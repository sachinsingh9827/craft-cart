import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // fixed import (jwtDecode is default export)
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import { encrypt } from "../../utils/cryptoHelper";
const BASE_URL = "https://craft-cart-backend.vercel.app";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleLinkClick = () => setMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          toast.error("Session expired, please login again.");
          logout?.();
          navigate("/login");
        }
      } catch (error) {
        toast.error("Invalid session, please login again.");
        logout?.();
        navigate("/login");
      }
    } else {
      logout?.();
    }
  }, [logout, navigate]);

  const handleLoginClick = () => {
    setMenuOpen(false);
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      // Optional: Add loading state or spinner

      const res = await fetch(`${BASE_URL}/api/user/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Pass token to backend
        },
      });

      if (res.ok) {
        toast.success("You have been logged out successfully.");
      } else {
        toast.error("Logout failed. Try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong while logging out.");
    } finally {
      // Clear local state
      logout?.();
      setMenuOpen(false);
      navigate("/");
      window.location.reload();
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <h1 className="logo-text">C</h1>
          <span className="logo-subtext">raft-Cart</span>
        </Link>

        <ToastContainer position="bottom-right" autoClose={3000} />

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <NavLink to="/" onClick={handleLinkClick} className="nav-3d-link">
            <span className="link-text primary">Home</span>
            <span className="link-text secondary">Home</span>
          </NavLink>

          <NavLink to="/shop" onClick={handleLinkClick} className="nav-3d-link">
            <span className="link-text primary">Shop</span>
            <span className="link-text secondary">Shop</span>
          </NavLink>

          <NavLink
            to="/about"
            onClick={handleLinkClick}
            className="nav-3d-link"
          >
            <span className="link-text primary">About</span>
            <span className="link-text secondary">About</span>
          </NavLink>

          <NavLink
            to="/contact-us"
            onClick={handleLinkClick}
            className="nav-3d-link"
          >
            <span className="link-text primary">Contact</span>
            <span className="link-text secondary">Contact</span>
          </NavLink>

          {!user ? (
            <button
              type="button"
              className="nav-3d-link login-btn"
              onClick={handleLoginClick}
            >
              <span className="link-text primary">Login</span>
              <span className="link-text secondary">Login</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                className="btn profile-3d-btn"
                onClick={() => {
                  const encrypted = encrypt("profile");
                  handleLinkClick();
                  navigate(`/profile/${encrypted}`);
                }}
                aria-label="Profile Settings"
              >
                <span className="btn-text primary">Profile</span>
                <span className="btn-text secondary">Profile</span>
              </button>

              <button
                type="button"
                className="btn logout-3d-btn"
                onClick={handleLogout}
                aria-label="Logout"
              >
                <span className="btn-text primary">Logout</span>
                <span className="btn-text secondary">Logout</span>
              </button>
            </>
          )}
        </div>

        {/* Menu toggle for mobile */}
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
