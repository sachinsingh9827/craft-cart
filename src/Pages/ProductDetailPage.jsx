import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// ... your products array with reviews included
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
    reviews: [
      // <-- Use colon here
      {
        id: 1,
        username: "Alice",
        rating: 5,
        comment: "Absolutely love this vase! Great quality and design.",
      },
      {
        id: 2,
        username: "Bob",
        rating: 4,
        comment: "Nice product, but a bit smaller than expected.",
      },
      {
        id: 3,
        username: "Cathy",
        rating: 3,
        comment: "Good overall, but shipping was delayed.",
      },
      {
        id: 4,
        username: "David",
        rating: 5,
        comment: "Exceeded my expectations! Will buy again.",
      },
      {
        id: 5,
        username: "Eva",
        rating: 2,
        comment: "Not as described. Color was different from pictures.",
      },
    ],
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
    reviews: [], // empty but defined
  },
  // Add more products similarly with reviews or empty arrays
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === Number(id));

  const [showAllReviews, setShowAllReviews] = useState(false);

  if (!product) {
    return (
      <div className="min-full flex items-center justify-center">
        <p className="text-xl text-gray-500">Product not found.</p>
      </div>
    );
  }
  const handleBuyNow = () => {
    navigate("/buy-now"); // Adjust this route if your route is different
  };
  const reviews = product.reviews || [];
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
  function renderStars(rating) {
    const totalStars = 5;
    const filledStars = "★".repeat(rating);
    const emptyStars = "☆".repeat(totalStars - rating);
    return (
      <span className="text-yellow-400 font-bold text-lg">
        {filledStars}
        {emptyStars}
      </span>
    );
  }

  return (
    <div className="min-h-screen p-6 max-full mx-auto bg-white rounded-lg shadow-lg mt-8">
      <div className="flex flex-col md:flex-row gap-8 text-left">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 object-cover rounded-lg"
        />
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold text-[#004080] mb-4">
            {product.name}
          </h1>
          <p className="text-yellow-500 font-bold text-2xl mb-4">
            ${product.price.toFixed(2)}
          </p>
          <p className="mb-4">{product.description}</p>

          <ul className="text-gray-700 space-y-2 mb-6">
            <li>
              <strong>Material:</strong> {product.material}
            </li>
            <li>
              <strong>Dimensions:</strong> {product.dimensions}
            </li>
            <li>
              <strong>Weight:</strong> {product.weight}
            </li>
            <li>
              <strong>Color:</strong> {product.color}
            </li>
            <li>
              <strong>Stock:</strong> {product.stock}
            </li>
            <li>
              <strong>Brand:</strong> {product.brand}
            </li>
            <li>
              <strong>Warranty:</strong> {product.warranty}
            </li>
            <li>
              <strong>Care Instructions:</strong> {product.careInstructions}
            </li>
          </ul>

          <button
            className="mb-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => handleBuyNow()}
          >
            Buy Now
          </button>
        </div>
      </div>
      <div className="max-w-2xl mx-auto text-left">
        <h2 className="text-xl font-semibold mb-2">
          Rating: {averageRating.toFixed(1)} / 5
        </h2>

        <h3 className="text-lg font-semibold mb-4">Reviews:</h3>

        {(reviews?.length
          ? showAllReviews
            ? reviews
            : reviews.slice(0, 1)
          : []
        ).map((review) => (
          <div
            key={review.id}
            className="mb-4 border p-3 rounded shadow-sm text-[#004080]"
          >
            <p className="font-semibold">{review.username}</p>
            <p>
              Rating: {renderStars(review.rating)} ({review.rating} / 5)
            </p>
            <p>{review.comment}</p>
          </div>
        ))}

        {reviews.length > 1 && (
          <div className="mt-2">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? "Show Less Reviews" : "Show All Reviews"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
