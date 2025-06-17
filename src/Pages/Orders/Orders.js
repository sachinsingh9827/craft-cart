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
  const [statusSaving, setStatusSaving] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [reviewInputs, setReviewInputs] = useState({});
  const [reviewLoading, setReviewLoading] = useState({});
  const [thankYouModalOpen, setThankYouModalOpen] = useState(false);

  // Load orders and user's reviewed products
  useEffect(() => {
    if (!userId || !token) {
      toast.error("User not authenticated");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/orders/user/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${BASE_URL}/api/reviews/users/${userId}`),
        ]);

        setOrders(ordersRes.data.orders || []);
        setReviewedProductIds(reviewsRes.data.reviews.map((r) => r.productId));
      } catch (err) {
        toast.error("Failed to load orders or reviews");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId, token]);

  const toggleOrder = (id) =>
    setExpandedOrderId((prev) => (prev === id ? null : id));
  const isWithinThreeDays = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    return diff / (1000 * 60 * 60 * 24) <= 3;
  };

  const openCancelModal = (id) => {
    setSelectedOrderId(id);
    setCancelModalOpen(true);
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
        toast.success("Order cancelled successfully!");
        setOrders((o) =>
          o.map((order) =>
            order._id === selectedOrderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Cancellation failed");
    } finally {
      setStatusSaving(false);
      setCancelModalOpen(false);
      setSelectedOrderId(null);
    }
  };

  const handleReviewChange = (prodId, field, value) => {
    setReviewInputs((prev) => ({
      ...prev,
      [prodId]: { ...(prev[prodId] || {}), [field]: value },
    }));
  };

  const handleReviewSubmit = async (prodId) => {
    const inp = reviewInputs[prodId];
    if (!inp?.rating || !inp?.comment) {
      toast.warning("Please fill rating and comment");
      return;
    }
    setReviewLoading((prev) => ({ ...prev, [prodId]: true }));

    try {
      const res = await axios.post(
        `${BASE_URL}/api/reviews/products/${prodId}/reviews`,
        { rating: inp.rating, comment: inp.comment, userId, userName }
      );

      if (res.data.status === "success") {
        toast.success("Review submitted");
        setReviewedProductIds((prev) => [...prev, prodId]);
        setReviewInputs((prev) => ({
          ...prev,
          [prodId]: { rating: "", comment: "" },
        }));
        setThankYouModalOpen(true);
        setTimeout(() => {
          setThankYouModalOpen(false);
          navigate("/shop");
        }, 2000);
      } else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Review failed");
    } finally {
      setReviewLoading((prev) => ({ ...prev, [prodId]: false }));
    }
  };

  if (loading)
    return <div className="text-center p-6">Loading your orders...</div>;
  if (!orders.length)
    return <div className="text-center p-6">No orders found.</div>;

  return (
    <div className="mx-auto p-2 max-w-full">
      <h1 className="text-sm uppercase font-bold mb-4 text-[#004080]">
        Your Orders
      </h1>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 mb-4 rounded shadow-sm bg-white"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-bold uppercase text-sm mb-4">
              Order #{order.orderId}
            </h2>
            <span
              className={`text-sm font-bold px-2 rounded ${
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
              className="text-xs ml-2 text-blue-600 underline"
              onClick={() => toggleOrder(order._id)}
            >
              {expandedOrderId === order._id ? "Hide Details" : "Show Details"}
            </button>
          </div>

          <div className="text-sm text-gray-700 mb-2">
            <strong>Date:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </div>
          <div className="text-right font-bold text-[#004080]">
            Total: ₹{order.totalAmount.toFixed(2)}
          </div>

          {expandedOrderId === order._id && (
            <div className="mt-6 border-t pt-4">
              <h3 className="text-lg font-bold mb-4 text-[#004080]">
                Order Summary
              </h3>
              <table className="w-full text-sm mb-4">
                <thead>
                  <tr className="bg-[#004080] text-white">
                    <th className="p-2 text-left">Product</th>
                    <th className="p-2 text-left">Image</th>
                    <th className="p-2 text-right">Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <React.Fragment key={item._id}>
                      <tr className="border-b">
                        <td className="p-2">{item.name}</td>
                        <td className="p-2">
                          <img
                            src={item.images?.[0]?.url || "/placeholder.jpg"}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        </td>
                        <td className="p-2 text-right">
                          ₹{item.price.toFixed(2)}
                        </td>
                      </tr>

                      {order.status === "delivered" &&
                        !reviewedProductIds.includes(item._id) && (
                          <tr>
                            <td colSpan="3" className="p-4">
                              <div className="bg-gray-50 border rounded p-4">
                                <div className="font-semibold text-sm mb-2">
                                  Leave a Review
                                </div>
                                <div className="flex flex-col gap-2">
                                  <select
                                    value={reviewInputs[item._id]?.rating || ""}
                                    onChange={(e) =>
                                      handleReviewChange(
                                        item._id,
                                        "rating",
                                        e.target.value
                                      )
                                    }
                                    className="border p-2 rounded"
                                  >
                                    <option value="">Select Rating</option>
                                    {[1, 2, 3, 4, 5].map((v) => (
                                      <option key={v} value={v}>
                                        {v}{" "}
                                        {
                                          [
                                            "Poor",
                                            "Fair",
                                            "Good",
                                            "Very Good",
                                            "Excellent",
                                          ][v - 1]
                                        }
                                      </option>
                                    ))}
                                  </select>
                                  <textarea
                                    rows="3"
                                    placeholder="Write your review..."
                                    value={
                                      reviewInputs[item._id]?.comment || ""
                                    }
                                    onChange={(e) =>
                                      handleReviewChange(
                                        item._id,
                                        "comment",
                                        e.target.value
                                      )
                                    }
                                    className="border p-2 rounded"
                                  />
                                  <button
                                    onClick={() => handleReviewSubmit(item._id)}
                                    disabled={reviewLoading[item._id]}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition"
                                  >
                                    {reviewLoading[item._id]
                                      ? "Submitting..."
                                      : "Submit Review"}
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>

              {order.coupon && (
                <div className="mb-4 p-4 border rounded bg-green-50 text-green-700 font-medium max-w-sm">
                  Coupon Applied: <strong>{order.coupon.code}</strong> — ₹
                  {order.coupon.discountAmt.toFixed(2)}
                </div>
              )}

              <div className="max-w-md ml-auto border-t pt-4 text-sm font-mono">
                <div className="flex justify-between text-gray-700 mb-2">
                  <span>Subtotal:</span>
                  <span>₹{order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-red-600 mb-2">
                    <span>Discount:</span>
                    <span>-₹{order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-base">
                  <span>Total:</span>
                  <span>₹{order.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {order.status === "pending" &&
                isWithinThreeDays(order.createdAt) && (
                  <div className="text-right mt-6">
                    <button
                      onClick={() => openCancelModal(order._id)}
                      disabled={statusSaving}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition"
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded shadow-lg p-6 max-w-sm w-full">
            <h3 className="font-semibold text-lg text-[#004080] mb-4">
              Confirm Cancellation
            </h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel this order?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
                onClick={() => setCancelModalOpen(false)}
              >
                No
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition"
                onClick={handleCancelOrder}
                disabled={statusSaving}
              >
                {statusSaving ? "Cancelling..." : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Thank You Modal */}
      {thankYouModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center max-w-sm w-full">
            <h2 className="text-green-700 font-bold text-xl mb-2">
              Thank You!
            </h2>
            <p className="text-gray-700">Your review has been submitted.</p>
          </div>
        </div>
      )}
    </div>
  );
}
