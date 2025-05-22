import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { encrypt } from "../../utils/cryptoHelper";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  // Check token validity on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);

        // Check if token is expired (decoded.exp is in seconds, Date.now() is ms)
        if (decoded.exp * 1000 < Date.now()) {
          toast.error("Session expired, please login again.");
          logout?.();
          navigate("/login");
        }
      } catch (error) {
        // Invalid token (cannot decode)
        toast.error("Invalid session, please login again.");
        logout?.();
        navigate("/login");
      }
    } else {
      // No token — user is not logged in
      logout?.();
    }
  }, [logout, navigate]);

  const handleLoginClick = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const handleLogout = () => {
    toast.success("You have been logged out successfully.");
    logout?.();
    setMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo uppercase" onClick={() => navigate("/")}>
          Craft-Cart
        </div>
        <ToastContainer position="bottom-right" autoClose={3000} />
        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <a href="/" onClick={handleLinkClick}>
            Home
          </a>
          <a href="/shop" onClick={handleLinkClick}>
            Shop
          </a>
          <a href="/about" onClick={handleLinkClick}>
            About
          </a>
          <a href="/contact-us" onClick={handleLinkClick} className="icon-link">
            Contact
          </a>
          {!user ? (
            <button className="login-btn" onClick={handleLoginClick}>
              Login
            </button>
          ) : (
            <>
              <a
                onClick={() => {
                  const encrypted = encrypt("product");
                  handleLinkClick();
                  navigate(`/product/${encrypted}`);
                }}
                className="icon-link"
              >
                <FaShoppingCart /> Cart
              </a>

              <a
                onClick={() => {
                  const encrypted = encrypt("wishlist");
                  handleLinkClick();
                  navigate(`/wishlist/${encrypted}`);
                }}
                className="icon-link"
              >
                <FaHeart /> Wishlist
              </a>

              <a
                onClick={() => {
                  const encrypted = encrypt("profile");
                  handleLinkClick();
                  navigate(`/profile/${encrypted}`);
                }}
                className="icon-link"
              >
                Profile
              </a>

              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>

        <div
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
