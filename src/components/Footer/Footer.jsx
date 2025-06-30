import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { FiPhone } from "react-icons/fi";
import { HiOutlineMail } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Footer() {
  const quickLinks = [
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact Us", path: "/contact-us" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ];

  return (
    <footer className="bg-[#004080] text-gray-100 px-4 sm:px-6 py-10 font-montserrat">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Section */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Craft-Cart</h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Craft-Cart is your go-to marketplace for unique handmade crafts and
            artisan products. We connect creators and buyers with quality and
            care.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="hover:text-yellow-400 transition-colors duration-200"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <GoLocation className="text-yellow-400 mt-0.5" />
              <span>123 Craft St, Handmade City</span>
            </p>
            <p className="flex items-center gap-2">
              <FiPhone className="text-yellow-400" />
              <span>+1 (234) 567-890</span>
            </p>
            <p className="flex items-center gap-2">
              <HiOutlineMail className="text-yellow-400" />
              <span>support@craft-cart.com</span>
            </p>
          </div>
        </div>
      </div>

      <hr className="border-yellow-400 border-opacity-30 my-8" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="text-yellow-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Craft-Cart. All rights reserved.
        </div>

        <div className="flex gap-3">
          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
            (Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-400 text-[#004080] hover:bg-yellow-300 transition duration-200"
                aria-label="social link"
              >
                <Icon className="w-4 h-4" />
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
