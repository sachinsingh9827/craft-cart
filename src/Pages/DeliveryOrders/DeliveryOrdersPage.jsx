import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../../components/Reusable/Pagination";
import axios from "axios";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Button from "../../components/Reusable/Button";
import LoadingPage from "../../components/LoadingPage";
import VideoUploader from "./VideoUploader";

const BASE_URL = "https://craft-cart-backend.vercel.app/api";

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const DeliveryOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [totalRemainingOrders, setTotalRemainingOrders] = useState(0);
  const inputRefs = useRef([]);

  const fetchOrders = async (page = 1) => {
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/orders/shipped?page=${page}&limit=5`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setOrders(data.data || []);
        setTotalPages(data.totalPages || 1);
        setTotalRemainingOrders(data.totalItems || 0);
      } else {
        toast.error(data.message || "Failed to load shipped orders");
      }
    } catch {
      toast.error("Error fetching shipped orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowOtpInput(false);
  };

  const handleSendOtp = async (orderId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `${BASE_URL}/orders/delivery/send-otp/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        setShowOtpInput(true);
      } else {
        toast.error(data.message || "Failed to send OTP.");
      }
    } catch {
      toast.error("Server error while sending OTP.");
    }
  };

  const handleVerifyOtp = async (otp, orderId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `${BASE_URL}/orders/delivery/verify-otp/${orderId}`,
        { otp },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.data.success) {
        toast.success("Order marked as delivered!");
        setSelectedOrder(null);
        setShowOtpInput(false);
        fetchOrders();
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch {
      toast.error("Failed to verify OTP.");
    }
  };

  return (
    <div className="p-6 font-montserrat bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-sm uppercase text-[#004080] font-bold">
          Shipped Orders
        </h2>
        <span className="text-gray-700 text-sm sm:text-base mt-2 sm:mt-0">
          Remaining Orders to Deliver:{" "}
          <strong className="text-red-600">{totalRemainingOrders}</strong>
        </span>
      </div>

      {loading ? (
        <LoadingPage />
      ) : selectedOrder ? (
        <div className="border p-4 bg-white rounded shadow-md space-y-3">
          <div className="flex justify-between">
            <p className="font-semibold text-[#004080]">Order ID:</p>
            <p>{selectedOrder.orderId}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#004080]">Customer:</p>
            <p>{selectedOrder.customerName || "N/A"}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#004080]">Contact:</p>
            <p>{selectedOrder.deliveryAddress?.contact}</p>
          </div>
          <div className="flex justify-between">
            <p className="font-semibold text-[#004080]">Status:</p>
            <p>{selectedOrder.status}</p>
          </div>
          <div>
            <p className="font-semibold text-[#004080] mb-1">Address:</p>
            <p className="text-sm text-right">
              {selectedOrder.deliveryAddress?.street},{" "}
              {selectedOrder.deliveryAddress?.city},{" "}
              {selectedOrder.deliveryAddress?.state} -{" "}
              {selectedOrder.deliveryAddress?.postalCode}
            </p>
          </div>
          <div>
            <p className="font-semibold text-[#004080]">Items:</p>
            <ul className="ml-4 list-disc text-sm text-gray-700">
              {selectedOrder.items.map((item) => (
                <li key={item._id}>
                  {item.name} x {item.quantity}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-between mt-2">
            <p className="font-semibold text-[#004080]">Total:</p>
            <p>₹{selectedOrder.totalAmount}</p>
          </div>
          {/* Video Upload Section */}
          <div className="mt-4">
            <h3 className="font-semibold text-[#004080] mb-2">
              Unboxing Video:
            </h3>
            <VideoUploader
              orderId={selectedOrder._id}
              deliveryBoyId={selectedOrder.assignedTo || "delivery-boy-id"}
            />
          </div>
          {!showOtpInput && videoUploaded ? (
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
              <Button
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto"
              >
                Back to all orders
              </Button>
              <Button
                onClick={() => handleSendOtp(selectedOrder._id)}
                className="w-full sm:w-auto"
              >
                Send OTP
              </Button>
            </div>
          ) : (
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={OtpSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleVerifyOtp(values.otp, selectedOrder._id);
                setSubmitting(false);
              }}
            >
              {({ values, setFieldValue, errors, touched }) => (
                <Form className="mt-4">
                  <p className="text-sm mb-2 text-center">
                    Enter the 6-digit OTP sent to the customer's email.
                  </p>

                  <div className="flex gap-2 justify-center">
                    {[...Array(6)].map((_, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        value={values.otp[i] || ""}
                        ref={(el) => (inputRefs.current[i] = el)}
                        className="w-10 h-12 text-center border border-gray-300 rounded text-lg"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          const otpArr = values.otp.split("");
                          otpArr[i] = val;
                          const newOtp = otpArr.join("").slice(0, 6);
                          setFieldValue("otp", newOtp);
                          if (val && i < 5) inputRefs.current[i + 1]?.focus();
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !values.otp[i] &&
                            i > 0
                          ) {
                            inputRefs.current[i - 1]?.focus();
                            const otpArr = values.otp.split("");
                            otpArr[i - 1] = "";
                            setFieldValue("otp", otpArr.join(""));
                          }
                        }}
                      />
                    ))}
                  </div>

                  {errors.otp && touched.otp && (
                    <div className="text-red-500 text-sm mt-1 text-center">
                      {errors.otp}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4">
                    <Button type="submit" className="w-full sm:w-auto">
                      Verify OTP
                    </Button>
                    <Button
                      onClick={() => setSelectedOrder(null)}
                      className="w-full sm:w-auto"
                    >
                      Back to all orders
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border p-4 bg-white rounded shadow cursor-pointer hover:bg-gray-50"
              onClick={() => handleOrderClick(order)}
            >
              <div className="flex justify-between text-sm sm:text-base font-medium text-gray-700">
                <span className="text-[#004080] font-semibold">Order ID:</span>
                <span>{order.orderId}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-medium text-gray-700">
                <span className="text-[#004080] font-semibold">Customer:</span>
                <span>{order.customerName || "N/A"}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-medium text-gray-700">
                <span className="text-[#004080] font-semibold">Status:</span>
                <span>{order.status}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-medium text-gray-700">
                <span className="text-[#004080] font-semibold">Total:</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!selectedOrder && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
        />
      )}
    </div>
  );
};

export default DeliveryOrdersPage;
