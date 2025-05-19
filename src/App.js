import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Banner from "./components/Banner/Banner";
import WelcomePage from "./components/WelcomePage/WelcomePage";
import ProductPage from "./components/ProductPage/ProductPage";
import AllProducts from "./components/AllProducts/AllProducts";
import ViewProduct from "./components/AllProducts/ViewProduct";
import "./App.css";
import ContactUs from "./components/ContactUs/ContactUs";

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
            <>
              <WelcomePage />
              <Banner />
              <ProductPage />
              <ContactUs />
            </>
          }
        />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/product/:id" element={<ViewProduct />} />
        <Route path="/contact-us" element={<ContactUs />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
