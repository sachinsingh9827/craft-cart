import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Banner from "./components/Banner/Banner";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import ProductPage from "./components/ProductPage/ProductPage";
import "./App.css";
import ContactUs from "./components/ContactUs/ContactUs";
import Login from "./components/Login/Login";
import SignupPage from "./components/Login/SignupPage";
import ForgetPasswordPage from "./components/Login/ForgotPasswordPage";
import ShopPage from "./Pages/ShopPage";
import ProductDetailPage from "./Pages/ProductDetailPage";
import BuyNowPage from "./Pages/BuyNowPage";
import AboutUs from "./components/AboutUs/AboutUs";

function App() {
  return (
    <div className="App">
      {" "}
      {/* Wrap everything here */}
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
        <Route path="/signup" element={<SignupPage />} />{" "}
        <Route path="/forget-password" element={<ForgetPasswordPage />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/shop" element={<ShopPage />} />{" "}
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/buy-now" element={<BuyNowPage />} />
        <Route path="/about" element={<AboutUs />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
