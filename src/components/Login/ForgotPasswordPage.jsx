import React, { useState, useRef, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schemas
const EmailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ForgetPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: reset password
  const [email, setEmail] = useState("");
  const inputRefs = useRef([]);

  useEffect(() => {
    if (step === 2) {
      inputRefs.current[0]?.focus();
    }
  }, [step]);

  // Simulated backend calls — replace these with real API calls!
  const sendOtpToEmail = async (email) => {
    return new Promise((res) => setTimeout(res, 1000));
  };

  const verifyOtpWithBackend = async (email, otp) => {
    return new Promise((res) => setTimeout(() => res(otp === "123456"), 1000));
  };

  const updatePasswordBackend = async (email, password) => {
    // Backend call to update password here
    return new Promise((res) => setTimeout(() => res(true), 1000));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-center text-3xl font-bold text-[#004080] mb-6 uppercase">
          {step === 3 ? "Update Password" : "Forgot Password"}
        </h1>

        {/* Step 1: Email input */}
        {step === 1 && (
          <Formik
            initialValues={{ email: "" }}
            validationSchema={EmailSchema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                await sendOtpToEmail(values.email);
                setEmail(values.email);
                alert(`OTP sent to: ${values.email}`);
                setStep(2);
              } catch {
                alert("Failed to send OTP. Try again.");
              }
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form noValidate className="space-y-6">
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
                    className="absolute left-0 -top-3 text-[#004080] text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#004080] peer-focus:-top-3 peer-focus:text-yellow-400 transition-all origin-left"
                  >
                    Email Address
                  </label>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-red-600 mt-1 text-sm font-semibold animate-error"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#004080] text-yellow-400 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  {isSubmitting ? "Sending OTP..." : "Send OTP"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Step 2: OTP input */}
        {step === 2 && (
          <Formik
            initialValues={{ otp: "" }}
            validationSchema={OtpSchema}
            onSubmit={async (values, { setSubmitting }) => {
              const success = await verifyOtpWithBackend(email, values.otp);
              setSubmitting(false);
              if (success) {
                alert("OTP verified! Please reset your password.");
                setStep(3);
              } else {
                alert("Invalid OTP. Please try again.");
              }
            }}
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
              <Form noValidate className="space-y-6">
                <p className="text-center text-[#004080] text-sm">
                  Enter the 6-digit OTP sent to{" "}
                  <span className="font-semibold">{email}</span>
                </p>

                <div className="flex justify-center gap-2">
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
                          if (index < 5) inputRefs.current[index + 1]?.focus();
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
                  className="w-full py-3 bg-[#004080] text-yellow-400 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        {/* Step 3: Reset Password */}
        {step === 3 && (
          <Formik
            initialValues={{ password: "", confirmPassword: "" }}
            validationSchema={PasswordSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              try {
                const success = await updatePasswordBackend(
                  email,
                  values.password
                );
                if (success) {
                  alert("Password updated successfully! You can now login.");
                  resetForm();
                  setStep(1);
                } else {
                  alert("Failed to update password. Try again.");
                }
              } catch {
                alert("Error updating password. Try again.");
              }
              setSubmitting(false);
            }}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form noValidate className="space-y-6">
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
                    className="absolute left-0 -top-3 text-[#004080] text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#004080] peer-focus:-top-3 peer-focus:text-yellow-400 transition-all origin-left"
                  >
                    New Password
                  </label>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-600 mt-1 text-sm font-semibold animate-error"
                  />
                </div>

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
                    className="absolute left-0 -top-3 text-[#004080] text-sm peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-[#004080] peer-focus:-top-3 peer-focus:text-yellow-400 transition-all origin-left"
                  >
                    Confirm New Password
                  </label>
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-600 mt-1 text-sm font-semibold animate-error"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#004080] text-yellow-400 font-bold rounded-xl shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-4 focus:ring-yellow-300"
                >
                  {isSubmitting ? "Updating Password..." : "Update Password"}
                </button>
              </Form>
            )}
          </Formik>
        )}

        <p className="mt-6 text-center text-[#004080]">
          Back to{" "}
          <a
            href="/login"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
