// App.js
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import ContactUs from "./components/ContactUs/ContactUs";
import Login from "./components/Login/Login";
import SignupPage from "./components/Login/SignupPage";
import ForgetPasswordPage from "./components/Login/ForgotPasswordPage";
import ShopPage from "./Pages/ShopPage";
import BuyNowPage from "./Pages/BuyNowPage";
import AboutUs from "./components/AboutUs/AboutUs";
import ProtectedRoute from "./context/ProtectedRoute";
import ProductsPage from "./Pages/ProductsPage";
import WishlistPage from "./Pages/WishlistPage";
import TeamSection from "./components/TeamSection/TeamSection";
import AboutOffer from "./components/AboutUs/AboutOffer";
import Toast from "./components/Toast/Toast";
import ScrollAutoPlayVideo from "./components/TeamSection/ScrollAutoPlayVideo";
import NotFound from "./utils/NotFound";
import VerifyEmailPage from "./components/Login/VerifyEmailPage";
import ProfilePage from "./Pages/ProfileInfo/ProfilePage";
import OrdersPage from "./Pages/Orders/OrdersPage";
import ProductDetail from "./Pages/ProductDetail/ProductDetail";
import ScrollToTop from "./utils/ScrollToTop";
import PaymentRedirect from "./Pages/PaymentRedirect/PaymentRedirect";
import PrivacyPolicy from "./Pages/PrivacyPolicy/PrivacyPolicy";
import RoleProtectedRoute from "./context/RoleProtectedRoute";
import DeliveryOrdersPage from "./Pages/DeliveryOrders/DeliveryOrdersPage";
import { useAuth } from "./context/AuthContext";
import PaymentStatus from "./Pages/PaymentStatus/PaymentStatus";
import DeliveredOrdersPage from "./Pages/DeliveryOrders/DeliveredOrdersPage";

function App() {
  const { token, loading } = useAuth();
  const isAuthenticated = Boolean(token);

  const location = useLocation();
  const theme = useSelector((state) => state.theme.theme);

  if (loading) return null; // or a <Loader />

  const isNotFound =
    location.pathname !== "/" &&
    ![
      "/login",
      "/signup",
      "/forget-password",
      "/contact-us",
      "/shop",
      "/about",
      "/about-offer",
      "/privacy-policy",
      "/delivery/orders",
      "/delivery/delivered", // ✅ Add this line
      "/payment-status",
    ].some(
      (path) =>
        location.pathname === path || location.pathname.startsWith(path + "/")
    ) &&
    !/^\/(buynow|wishlist|profile|product|order)\/[^/]+$/.test(
      location.pathname
    );

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <div className={`App ${theme === "dark" ? "dark-theme" : "light-theme"}`}>
      <Navbar />
      <Toast />
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <div className="image">
              <WelcomePage />
              <ShopPage />
              <ScrollAutoPlayVideo />
              <TeamSection />
              <ContactUs />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about-offer" element={<AboutOffer />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/payment-redirect" element={<PaymentRedirect />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

        <Route path="/payment-status" element={<PaymentStatus />} />

        {/* Protected Routes */}
        <Route
          path="/buynow/:extra"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <BuyNowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist/:extra"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <WishlistPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:extra"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:encryptedId"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order/:id"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/orders"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <RoleProtectedRoute allowedRoles={["deliveryboy", "admin"]}>
                <DeliveryOrdersPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/delivery/delivered"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <RoleProtectedRoute allowedRoles={["deliveryboy", "admin"]}>
                <DeliveredOrdersPage />
              </RoleProtectedRoute>
            </ProtectedRoute>
          }
        />
        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
