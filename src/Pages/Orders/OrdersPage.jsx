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
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
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

  // On mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // On step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Fetch user and wishlist / initial product
  useEffect(() => {
    if (!token || !userId) return;

    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/user/auth/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) {
          const userData = res.data.data.user;
          setUser(userData);

          if (userData.wishlist?.length) {
            setSelectedProducts(userData.wishlist);
          } else if (productIdFromQuery) {
            const pr = await axios.get(
              `${BASE_URL}/products/${productIdFromQuery}`
            );
            if (pr.data.success) {
              setSelectedProducts([pr.data.data]);
            } else {
              toast.error("Product not found");
            }
          }
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (err) {
        toast.error("Error: " + err.message);
      }
    })();
  }, [token, userId, productIdFromQuery]);

  // Calculate totals (subtotal, tax, delivery, total)
  useEffect(() => {
    const subtotal = selectedProducts.reduce(
      (sum, p) => sum + p.price * (p.qty || 1),
      0
    );

    const deliveryCharges = 30; // fixed delivery charge
    let tax = 0;
    if (paymentOption === "online") {
      tax = (2 / 100) * subtotal; // 2% tax on product price if online payment
    }
    const total = Math.max(subtotal - discount + deliveryCharges + tax, 0);
    setTotals({ subtotal, tax, delivery: deliveryCharges, total });
  }, [selectedProducts, discount, paymentOption]);

  // Validate address via API
  useEffect(() => {
    if (!selectedAddressId) {
      setAddressValid(false);
      setAddressValidationError("");
      return;
    }
    const addr = user?.addresses?.find((a) => a._id === selectedAddressId);
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
        if (res.data.success) {
          setAddressValid(true);
        } else {
          throw new Error(res.data.message || "Invalid address");
        }
      } catch (err) {
        const msg = err.response?.data?.message || err.message;
        setAddressValid(false);
        setAddressValidationError(msg);
        toast.error(msg);
      } finally {
        setAddressValidationLoading(false);
      }
    })();
  }, [selectedAddressId, token, user]);

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim() || !selectedProducts.length) {
      return toast.error("Please enter a coupon and select a product");
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
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setCouponError(msg);
      toast.error(msg);
    } finally {
      setLoadingCoupon(false);
    }
  };

  // Confirm payment step
  const handleConfirmStep4 = async () => {
    if (!selectedAddressId || !selectedProducts.length) {
      return toast.error("Please select address and products");
    }
    if (!paymentOption) {
      return setPaymentError("Please select a payment option");
    }
    if (paymentOption === "online") {
      await handleInitiatePayment();
      return;
    }
    setPaymentError("");
    setStep(5);
  };

  // Initiate online payment
  const handleInitiatePayment = async () => {
    setSubmittingOrder(true);
    try {
      const amountWithTax = totals.subtotal + totals.tax + totals.delivery;

      const deliveryAddress = user.addresses.find(
        (a) => a._id === selectedAddressId
      );

      const res = await axios.post(`${BASE_URL}/payment/initiate`, {
        userId,
        amount: amountWithTax,
        subtotal: totals.subtotal,
        tax: totals.tax,
        deliveryCharges: totals.delivery,
        discount: discount,
        paymentMethod: "online",
        coupon: couponData || null,
        deliveryAddress: {
          street: deliveryAddress.street,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          postalCode: deliveryAddress.postalCode,
          country: deliveryAddress.country,
          contact: deliveryAddress.contact,
        },
        items: selectedProducts.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.qty || 1,
        })),
        redirectUrl: `${BASE_URL}/payment-redirect`,
      });

      if (res.data.success && res.data.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        toast.error("Failed to initiate payment");
      }
    } catch (err) {
      toast.error("Error: " + err.response?.data?.message || err.message);
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Submit order, then show modal
  const handleSubmitOrder = async () => {
    if (!selectedAddressId || !selectedProducts.length || !paymentOption) {
      return toast.error("Complete all steps before placing order");
    }
    setSubmittingOrder(true);

    try {
      const deliveryAddress = user.addresses.find(
        (a) => a._id === selectedAddressId
      );

      const order = {
        userId,
        deliveryAddress,
        items: selectedProducts.map((p) => ({
          productId: p._id,
          name: p.name,
          price: p.price,
          quantity: p.qty || 1,
        })),
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
      const msg = err.response?.data?.message || err.message;
      toast.error(msg);
    } finally {
      setSubmittingOrder(false);
    }
  };

  // On modal close: remove wishlist, navigate
  const closeModal = async () => {
    setShowThankYouModal(false);

    try {
      const token = localStorage.getItem("token");

      const removeWishlistItem = (productId) =>
        axios.post(
          `${BASE_URL}/user/auth/wishlist/remove`,
          { productId },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

      for (const product of selectedProducts) {
        await removeWishlistItem(product._id);
      }

      setUser((prevUser) => ({
        ...prevUser,
        wishlist: prevUser.wishlist.filter(
          (item) => !selectedProducts.some((p) => p._id === item._id)
        ),
      }));
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to remove items from wishlist"
      );
    }

    navigate("/shop");
  };

  if (!user)
    return (
      <div className="text-center p-6">
        <LoadingPage />
      </div>
    );
  const addr = user.addresses.find((a) => a._id === selectedAddressId);

  return (
    <div className="p-2 font-montserrat max-w-full mx-auto space-y-6 min-h-screen">
      <h1 className="text-xl font-bold text-start mb-4 text-[#004080] uppercase">
        Place Your Order
      </h1>
      <div className="text-right text-lg font-bold text-green-600 mb-4">
        Total: ₹{totals.total.toFixed(2)}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <>
          <h2 className="text-sm font-bold text-start mb-4 text-[#004080] uppercase">
            1. Review &amp; Select Products
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-6 gap-3">
            {user.wishlist.map((p) => {
              const selectedItem = selectedProducts.find(
                (sp) => sp._id === p._id
              );
              const sel = !!selectedItem;

              return (
                <div
                  key={p._id}
                  className={`border p-2 rounded ${
                    sel ? "border-blue-600 bg-blue-50" : ""
                  }`}
                >
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                    className="h-20 w-full object-cover rounded"
                  />
                  <div className="text-sm mt-1">{p.name}</div>
                  <div className="font-semibold">₹{p.price}</div>

                  {/* Selection Checkbox */}
                  <div className="mt-2">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={sel}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProducts((prev) => [
                              ...prev,
                              { ...p, qty: 1 },
                            ]);
                          } else {
                            setSelectedProducts((prev) =>
                              prev.filter((sp) => sp._id !== p._id)
                            );
                          }
                        }}
                        className="mt-1"
                      />
                      <span>Select</span>
                    </label>
                  </div>

                  {/* Quantity Counter */}
                  {sel && (
                    <div className="mt-2 flex items-center space-x-2">
                      <label className="text-sm">Qty:</label>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProducts((prev) =>
                            prev.map((sp) =>
                              sp._id === p._id
                                ? { ...sp, qty: Math.max(1, (sp.qty || 1) - 1) }
                                : sp
                            )
                          )
                        }
                        className="px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span className="px-3">
                        {selectedProducts.find((sp) => sp._id === p._id)?.qty ||
                          1}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedProducts((prev) =>
                            prev.map((sp) =>
                              sp._id === p._id
                                ? { ...sp, qty: (sp.qty || 1) + 1 }
                                : sp
                            )
                          )
                        }
                        className="px-2 py-1 border rounded"
                      >
                        +
                      </button>
                    </div>
                  )}
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

      {/* Step 2 */}
      {step === 2 && (
        <>
          <h2 className="text-sm font-bold text-start mb-4 text-[#004080] uppercase">
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
                    className="mr-2"
                  />
                  {a.street}, {a.city}, {a.state} - {a.postalCode},{a.contact}
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
            <p className="text-gray-600 mt-2">Validating address...</p>
          )}
          {addressValidationError && (
            <p className="text-red-600 mt-2">{addressValidationError}</p>
          )}
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setStep(1)} className="btn-secondary">
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="btn-primary"
              disabled={!addressValid || addressValidationLoading}
            >
              Proceed to Coupon
            </Button>
          </div>
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <>
          <h2 className="text-sm font-bold text-start mb-4 text-[#004080] uppercase">
            3. Apply Coupon
          </h2>

          {!couponData && (
            <p className="text-sm text-gray-600 mb-2">
              If you have a coupon code, please enter it below to get a
              discount. If you don't have one, you can skip this step and
              continue.
            </p>
          )}

          <div className="flex gap-2 flex-wrap">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="border p-2 flex-grow rounded min-w-[180px]"
              placeholder="Coupon code"
              disabled={loadingCoupon}
            />
            <Button
              onClick={handleApplyCoupon}
              className="btn-primary min-w-[100px]"
              disabled={loadingCoupon || couponCode.trim() === ""}
            >
              {loadingCoupon ? "Applying..." : "Apply"}
            </Button>
          </div>

          {couponData && (
            <div className="mt-2 text-green-600">
              {couponData.code} applied! Discount: ₹{discount.toFixed(2)}
            </div>
          )}
          {couponError && (
            <div className="mt-2 text-red-600">{couponError}</div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setStep(2)} className="btn-secondary">
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="btn-primary">
              Proceed to Payment
            </Button>
          </div>
        </>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <>
          <h2 className="text-sm font-bold text-start mb-4 text-[#004080] uppercase">
            4. Choose Payment Option
          </h2>
          <div className="space-y-3 max-w-md mx-auto">
            <label className="flex items-start gap-3 cursor-pointer border p-3 rounded hover:bg-blue-50">
              <input
                type="radio"
                name="paymentOption"
                value="cod"
                checked={paymentOption === "cod"}
                onChange={() => {
                  setPaymentOption("cod");
                }}
              />
              <span className="font-semibold">Cash on Delivery (COD )</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer border p-3 rounded hover:bg-blue-50">
              <input
                type="radio"
                name="paymentOption"
                value="online"
                checked={paymentOption === "online"}
                onChange={() => {
                  setPaymentOption("online");
                }}
              />
              <span className="font-semibold">Online Payment</span>
            </label>
          </div>
          {paymentError && <p className="text-red-600 mt-3">{paymentError}</p>}
          <div className="flex justify-end gap-2 mt-6">
            <Button onClick={() => setStep(3)} className="btn-secondary">
              Back
            </Button>
            <Button
              onClick={handleConfirmStep4}
              className="btn-primary"
              disabled={!paymentOption}
            >
              Confirm
            </Button>
          </div>
        </>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <div className="max-w-full mx-auto p-4 bg-white border rounded shadow-md">
          <h2 className="text-sm font-bold text-start mb-4 text-[#004080] uppercase">
            Order Summary &amp; Invoice
          </h2>
          <table className="w-full table-auto border-collapse mb-6">
            <thead>
              <tr className="bg-[#004080] text-white">
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left hidden sm:table-cell">Image</th>
                <th className="p-3 text-right">Price (₹)</th>
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
                    {p.qty} × ₹{p.price.toFixed(2)} ₹
                    {(p.price * p.qty).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {couponData && (
            <div className="mb-6 p-4 border border-green-400 bg-green-50 rounded text-green-700 font-semibold max-w-sm">
              Coupon Applied:{" "}
              <span className="uppercase">{couponData.code}</span> — Discount: ₹
              {discount.toFixed(2)}
            </div>
          )}

          <section className="mb-6 max-w-md">
            <h3 className="text-lg font-semibold border-b pb-1 mb-2 text-[#004080] uppercase">
              Shipping Address
            </h3>
            <address className="not-italic whitespace-pre-line text-gray-700 leading-relaxed font-mono text-sm">
              {addr?.street},{"\n"}
              {addr?.city}, {addr?.state} - {addr?.postalCode},{"\n"}
              {addr?.country}
            </address>
          </section>

          <section className="mb-6 max-w-md">
            <h3 className="text-lg font-semibold border-b pb-1 mb-2 text-[#004080] uppercase">
              Payment Method
            </h3>
            <p className="text-gray-800 font-mono">
              {paymentOption === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p>
          </section>

          <section className="max-w-md ml-auto border-t pt-4 font-mono">
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Subtotal:</span>
              <span>₹{totals.subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between mb-2 text-red-600">
                <span>Discount:</span> <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between mb-2 text-gray-700">
              <span>Delivery Charges:</span>
              <span>₹{totals.delivery.toFixed(2)}</span>
            </div>
            {paymentOption === "online" && (
              <div className="flex justify-between mb-2 text-gray-700">
                <span>Tax (2% online payment):</span>
                <span>₹{totals.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span> <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </section>

          <div className="mt-6 flex flex-row justify-between md:justify-end md:space-x-4">
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
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md text-center">
            <h2 className="text-2xl font-semibold mb-4">Thank You!</h2>
            <p className="mb-4">Your order was placed successfully.</p>

            <button
              onClick={closeModal}
              className="bg-[#004080] text-white px-4 py-2 rounded hover:bg-[#003366]"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
