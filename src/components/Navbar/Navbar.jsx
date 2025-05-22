import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
        <Link to="/" className="flex items-center space-x-1">
          <h1
            className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text leading-none"
            style={{
              backgroundImage:
                "linear-gradient(270deg, #004080, #0066cc, #3399ff, #004080)",
              backgroundSize: "200% auto",
              animation: "brandGradient 4s linear infinite",
              WebkitBackgroundClip: "text",
            }}
          >
            C
          </h1>
          <span className="text-lg md:text-xl font-semibold text-[#004080] tracking-wide uppercase">
            raft-Cart
          </span>
        </Link>

        <ToastContainer position="bottom-right" autoClose={3000} />
        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            Shop
          </NavLink>
          <NavLink
            to="/about"
            onClick={handleLinkClick}
            className={({ isActive }) => (isActive ? "active-link" : "")}
          >
            About
          </NavLink>
          <NavLink
            to="/contact-us"
            onClick={handleLinkClick}
            className={({ isActive }) =>
              isActive ? "active-link icon-link" : "icon-link"
            }
          >
            Contact
          </NavLink>

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

              <button
                onClick={() => {
                  const encrypted = encrypt("profile");
                  handleLinkClick();
                  navigate(`/profile/${encrypted}`);
                }}
                className="logout-btn "
              >
                Profile
              </button>

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
