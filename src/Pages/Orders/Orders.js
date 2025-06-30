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
              <div className="mt-4 border-t pt-4 text-sm px-2 sm:px-4">
                <h3 className="text-[#004080] font-semibold mb-2 text-lg">
                  Invoice
                </h3>

                {/* --- Order Progress --- */}
                <div className="my-6">
                  <h3 className="text-[#004080] font-semibold mb-4 text-base sm:text-lg">
                    Order Progress
                  </h3>

                  <div className="relative w-full max-w-3xl mx-auto">
                    {/* Animated Progress Line */}
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
                        transform: "translateY(-50%)",
                      }}
                    ></div>

                    {/* Step Numbers Only */}
                    <div className="flex justify-between items-center relative z-20 flex-wrap">
                      {[1, 2, 3, 4, 5].map((number, index) => {
                        const activeIndex = [
                          "pending",
                          "confirmed",
                          "processing",
                          "shipped",
                          "delivered",
                        ].indexOf(order.status.toLowerCase());

                        const isActive = index <= activeIndex;
                        const isCancelled =
                          order.status.toLowerCase() === "cancelled";

                        return (
                          <div
                            key={index}
                            className="w-[20%] min-w-[50px] flex justify-center mb-3"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                                isCancelled
                                  ? "bg-red-600 text-white animate-pulse"
                                  : isActive
                                  ? "bg-[#004080] text-white shadow-lg animate-bounce"
                                  : "bg-gray-300 text-gray-500"
                              }`}
                            >
                              {number}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Only Current Status Text */}
                  <div className="text-center mt-4 font-medium text-sm sm:text-base">
                    {order.status === "cancelled" ? (
                      <span className="text-red-600">Order Cancelled</span>
                    ) : (
                      <span className="text-[#004080] capitalize">
                        {order.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Delivery & Payment Info */}
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
                        src={item.images?.[0]?.url || "/placeholder.jpg"}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
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

                {/* Cancel Button */}
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
