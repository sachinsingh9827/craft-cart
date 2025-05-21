import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      errs.email = "Invalid email address";
    }
    if (!formData.message.trim()) errs.message = "Message is required";
    return errs;
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const valErrors = validate();
    setErrors(valErrors);

    if (Object.keys(valErrors).length === 0) {
      try {
        setSubmitted(true);
        setResponseMessage("");
        setResponseType("");

        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          toast.error("User not authenticated. Please login.", {
            autoClose: 2000,
          });
          navigate("/login");
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/api/user/auth/contact",
          {
            userId,
            name: formData.name,
            email: formData.email,
            message: formData.message,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.success) {
          toast.success(response.data.message || "Message sent successfully!", {
            autoClose: 2000,
          });
          setResponseMessage(response.data.message);
          setResponseType("success");
          setFormData({ name: "", email: "", message: "" });
          setTimeout(() => {
            setResponseMessage("");
            setResponseType("");
          }, 2000);
          // navigate("/shop");
        } else {
          toast.error(response.data.message || "Failed to send message.", {
            autoClose: 2000,
          });
          setResponseMessage(response.data.message);
          setResponseType("error");
          setTimeout(() => {
            setResponseMessage("");
            setResponseType("");
          }, 4000);
        }
      } catch (error) {
        const status = error.response?.status;
        const message = error.response?.data?.message || "An error occurred.";

        toast.error(message, { autoClose: 2000 });
        setResponseMessage(message);
        setResponseType("error");
        setTimeout(() => {
          setResponseMessage("");
          setResponseType("");
        }, 4000);

        if (status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else if (status === 404 && message.includes("User not found")) {
          setTimeout(() => {
            navigate("/signup");
          }, 4000);
        }
      } finally {
        setSubmitted(false);
      }
    } else {
      setSubmitted(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white p-6">
      <div className="w-full max-w-5xl bg-white shadow-xl rounded-xl overflow-hidden md:flex">
        {/* Left - Image */}
        <div className="hidden md:block md:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e"
            alt="Contact Us"
            className="h-full w-full object-cover"
          />
        </div>

        {/* Right - Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-[#004080] mb-4">
            Get in Touch
          </h2>
          <p className="text-[#004080] mb-6">
            Have a question or want to work with us? Fill out the form below!
          </p>

          {responseMessage && (
            <div
              className={`mb-4 border-l-4 p-4 rounded ${
                responseType === "success"
                  ? "bg-green-100 border-green-500 text-green-700"
                  : "bg-red-100 border-red-500 text-red-700"
              }`}
            >
              {responseMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border text-[#004080] ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border text-[#004080] ${
                  errors.email ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                className={`w-full px-4 py-3 border resize-none text-[#004080] ${
                  errors.message ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400`}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#004080] font-semibold py-3 rounded-lg transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
