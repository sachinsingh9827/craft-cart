import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingPage from "../../components/LoadingPage";
import Toast, { showToast } from "../../components/Toast/Toast";
import Button from "../../components/Reusable/Button";
import Pagination from "../../components/Reusable/Pagination";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [totalReviewPages, setTotalReviewPages] = useState(1);
  const [allReviews, setAllReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  const userId = (() => {
    try {
      const tokenData = JSON.parse(
        atob(localStorage.getItem("token").split(".")[1])
      );
      return tokenData?.id?._id;
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/protect/${productId}`
        );
        const data = res.data.data;
        setProduct(data);
        setSelectedImage(data.images?.[0]?.url || "");
      } catch (err) {
        console.error(err);
        showToast("Failed to load product details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/reviews/products/${productId}/reviews?limit=5&page=${reviewPage}`
        );
        if (res.data.status === "success") {
          const reviews = res.data.reviews || [];
          const user = reviews.find((r) => r.user === userId);
          const others = reviews.filter((r) => r.user !== userId);
          setUserReview(user || null);
          setAllReviews(others);
          setTotalReviewPages(Math.ceil(res.data.total / res.data.limit));
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to load reviews", "error");
      }
    };
    fetchReviews();
  }, [productId, reviewPage, userId]);

  const handleBuyNow = async (pId, e) => {
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
        { productId: pId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/order/${pId}`);
    } catch (err) {
      if (err.response?.status === 409) return;
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        showToast("Session expired. Please login again.", "warning");
        navigate("/login");
      } else {
        showToast("Error adding to wishlist. Try again.", "error");
      }
    }
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
    images,
  } = product;

  const visibleReviews = showAllReviews
    ? [...(userReview ? [userReview] : []), ...allReviews]
    : userReview
    ? [userReview]
    : allReviews.length > 0
    ? [allReviews[0]]
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 font-montserrat">
      <Toast />

      {/* Product Info */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-1/2">
          <div className="aspect-square w-full mb-3">
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {images?.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`thumb-${idx}`}
                onClick={() => setSelectedImage(img.url)}
                className={`w-16 h-16 object-cover rounded-md border cursor-pointer ${
                  selectedImage === img.url ? "ring-2 ring-[#004080]" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#004080] mb-2">{name}</h1>
            <p className="text-yellow-500 text-xl font-semibold mb-1">
              ₹{price.toFixed(2)}
            </p>
            <p className="text-[#004080] mb-3 text-sm">{description}</p>

            <div className="space-y-1 mb-3">
              <p>
                <strong className="text-[#004080]">Category:</strong> {category}
              </p>
              <p>
                <strong className="text-[#004080]">Brand:</strong> {brand}
              </p>
              <p>
                <strong className="text-[#004080]">Stock:</strong>{" "}
                {stock > 10 ? (
                  <span className="text-green-600">In Stock ({stock})</span>
                ) : stock > 0 ? (
                  <span className="text-orange-500">Only {stock} left!</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
              <p>
                <strong className="text-[#004080]">Product ID:</strong> {pId}
              </p>
            </div>

            <div className="mb-3 space-y-0.5">
              <p>
                <strong className="text-[#004080]">Rating:</strong>{" "}
                {ratings ? `${ratings.toFixed(1)} / 5` : "No ratings yet"}
              </p>
              {ratings > 0 && (
                <p className="text-yellow-500 text-base">
                  {renderStars(ratings)}
                </p>
              )}
              <p>
                <strong className="text-[#004080]">Reviews:</strong>{" "}
                {numReviews > 0 ? `${numReviews} review(s)` : "No reviews yet"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              onClick={(e) => handleBuyNow(product._id, e)}
              disabled={stock === 0}
              className="flex-1"
            >
              {stock === 0 ? "Out of Stock" : "Buy Now"}
            </Button>

            {numReviews > 0 && (
              <Button
                onClick={() => {
                  setShowAllReviews(!showAllReviews);
                  setReviewPage(1);
                }}
                variant={showAllReviews ? "outline" : "solid"}
                className="flex-1"
              >
                {showAllReviews ? "Hide Reviews" : "Show All Reviews"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      {visibleReviews.length > 0 && (
        <div className="mt-8 mb-2">
          <h2 className="text-lg font-semibold text-[#004080] mb-3">
            Customer Reviews
          </h2>

          <div className="space-y-3">
            {visibleReviews.map((review) => (
              <div
                key={review._id}
                className="border rounded-md p-3 bg-white shadow-sm"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">
                    {review.name}
                    {review.user === userId && (
                      <span className="text-xs text-blue-600 font-semibold ml-1">
                        (You)
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
                <div className="text-yellow-500 font-medium text-sm mb-1">
                  {renderStars(review.rating)} ({review.rating} / 5)
                </div>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>

          {showAllReviews && totalReviewPages > 1 && (
            <div className="mt-4">
              <Pagination
                page={reviewPage}
                totalPages={totalReviewPages}
                onPageChange={setReviewPage}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
