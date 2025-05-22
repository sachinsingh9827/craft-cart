import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const products = [
  {
    id: 1,
    name: "Handmade Chitra artworks Mud ",
    price: 45.0,
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
    price: 30.0,
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
    price: 60.0,
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
    price: 80.0,
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
    price: 25.0,
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
    price: 55.0,
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
