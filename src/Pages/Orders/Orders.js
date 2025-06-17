import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://craft-cart-backend.vercel.app";

export default function Orders() {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const storedToken = localStorage.getItem("token");

  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const userId = parsedUser?._id;
  const userName = parsedUser?.username;
  const token = storedToken || null;

  const [orders, setOrders] = useState([]);
  const [reviewedProductIds, setReviewedProductIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Fetch orders and user's reviews
  useEffect(() => {
    if (!userId || !token) {
      toast.error("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }

    const fetchOrdersAndReviews = async () => {
      try {
        const [orderRes, reviewRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/orders/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/reviews/users/${userId}`),
        ]);

        setOrders(orderRes.data.orders || []);
        const reviewed = reviewRes.data.reviews.map((r) => r.productId);
        setReviewedProductIds(reviewed);
      } catch (error) {
        console.error("Error fetching orders or reviews", error);
        toast.error("Something went wrong. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndReviews();
  }, [userId, token]);

  const toggleOrder = (id) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const isWithinThreeDays = (dateStr) => {
    const orderDate = new Date(dateStr);
    const now = new Date();
    const diff = (now - orderDate) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  };

  const handleReviewChange = (productId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value,
      },
    }));
  };

  const handleReviewSubmit = async (productId) => {
    const input = reviewInputs[productId];
    if (!input?.rating || !input?.comment) {
      toast.warning("Please fill in both rating and comment.");
      return;
    }

    setReviewLoading((prev) => ({ ...prev, [productId]: true }));

    try {
      const response = await axios.post(
        `${BASE_URL}/api/reviews/products/${productId}/reviews`,
        {
          rating: input.rating,
          comment: input.comment,
          userId,
          userName,
        }
      );

      if (response.data.status === "success") {
        toast.success("Review submitted!");
        setReviewedProductIds((prev) => [...prev, productId]);
        setThankYouModalOpen(true);
        setTimeout(() => {
          setThankYouModalOpen(false);
          navigate("/shop");
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setReviewLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/orders/${selectedOrderId}/status`,
        { status: "cancelled" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status === "success") {
        toast.success("Order cancelled.");
        setOrders((prev) =>
          prev.map((o) =>
            o._id === selectedOrderId ? { ...o, status: "cancelled" } : o
          )
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order.");
    } finally {
      setCancelModalOpen(false);
      setSelectedOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-blue-600">
        Loading your orders...
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="text-center py-10 text-gray-600">
        <h2 className="text-xl font-semibold mb-2">No Orders Yet</h2>
        <p>
          Looks like you haven’t placed any orders. Browse our shop to get
          started!
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#004080] mb-6">Your Orders</h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="mb-6 border rounded shadow-sm p-4 bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Order #{order.orderId}</h2>
            <span
              className={`text-sm font-bold px-2 py-1 rounded ${
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
              className="ml-2 text-blue-600 underline text-sm"
              onClick={() => toggleOrder(order._id)}
            >
              {expandedOrderId === order._id ? "Hide Details" : "Show Details"}
            </button>
          </div>

          {expandedOrderId === order._id && (
            <div className="mt-4 border-t pt-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="mb-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.images?.[0]?.url || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <span>{item.name}</span>
                  </div>
                  <div className="text-right">₹{item.price}</div>
                </div>
              ))}

              {/* Review section */}
              {order.items.map((item) =>
                order.status === "delivered" &&
                !reviewedProductIds.includes(item._id) ? (
                  <div
                    key={`review-${item._id}`}
                    className="mt-4 border-t pt-4"
                  >
                    <h4 className="font-semibold text-sm mb-2">
                      Review: {item.name}
                    </h4>
                    <select
                      value={reviewInputs[item._id]?.rating || ""}
                      onChange={(e) =>
                        handleReviewChange(item._id, "rating", e.target.value)
                      }
                      className="border p-2 rounded mb-2 w-full"
                    >
                      <option value="">Select Rating</option>
                      {[1, 2, 3, 4, 5].map((r) => (
                        <option key={r} value={r}>
                          {r} Star{r > 1 && "s"}
                        </option>
                      ))}
                    </select>
                    <textarea
                      rows="3"
                      placeholder="Your comment..."
                      value={reviewInputs[item._id]?.comment || ""}
                      onChange={(e) =>
                        handleReviewChange(item._id, "comment", e.target.value)
                      }
                      className="border p-2 rounded w-full mb-2"
                    />
                    <button
                      onClick={() => handleReviewSubmit(item._id)}
                      disabled={reviewLoading[item._id]}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {reviewLoading[item._id]
                        ? "Submitting..."
                        : "Submit Review"}
                    </button>
                  </div>
                ) : null
              )}

              {/* Cancel Order */}
              {order.status === "pending" &&
                isWithinThreeDays(order.createdAt) && (
                  <div className="text-right mt-6">
                    <button
                      onClick={() => openCancelModal(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
            </div>
          )}
        </div>
      ))}

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Cancel Order</h3>
            <p>Are you sure you want to cancel this order?</p>
            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                No
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {thankYouModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full text-center">
            <h2 className="text-green-700 font-bold text-xl mb-2">
              Thank You!
            </h2>
            <p>Your review has been submitted successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
}
