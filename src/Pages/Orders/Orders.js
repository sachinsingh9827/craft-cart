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

  useEffect(() => {
    if (!userId || !token) return;

    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrders(res.data.orders || []);
      } catch (err) {
        toast.error("Failed to load orders");
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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

  if (loading)
    return <div className="text-center p-6">Loading your orders...</div>;
  if (!orders.length)
    return <div className="text-center p-6">No orders found.</div>;

  return (
    <div className="mx-auto p-6 max-w-4xl">
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
            className="border p-4 mb-4 rounded shadow-sm bg-white"
            onClick={() => toggleOrder(order._id)}
          >
            <div className="flex justify-between items-center mb-2 cursor-pointer">
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

                <table className="w-full table-auto border-collapse mb-4 text-sm">
                  <thead>
                    <tr className="bg-[#004080] text-white">
                      <th className="p-2 text-left">Product</th>
                      <th className="p-2 text-left">Image</th>
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
                  <div className="mb-4 p-4 border border-green-300 bg-green-50 rounded text-green-700 font-medium max-w-sm">
                    Coupon Applied: <strong>{order.coupon.code}</strong> —
                    Discount: ₹{order.coupon.discountAmt.toFixed(2)}
                  </div>
                )}

                <section className="mb-4 text-sm">
                  <h4 className="font-semibold text-[#004080] mb-1">
                    Shipping Address
                  </h4>
                  <address className="not-italic font-mono text-gray-700">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                    , {order.deliveryAddress.state} -{" "}
                    {order.deliveryAddress.postalCode},{" "}
                    {order.deliveryAddress.country}
                    <br />
                    <strong>Contact:</strong> {order.deliveryAddress.contact}
                  </address>
                </section>

                <section className="mb-4 text-sm">
                  <h4 className="font-semibold text-[#004080] mb-1">
                    Payment Method
                  </h4>
                  <p className="font-mono text-gray-700">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Online Payment"}
                  </p>
                </section>

                <div className="max-w-md ml-auto border-t pt-4 font-mono text-sm">
                  <div className="flex justify-between mb-2 text-gray-700">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal.toFixed(2)}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between mb-2 text-red-600">
                      <span>Discount:</span>{" "}
                      <span>-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base border-t pt-2">
                    <span>Total:</span>{" "}
                    <span>₹{order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                {showCancelButton && (
                  <div className="text-right mt-6">
                    <button
                      disabled={statusSaving}
                      onClick={() => openCancelModal(order._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition disabled:opacity-50"
                    >
                      Cancel Order
                    </button>
                  </div>
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
