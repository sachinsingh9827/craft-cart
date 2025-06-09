import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Reusable/Button";

export default function OrdersPage() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [totals, setTotals] = useState({ subtotal: 0, total: 0 });
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [addressValid, setAddressValid] = useState(false);
  const [addressValidationLoading, setAddressValidationLoading] =
    useState(false);
  const [addressValidationError, setAddressValidationError] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [onlineBlocked, setOnlineBlocked] = useState(false);
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;
  const userId = userData?._id;

  useEffect(() => {
    if (!token || !userId) return;
    (async () => {
      try {
        const res = await axios.get(
          `https://craft-cart-backend.vercel.app/api/user/auth/${userId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setUser(res.data.data.user);
          setSelectedProducts(res.data.data.user.wishlist || []);
        } else toast.error("Failed to fetch user data");
      } catch (err) {
        toast.error("Error: " + err.message);
      }
    })();
  }, [token, userId]);

  useEffect(() => {
    const subtotal = selectedProducts.reduce(
      (acc, p) => acc + (p.price || 0),
      0
    );
    setTotals({ subtotal, total: Math.max(subtotal - discount, 0) });
  }, [selectedProducts, discount]);

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
      setAddressValid(false);
      setAddressValidationError("");
      try {
        const res = await axios.post(
          "https://craft-cart-backend.vercel.app/api/user/auth/order",
          { deliveryAddress: addr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.success) {
          setAddressValid(true);
          toast.success("Address validated successfully");
        } else {
          setAddressValid(false);
          setAddressValidationError(res.data.message || "Address not valid");
          toast.error(res.data.message || "Address not valid");
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Address validation failed";
        setAddressValid(false);
        setAddressValidationError(msg);
        toast.error(msg);
      } finally {
        setAddressValidationLoading(false);
      }
    })();
  }, [selectedAddressId, token, user]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!selectedProducts.length) {
      toast.error("Please select at least one product first");
      return;
    }
    setLoadingCoupon(true);
    setCouponError("");
    setCouponData(null);
    setDiscount(0);
    try {
      const productId = selectedProducts[0]._id;
      const res = await axios.post(
        "https://craft-cart-backend.vercel.app/api/user/auth/verify",
        { code: couponCode.trim(), productId, subtotal: totals.subtotal },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        setCouponData(res.data.data);
        setDiscount(res.data.data.discountAmt);
        toast.success("Coupon applied!");
      } else {
        setCouponError(res.data.message || "Invalid coupon");
        setTimeout(() => setCouponError(""), 3000);
      }
    } catch (err) {
      setCouponError(
        err.response?.data?.message || err.message || "Error applying coupon"
      );
      setTimeout(() => setCouponError(""), 3000);
    } finally {
      setLoadingCoupon(false);
    }
  };

  // Remove handleConfirm order submission from step 4
  const handleConfirmStep4 = () => {
    if (!selectedAddressId || !selectedProducts.length) {
      toast.error("Please select address and products");
      return;
    }
    if (!paymentOption) {
      setPaymentError("Please select a payment option");
      return;
    }
    if (paymentOption === "online") {
      toast.warn("Online payment not available. Please select COD.");
      setOnlineBlocked(true);
      return;
    }
    setPaymentError("");
    setOnlineBlocked(false);
    setStep(5); // Move to step 5 for order summary & submission
  };

  // New order submission function for step 5
  const handleSubmitOrder = async () => {
    if (!selectedAddressId || selectedProducts.length === 0) {
      toast.error("Please select address and products");
      return;
    }
    if (!paymentOption) {
      toast.error("Please select a payment option");
      return;
    }

    const order = {
      userId,
      deliveryAddress: user.addresses.find((a) => a._id === selectedAddressId),
      items: selectedProducts,
      coupon: couponData || null, // if no coupon applied, send null
      subtotal: totals.subtotal,
      discount: discount || 0,
      totalAmount: totals.total,
      paymentMethod: paymentOption,
    };

    console.log("Order to submit:", order);
    setSubmittingOrder(true);

    try {
      const res = await axios.post(
        "https://craft-cart-backend.vercel.app/api/order",
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Order placed successfully!");
        // Optional: reset states or navigate user after order
        // navigate("/ordersuccess");
      } else {
        toast.error(res.data.message || "Order placement failed");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Order submission failed";
      toast.error(msg);
    } finally {
      setSubmittingOrder(false);
    }
  };

  const addr = user?.addresses?.find((a) => a._id === selectedAddressId);
  if (!user) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="p-4 max-w-full mx-auto space-y-6">
      <h1 className="text-xl font-bold text-center mb-4 text-[#004080] uppercase">
        Place Your Order
      </h1>
      <div className="text-right text-lg font-bold text-green-600 mb-4">
        Total: ₹{totals.total}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <>
          <h2 className="font-semibold mb-2">
            1. Review &amp; Select Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.wishlist.map((p) => {
              const sel = selectedProducts.some((sp) => sp._id === p._id);
              return (
                <div
                  key={p._id}
                  className={`border p-2 rounded cursor-pointer ${
                    sel ? "border-blue-600 bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    if (sel)
                      setSelectedProducts((prev) =>
                        prev.filter((x) => x._id !== p._id)
                      );
                    else setSelectedProducts((prev) => [...prev, p]);
                  }}
                >
                  <img
                    src={p.images?.[0]?.url}
                    alt={p.name}
                    className="h-20 w-full object-cover rounded"
                  />
                  <div className="text-sm mt-1">{p.name}</div>
                  <div className="font-semibold">₹{p.price}</div>
                  <input
                    type="checkbox"
                    checked={sel}
                    readOnly
                    className="mt-1"
                  />{" "}
                  Select
                </div>
              );
            })}
          </div>
          <Button
            onClick={() => setStep(2)}
            className="mt-4 w-full bg-blue-600 text-white p-2 rounded disabled:opacity-50"
            disabled={!selectedProducts.length}
          >
            Next: Address
          </Button>
        </>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <>
          <h2 className="font-semibold mb-2">2. Choose Address</h2>
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
                  {a.street}, {a.city}, {a.state} - {a.postalCode}
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
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setStep(1)} className="btn-secondary">
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="btn-primary"
              disabled={!addressValid || addressValidationLoading}
            >
              Next: Coupon
            </Button>
          </div>
        </>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <>
          <h2 className="font-semibold mb-2">3. Apply Coupon</h2>
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
              disabled={loadingCoupon}
            >
              {loadingCoupon ? "Applying..." : "Apply"}
            </Button>
          </div>
          {couponData && (
            <div className="mt-2 text-green-600">
              {couponData.code} applied! Discount: ₹{discount}
            </div>
          )}
          {couponError && (
            <div className="mt-2 text-red-600">{couponError}</div>
          )}
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setStep(2)} className="btn-secondary">
              Back
            </Button>
            <Button onClick={() => setStep(4)} className="btn-primary">
              Next: Payment
            </Button>
          </div>
        </>
      )}

      {/* Step 4 */}
      {step === 4 && (
        <>
          <h2 className="font-semibold mb-4">4. Choose Payment Option</h2>
          <div className="space-y-3 max-w-md mx-auto">
            <label className="flex items-center gap-3 cursor-pointer border p-3 rounded hover:bg-blue-50">
              <input
                type="radio"
                name="paymentOption"
                value="cod"
                checked={paymentOption === "cod"}
                onChange={() => {
                  setPaymentOption("cod");
                  setOnlineBlocked(false);
                }}
              />
              <span className="font-semibold">Cash on Delivery (COD)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer border p-3 rounded hover:bg-blue-50">
              <input
                type="radio"
                name="paymentOption"
                value="online"
                checked={paymentOption === "online"}
                onChange={() => {
                  setPaymentOption("online");
                  toast.warn(
                    "Online payment not available. Please select COD."
                  );
                  setOnlineBlocked(true);
                }}
              />
              <span className="font-semibold text-gray-500 line-through">
                Online Payment (Unavailable)
              </span>
            </label>
          </div>
          {paymentError && (
            <p className="text-red-600 mt-3 font-semibold">{paymentError}</p>
          )}
          <div className="flex gap-2 mt-6">
            <Button onClick={() => setStep(3)} className="btn-secondary">
              Back
            </Button>
            <Button
              onClick={handleConfirmStep4}
              className="btn-primary"
              disabled={!paymentOption || onlineBlocked}
            >
              Confirm
            </Button>
          </div>
        </>
      )}

      {/* Step 5 */}
      {step === 5 && (
        <div className="max-w-full mx-auto p-6 bg-white border rounded shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-[#004080] uppercase text-center">
            Order Summary &amp; Invoice
          </h2>

          {/* Product Table */}
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
                    ₹{p.price.toFixed(2)}
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
            {addr ? (
              <address className="not-italic whitespace-pre-line text-gray-700 leading-relaxed font-mono text-sm">
                {addr.street},{"\n"}
                {addr.city}, {addr.state} - {addr.postalCode},{"\n"}
                {addr.country}
              </address>
            ) : null}
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
            <div className="flex justify-between mb-2 text-red-600">
              <span>Discount:</span>
              <span>-₹{discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>₹{totals.total.toFixed(2)}</span>
            </div>
          </section>

          <button
            onClick={handleSubmitOrder}
            disabled={submittingOrder}
            className="mt-6 w-full bg-[#004080] text-white font-bold py-3 rounded hover:bg-[#003366] disabled:opacity-50"
          >
            {submittingOrder ? "Placing Order..." : "Place Order"}
          </button>

          <button
            onClick={() => setStep(4)}
            disabled={submittingOrder}
            className="mt-3 w-full border border-[#004080] text-[#004080] font-bold py-3 rounded hover:bg-[#004080] hover:text-white disabled:opacity-50"
          >
            Back to Payment
          </button>
        </div>
      )}
    </div>
  );
}
