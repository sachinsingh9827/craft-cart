import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import OfferBanner from "../Banner/Banner";
import contactusbanner from "../../assets/4862931.webp";

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

  // Full form validation for submit
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

  // Validate a single field on change
  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!value.trim()) return "Name is required";
        break;
      case "email":
        if (!value.trim()) return "Email is required";
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value))
          return "Invalid email address";
        break;
      case "message":
        if (!value.trim()) return "Message is required";
        break;
      default:
        break;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate this specific field and update errors
    const errorMsg = validateField(name, value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMsg || undefined,
    }));
  };

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
          setErrors({});
          setTimeout(() => {
            setResponseMessage("");
            setResponseType("");
          }, 2000);
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
    <>
      <OfferBanner
        imageUrl={contactusbanner}
        heading="Have Questions? We're Here to Help!"
        description="Reach out to us and we'll get back to you as soon as possible."
        buttonText="Explore More"
        navigateTo="/shop"
      />
      <div className="flex items-center justify-center p-4 md:p-6 font-montserrat">
        <div className="w-full max-w-full bg-white shadow-2xl rounded-2xl overflow-hidden md:flex">
          {/* Left - Image */}
          <div className="hidden md:block md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1581291518857-4e27b48ff24e"
              alt="Contact Us"
              className="h-full w-full object-cover rounded-l-2xl"
            />
          </div>

          {/* Right - Form */}
          <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
            <h2 className="text-4xl font-extrabold text-[#004080] mb-6 uppercase tracking-wide text-center">
              Get in Touch
            </h2>
            <p className="text-[#004080] mb-8 text-center text-lg font-medium">
              Have a question or want to work with us? Fill out the form below!
            </p>

            {responseMessage && (
              <div
                className={`mb-6 border-l-6 p-5 rounded-xl shadow-md ${
                  responseType === "success"
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "bg-red-100 border-red-500 text-red-800"
                }`}
              >
                {responseMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border text-[#004080] text-lg placeholder:text-[#7a8bb1] rounded-3xl shadow-sm transition focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 ml-3 text-left">
                    {errors.name} *
                  </p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border text-[#004080] text-lg placeholder:text-[#7a8bb1] rounded-3xl shadow-sm transition focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-3 text-left">
                    {errors.email} *
                  </p>
                )}
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-5 py-3 border resize-none text-[#004080] text-lg placeholder:text-[#7a8bb1] rounded-3xl shadow-sm transition focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 ${
                    errors.message ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1 ml-3 text-left">
                    {errors.message} *
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={submitted}
                className="w-full bg-yellow-400 hover:bg-yellow-350 active:bg-yellow-300 text-[#004080] font-extrabold py-3 rounded-3xl shadow-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitted ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
