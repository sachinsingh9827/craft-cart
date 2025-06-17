import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://craft-cart-backend.vercel.app";

export default function Orders() {
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const token = parsedUser?.token;
  const userId = parsedUser?._id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [statusSaving, setStatusSaving] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [ratingInputs, setRatingInputs] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  useEffect(() => {
    if (!userId || !token) return;
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data.orders || []);
        // Mark orders that already have reviews submitted
        const reviewMap = {};
        res.data.orders.forEach((order) => {
          if (order.reviewSubmitted) {
            reviewMap[order._id] = true;
          }
        });
        setSubmittedReviews(reviewMap);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, token]);

  const toggleOrder = (id) =>
    setExpandedOrderId((prev) => (prev === id ? null : id));

  const isWithinThreeDays = (dateStr) =>
    (new Date() - new Date(dateStr)) / (1000 * 60 * 60 * 24) <= 3;

  const openCancelModal = (id) => {
    setSelectedOrderId(id);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status === "success") {
        toast.success("Order cancelled");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === selectedOrderId
              ? { ...o, status: res.data.order.status }
              : o
          )
        );
      } else {
        toast.error(res.data.message || "Failed to cancel");
      }
    } catch {
      toast.error("Status update failed");
    } finally {
      setStatusSaving(false);
      closeCancelModal();
    }
  };

  const handleSubmitReview = async (orderId) => {
    const rating = ratingInputs[orderId];
    const comment = reviewInputs[orderId]?.trim();
    if (!rating || !comment) {
      toast.error("Please provide both rating and review.");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/orders/${orderId}/review`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Review submitted!");
        setSubmittedReviews((prev) => ({ ...prev, [orderId]: true }));
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="text-center p-6">Loading...</div>;
  if (!orders.length)
    return <div className="text-center p-6">No orders found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold text-[#004080] mb-6">Your Orders</h1>

      {orders.map((order) => {
        const showCancel =
          order.status === "pending" &&
          isWithinThreeDays(order.createdAt) &&
          order.status !== "cancelled";

        const showReviewForm =
          order.status === "delivered" && !submittedReviews[order._id];

        return (
          <div
            key={order._id}
            className="border p-4 mb-4 rounded shadow-sm bg-white"
          >
            <div
              className="flex justify-between cursor-pointer"
              onClick={() => toggleOrder(order._id)}
            >
              <h2 className="font-semibold">Order #{order.orderId}</h2>
              <span
                className={`px-2 py-1 rounded ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>
            </div>

            {expandedOrderId === order._id && (
              <div className="mt-4">
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Total:</strong> ₹{order.totalAmount.toFixed(2)}
                </p>

                <div className="border-t pt-3 mt-3">
                  <h3 className="font-semibold text-[#004080] mb-2">
                    Order Items:
                  </h3>
                  {order.items.map((item) => (
                    <div key={item._id} className="mb-2 text-sm">
                      <span>{item.name}</span> — ₹{item.price.toFixed(2)}
                    </div>
                  ))}
                </div>

                {showCancel && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => openCancelModal(order._id)}
                      className="bg-red-600 text-white px-3 py-2 rounded"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

                {showReviewForm && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold mb-2">Leave a Review</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <label>Rating:</label>
                      <select
                        value={ratingInputs[order._id] || ""}
                        onChange={(e) =>
                          setRatingInputs((prev) => ({
                            ...prev,
                            [order._id]: +e.target.value,
                          }))
                        }
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">--</option>
                        {[1, 2, 3, 4, 5].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </div>
                    <textarea
                      rows="3"
                      className="w-full border p-2 rounded"
                      placeholder="Write your review..."
                      value={reviewInputs[order._id] || ""}
                      onChange={(e) =>
                        setReviewInputs((prev) => ({
                          ...prev,
                          [order._id]: e.target.value,
                        }))
                      }
                    />
                    <button
                      onClick={() => handleSubmitReview(order._id)}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Submit Review
                    </button>
                  </div>
                )}

                {submittedReviews[order._id] && (
                  <p className="mt-4 text-green-600 italic">
                    You already submitted a review. Thank you!
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })}

      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="font-semibold mb-4">Confirm Cancellation?</h3>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeCancelModal}
                className="px-4 py-2 border rounded"
              >
                No
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={statusSaving}
                className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50"
              >
                {statusSaving ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
