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

export default function Footer() {
  return (
    <footer className="bg-[#004080] text-gray-100 px-6 py-12 md:py-16 md:px-20 font-montserrat">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between gap-12 md:gap-0">
        {/* About Section */}
        <div className="md:flex-1 max-w-md">
          <h2 className="text-3xl font-extrabold mb-6 tracking-wide text-left">
            Craft-Cart
          </h2>
          <p className="text-gray-300 leading-relaxed text-base md:text-lg text-left">
            Craft-Cart is your go-to marketplace for unique handmade crafts and
            artisan products. We connect creators and buyers with quality and
            care.
          </p>
        </div>

        {/* Quick Links Section */}
        <div className="md:flex-1 max-w-xs">
          <h3 className="text-2xl font-semibold mb-6 text-left">Quick Links</h3>
          <ul className="grid grid-cols-2 gap-y-4 gap-x-8 text-lg text-left">
            {["Home", "Shop", "About", "Contact-us", "FAQ"].map((item) => (
              <li key={item}>
                <a
                  href={`${item.toLowerCase().replace(/\s/g, "")}`}
                  className="hover:text-yellow-400 transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Section */}
        <div className="md:flex-1 max-w-xs">
          <h3 className="text-2xl font-semibold mb-6 text-left">Contact Us</h3>
          <div className="space-y-6 text-lg text-gray-300">
            <p className="flex items-start gap-3">
              <GoLocation className="text-yellow-400 w-6 h-6 flex-shrink-0 mt-1" />
              <span className="leading-relaxed">
                123 Craft St, Handmade City
              </span>
            </p>
            <p className="flex items-center gap-3">
              <FiPhone className="text-yellow-400 w-6 h-6 flex-shrink-0" />
              <span className="leading-relaxed">+1 (234) 567-890</span>
            </p>
            <p className="flex items-center gap-3">
              <HiOutlineMail className="text-yellow-400 w-6 h-6 flex-shrink-0" />
              <span className="leading-relaxed">support@craft-cart.com</span>
            </p>
          </div>
        </div>
      </div>

      <hr className="border-yellow-400 border-opacity-40 my-10" />

      {/* Footer Bottom */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-center md:justify-between max-w-7xl mx-auto px-2 md:px-10 space-y-4 md:space-y-0">
        {/* Social Icons */}
        <div className="flex space-x-5 order-1 md:order-2">
          {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
            (Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-400 text-[#004080] hover:bg-yellow-300 transition"
                aria-label="social link"
              >
                <Icon className="w-5 h-5" />
              </a>
            )
          )}
        </div>

        {/* Copyright */}
        <div className="text-yellow-400 text-sm font-medium order-2 md:order-1 text-center md:text-left">
          &copy; {new Date().getFullYear()} Craft-Cart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
