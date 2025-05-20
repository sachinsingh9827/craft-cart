import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Mehandi Platter",
    type: "Alphabet Keychain",
    price: 199,
    color: "#FF6B6B", // Red
    image: "https://media.istockphoto.com/id/1294925648/photo/cake.webp",
  },
  {
    id: 2,
    name: "Resin Keychain M",
    type: "Alphabet Keychain",
    price: 249,
    color: "#6BCB77", // Green
    image:
      "https://image.shutterstock.com/image-photo/keychain-alphabet-m-resin-art-260nw-1924196675.jpg",
  },
  {
    id: 3,
    name: "Wedding Hoop Art",
    type: "Wedding Gifts",
    price: 199,
    color: "#4D96FF", // Blue
    image:
      "https://media.istockphoto.com/id/1171638539/photo/gold-sparkles-on-white-background.webp",
  },
  {
    id: 4,
    name: "Lippan Art",
    type: "Wall Decor",
    price: 299,
    color: "#FFB84C", // Orange
    image:
      "https://media.istockphoto.com/id/1314236759/photo/beautiful-decorative-mandala-hanging-on-wall.webp",
  },
];

const ProductPage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleViewMore = () => navigate("/shop");

  return (
    <section className="px-4 py-10 bg-white/30 backdrop-blur-md rounded-lg min-h-[98vh] mt-10">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8 uppercase">
        Our Products
      </h2>

      {isMobile ? (
        <>
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
          >
            {products.slice(0, 4).map((product) => (
              <SwiperSlide key={product.id}>
                <div className="bg-white rounded-xl shadow-md p-5 text-center transition-transform hover:scale-105">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">
                    {product.name}
                  </h3>
                  <p className="text-gray-500">{product.type}</p>
                  <p className="text-blue-600 font-bold text-lg">
                    ₹{product.price}
                  </p>
                  <div className="mt-4 space-y-2">
                    <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#004080] font-semibold py-2 rounded-lg transition duration-200">
                      Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="w-full bg-white text-[#004080] font-semibold py-2 rounded-lg border border-yellow-400 hover:bg-yellow-100 transition duration-200"
                    >
                      View
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Pagination Dots */}
          <div className="flex justify-center mt-4 space-x-2">
            {products.slice(0, 4).map((product, index) => (
              <span
                key={index}
                className="w-3 h-3 rounded-full"
                style={{
                  backgroundColor: product.color,
                  opacity: activeIndex === index ? 1 : 0.5,
                  transform: activeIndex === index ? "scale(1.3)" : "scale(1)",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md p-5 text-center transition-transform hover:scale-105"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-gray-500">{product.type}</p>
              <p className="text-blue-600 font-bold text-lg">
                ₹{product.price}
              </p>
              <div className="mt-4">
                <button className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#004080] font-semibold py-2 rounded-lg transition duration-200">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          onClick={handleViewMore}
          className="w-1/3 bg-white text-[#004080] font-semibold py-2 rounded-lg border border-yellow-400 hover:bg-yellow-100 transition duration-200"
        >
          View More
        </button>
      </div>
    </section>
  );
};

export default ProductPage;
