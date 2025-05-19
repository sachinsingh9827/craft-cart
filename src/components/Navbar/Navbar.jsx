import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Close menu on link click (optional)
  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" href="/">
          Craft-Cart
        </div>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <a href="#home" onClick={handleLinkClick}>
            Home
          </a>
          <a href="#shop" onClick={handleLinkClick}>
            Shop
          </a>
          <a href="#about" onClick={handleLinkClick}>
            About
          </a>
          <a href="/contact-us" onClick={handleLinkClick}>
            Contact
          </a>
          <button className="profile-link" onClick={handleLinkClick}>
            Profile
          </button>
          <button className="logout-btn" onClick={handleLinkClick}>
            Logout
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
