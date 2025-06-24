import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";
import Toast, { showToast } from "../../components/Toast/Toast";
import Button from "../../components/Reusable/Button";

const BASE_URL = "https://craft-cart-backend.vercel.app";

// Format date to Indian format
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Convert number to star rating
const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) stars.push("★");
  if (halfStar) stars.push("☆");
  while (stars.length < 5) stars.push("☆");

  return stars.join(" ");
};

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);

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
        // Already in wishlist
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

  const {
    name,
    price,
    description,
    category,
    brand,
    stock,
    ratings,
    numReviews,
    productId: pId,
    reviews,
  } = product;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 font-montserrat">
      <Toast />
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Image Section */}
        <div className="w-full lg:w-1/2">
          <div className="aspect-square w-full mb-4">
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>

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
          <h1 className="text-3xl font-bold text-[#004080] mb-3">{name}</h1>
          <p className="text-yellow-500 text-2xl font-semibold mb-2">
            ₹{price.toFixed(2)}
          </p>
          <p className="text-gray-700 mb-4 leading-relaxed">{description}</p>

          <div className="text-sm text-gray-600 space-y-2 mb-4">
            <p>
              <strong className="text-gray-800">Category:</strong> {category}
            </p>
            <p>
              <strong className="text-gray-800">Brand:</strong> {brand}
            </p>
            <p className="flex items-center gap-1">
              <strong className="text-gray-800">Stock:</strong>{" "}
              {stock > 10 && (
                <span className="text-green-600 font-medium">
                  In Stock ({stock})
                </span>
              )}
              {stock > 0 && stock <= 10 && (
                <span className="text-orange-500 font-medium">
                  Only {stock} left!
                </span>
              )}
              {stock === 0 && (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </p>
            <p>
              <strong className="text-gray-800">Product ID:</strong> {pId}
            </p>
          </div>

          <div className="mb-4 space-y-1">
            <p className="text-md">
              <strong className="text-gray-800">Rating:</strong>{" "}
              {ratings ? `${ratings.toFixed(1)} / 5` : "No ratings yet"}
            </p>
            {ratings > 0 && (
              <p className="text-yellow-500 text-lg">{renderStars(ratings)}</p>
            )}
            <p className="text-md">
              <strong className="text-gray-800">Reviews:</strong>{" "}
              {numReviews > 0 ? `${numReviews} review(s)` : "No reviews yet"}
            </p>
          </div>

          <Button
            onClick={(e) => handleBuyNow(product._id, e)}
            disabled={stock === 0}
          >
            {stock === 0 ? "Out of Stock" : "Buy Now"}
          </Button>
        </div>
      </div>

      {/* Reviews */}
      {reviews?.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-[#004080] mb-4">
            Customer Reviews
          </h2>
          <div className="space-y-4">
            {(showAllReviews ? reviews : [reviews[0]]).map((review) => (
              <div
                key={review._id}
                className="border border-gray-200 rounded-md p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-gray-800">
                    {review.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="text-yellow-500 font-semibold mb-1">
                  {renderStars(review.rating)} ({review.rating} / 5)
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}

            {reviews.length > 1 && (
              <button
                className={`text-sm font-medium px-3 py-1 mt-4 rounded transition-all ${
                  showAllReviews
                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    : "bg-gray-100 text-blue-600 hover:bg-gray-200"
                }`}
                onClick={() => setShowAllReviews((prev) => !prev)}
              >
                {showAllReviews ? "Hide Reviews" : "Show All Reviews"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
