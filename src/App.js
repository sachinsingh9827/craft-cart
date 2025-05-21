import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Banner from "./components/Banner/Banner";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import ProductPage from "./components/ProductPage/ProductPage";
import ContactUs from "./components/ContactUs/ContactUs";
import Login from "./components/Login/Login";
import SignupPage from "./components/Login/SignupPage";
import ForgetPasswordPage from "./components/Login/ForgotPasswordPage";
import ShopPage from "./Pages/ShopPage";
import ProductDetailPage from "./Pages/ProductDetailPage";
import BuyNowPage from "./Pages/BuyNowPage";
import AboutUs from "./components/AboutUs/AboutUs";
import ProtectedRoute from "./context/ProtectedRoute";
import ProductsPage from "./Pages/ProductsPage";
import WishlistPage from "./Pages/WishlistPage";
import ProfilePage from "./Pages/ProfilePage";

function App() {
  // Example authentication flag
  const isAuthenticated = Boolean(localStorage.getItem("token")); // or from context/state

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="image">
              <WelcomePage />
              <Banner />
              <ProductPage />
              <ContactUs />
            </div>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route
          path="/product"
          element={
            <ProtectedRoute isAuth={isAuthenticated}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/buynow" element={<BuyNowPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
