import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";
import Toast, { showToast } from "../../components/Toast/Toast";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const ProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/${productId}`);
        setProduct(res.data.product);
      } catch (err) {
        console.error(err);
        showToast("Failed to load product details", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  if (loading) return <LoadingPage />;
  if (!product)
    return (
      <div className="text-center mt-10 text-gray-500">Product not found.</div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 font-montserrat">
      <Toast />
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
          alt={product.name}
          className="w-full md:w-1/2 object-cover rounded-lg shadow"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#004080] mb-2">
            {product.name}
          </h1>
          <p className="text-yellow-500 text-xl font-semibold mb-4">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          <button className="bg-[#004080] text-yellow-400 px-6 py-2 rounded hover:bg-yellow-400 hover:text-[#004080] transition font-semibold">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
