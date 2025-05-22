import React, { useEffect, useRef, useState } from "react";
import wellcome from "../../assets/wellcome.svg";
import { useNavigate } from "react-router-dom";
import ProductShowcase from "./ProductShowcase";
const WelcomePage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef();
  const navigate = useNavigate(); // ✅ Correct hook usage

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (contentRef.current) observer.observe(contentRef.current);

    return () => {
      if (contentRef.current) observer.unobserve(contentRef.current);
    };
  }, []);
  return (
    <>
      <ProductShowcase />
      <div className="min-h-[620px]  min-w-full flex items-center justify-center px-4 font-montserrat bg-white ">
        <div className="max-w-6xl w-full flex flex-col md:flex-row items-center rounded-3xl shadow-lg overflow-hidden">
          {/* Text Section */}{" "}
          <div className="md:w-1/2 w-full">
            <img
              src={wellcome}
              alt="Crafts and handmade items"
              className="w-full h-auto object-cover rounded-tr-3xl rounded-br-3xl"
            />
          </div>
          <div
            ref={contentRef}
            className={`w-full md:w-1/2 text-center md:text-left transition-all duration-700 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="ml-4">
              <h1 className="text-4xl font-extrabold text-[#002060] mb-6 drop-shadow-md">
                Welcome to Craft-Cart
              </h1>
              <p className="text-gray-900 mb-8 leading-relaxed text-lg drop-shadow-sm">
                Discover unique, handmade crafts created by talented artisans
                from around the world. Quality, creativity, and passion
                delivered to your doorstep.
              </p>
              <button className="bg-[#002060] text-yellow-400 px-8 py-3 rounded-xl mb-4 font-bold hover:bg-yellow-400 hover:text-[#002060] transition-colors duration-300">
                Explore Collections
              </button>
            </div>
          </div>
          {/* Image Section */}
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
