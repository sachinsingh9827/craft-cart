import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const ProductsPage = () => {
  const [cart, setCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [moreInfo, setMoreInfo] = useState("");

  const [animate, setAnimate] = useState(false);

  const [quantities, setQuantities] = useState({});
  const [selectedProductId, setSelectedProductId] = useState(null);
  const navigate = useNavigate();
  const addToCart = (productId) => {
    const qty = quantities[productId];
    if (!qty || qty < 1) return;

    const selectedProduct = products.find((p) => p.id === productId);

    console.log("Product Added:", {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: qty,
      total: selectedProduct.price * qty,
    });

    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + qty,
    }));

    // Reset
    setSelectedProductId(null);
    setQuantities((prev) => ({ ...prev, [productId]: "" }));
  };

  useEffect(() => {
    // Trigger animation after component mounts
    setAnimate(true);
  }, []);

  const handleBuyNow = (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Calculate total price for the selected product
    const totalProductPrice = selectedProduct.price * quantity;

    // Log product details and total price
    console.log("Product Details:", {
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      quantity: quantity,
      total: totalProductPrice,
    });
    navigate("/buynow", {
      state: { product: selectedProduct, quantity: quantity }, // Pass product data
    });

    // Add to cart
    addToCart(selectedProduct.id); // Corrected to use product ID

    // Reset form and close sidebar
    setSelectedProduct(null);
    setQuantity(1);
    setMoreInfo("");
  };

  // Cart summary calculations
  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalPrice = Object.entries(cart).reduce((acc, [id, qty]) => {
    const product = products.find((p) => p.id === parseInt(id));
    return acc + product.price * qty;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-5 relative">
      <h1
        className={`text-4xl font-bold text-[#004080] mb-8 text-center tracking-wide uppercase transition-all duration-700 ease-out ${
          animate ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"
        }`}
      >
        Craft-Cart Products
      </h1>

      {/* Cart summary */}
      <div className="max-w-7xl mx-auto mb-6 p-4 bg-white rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-[#004080]">Cart Summary</h3>
        <p className="mt-2 text-lg">
          Total Products: <span className="font-bold">{products.length}</span> |
          Total Price:{" "}
          <span className="font-bold">
            ₹
            {products
              .reduce((acc, product) => acc + product.price, 0)
              .toFixed(2)}
          </span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

              {/* Button to open sidebar and select product */}
              <button
                onClick={() => {
                  setSelectedProduct({ id, name, price, img });
                  setQuantity(1);
                  setMoreInfo("");
                }}
                className="mt-4 bg-[#004080] text-yellow-400 font-semibold py-2 px-6 rounded-lg hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300"
              >
                Select Product
              </button>

              {cart[id] && (
                <p className="mt-2 text-sm text-gray-700">
                  Quantity in cart:{" "}
                  <span className="font-semibold">{cart[id]}</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg p-6 transform transition-transform duration-300 ${
          selectedProduct ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ zIndex: 1000 }}
      >
        {selectedProduct && (
          <>
            <button
              className="text-gray-500 mb-4"
              onClick={() => setSelectedProduct(null)}
            >
              ✕ Close
            </button>

            <img
              src={selectedProduct.img}
              alt={selectedProduct.name}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-2xl font-bold text-[#004080] mb-2">
              {selectedProduct.name}
            </h2>
            <p className="text-yellow-500 font-bold text-xl mb-4">
              ₹{selectedProduct.price}
            </p>

            <form onSubmit={handleBuyNow}>
              <label className="block mb-2 font-semibold text-[#004080]">
                Quantity:
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </label>

              <label className="block mb-4 font-semibold text-[#004080]">
                More Information:
                <textarea
                  rows="3"
                  value={moreInfo}
                  onChange={(e) => setMoreInfo(e.target.value)}
                  placeholder="Add notes or instructions"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 resize-none"
                />
              </label>

              <button
                type="submit"
                className="w-full bg-[#004080] text-yellow-400 font-semibold py-2 rounded-lg hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300"
              >
                Buy Now
              </button>
            </form>
          </>
        )}
      </div>

      {/* Overlay */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black opacity-30"
          onClick={() => setSelectedProduct(null)}
          style={{ zIndex: 900 }}
        />
      )}
    </div>
  );
};

export default ProductsPage;
