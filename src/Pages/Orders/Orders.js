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

  const navigate = useNavigate();

  // Get user info from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;
  const userId = userData?._id;

  // Fetch user data
  useEffect(() => {
    if (!token || !userId) return;

    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `https://craft-cart-backend.vercel.app/api/user/auth/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.data.success) {
          setUser(res.data.data.user);
          if (res.data.data.user?.wishlist?.length) {
            setSelectedProducts(res.data.data.user.wishlist);
          }
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (err) {
        toast.error("Error: " + err.message);
      }
    };

    fetchUserData();
  }, [token, userId]);

  // Calculate subtotal and total based on selected products and discount
  useEffect(() => {
    if (selectedProducts.length) {
      const subtotal = selectedProducts.reduce(
        (acc, item) => acc + (item.price || 0),
        0
      );
      const total = subtotal - discount;
      setTotals({ subtotal, total: total >= 0 ? total : 0 });
    } else {
      setTotals({ subtotal: 0, total: 0 });
      setDiscount(0);
      setCouponData(null);
      setCouponCode("");
    }
  }, [selectedProducts, discount]);

  // Apply coupon with loading and error handling
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
      // Using first selected product's ID for coupon verification
      const productId = selectedProducts[0]._id;

      const res = await axios.post(
        `https://craft-cart-backend.vercel.app/api/coupons/verify`,
        {
          code: couponCode.trim(),
          productId,
          subtotal: totals.subtotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        const discountAmt = res.data.data.discountAmt;
        setCouponData(res.data.data);
        setDiscount(discountAmt);
        toast.success("Coupon applied!");
      } else {
        setCouponError(res.data.message || "Coupon invalid");
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

  // Confirm and go to payment
  const handleConfirm = () => {
    if (!selectedAddressId || !selectedProducts.length) {
      toast.error("Please select address and products");
      return;
    }

    const order = {
      userId,
      addressId: selectedAddressId,
      items: selectedProducts,
      coupon: couponData,
      subtotal: totals.subtotal,
      discount,
      totalAmount: totals.total,
    };

    console.log("Order Submitted:", order);
    navigate("/payment", { state: order });
  };

  if (!user) return <div className="p-4 text-center">Loading...</div>;

  const selectedAddress = user.addresses?.find(
    (a) => a._id === selectedAddressId
  );

  return (
    <div className="p-4 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-center mb-4 text-[#004080] uppercase">
        Place Your Order
      </h1>

      {/* Show total on top */}
      <div className="text-right text-lg font-bold text-green-600 mb-4">
        Total: ₹{totals.total}
      </div>

      {/* Step 1: Review & Select Wishlist Products */}
      {step === 1 && (
        <div>
          <div className="flex justify-between items-center mb-2 flex-wrap">
            <h2 className="font-semibold">1. Review & Select Products</h2>
            <span className="font-bold text-blue-600">
              Total: ₹{totals.total}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {user.wishlist.map((p) => {
              const isSelected = selectedProducts.some(
                (sp) => sp._id === p._id
              );
              const toggleSelect = () => {
                setSelectedProducts((prev) =>
                  isSelected
                    ? prev.filter((item) => item._id !== p._id)
                    : [...prev, p]
                );
              };

              return (
                <div
                  key={p._id}
                  className={`border p-2 rounded cursor-pointer ${
                    isSelected ? "border-blue-600 bg-blue-50" : ""
                  }`}
                  onClick={toggleSelect}
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
                    checked={isSelected}
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
        </div>
      )}

      {/* Step 2: Choose Address */}
      {step === 2 && (
        <div>
          <div className="mb-2 text-right font-bold text-blue-600">
            Total: ₹{totals.total}
          </div>

          <h2 className="font-semibold mb-2">2. Choose Address</h2>

          {user.addresses?.length > 0 ? (
            <div className="space-y-2">
              {user.addresses.map((addr) => (
                <label
                  key={addr._id}
                  className={`block p-3 border rounded cursor-pointer ${
                    selectedAddressId === addr._id
                      ? "border-blue-600 bg-blue-50"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr._id}
                    checked={selectedAddressId === addr._id}
                    onChange={() => setSelectedAddressId(addr._id)}
                    className="mr-2"
                  />
                  {addr.street}, {addr.city}, {addr.state} - {addr.postalCode}
                  <div>{addr.country}</div>
                </label>
              ))}
            </div>
          ) : (
            <p className="text-red-600">No address found—please add one.</p>
          )}

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setStep(1)} className="btn-secondary">
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="btn-primary"
              disabled={!selectedAddressId}
            >
              Next: Coupon
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Apply Coupon */}
      {step === 3 && (
        <div>
          <div className="mb-2 text-right font-bold text-blue-600">
            Total: ₹{totals.total}
          </div>

          <h2 className="font-semibold mb-2">3. Apply Coupon</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())} // <-- convert to uppercase here
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
              Next: Summary
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 4 && (
        <div>
          <h2 className="font-semibold mb-2">4. Order Summary</h2>

          <div className="mb-2">
            <h3 className="font-semibold">Products:</h3>
            <ul className="list-disc list-inside">
              {selectedProducts.map((p) => (
                <li key={p._id}>
                  {p.name} - ₹{p.price}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-2">
            <h3 className="font-semibold">Shipping Address:</h3>
            {selectedAddress ? (
              <p>
                {selectedAddress.street}, {selectedAddress.city},{" "}
                {selectedAddress.state} - {selectedAddress.postalCode},{" "}
                {selectedAddress.country}
              </p>
            ) : (
              <p className="text-red-600">No address selected</p>
            )}
          </div>

          <div className="mb-2">
            <h3 className="font-semibold">Price Details:</h3>
            <p>Subtotal: ₹{totals.subtotal}</p>
            <p>Discount: ₹{discount}</p>
            <p className="font-bold">Total: ₹{totals.total}</p>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={() => setStep(3)} className="btn-secondary">
              Back
            </Button>
            <Button onClick={handleConfirm} className="btn-primary">
              Confirm & Proceed to Payment
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
