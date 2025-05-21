import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OfferBanner() {
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
  const handleLoginClick = () => {
    navigate("/shop");
  };

  return (
    <div className="w-full bg-primary text-white py-10 px-5 md:px-16 rounded-xl shadow-2xl relative overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
        {/* Image Section */}
        <div className="w-full md:w-1/2 animate-fade-in">
          <img
            src="https://media.istockphoto.com/id/1294925648/photo/cake.webp?b=1&s=612x612&w=0&k=20&c=NXgPLgob3-Ug2jV_tx1iEw4XL2_kPywBPK85Gqyx2Uk="
            alt="Offer"
            className="rounded-xl shadow-lg w-full object-cover"
          />
        </div>

        {/* Text Section */}
        <div
          className={`w-full md:w-1/2 text-center md:text-left transition-all duration-700 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          ref={contentRef}
        >
          <h2 className="text-3xl lg:text-4xl font-extrabold text-yellow-400 mb-4 animate-fade-in-up">
            Special Offer Just for You!
          </h2>

          <p className="text-lg mb-6 animate-fade-in-delay">
            Get 50% off our premium course. Learn coding, build projects, and
            launch your tech career today.
          </p>

          <button
            className="bg-yellow-400 text-blue-900 px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-yellow-300 transition transform hover:scale-105 animate-bounce-slow"
            onClick={handleLoginClick}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
