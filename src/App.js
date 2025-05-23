import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Banner from "./components/Banner/Banner";
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
import ProfilePage from "./Pages/ProfilePage";
import TeamSection from "./components/TeamSection/TeamSection";
import AboutOffer from "./components/AboutUs/AboutOffer";
import Toast from "./components/Toast/Toast";
import ScrollAutoPlayVideo from "./components/TeamSection/ScrollAutoPlayVideo";
import ScrollToTop from "./ScrollToTop";
import NotFound from "./utils/NotFound";

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));
  const location = useLocation();

  // If the current path does not match any defined routes, show NotFound without layout
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
    ].some((path) => location.pathname.startsWith(path)) &&
    !/^\/(buynow|wishlist|profile|product)\/[^/]+$/.test(location.pathname);

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <div className="App">
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
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/about-offer" element={<AboutOffer />} />

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
        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
