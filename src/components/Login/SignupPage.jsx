import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import Toast, { showToast } from "../Toast/Toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://craft-cart-backend.vercel.app";

// Validation Schemas
const EmailSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .length(6, "OTP must be 6 digits")
    .required("OTP is required"),
});

const RegistrationSchema = Yup.object().shape({
  name: Yup.string().min(3, "Min 3 characters").required("Name is required"),
  password: Yup.string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
});

const SignupPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("email"); // 'email', 'otp', 'register'
  const [email, setEmail] = useState("");

  // STEP 1: Send OTP
  const handleSendEmail = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/auth/send-verification-email`,
        {
          email: values.email,
        }
      );

      showToast("OTP sent to your email", "info");
      setEmail(values.email);
      setStep("otp");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/user/auth/verify-email`, {
        email,
        otp: values.otp,
      });

      showToast("Email verified! Continue registration.", "success");
      setStep("register");
    } catch (err) {
      showToast(
        err.response?.data?.message || "Invalid or expired OTP",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // STEP 3: Register user
  const handleRegister = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post(`${BASE_URL}/api/user/auth/register`, {
        name: values.name,
        email,
        password: values.password,
      });

      showToast("Registration successful!", "success");
      navigate("/login");
    } catch (err) {
      showToast(err.response?.data?.message || "Registration failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-montserrat">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10">
        {step === "email" && (
          <>
            <h1 className="text-3xl font-bold text-center text-[#004080] mb-6">
              Enter Your Email
            </h1>
            <Formik
              initialValues={{ email: "" }}
              validationSchema={EmailSchema}
              onSubmit={handleSendEmail}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Toast />
                  <div className="mb-6">
                    <Field
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full border-b-2 py-3 focus:outline-none"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-600 mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#004080] text-yellow-400 font-semibold rounded-xl"
                  >
                    {isSubmitting ? "Sending..." : "Send OTP"}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}

        {step === "otp" && (
          <>
            <h1 className="text-3xl font-bold text-center text-[#004080] mb-6">
              Verify OTP
            </h1>
            <Formik
              initialValues={{ otp: "" }}
              validationSchema={OtpSchema}
              onSubmit={handleVerifyOtp}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Toast />
                  <div className="mb-6">
                    <Field
                      type="text"
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      className="w-full border-b-2 py-3 focus:outline-none"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-600 mt-1"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#004080] text-yellow-400 font-semibold rounded-xl"
                  >
                    {isSubmitting ? "Verifying..." : "Verify OTP"}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}

        {step === "register" && (
          <>
            <h1 className="text-3xl font-bold text-center text-[#004080] mb-6">
              Complete Registration
            </h1>
            <Formik
              initialValues={{ name: "", password: "", confirmPassword: "" }}
              validationSchema={RegistrationSchema}
              onSubmit={handleRegister}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Toast />
                  <div className="mb-4">
                    <Field
                      type="text"
                      name="name"
                      placeholder="Full Name"
                      className="w-full border-b-2 py-3 focus:outline-none"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-600 mt-1"
                    />
                  </div>

                  <div className="mb-4">
                    <Field
                      type="password"
                      name="password"
                      placeholder="Password"
                      className="w-full border-b-2 py-3 focus:outline-none"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-600 mt-1"
                    />
                  </div>

                  <div className="mb-6">
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      className="w-full border-b-2 py-3 focus:outline-none"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-600 mt-1"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#004080] text-yellow-400 font-semibold rounded-xl"
                  >
                    {isSubmitting ? "Registering..." : "Register"}
                  </button>
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
