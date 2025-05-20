import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  // Simple toast substitute with alert; you can replace with a toast library like react-toastify
  const showToast = (message, type = "info") => {
    // type can be 'success', 'error', etc.
    alert(`${type.toUpperCase()}: ${message}`);
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await axios.post(
        "https://craft-cart-backend.vercel.app/api/admin/auth/login",
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success) {
        toast.success("Login successful!", "success");

        // Store token in localStorage or cookie as needed
        localStorage.setItem("token", response.data.data.token);

        // Reset form or redirect user to dashboard, etc.
        resetForm();
      } else {
        showToast(response.data.message || "Login failed", "error");
      }
    } catch (error) {
      showToast(
        error.response?.data?.message || "An error occurred during login",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden ">
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-center text-4xl font-extrabold text-[#004080] mb-10 tracking-widest uppercase drop-shadow-lg">
          Craft-Cart Login
        </h1>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form noValidate className="space-y-8">
              {/* Email Field */}
              <div className="relative">
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder=" "
                  className={`peer w-full border-b-2 bg-transparent py-3 text-[#004080] placeholder-transparent focus:outline-none focus:border-yellow-400 transition-colors ${
                    errors.email && touched.email
                      ? "border-yellow-400"
                      : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3 text-[#004080] text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#004080] peer-focus:-top-3 peer-focus:text-yellow-400 transition-all origin-left cursor-text select-none"
                >
                  Email Address
                </label>
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 mt-1 text-sm font-semibold animate-error text-left"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  placeholder=" "
                  className={`peer w-full border-b-2 bg-transparent py-3 text-[#004080] placeholder-transparent focus:outline-none focus:border-yellow-400 transition-colors ${
                    errors.password && touched.password
                      ? "border-yellow-400 "
                      : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="password"
                  className="absolute left-0 -top-3 text-[#004080] text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#004080] peer-focus:-top-3 peer-focus:text-yellow-400 transition-all origin-left cursor-text select-none"
                >
                  Password
                </label>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 mt-1 text-sm font-semibold animate-error text-left"
                />
              </div>
              <p className="text-right text-sm text-[#004080] mt-2">
                <a
                  href="/forget-password"
                  className="text-yellow-400 hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </p>
              {/* Submit Button */}
              <div className="relative w-full max-w-md mx-auto">
                {/* Gradient glow outside button */}
                <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-40 blur-lg animate-gradient-x"></span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-4 bg-[#004080] text-yellow-400 font-bold rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-300 z-10"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Logging In..." : "Login"}
                  </span>
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-8 text-center text-[#004080] select-none">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-yellow-400 font-semibold hover:underline cursor-pointer"
          >
            Sign up
          </a>
        </p>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        .animate-blob {
          animation: blob 7s infinite ease-in-out;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animate-error {
          animation: fadeSlideIn 0.5s ease forwards;
          opacity: 0;
        }
        @keyframes fadeSlideIn {
          to {
            opacity: 1;
            transform: translateX(0);
          }
          from {
            opacity: 0;
            transform: translateX(-15px);
          }
        }
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
