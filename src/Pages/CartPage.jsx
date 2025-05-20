import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CartPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = state || {};

  if (!product) return <p>No product in cart</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Your Cart</h2>
      <div className="flex gap-4 bg-gray-100 p-4 rounded">
        <img
          src={product.image}
          alt={product.name}
          className="w-24 h-24 rounded"
        />
        <div>
          <p className="font-bold text-blue-800">{product.name}</p>
          <p>Qty: {quantity}</p>
          <p>Price: Rs. {product.price}</p>
          <p>Total: Rs. {product.price * quantity}</p>
        </div>
      </div>

      <button
        onClick={() => navigate("/confirm", { state: { product, quantity } })}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        Buy Now
      </button>
    </div>
  );
};

export default CartPage;
