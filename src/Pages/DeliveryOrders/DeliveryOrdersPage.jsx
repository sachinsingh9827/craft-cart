import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const BASE_URL = "https://craft-cart-backend.vercel.app/api";

const DeliveryOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = async (page = 1) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${BASE_URL}/orders/shipped?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOrders(data.data || []);
        setTotalPages(data.totalPages || 1);
      } else {
        toast.error(data.message || "Failed to load orders");
      }
    } catch (err) {
      toast.error("Error fetching shipped orders");
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleDeliver = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${BASE_URL}/delivery/send-otp/${orderId}`, {
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

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="orders-container">
      <h2>Shipped Orders</h2>
      {orders.length === 0 ? (
        <p>No shipped orders available.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <p>Order ID: {order._id}</p>
              <p>Customer: {order.customerName || "N/A"}</p>
              <p>Status: {order.status}</p>
              <button onClick={() => handleDeliver(order._id)}>Send OTP</button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div style={{ marginTop: "1rem" }}>
        <button onClick={handlePrev} disabled={page === 1}>
          Prev
        </button>
        <span style={{ margin: "0 1rem" }}>
          Page {page} of {totalPages}
        </span>
        <button onClick={handleNext} disabled={page === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryOrdersPage;
