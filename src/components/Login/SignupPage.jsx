import React, { useState, useRef, useEffect } from "react";
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
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
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
  const inputRefs = useRef([]);

  // Focus first OTP input when step changes to 'otp'
  useEffect(() => {
    if (step === "otp") {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  // STEP 1: Send OTP
  const handleSendEmail = async (values, { setSubmitting }) => {
    try {
      await axios.post(`${BASE_URL}/api/user/auth/send-verification-email`, {
        email: values.email,
      });

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
      await axios.post(`${BASE_URL}/api/user/auth/verify-email`, {
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
      await axios.post(`${BASE_URL}/api/user/auth/register`, {
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
    <div className="min-h-screen flex items-center justify-center p-6 font-montserrat bg-gray-50">
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
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Toast />
                  <div className="relative mb-6">
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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#004080] text-yellow-400 font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
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
              {({ values, setFieldValue, errors, touched, isSubmitting }) => (
                <Form>
                  <Toast />
                  <p className="text-center text-[#004080] mb-4">
                    Enter the 6-digit OTP sent to{" "}
                    <span className="font-semibold">{email}</span>
                  </p>
                  <div className="flex justify-center gap-2 mb-6">
                    {[...Array(6)].map((_, index) => (
                      <input
                        key={index}
                        ref={(el) => (inputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        className="w-10 h-12 text-center border border-gray-300 rounded-md focus:outline-none focus:border-yellow-400 text-lg text-[#004080]"
                        value={values.otp[index] || ""}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, ""); // only digits
                          if (!val && values.otp[index]) {
                            let otpArr = values.otp.split("");
                            otpArr[index] = "";
                            setFieldValue("otp", otpArr.join(""));
                            return;
                          }
                          if (val) {
                            let otpArr = values.otp.split("");
                            otpArr[index] = val;
                            const newOtp = otpArr.join("").slice(0, 6);
                            setFieldValue("otp", newOtp);
                            if (index < 5)
                              inputRefs.current[index + 1]?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Backspace" &&
                            !values.otp[index] &&
                            index > 0
                          ) {
                            inputRefs.current[index - 1]?.focus();
                            let otpArr = values.otp.split("");
                            otpArr[index - 1] = "";
                            setFieldValue("otp", otpArr.join(""));
                            e.preventDefault();
                          }
                        }}
                      />
                    ))}
                  </div>
                  {errors.otp && touched.otp && (
                    <div className="text-red-600 mt-1 text-sm font-semibold text-center animate-error">
                      {errors.otp}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#004080] text-yellow-400 font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
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
              {({ errors, touched, isSubmitting }) => (
                <Form>
                  <Toast />
                  <div className="mb-4 relative">
                    <Field
                      type="text"
                      name="name"
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

                  <div className="mb-4 relative">
                    <Field
                      type="password"
                      name="password"
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

                  <div className="mb-6 relative">
                    <Field
                      type="password"
                      name="confirmPassword"
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

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#004080] text-yellow-400 font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform"
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
