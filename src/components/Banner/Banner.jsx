import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OfferBanner({
  imageUrl = "https://media.istockphoto.com/id/1294925648/photo/cake.webp",
  heading = "Special Offer Just for You!",
  description = "Get in touch with us and unlock exclusive deals tailored for you.",
  buttonText = "Contact Now",
  navigateTo = "/contactus",
}) {
  const [isVisible, setIsVisible] = useState(false);
  const contentRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );

    if (contentRef.current) observer.observe(contentRef.current);
    return () => {
      if (contentRef.current) observer.unobserve(contentRef.current);
    };
  }, []);

  const handleClick = () => {
    navigate(navigateTo);
  };

  return (
    <div className="w-full bg-primary text-white py-10 px-5 md:px-16 rounded-xl font-montserrat shadow-2xl relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        <div
          className="w-full md:w-1/2 flex justify-center items-center"
          style={{ height: "150px" }}
        >
          <img
            src={imageUrl}
            alt="Offer"
            className="max-h-full max-w-full object-contain"
          />
        </div>

        <div
          className={`w-full md:w-1/2 text-center md:text-left transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          ref={contentRef}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-yellow-400 mb-4 animate-fade-in-up">
            {heading}
          </h2>
          <p className="text-lg mb-6 animate-fade-in-delay">{description}</p>
          <button
            className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition transform hover:scale-105 animate-bounce-slow"
            onClick={handleClick}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
