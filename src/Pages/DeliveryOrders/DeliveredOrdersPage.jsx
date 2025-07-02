import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../components/Reusable/Pagination";

const BASE_URL = "https://craft-cart-backend.vercel.app/api";

const DeliveredOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showVideo, setShowVideo] = useState({}); // keep track of which video is shown

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const fetchDeliveredOrders = async (page) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${BASE_URL}/delivery-video/delivered/${user._id}?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch delivered orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveredOrders(page);
  }, [page]);

  const toggleVideo = (orderId) => {
    setShowVideo((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="p-6 font-montserrat bg-gray-50 min-h-screen">
      <h2 className="text-lg font-bold text-[#004080] mb-4">
        Delivered Orders
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <p>No delivered orders found.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="p-4 border rounded bg-white shadow"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">Order ID:</span>
                  <span>{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Status:</span>
                  <span>{order.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Delivered At:</span>
                  <span>{new Date(order.deliveredAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Ordered By:</span>
                  <span>{order.orderedBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Contact Number:</span>
                  <span>{order.deliveryAddress?.contact || "N/A"}</span>
                </div>

                {order.videoUrl && (
                  <div className="mt-2">
                    <button
                      onClick={() => toggleVideo(order._id)}
                      className="px-4 py-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {showVideo[order._id] ? "Hide Video" : "Show Video"}
                    </button>

                    {showVideo[order._id] && (
                      <div className="mt-3">
                        <video
                          src={order.videoUrl}
                          controls
                          className="w-full max-w-md"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        loading={loading}
      />
    </div>
  );
};

export default DeliveredOrdersPage;
