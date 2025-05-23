import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Toast, { showToast } from "../Toast/Toast";
const BASE_URL = "https://craft-cart-backend.vercel.app";
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Name must be at least 3 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-montserrat">
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-center text-4xl font-extrabold text-[#004080] mb-10 tracking-widest uppercase drop-shadow-lg">
          Craft-Cart Signup
        </h1>

        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={SignupSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              const response = await axios.post(
                `${BASE_URL}/api/user/auth/register`,
                {
                  name: values.name,
                  email: values.email,
                  password: values.password,
                }
              );

              if (response.data.status) {
                // Show green success toast
                showToast(
                  response.data.message || "Registration successful!",
                  "success"
                );

                // Then show red warning toast about sharing credentials
                showToast(
                  "⚠️ Please do NOT share your username and password with anyone.",
                  "error"
                );

                resetForm();
                navigate("/login");
              } else {
                // Show red error toast if registration failed
                showToast(
                  response.data.message || "Registration failed.",
                  "error"
                );
              }
            } catch (error) {
              console.error("Registration error:", error);

              // Show error toast
              showToast(
                error.response?.data?.message ||
                  "An error occurred during registration.",
                "error"
              );
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form noValidate className="space-y-8">
              {/* Name Field */}
              <Toast />
              <div className="relative">
                <Field
                  id="name"
                  name="name"
                  type="text"
                  placeholder=" "
                  className={`peer w-full border-b-2 bg-transparent py-3 text-[#004080] placeholder-transparent focus:outline-none focus:border-yellow-400 transition-colors ${
                    errors.name && touched.name
                      ? "border-yellow-400"
                      : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 -top-3 text-[#004080] text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#004080] peer-focus:-top-3 peer-focus:text-yellow-400 transition-all origin-left cursor-text select-none"
                >
                  Full Name
                </label>
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 mt-1 text-sm font-semibold animate-error text-left"
                />
              </div>

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
                      ? "border-yellow-400"
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

              {/* Confirm Password Field */}
              <div className="relative">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder=" "
                  className={`peer w-full border-b-2 bg-transparent py-3 text-[#004080] placeholder-transparent focus:outline-none focus:border-yellow-400 transition-colors ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-yellow-400"
                      : "border-gray-300"
                  }`}
                />
                <label
                  htmlFor="confirmPassword"
                  className="absolute left-0 -top-3 text-[#004080] text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#004080] peer-focus:-top-3 peer-focus:text-yellow-400 transition-all origin-left cursor-text select-none"
                >
                  Confirm Password
                </label>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-600 mt-1 text-sm font-semibold animate-error text-left"
                />
              </div>

              {/* Submit Button */}
              <div className="relative w-full max-w-md mx-auto">
                {/* Gradient glow outside button */}
                <span className="absolute -inset-1 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-300 opacity-40 blur-lg animate-gradient-x"></span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative w-full py-4 bg-[#004080] text-yellow-400 font-bold rounded-xl shadow-lg overflow-visible hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-300 z-10"
                >
                  <span className="relative z-10">
                    {isSubmitting ? "Creating Account..." : "Sign Up"}
                  </span>
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-8 text-center text-[#004080] select-none">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-yellow-400 font-semibold hover:underline cursor-pointer"
          >
            Login
          </a>
        </p>
      </div>

      {/* Animations */}
      <style>{`
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
        .animate-error {
          animation: fadeSlideIn 0.5s ease forwards;
          opacity: 0;
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

export default SignupPage;
