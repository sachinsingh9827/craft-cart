import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast, ToastContainer } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { encrypt } from "../../utils/cryptoHelper";
import "./Navbar.css";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();
  const user = auth?.user;
  const logout = auth?.logout;

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleLinkClick = () => setMenuOpen(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          toast.error("Session expired. Please login again.");
          logout?.();
          navigate("/login");
        }
      } catch {
        toast.error("Invalid token. Please login again.");
        logout?.();
        navigate("/login");
      }
    }
  }, [logout, navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/user/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) toast.success("Logged out successfully.");
      else toast.error("Logout failed.");
    } catch (err) {
      toast.error("Error during logout.");
    } finally {
      logout?.();
      navigate("/");
      setMenuOpen(false);
      window.location.reload();
    }
  };

  const hasRole = (role) => user?.role?.includes(role);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo-link">
          <h1 className="logo-text">C</h1>
          <span className="logo-subtext">raft-Cart</span>
        </Link>

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
              onClick={() => navigate("/login")}
              className="nav-3d-link login-btn"
            >
              <span className="link-text primary">Login</span>
              <span className="link-text secondary">Login</span>
            </button>
          ) : (
            <>
              <button
                className="profile-3d-btn"
                onClick={() => {
                  handleLinkClick();
                  navigate(`/profile/${encrypt("profile")}`);
                }}
              >
                <span className="btn-text primary">Profile</span>
                <span className="btn-text secondary">Profile</span>
              </button>

              {hasRole("deliveryboy") && (
                <button
                  className="profile-3d-btn orders-3d-btn"
                  onClick={() => {
                    handleLinkClick();
                    navigate("/delivery/orders");
                  }}
                >
                  <span className="btn-text primary">Orders</span>
                  <span className="btn-text secondary">Orders</span>
                </button>
              )}

              <button className="profile-3d-btn " onClick={handleLogout}>
                <span className="btn-text primary">Logout</span>
                <span className="btn-text secondary">Logout</span>
              </button>
            </>
          )}
        </div>

        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </nav>
  );
};

export default Navbar;
