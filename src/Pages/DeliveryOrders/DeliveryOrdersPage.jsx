import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const DeliveryOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("/api/delivery/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data.orders);
        } else {
          toast.error(data.message || "Failed to load orders");
        }
      } catch (err) {
        toast.error("Error fetching orders");
      }
    };

    fetchOrders();
  }, []);

  const handleDeliver = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/delivery/send-otp/${orderId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("OTP sent to customer email.");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to send OTP.");
    }
  };

  return (
    <div className="orders-container">
      <h2>Assigned Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            <p>Order ID: {order._id}</p>
            <p>Customer: {order.customerName}</p>
            <p>Status: {order.status}</p>
            <button onClick={() => handleDeliver(order._id)}>Send OTP</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryOrdersPage;
