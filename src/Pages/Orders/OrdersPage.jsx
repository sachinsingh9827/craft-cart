import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/Reusable/Button";
import LoadingPage from "../../components/LoadingPage";

const BASE_URL = "https://craft-cart-backend.vercel.app/api";

export default function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const productIdFromQuery = new URLSearchParams(location.search).get(
    "product"
  );

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  const token = parsedUser?.token;
  const userId = parsedUser?._id;

  const [user, setUser] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState({
    subtotal: 0,
    tax: 0,
    delivery: 30,
    total: 0,
  });
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const [addressValidationLoading, setAddressValidationLoading] =
    useState(false);
  const [addressValidationError, setAddressValidationError] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [showThankYouModal, setShowThankYouModal] = useState(false);

  useEffect(() => window.scrollTo(0, 0), []);
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [step]);

  // Fetch user & wishlist or product
  useEffect(() => {
    if (!token || !userId) return;
    (async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/user/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          const userData = data.data.user;
          setUser(userData);

          let initial = [];
          if (userData.wishlist?.length) {
            initial = userData.wishlist;
          } else if (productIdFromQuery) {
            const pr = await axios.get(
              `${BASE_URL}/products/${productIdFromQuery}`
            );
            if (pr.data.success) {
              initial = [pr.data.data];
            } else toast.error("Product not found");
          }
          // attach quantity = 1
          setSelectedProducts(initial.map((p) => ({ ...p, quantity: 1 })));
        } else {
          toast.error(data.message || "Failed to fetch user data");
        }
      } catch (err) {
        toast.error("Error: " + err.message);
      }
    })();
  }, [token, userId, productIdFromQuery]);

  // Recalculate totals
  useEffect(() => {
    const subtotal = selectedProducts.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );
    const tax = paymentOption === "online" ? 0.05 * subtotal : 0;
    const total = Math.max(subtotal - discount + totals.delivery + tax, 0);
    setTotals({ subtotal, tax, delivery: totals.delivery, total });
  }, [selectedProducts, discount, paymentOption]);

  // Validate address
  useEffect(() => {
    if (!selectedAddressId) {
      setAddressValid(false);
      setAddressValidationError("");
      return;
    }
    const addr = user?.addresses.find((a) => a._id === selectedAddressId);
    if (!addr) {
      setAddressValid(false);
      setAddressValidationError("Selected address not found");
      return;
    }
    (async () => {
      setAddressValidationLoading(true);
      setAddressValidationError("");
      try {
        const res = await axios.post(
          `${BASE_URL}/user/auth/order`,
          { deliveryAddress: addr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAddressValid(res.data.success);
        if (!res.data.success) throw new Error(res.data.message);
      } catch (err) {
        setAddressValid(false);
        setAddressValidationError(err.response?.data?.message || err.message);
        toast.error(err.message);
      } finally {
        setAddressValidationLoading(false);
      }
    })();
  }, [selectedAddressId]);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || selectedProducts.length === 0) {
      return toast.error("Enter coupon and select a product");
    }
    setLoadingCoupon(true);
    setCouponError("");
    setCouponData(null);
    setDiscount(0);
    try {
      const res = await axios.post(
        `${BASE_URL}/user/auth/verify`,
        {
          code: couponCode.trim(),
          productId: selectedProducts[0]._id,
          subtotal: totals.subtotal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCouponData(res.data.data);
        setDiscount(res.data.data.discountAmt);
        toast.success("Coupon applied!");
      } else throw new Error(res.data.message);
    } catch (err) {
      setCouponError(err.message);
      toast.error(err.message);
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleConfirmStep4 = async () => {
    if (!selectedAddressId || selectedProducts.length === 0) {
      return toast.error("Select address & products");
    }
    if (!paymentOption) {
      return setPaymentError("Please select payment option");
    }
    if (paymentOption === "online") {
      await handleInitiatePayment();
    } else {
      setPaymentError("");
      setStep(5);
    }
  };

  const handleInitiatePayment = async () => {
    setSubmittingOrder(true);
    try {
      const amountWithTax = totals.subtotal + totals.tax + totals.delivery;
      const res = await axios.post(`${BASE_URL}/payment/initiate`, {
        orderId: Date.now(),
        amount: amountWithTax,
        redirectUrl: `${BASE_URL}/payment-redirect`,
      });
      if (res.data.success) window.location.href = res.data.data.paymentUrl;
      else toast.error("Failed to initiate payment");
    } catch (err) {
      toast.error("Error: " + err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddressId || selectedProducts.length === 0 || !paymentOption) {
      return toast.error("Complete all steps before placing order");
    }
    setSubmittingOrder(true);
    try {
      const addr = user.addresses.find((a) => a._id === selectedAddressId);
      const order = {
        userId,
        deliveryAddress: addr,
        items: selectedProducts,
        coupon: couponData || null,
        subtotal: totals.subtotal,
        discount,
        tax: totals.tax,
        deliveryCharges: totals.delivery,
        totalAmount: totals.total,
        paymentMethod: paymentOption,
      };
      const res = await axios.post(`${BASE_URL}/orders`, order, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.data.status === "success") {
        toast.success("Order placed successfully!");
        setShowThankYouModal(true);
      } else {
        toast.error(res.data.message || "Order failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const closeModal = async () => {
    setShowThankYouModal(false);
    navigate("/shop");
  };

  if (!user) return <LoadingPage />;

  const addr = user.addresses.find((a) => a._id === selectedAddressId);

  return (
    <div className="p-4 font-montserrat max-w-full mx-auto space-y-6 min-h-screen">
      <h1 className="text-xl font-bold text-[#004080] uppercase">
        Place Your Order
      </h1>
      <div className="text-right text-lg font-bold text-green-600">
        Total: ₹{totals.total.toFixed(2)}
      </div>

      {/* Step 1: Select Products */}
      {step === 1 && (
        <>
          <h2 className="text-sm font-bold text-[#004080] uppercase">
            1. Review & Select Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            {user.wishlist.map((p) => {
              const selected = selectedProducts.some((sp) => sp._id === p._id);
              const productObj = selectedProducts.find(
                (sp) => sp._id === p._id
              );
              return (
                <div
                  key={p._id}
                  className={`border p-2 rounded cursor-pointer ${
                    selected ? "border-blue-600 bg-blue-50" : ""
                  }`}
                >
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                    className="h-20 w-full object-cover rounded"
                  />
                  <div className="text-sm mt-1">{p.name}</div>
                  <div className="font-semibold">₹{p.price}</div>
                  {selected && (
                    <div className="mt-2">
                      <label className="text-sm mr-1">Qty:</label>
                      <select
                        value={productObj.quantity}
                        onChange={(e) => {
                          const qty = parseInt(e.target.value);
                          setSelectedProducts((prev) =>
                            prev.map((item) =>
                              item._id === p._id
                                ? { ...item, quantity: qty }
                                : item
                            )
                          );
                        }}
                        className="border rounded px-1 py-0.5 text-sm"
                      >
                        {[...Array(10)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="mt-2">
                    <input
                      type="checkbox"
                      checked={selected}
                      readOnly
                      onChange={() => {}}
                    />{" "}
                    Select
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedProducts.length}
            >
              Select Address
            </Button>
          </div>
        </>
      )}

      {/* Step 2: Address */}
      {step === 2 && (
        <>
          <h2 className="text-sm font-bold text-[#004080] uppercase">
            2. Choose Address
          </h2>
          {user.addresses?.length ? (
            <div className="space-y-2">
              {user.addresses.map((a) => (
                <label
                  key={a._id}
                  className={`block p-3 border rounded cursor-pointer ${
                    selectedAddressId === a._id
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={a._id}
                    checked={selectedAddressId === a._id}
                    onChange={() => setSelectedAddressId(a._id)}
                  />
                  <div>
                    {a.street}, {a.city}, {a.state} - {a.postalCode},{" "}
                    {a.contact}
                  </div>
                  <div>{a.country}</div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-[#004080] uppercase">
              No address found—please add one.
            </p>
          )}
          {addressValidationLoading && (
            <p className="text-gray-600">Validating address...</p>
          )}
          {addressValidationError && (
            <p className="text-red-600">{addressValidationError}</p>
          )}
          <div className="flex justify-end mt-6 gap-2">
            <Button onClick={() => setStep(1)}>Back</Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!addressValid || addressValidationLoading}
            >
              Proceed to Coupon
            </Button>
          </div>
        </>
      )}

      {/* Step 3: Coupon */}
      {step === 3 && (
        <>
          <h2 className="text-sm font-bold text-[#004080] uppercase">
            3. Apply Coupon
          </h2>
          <div className="flex gap-2 flex-wrap">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="border p-2 rounded min-w-[180px]"
              placeholder="Coupon code"
              disabled={loadingCoupon}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={loadingCoupon || !couponCode.trim()}
            >
              {loadingCoupon ? "Applying..." : "Apply"}
            </Button>
          </div>
          {couponData && (
            <p className="mt-2 text-green-600">
              {couponData.code} applied! Discount: ₹{discount.toFixed(2)}
            </p>
          )}
          {couponError && <p className="mt-2 text-red-600">{couponError}</p>}
          <div className="flex justify-end mt-6 gap-2">
            <Button onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Proceed to Payment</Button>
          </div>
        </>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <>
          <h2 className="text-sm font-bold text-[#004080] uppercase">
            4. Choose Payment Option
          </h2>
          <div className="space-y-3 max-w-md mx-auto">
            <label className="flex items-start gap-3 border p-3 rounded hover:bg-blue-50">
              <input
                type="radio"
                name="paymentOption"
                value="cod"
                checked={paymentOption === "cod"}
                onChange={() => setPaymentOption("cod")}
              />
              <span>Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-start gap-3 border p-3 rounded hover:bg-blue-50">
              <input
                type="radio"
                name="paymentOption"
                value="online"
                checked={paymentOption === "online"}
                onChange={() => setPaymentOption("online")}
              />
              <span>Online Payment</span>
            </label>
          </div>
          {paymentError && <p className="text-red-600 mt-3">{paymentError}</p>}
          <div className="flex justify-end mt-6 gap-2">
            <Button onClick={() => setStep(3)}>Back</Button>
            <Button onClick={handleConfirmStep4} disabled={!paymentOption}>
              Confirm
            </Button>
          </div>
        </>
      )}

      {/* Step 5: Summary */}
      {step === 5 && (
        <div className="bg-white border rounded shadow-md p-4 max-w-full mx-auto">
          <h2 className="text-sm font-bold text-[#004080] uppercase mb-4">
            Order Summary & Invoice
          </h2>

          <table className="w-full table-auto border-collapse mb-6">
            <thead>
              <tr className="bg-[#004080] text-white">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left hidden sm:table-cell">Image</th>
                <th className="p-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-3 font-semibold">{p.name}</td>
                  <td className="p-3 hidden sm:table-cell">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="p-3 text-right font-mono">
                    {p.quantity} × ₹{p.price.toFixed(2)} = ₹
                    {(p.quantity * p.price).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {couponData && (
            <div className="mb-6 p-4 border border-green-400 bg-green-50 rounded font-semibold text-green-700 max-w-sm">
              Coupon: <span className="uppercase">{couponData.code}</span> —
              Discount: ₹{discount.toFixed(2)}
            </div>
          )}

          <section className="mb-6 max-w-md">
            <h3 className="font-semibold text-[#004080] uppercase mb-2">
              Shipping Address
            </h3>
            <address className="not-italic whitespace-pre-line font-mono text-gray-700 text-sm">
              {addr?.street}, {"\n"} {addr?.city}, {addr?.state} -{" "}
              {addr?.postalCode}, {"\n"} {addr?.country}
            </address>
          </section>

          <section className="mb-6 max-w-md">
            <h3 className="font-semibold text-[#004080] uppercase mb-2">
              Payment Method
            </h3>
            <p className="font-mono text-gray-800">
              {paymentOption === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p>
          </section>

          <section className="max-w-md ml-auto border-t pt-4 font-mono">
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal:</span> <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-red-600">
                <span>Discount:</span> <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Delivery Charges:</span>{" "}
              <span>₹{totals.delivery.toFixed(2)}</span>
            </div>
            {paymentOption === "online" && (
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Tax (5%):</span> <span>₹{totals.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span> <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </section>

          <div className="mt-6 flex justify-end gap-4">
            <Button onClick={handleSubmitOrder} disabled={submittingOrder}>
              {submittingOrder ? "Placing Order..." : "Place Order"}
            </Button>
            <Button onClick={() => setStep(4)} disabled={submittingOrder}>
              Back to Payment
            </Button>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYouModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
            <p className="mb-4">Your order has been placed successfully.</p>
            <Button onClick={closeModal}>Continue Shopping</Button>
          </div>
        </div>
      )}
    </div>
  );
}
