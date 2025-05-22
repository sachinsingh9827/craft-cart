// ShopPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OfferBanner from "../components/Banner/Banner";
import shop from "../../src/assets/4862931.webp";
const products = [
  {
    id: 1,
    name: "Handmade Chitra artworks Mud ",
    price: 450.0,
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcSXm9H4Wex8X_3b4IdTMN7CYdO49FLXChy_n7pytWbKGqeGLpPn7yPulIle2O9YqPdkfufqepvv-W9Am2tpQ65_xtXTFKTild2JN827_IouCPwd6fFJnGNb",
    description:
      "Chitra artworks Mud & Mirror Work Lippan Art Wall Decor| Traditional Handcrafted Rajasthani/Gujarati Design | Ethnic Wall Hanging for Living Room,",
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
    name: "Wall Hanging",
    price: 300.0,
    image:
      "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSJ-JZjbiBrnChc7-AW3VOZAUj6Z8fv2trZMitIF17SxxwNxHN94fGAvSzUroajIJsVVdBgay5RBgU1syb4P1xZvZVb13ZGRcKc6q1MZW4",
    description: "Colorful Lippan Art Wall Hanging with Tassles",
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
    name: "MANDALA LIPPAN ART",
    price: 600.0,
    image: "https://m.media-amazon.com/images/I/71m5tZ1gwgL.jpg",
    description:
      "wall decor/Wall hanging/Comes with attached hook/handmade craft/base is of mdf board/mud work/UNIQUE LIPPAN art wall hanging home",
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
    name: "Rema Fabtex Art",
    price: 800.0,
    image:
      "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRa0cg-mtedorJLt9JjZsD1vm-0a-P4KcpipahLxs9tyztkRMWl8oc6l-DFJP55ptxPtMtkk7mNiCaASzqDZqWcXZlVx72P8FJ41HTRCEGq",
    description:
      "Beautiful Home Decor Lippan Art Mud Mirror Wall Decor Handmade Wall Art",
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
    name: "Indian clay painting",
    price: 250.0,
    image:
      "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTAjkwxxIX9z2Ui0oe4Nf4tsPZXTcOb5Vvl1GQZc7onpPpnYpyhDA_Fg2NTE6EciKaaTMHAqYc5l_IIIZ7y8AHfNMU8y1t0ZjvvndrrT0eB",
    description:
      "Indian tribal art, lippan wall art, Ganesha wall art,ethnic Lippan wall art Ganesh, clay art.",
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
    name: "Mud and mirror art",
    price: 550.0,
    image:
      "https://i.pinimg.com/originals/83/ea/67/83ea67e9791cf295759bb72e6d85f846.jpg",
    description:
      "Krishna lippan art, wall decor, good gift,good vibes,Indian folk art,handmade, home decor.",
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
    <>
      <OfferBanner
        imageUrl={shop}
        heading="Have Questions? We're Here to Help!"
        description="Reach out to us and we'll get back to you as soon as possible."
        buttonText="Explore More"
        navigateTo="/shop"
      />

      <div className="max-w-full mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
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
              className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col max-w-[260px] w-full mx-auto"
            >
              <img
                src={image}
                alt={name}
                className="w-full object-cover aspect-square"
                loading="lazy"
              />
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-[#004080] mb-1 truncate">
                  {name}
                </h2>
                <p className="text-yellow-500 font-bold text-md mb-3">
                  {price.toFixed(2)}
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToProduct(id);
                  }}
                  className="mt-auto w-full bg-[#004080] text-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300 text-sm"
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
    </>
  );
};

export default ShopPage;
