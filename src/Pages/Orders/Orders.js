import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Orders() {
  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const token = parsedUser?.token;
  const userId = parsedUser?._id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    (async () => {
      try {
        const res = await axios.get(
          `https://craft-cart-backend.vercel.app/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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

  if (loading)
    return <div className="text-center p-6">Loading your orders...</div>;
  if (!orders.length)
    return <div className="text-center p-6">No orders found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-[#004080] mb-4">Your Orders</h1>

      {orders.map((order) => (
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
                  {order.deliveryAddress.street}, {order.deliveryAddress.city},{" "}
                  {order.deliveryAddress.state} -{" "}
                  {order.deliveryAddress.postalCode},{" "}
                  {order.deliveryAddress.country}
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
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
