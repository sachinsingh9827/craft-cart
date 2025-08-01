import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Button from "../../components/Reusable/Button";
import { showToast } from "../../components/Toast/Toast";

const BASE_URL = "https://craft-cart-backend.vercel.app";

export default function Orders() {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const token = storedToken || null;
  const userId = parsedUser?._id;
  const userName = parsedUser?.username;

  const ratingComments = {
    1: "Okay",
    2: "Could be better",
    3: "Good",
    4: "Very good",
    5: "Excellent",
  };

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});
  const [reviewErrors, setReviewErrors] = useState({});
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!userId || !token) {
      toast.error("User not authenticated");
      return;
    }

    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.status === "success") {
          setOrders(res.data.orders || []);
        } else {
          toast.error(res.data.message || "Failed to load orders");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error loading orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, token]);

  const toggleOrder = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const isWithinThreeDays = (dateStr) => {
    const createdDate = new Date(dateStr);
    const currentDate = new Date();
    const diffTime = currentDate - createdDate;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setSelectedOrderId(null);
    setCancelModalOpen(false);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;
    setStatusSaving(true);

    try {
      const res = await axios.patch(
        `${BASE_URL}/api/orders/${selectedOrderId}/status`,
        { status: "cancelled" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.status === "success") {
        toast.success(res.data.message || "Order cancelled successfully");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === selectedOrderId
              ? { ...order, status: res.data.order.status }
              : order
          )
        );
      } else {
        toast.error(res.data.message || "Failed to cancel order.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Status update failed.");
    } finally {
      setStatusSaving(false);
      closeCancelModal();
    }
  };

  const handleReviewChange = (productId, key, value) => {
    setReviewInputs((prev) => {
      const updated = {
        ...prev,
        [productId]: {
          ...prev[productId],
          [key]: value,
        },
      };

      if (key === "rating" && !prev[productId]?.manualComment) {
        updated[productId].comment = ratingComments[value] || "";
      }

      return updated;
    });
  };

  const handleReviewSubmit = async (productId) => {
    const input = reviewInputs[productId];
    if (!input?.rating || !input?.comment) {
      setReviewErrors((prev) => ({
        ...prev,
        [productId]: "Please fill out both rating and comment",
      }));
      return;
    }

    setReviewErrors((prev) => ({ ...prev, [productId]: null }));
    setReviewLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const res = await axios.post(
        `${BASE_URL}/api/reviews/products/${productId}/reviews`,
        {
          rating: input.rating,
          comment: input.comment,
          userId,
          userName,
        }
      );

      if (res.data.status === "success") {
        showToast(
          res.data.message || "Review submitted successfully",
          "success"
        );
        setReviewInputs((prev) => ({
          ...prev,
          [productId]: { rating: "", comment: "" },
        }));
        setThankYouModalOpen(true);
        setTimeout(() => {
          setThankYouModalOpen(false);
          navigate("/shop");
        }, 2000);
      } else {
        showToast(res.data.message || "Review submission failed", "error");
        setReviewErrors(res.data.message);
      }
    } catch (err) {
      showToast(
        err.response?.data?.message || "Failed to submit review",
        "error"
      );
    } finally {
      setReviewLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (loading)
    return <div className="text-center p-6">Loading your orders...</div>;
  if (!orders.length)
    return <div className="text-center p-6">No orders found.</div>;

  return (
    <div className="max-w-full mx-auto p-2">
      <h1 className="text-sm uppercase text-[#004080] font-bold mb-4">
        Your Orders
      </h1>

      {orders.map((order) => {
        const showCancelButton =
          order.status === "pending" &&
          isWithinThreeDays(order.createdAt) &&
          order.status !== "cancelled";

        return (
          <div
            key={order._id}
            className="border rounded-lg shadow-sm p-4 mb-6 bg-white"
          >
            <div className="flex flex-wrap justify-between items-center gap-2">
              <div>
                <h2 className="text-sm font-bold text-start mb-4 text-[#004080] uppercase">
                  Order #{order.orderId}
                </h2>
                <p className="text-xs text-gray-600">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium px-2 py-1 rounded ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.status}
                </span>
                <button
                  className={`text-sm font-medium px-2 py-1 rounded transition-all ${
                    expandedOrderId === order._id
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-blue-600"
                  }`}
                  onClick={() => toggleOrder(order._id)}
                >
                  {expandedOrderId === order._id
                    ? "Hide Details"
                    : "Show Details"}
                </button>
              </div>
            </div>

            {expandedOrderId === order._id && (
              <div className="mt-4 border-t pt-4 text-sm">
                <h3 className="text-[#004080] font-semibold mb-2">Invoice</h3>

                {/* Order Status Progress */}
                <div className="my-6">
                  <h3 className="text-[#004080] font-semibold mb-4 text-lg">
                    Order Progress
                  </h3>

                  <div className="relative w-full  mx-auto px-2 sm:px-2">
                    {/* Progress Line */}
                    <div
                      className=""
                      style={{
                        width:
                          order.status === "pending"
                            ? "0%"
                            : order.status === "confirmed"
                            ? "20%"
                            : order.status === "processing"
                            ? "45%"
                            : order.status === "shipped"
                            ? "75%"
                            : order.status === "delivered"
                            ? "100%"
                            : order.status === "cancelled"
                            ? "100%"
                            : "0%",
                        backgroundColor:
                          order.status === "cancelled" ? "#dc2626" : "#004080",
                        left: 0,
                        transform: "translateY(-50%)",
                      }}
                    ></div>

                    {/* Steps - Only numbers now */}
                    <div className="flex justify-between items-center relative z-20 flex-wrap">
                      {[
                        "pending",
                        "confirmed",
                        "processing",
                        "shipped",
                        "delivered",
                      ].map((step, index) => {
                        const isActive =
                          index <=
                          [
                            "pending",
                            "confirmed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].indexOf(order.status.toLowerCase());
                        const isCancelled =
                          order.status.toLowerCase() === "cancelled";

                        return (
                          <div
                            key={step}
                            className="flex flex-col items-center text-center w-1/5 min-w-[60px] mb-4"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 transition-all duration-300 ${
                                isCancelled
                                  ? "bg-red-600 text-white animate-pulse"
                                  : isActive
                                  ? "bg-[#004080] text-white shadow-lg animate-bounce"
                                  : "bg-gray-300 text-gray-500"
                              }`}
                            >
                              {index + 1}
                            </div>
                            {/* Name hidden */}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="text-center mt-4 font-medium text-sm">
                    {order.status === "cancelled" ? (
                      <span className="text-red-600">Order Cancelled</span>
                    ) : (
                      <span className="text-[#004080] capitalize">
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivery and Payment Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="font-medium">Delivery Address</p>
                    <p>{order.deliveryAddress.street}</p>
                    <p>
                      {order.deliveryAddress.city},{" "}
                      {order.deliveryAddress.state}
                    </p>
                    <p>
                      {order.deliveryAddress.country} -{" "}
                      {order.deliveryAddress.postalCode}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Method</p>
                    <p className="capitalize">{order.paymentMethod}</p>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4 space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="border rounded p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                    >
                      <img
                        src={
                          item.productId?.images?.[0]?.url || "/placeholder.jpg"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">
                          {item.productId?.name || item.name}
                        </p>
                        <p className="text-gray-600">
                          Price: ₹{item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total Summary */}
                <div className="text-right font-mono">
                  <p>Subtotal: ₹{order.subtotal.toFixed(2)}</p>
                  {order.discount > 0 && (
                    <p className="text-red-600">
                      Discount: -₹{order.discount.toFixed(2)}
                    </p>
                  )}
                  <p className="text-lg font-bold">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </p>
                </div>

                {/* Review Section */}
                {order.status === "delivered" &&
                  order.items.map((item) => {
                    const product = item.productId;
                    const productId = product?._id || item.productId;
                    const existingReview = product?.reviews?.find(
                      (rev) => rev.user === user._id // Assuming you have user._id
                    );

                    return (
                      <div key={item._id} className="mb-6">
                        <p className="font-medium mb-1">
                          {product?.name || item.name}
                        </p>

                        {/* Show user's existing review if found */}
                        {existingReview ? (
                          <div className="border p-4 rounded bg-green-50 dark:bg-green-900 text-gray-800 dark:text-white">
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill={
                                    existingReview.rating >= star
                                      ? "#facc15"
                                      : "none"
                                  }
                                  viewBox="0 0 24 24"
                                  stroke="#facc15"
                                  strokeWidth="1.5"
                                  className="w-5 h-5"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.18 6.684a1 1 0 00.95.69h7.017c.969 0 1.371 1.24.588 1.81l-5.683 4.14a1 1 0 00-.364 1.118l2.18 6.684c.3.921-.755 1.688-1.54 1.118l-5.683-4.14a1 1 0 00-1.176 0l-5.683 4.14c-.784.57-1.838-.197-1.539-1.118l2.18-6.684a1 1 0 00-.364-1.118l-5.683-4.14c-.784-.57-.38-1.81.588-1.81h7.017a1 1 0 00.95-.69l2.18-6.684z"
                                  />
                                </svg>
                              ))}
                            </div>
                            <p className="italic text-sm">
                              {existingReview.comment}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Reviewed on{" "}
                              {new Date(
                                existingReview.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          // Show review form if no review exists by this user
                          <>
                            {reviewErrors[productId] && (
                              <p className="text-red-600 text-sm mb-2">
                                {reviewErrors[productId]}
                              </p>
                            )}

                            <div className="flex flex-col gap-4 p-4 border rounded shadow-sm bg-white dark:bg-gray-800">
                              {/* Star Rating */}
                              <div className="flex gap-1 p-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    key={star}
                                    type="button"
                                    onClick={() =>
                                      handleReviewChange(
                                        productId,
                                        "rating",
                                        star
                                      )
                                    }
                                    className="focus:outline-none"
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill={
                                        reviewInputs[productId]?.rating >= star
                                          ? "#facc15"
                                          : "none"
                                      }
                                      viewBox="0 0 24 24"
                                      stroke="#facc15"
                                      strokeWidth="1.5"
                                      className="w-5 h-5 transition-all"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.18 6.684a1 1 0 00.95.69h7.017c.969 0 1.371 1.24.588 1.81l-5.683 4.14a1 1 0 00-.364 1.118l2.18 6.684c.3.921-.755 1.688-1.54 1.118l-5.683-4.14a1 1 0 00-1.176 0l-5.683 4.14c-.784.57-1.838-.197-1.539-1.118l2.18-6.684a1 1 0 00-.364-1.118l-5.683-4.14c-.784-.57-.38-1.81.588-1.81h7.017a1 1 0 00.95-.69l2.18-6.684z"
                                      />
                                    </svg>
                                  </button>
                                ))}
                              </div>

                              {/* Comment Box */}
                              <textarea
                                value={reviewInputs[productId]?.comment || ""}
                                onChange={(e) =>
                                  setReviewInputs((prev) => ({
                                    ...prev,
                                    [productId]: {
                                      ...prev[productId],
                                      comment: e.target.value,
                                      manualComment: true,
                                    },
                                  }))
                                }
                                className="border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-y"
                                rows="4"
                                placeholder="Write your review..."
                              />

                              {/* Submit Button */}
                              <Button
                                onClick={() => handleReviewSubmit(productId)}
                                disabled={reviewLoading[productId]}
                                className="w-full sm:w-auto"
                              >
                                {reviewLoading[productId]
                                  ? "Submitting..."
                                  : "Submit Review"}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}

                {/* Cancel Order Button */}
                {showCancelButton && (
                  <div className="text-right mt-4">
                    <button
                      onClick={() => openCancelModal(order._id)}
                      disabled={statusSaving}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {statusSaving ? "Cancelling..." : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Cancel Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#004080] mb-4">
              Confirm Cancellation
            </h3>
            <p className="mb-6 text-sm text-gray-700">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                No
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={statusSaving}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {statusSaving ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {thankYouModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h2 className="text-lg font-bold text-green-700 mb-4">
              Thank You!
            </h2>
            <p className="text-gray-700 text-sm">
              Your review has been submitted.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
