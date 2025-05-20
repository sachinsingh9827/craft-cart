import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // ✅ Correct hook usage

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  const handleLoginClick = () => {
    setMenuOpen(false);
    navigate("/login"); // ✅ This is how to navigate in React Router
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={() => navigate("/")}>
          Craft-Cart
        </div>

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
          <a href="/contact-us" onClick={handleLinkClick}>
            Contact
          </a>
          {/* <button className="profile-link" onClick={handleLinkClick}>
            Profile
          </button> */}
          <button className="logout-btn" onClick={handleLoginClick}>
            Login
          </button>
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
