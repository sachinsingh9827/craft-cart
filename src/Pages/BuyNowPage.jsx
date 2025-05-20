import React, { useState } from "react";

const product = {
  id: 1,
  name: "Handmade Ceramic Vase",
  price: 45.0,
  image:
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  description: "Beautifully crafted ceramic vase, perfect for home decoration.",
  material: "Ceramic",
  dimensions: "10 x 10 x 20 cm",
  weight: "500 grams",
  color: "Off-white",
  stock: 12,
  brand: "Artisan Crafts",
  warranty: "1 year",
  careInstructions: "Hand wash only, avoid direct sunlight.",
};

const DELIVERY_CHARGE = 5.0;

const BuyNowPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    postcode: "",
    moreDetails: "",
    quantity: 1,
  });

  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [upiId, setUpiId] = useState("");
  const [showSlip, setShowSlip] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity") {
      let qty = Math.max(1, Math.min(product.stock, Number(value)));
      setFormData((prev) => ({ ...prev, quantity: qty }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const totalPrice = (
    formData.quantity * product.price +
    DELIVERY_CHARGE
  ).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPaymentOptions(true);
  };

  const confirmPayment = () => {
    if (paymentMethod === "UPI" && upiId.trim() === "") {
      alert("Please enter your UPI ID");
      return;
    }
    setShowSlip(true);
  };

  return (
    <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-2xl shadow-md">
      <h1 className="text-3xl font-bold text-center text-[#004080] mb-8">
        Buy Now
      </h1>

      {!showPaymentOptions && !showSlip && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[#004080] font-semibold">
                Name:
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-[#004080] font-semibold">
                Email:
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-[#004080] font-semibold">
                Contact:
              </label>
              <input
                type="tel"
                name="contact"
                required
                value={formData.contact}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-[#004080] font-semibold">
                Postcode:
              </label>
              <input
                type="text"
                name="postcode"
                required
                value={formData.postcode}
                onChange={handleChange}
                className="w-full p-2 border rounded text-[#004080]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#004080] font-semibold">
                Address:
              </label>
              <textarea
                name="address"
                required
                rows="2"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded text-[#004080]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[#004080] font-semibold">
                More Details:
              </label>
              <textarea
                name="moreDetails"
                rows="2"
                value={formData.moreDetails}
                onChange={handleChange}
                className="w-full p-2 border rounded text-[#004080]"
              />
            </div>
            <div>
              <label className="block text-[#004080] font-semibold">
                Quantity:
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                max={product.stock}
                value={formData.quantity}
                onChange={handleChange}
                className="w-full p-2 border rounded text-[#004080]"
              />
            </div>
          </div>

          <div className="mt-4 text-lg font-semibold text-[#004080]">
            Delivery Charge: ${DELIVERY_CHARGE.toFixed(2)} <br />
            Total Price: ${totalPrice}
          </div>

          <button
            type="submit"
            className="mt-6 bg-[#004080] text-white px-6 py-2 rounded hover:bg-[#003060]"
          >
            Confirm Order
          </button>
        </form>
      )}

      {showPaymentOptions && !showSlip && (
        <div className="mt-6">
          <h2 className="text-xl font-bold text-[#004080] mb-4">
            Select Payment Method
          </h2>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="UPI"
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-[#004080]"
              />
              <span className="text-[#004080]">UPI</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="payment"
                value="COD"
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="text-[#004080]"
              />
              <span className="text-[#004080]"> Cash on Delivery</span>
            </label>
          </div>

          {paymentMethod === "UPI" && (
            <div className="mt-4">
              <label className="block text-[#004080] font-semibold text-left m-2">
                Enter UPI ID:
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full p-2 border rounded text-[#004080]"
                placeholder="example@upi"
              />
            </div>
          )}

          <button
            onClick={confirmPayment}
            className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Confirm Payment
          </button>
        </div>
      )}

      {showSlip && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-[#004080] mb-4">
            Shipping Slip
          </h2>
          <table className="w-full border text-left">
            <tbody>
              <tr className="border-b text-[#004080]">
                <td className="p-2 font-semibold">Product</td>
                <td className="p-2">{product.name}</td>
              </tr>
              <tr className="border-b text-[#004080]">
                <td className="p-2 font-semibold">Quantity</td>
                <td className="p-2">{formData.quantity}</td>
              </tr>
              <tr className="border-b text-[#004080]">
                <td className="p-2 font-semibold">Buyer Name</td>
                <td className="p-2">{formData.name}</td>
              </tr>
              <tr className="border-b text-[#004080]">
                <td className="p-2 font-semibold">Contact</td>
                <td className="p-2">{formData.contact}</td>
              </tr>
              <tr className="border-b text-[#004080]">
                <td className="p-2 font-semibold">Address</td>
                <td className="p-2">
                  {formData.address}, {formData.postcode}
                </td>
              </tr>
              <tr className="border-b text-[#004080]">
                <td className="p-2 font-semibold">Payment Method</td>
                <td className="p-2">
                  {paymentMethod} {paymentMethod === "UPI" && `(ID: ${upiId})`}
                </td>
              </tr>
              <tr className="border-b text-[#004080]">
                <td className="p-2 font-semibold">Total Amount</td>
                <td className="p-2">${totalPrice}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BuyNowPage;
