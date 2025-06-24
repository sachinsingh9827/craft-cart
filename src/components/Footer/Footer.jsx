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
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {/* About Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Craft-Cart</h2>
          <p className="text-gray-300 leading-relaxed text-base">
            Craft-Cart is your go-to marketplace for unique handmade crafts and
            artisan products. We connect creators and buyers with quality and
            care.
          </p>
        </div>

        {/* Quick Links Section */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">
            Quick Links
          </h3>
          <ul className="grid grid-cols-2 gap-y-3 text-base">
            <ul className="grid grid-cols-2 gap-y-3 text-base">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-yellow-400 transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </ul>
        </div>

        {/* Contact Section */}
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4">Contact Us</h3>
          <div className="space-y-4 text-gray-300 text-base">
            <p className="flex items-start gap-3">
              <GoLocation className="text-yellow-400 mt-1" />
              <span>123 Craft St, Handmade City</span>
            </p>
            <p className="flex items-center gap-3">
              <FiPhone className="text-yellow-400" />
              <span>+1 (234) 567-890</span>
            </p>
            <p className="flex items-center gap-3">
              <HiOutlineMail className="text-yellow-400" />
              <span>support@craft-cart.com</span>
            </p>
          </div>
        </div>
      </div>

      <hr className="border-yellow-400 border-opacity-30 my-10" />

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col-reverse sm:flex-row items-center justify-between gap-6 sm:gap-0 text-center sm:text-left">
        <div className="text-yellow-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} Craft-Cart. All rights reserved.
        </div>

        <div className="flex gap-4">
          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
            (Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 text-[#004080] hover:bg-yellow-300 transition"
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
