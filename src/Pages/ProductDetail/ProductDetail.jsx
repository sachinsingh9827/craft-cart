import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";
import Toast, { showToast } from "../../components/Toast/Toast";
import Button from "../../components/Reusable/Button";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product details
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/protect/${productId}`
        );
        const fetchedProduct = res.data.data;
        setProduct(fetchedProduct);
        setSelectedImage(fetchedProduct.images?.[0]?.url || "");
      } catch (err) {
        console.error(err);
        showToast("Failed to load product details", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // Buy Now handler
  const handleBuyNow = async (productId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      showToast("Please login to continue.", "warning");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/user/auth/wishlist/add`,
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        // Already in wishlist, continue
      } else if (status === 401) {
        showToast("Session expired. Please login again.", "warning");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      } else {
        showToast("Error adding to wishlist. Try again.", "error");
        return;
      }
    }

    navigate(`/order/${productId}`);
  };

  if (loading) return <LoadingPage />;
  if (!product)
    return (
      <div className="text-center mt-10 text-gray-500">Product not found.</div>
    );

  return (
    <div className="max-w-full min-h-1/2 mx-auto p-4 sm:p-6 font-montserrat">
      <Toast />
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
          <div className="w-full md:w-1/2 aspect-square mb-4">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>

          {/* Thumbnails */}
          <div className="flex flex-wrap gap-2">
            {(product.images || []).map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedImage(img.url)}
                className={`w-20 h-20 object-cover rounded-md border cursor-pointer transition-all ${
                  selectedImage === img.url ? "ring-2 ring-[#004080]" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-[#004080] mb-2">
            {product.name}
          </h1>
          <p className="text-yellow-500 text-xl font-semibold mb-2">
            ₹{product.price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          {/* Extra Details */}
          <div className="text-sm text-gray-600 space-y-1 mb-4">
            <p>
              <span className="font-semibold text-gray-800">Category:</span>{" "}
              {product.category}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Brand:</span>{" "}
              {product.brand}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Stock:</span>{" "}
              {product.stock > 0 ? product.stock : "Out of stock"}
            </p>
            <p>
              <span className="font-semibold text-gray-800">Product ID:</span>{" "}
              {product.productId}
            </p>
          </div>

          {/* Ratings */}
          <div className="mb-4">
            <p className="text-md">
              <span className="font-semibold text-gray-800">Rating:</span>{" "}
              {product.ratings > 0
                ? `${product.ratings} / 5`
                : "No ratings yet"}
            </p>
            <p className="text-md">
              <span className="font-semibold text-gray-800">Reviews:</span>{" "}
              {product.numReviews > 0
                ? `${product.numReviews} review(s)`
                : "No reviews yet"}
            </p>
          </div>

          {/* Buy Now Button */}
          <Button onClick={(e) => handleBuyNow(product._id, e)}>Buy Now</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
