import React from "react";
import { Routes, Route } from "react-router-dom";
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
import { decrypt } from "./utils/cryptoHelper"; // <-- Import decrypt function
import TeamSection from "./components/TeamSection/TeamSection";
import AboutOffer from "./components/AboutUs/AboutOffer";
import Toast from "./components/Toast/Toast";

function App() {
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <div className="App">
      <Navbar />
      <Toast />
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <div className="image">
              <WelcomePage />
              {/* <Banner /> */}
              <ShopPage />
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

        {/* Encrypted Protected Routes */}
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
