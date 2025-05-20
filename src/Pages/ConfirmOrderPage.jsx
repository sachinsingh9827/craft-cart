import React from "react";
import { useLocation } from "react-router-dom";

const ConfirmOrderPage = () => {
  const { state } = useLocation();
  const { product, quantity } = state || {};

  const deliveryCharge = 50;
  const total = product.price * quantity + deliveryCharge;

  if (!product) return <p>Invalid order</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold text-blue-800 mb-4">
        Confirm Your Order
      </h2>

      <div className="bg-gray-100 p-4 rounded">
        <p>
          <strong>Product:</strong> {product.name}
        </p>
        <p>
          <strong>Price:</strong> Rs. {product.price}
        </p>
        <p>
          <strong>Quantity:</strong> {quantity}
        </p>
        <p>
          <strong>Subtotal:</strong> Rs. {product.price * quantity}
        </p>
        <p>
          <strong>Delivery:</strong> Rs. {deliveryCharge}
        </p>
        <p className="text-lg mt-2 font-semibold">
          <strong>Total:</strong> Rs. {total}
        </p>
      </div>

      <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded">
        Confirm Order
      </button>
    </div>
  );
};

export default ConfirmOrderPage;
