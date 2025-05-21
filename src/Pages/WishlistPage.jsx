import React, { useEffect, useState } from "react";

const products = [
  {
    id: 1,
    name: "Handmade Wooden Chair",
    price: 120,
    img: "https://cdn.stocksnap.io/img-thumbs/280h/patio-furniture_ZHZOIIFITB.jpg",
  },
  {
    id: 2,
    name: "Elegant Ceramic Vase",
    price: 45,
    img: "https://cdn.stocksnap.io/img-thumbs/280h/flower-vase_TIKIL6JEJP.jpg",
  },
  {
    id: 3,
    name: "Stylish Leather Wallet",
    price: 80,
    img: "https://cdn.stocksnap.io/img-thumbs/280h/leather-purse_Y4IBN1USSQ.jpg",
  },
  {
    id: 4,
    name: "Modern Floor Lamp",
    price: 150,
    img: "https://image.shutterstock.com/image-photo/armchair-pillow-glowing-lamp-plant-260nw-2057011547.jpg",
  },
];

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);
  const addToWishlist = (product) => {
    if (!wishlist.find((item) => item.id === product.id)) {
      setWishlist([...wishlist, product]);
    }
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 font-montserrat ">
      <h1
        className={`text-4xl font-bold text-[#004080] mb-8 text-center tracking-wide uppercase transition-all duration-700 ease-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        Your Wishlist
      </h1>
      {/* Products to add to wishlist */}
      <div className="max-w-7xl mx-auto mb-10 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map(({ id, name, price, img }) => (
          <div
            key={id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <img src={img} alt={name} className="w-full h-48 object-cover" />
            <div className="p-5 text-center">
              <h2 className="text-lg font-semibold text-[#004080] mb-2">
                {name}
              </h2>
              <p className="text-yellow-500 font-bold text-xl">₹{price}</p>
              <button
                onClick={() => addToWishlist({ id, name, price, img })}
                disabled={wishlist.find((item) => item.id === id)}
                className={`mt-4 font-semibold py-2 px-6 rounded-lg transition-colors duration-300 ${
                  wishlist.find((item) => item.id === id)
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-[#004080] text-yellow-400 hover:bg-yellow-400 hover:text-[#004080]"
                }`}
              >
                {wishlist.find((item) => item.id === id)
                  ? "Added"
                  : "Add to Wishlist"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Wishlist Items */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-[#004080] mb-6">
          Items in Wishlist
        </h2>
        {wishlist.length === 0 ? (
          <p className="text-center text-gray-600 border border-gray-300 bg-white shadow-md px-4 py-3 rounded-lg max-w-md mx-auto">
            No items in wishlist yet.
          </p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {wishlist.map(({ id, name, price, img }) => (
              <div
                key={id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={img}
                  alt={name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-5 text-center">
                  <h3 className="text-lg font-semibold text-[#004080] mb-2">
                    {name}
                  </h3>
                  <p className="text-yellow-500 font-bold text-xl mb-4">
                    ₹{price}
                  </p>
                  <button
                    onClick={() => removeFromWishlist(id)}
                    className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
