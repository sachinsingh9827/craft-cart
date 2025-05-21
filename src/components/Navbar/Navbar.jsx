import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div className="navbar-logo" onClick={() => navigate("/")}>
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
          <a href="/profile" onClick={handleLinkClick}>
            Profile
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
              >
                Profile
              </a>

              <a href="/contact-us" onClick={handleLinkClick}>
                Contact
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
