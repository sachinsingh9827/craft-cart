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
      } catch (err) {
        toast.error("Failed to load orders.");
        console.error(err);
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
    const diffDays = (currentDate - createdDate) / (1000 * 60 * 60 * 24);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status === "success") {
        toast.success("Order cancelled successfully!");
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

  const handleSubmitReview = async (orderId) => {
    const rating = ratingInputs[orderId];
    const comment = reviewInputs[orderId]?.trim();

    if (!rating || !comment) {
      toast.error("Please provide both rating and comment.");
      return;
    }

    const order = orders.find((o) => o._id === orderId);
    if (!order || !order.items?.length) {
      toast.error("Invalid order data.");
      return;
    }

    try {
      for (const item of order.items) {
        const productId = item.product;
        if (!productId) continue;

        await axios.post(
          `${BASE_URL}/api/reviews/products/${productId}/reviews`,
          { rating, comment },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success("Review submitted successfully!");
      setSubmittedReviews((prev) => ({ ...prev, [orderId]: true }));
    } catch (err) {
      const message =
        err.response?.data?.message || "Review submission failed.";
      toast.error(message);
    }
  };

  if (loading)
    return <div className="text-center p-6">Loading your orders...</div>;
  if (!orders.length)
    return <div className="text-center p-6">No orders found.</div>;

  return (
    <div className="mx-auto p-4 max-w-full">
      <h1 className="text-xl font-bold text-[#004080] mb-4">Your Orders</h1>

      {orders.map((order) => {
        const showCancelButton =
          order.status === "pending" &&
          isWithinThreeDays(order.createdAt) &&
          order.status !== "cancelled";

        const showReviewForm =
          order.status === "delivered" && !submittedReviews[order._id];

        return (
          <div
            key={order._id}
            className="border p-4 mb-6 rounded shadow bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-[#004080]">
                Order #{order.orderId}
              </h2>
              <span
                className={`text-xs font-bold px-2 py-1 rounded ${
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
                onClick={() => toggleOrder(order._id)}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
              >
                {expandedOrderId === order._id
                  ? "Hide Details"
                  : "Show Details"}
              </button>
            </div>

            {expandedOrderId === order._id && (
              <div className="mt-4 border-t pt-4 text-sm">
                <div className="mb-4">
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </div>

                <table className="w-full mb-4 border text-left text-sm">
                  <thead className="bg-[#004080] text-white">
                    <tr>
                      <th className="p-2">Product</th>
                      <th className="p-2">Image</th>
                      <th className="p-2 text-right">Price (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item._id} className="border-b">
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
                    ))}
                  </tbody>
                </table>

                {order.coupon && (
                  <div className="mb-4 text-green-700 font-medium">
                    Coupon Applied: <strong>{order.coupon.code}</strong> —
                    Discount: ₹{order.coupon.discountAmt.toFixed(2)}
                  </div>
                )}

                <div className="text-sm mb-4">
                  <strong>Address:</strong> {order.deliveryAddress.street},{" "}
                  {order.deliveryAddress.city}, {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.postalCode},{" "}
                  {order.deliveryAddress.country}
                  <br />
                  <strong>Contact:</strong> {order.deliveryAddress.contact}
                </div>

                {showCancelButton && (
                  <div className="text-right mt-4">
                    <button
                      disabled={statusSaving}
                      onClick={() => openCancelModal(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

                {showReviewForm && (
                  <div className="mt-6 border-t pt-4">
                    <h4 className="font-semibold mb-2 text-[#004080]">
                      Leave a Review
                    </h4>
                    <div className="mb-2">
                      <label className="mr-2">Rating:</label>
                      <select
                        value={ratingInputs[order._id] || ""}
                        onChange={(e) =>
                          setRatingInputs((prev) => ({
                            ...prev,
                            [order._id]: Number(e.target.value),
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
                      className="w-full border p-2 rounded mb-2"
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
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

      {/* Cancel Confirmation Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-[#004080]">
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
    </div>
  );
}
