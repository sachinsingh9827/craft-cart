import React, { useState } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation to access passed state

const BuyNowPage = () => {
  const location = useLocation();
  const { product, quantity } = location.state; // Get product and quantity from state

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [error, setError] = useState("");

  const totalPrice = product.price * quantity;

  const handleConfirmOrder = () => {
    // Validate address and payment method
    if (!address) {
      setError("Please enter your address.");
      return;
    }
    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }
    if (paymentMethod === "UPI" && !upiId) {
      setError("Please enter your UPI ID.");
      return;
    }

    const orderDetails = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      total: totalPrice,
      address: address,
      paymentMethod: paymentMethod,
      upiId: paymentMethod === "UPI" ? upiId : null,
    };

    console.log("Order Details:", orderDetails);
    alert("Order confirmed! Check console for details.");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5">
      <h1 className="text-4xl font-bold text-[#004080] mb-8 text-center">
        Confirm Your Order
      </h1>

      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-[#004080] mb-4">
          Product Details
        </h2>
        <p>
          <strong>Name:</strong> {product.name}
        </p>
        <p>
          <strong>Price:</strong> ₹{product.price}
        </p>
        <p>
          <strong>Quantity:</strong> {quantity}
        </p>
        <p>
          <strong>Total:</strong> ₹{totalPrice}
        </p>

        <h2 className="text-xl font-semibold text-[#004080] mt-6 mb-4">
          Shipping Address
        </h2>
        <textarea
          rows="3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          className="w-full border border-gray-300 rounded-md p-2 mt-1 resize-none"
        />

        <h2 className="text-xl font-semibold text-[#004080] mt-6 mb-4">
          Payment Method
        </h2>
        <div className="flex items-center">
          <label className="mr-4">
            <input
              type="radio"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            UPI
          </label>
          <label>
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery (COD)
          </label>
        </div>

        {paymentMethod === "UPI" && (
          <div className="mt-4">
            <label className="block mb-2 font-semibold text-[#004080]">
              Enter UPI ID:
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
                placeholder="example@upi"
              />
            </label>
          </div>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}

        <button
          onClick={handleConfirmOrder}
          className="mt-6 w-full bg-[#004080] text-yellow-400 font-semibold py-2 rounded-lg hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
};

export default BuyNowPage;
