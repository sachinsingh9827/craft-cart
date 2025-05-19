import React from "react";
import "./Footer.css";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* About Section */}
        <div className="footer-section footer-about">
          <h3>Craft-Cart</h3>
          <p>
            Craft-Cart is your go-to marketplace for unique handmade crafts and
            artisan products. We connect creators and buyers with quality and
            care.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#shop">Shop</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#faq">FAQ</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section footer-contact">
          <h3>Contact Us</h3>
          <p>
            <GoLocation className="footer-icon" aria-label="location" />
            123 Craft St, Handmade City
          </p>
          <p>
            <FiPhone className="footer-icon" aria-label="phone" />
            +1 (234) 567-890
          </p>
          <p>
            <HiOutlineMail className="footer-icon" aria-label="email" />
            support@craft-cart.com
          </p>
        </div>

        {/* Social Media */}
        <div className="footer-section footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Craft-Cart. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
