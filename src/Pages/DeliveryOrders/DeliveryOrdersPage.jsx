import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../../components/Reusable/Pagination";
const BASE_URL = "https://craft-cart-backend.vercel.app/api";

const DeliveryOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async (page = 1) => {
    const token = localStorage.getItem("token");

    setLoading(true);
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
        toast.error(data.message || "Failed to load shipped orders");
      }
    } catch (err) {
      toast.error("Error fetching shipped orders");
    } finally {
      setLoading(false);
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

  return (
    <div className="orders-container">
      <h2 className="text-xl font-bold mb-4">Shipped Orders</h2>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No shipped orders available.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li
              key={order._id}
              className="border p-4 rounded shadow-md bg-white dark:bg-gray-800"
            >
              <p>
                <strong>Order ID:</strong> {order._id}
              </p>
              <p>
                <strong>Customer:</strong>{" "}
                {order.customerName || order.userId?.name || "N/A"}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <button
                onClick={() => handleDeliver(order._id)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Send OTP
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination Component */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
};

export default DeliveryOrdersPage;
