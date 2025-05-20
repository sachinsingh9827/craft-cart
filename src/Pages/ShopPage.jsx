// ShopPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Handmade Ceramic Vase",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
    description:
      "Beautifully crafted ceramic vase, perfect for home decoration.",
    material: "Ceramic",
    dimensions: "10 x 10 x 20 cm",
    weight: "500 grams",
    color: "Off-white",
    stock: 12,
    brand: "Artisan Crafts",
    warranty: "1 year",
    careInstructions: "Hand wash only, avoid direct sunlight.",
  },
  {
    id: 2,
    name: "Woven Basket",
    price: 30.0,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
    description: "Handwoven basket made from natural fibers.",
    material: "Natural fibers",
    dimensions: "25 x 20 x 15 cm",
    weight: "700 grams",
    color: "Natural brown",
    stock: 20,
    brand: "Eco Weaves",
    warranty: "6 months",
    careInstructions: "Keep dry and avoid heavy loads.",
  },
  {
    id: 3,
    name: "Wooden Jewelry Box",
    price: 60.0,
    image:
      "https://images.unsplash.com/photo-1494256997604-768d1f608cac?auto=format&fit=crop&w=400&q=80",
    description: "Elegant wooden box to store your precious jewelry.",
    material: "Solid wood",
    dimensions: "30 x 15 x 10 cm",
    weight: "1.2 kg",
    color: "Dark brown",
    stock: 8,
    brand: "WoodWorks",
    warranty: "2 years",
    careInstructions: "Wipe with dry cloth, avoid moisture.",
  },
  {
    id: 4,
    name: "Hand-painted Canvas",
    price: 80.0,
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
    description: "Original hand-painted canvas for your living room.",
    material: "Canvas and acrylic paint",
    dimensions: "50 x 70 cm",
    weight: "800 grams",
    color: "Multicolor",
    stock: 5,
    brand: "Creative Arts",
    warranty: "No warranty",
    careInstructions: "Avoid water, clean gently with dry cloth.",
  },
  {
    id: 5,
    name: "Knitted Scarf",
    price: 25.0,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
    description: "Warm knitted scarf made with love.",
    material: "Wool blend",
    dimensions: "180 x 25 cm",
    weight: "400 grams",
    color: "Red",
    stock: 15,
    brand: "Cozy Knits",
    warranty: "30 days",
    careInstructions: "Hand wash cold, lay flat to dry.",
  },
  {
    id: 6,
    name: "Leather Wallet",
    price: 55.0,
    image:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=400&q=80",
    description: "Durable leather wallet with multiple compartments.",
    material: "Genuine leather",
    dimensions: "12 x 9 x 2 cm",
    weight: "150 grams",
    color: "Dark brown",
    stock: 18,
    brand: "Urban Style",
    warranty: "1 year",
    careInstructions: "Avoid water, clean with leather conditioner.",
  },
];

const ShopPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const goToProduct = (id) => navigate(`/product/${id}`);

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "lowToHigh") return a.price - b.price;
      if (sortOption === "highToLow") return b.price - a.price;
      return 0;
    });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const countdownTarget = new Date();
  countdownTarget.setDate(countdownTarget.getDate() + 4); // 4 days from now

  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const now = new Date();
    const diff = countdownTarget - now;

    if (diff <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  }

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);
  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#004080] mb-6 text-center">
          Shop All Products
        </h1>

        {/* Animated Advertisement Banner */}
        <div className="max-full mx-auto mb-12 p-6 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between animate-bounceIn">
          <div className="text-[#004080] text-center sm:text-left sm:max-w-xl">
            <h2 className="text-2xl font-extrabold mb-2 animate-wiggle">
              🎉 Special Offer Alert!
            </h2>
            <p className="text-lg font-semibold">
              Get <span className="underline">20% OFF</span> on all handmade
              crafts! Use code <span className="font-bold">CRAFT20</span> at
              checkout.
            </p>
            <p className="text-sm mt-1 italic">
              Limited time only. Don't miss out!
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="mt-4 sm:mt-0 text-[#004080] font-extrabold text-xl sm:text-2xl flex space-x-4 justify-center sm:justify-end">
            <span>{timeLeft.days}d</span>
            <span>{timeLeft.hours}h</span>
            <span>{timeLeft.minutes}m</span>
            <span>{timeLeft.seconds}s</span>
          </div>
        </div>
      </>

      {/* Filter/Search and sorting UI as you have */}

      {/* Product Grid */}
      <div className="max-full mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(({ id, name, price, image }) => (
            <div
              key={id}
              onClick={() => goToProduct(id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") goToProduct(id);
              }}
              className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={image}
                alt={name}
                className="w-full h-56 object-cover"
                loading="lazy"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-[#004080] mb-2">
                  {name}
                </h2>
                <p className="text-yellow-500 font-bold text-lg mb-4">
                  ${price.toFixed(2)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToProduct(id);
                  }}
                  className="w-full bg-[#004080] text-yellow-400 py-2 rounded-lg font-bold hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
