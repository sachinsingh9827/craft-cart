import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import noData from "../../assets/noData.avif";
import Button from "../../components/Reusable/Button";
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        setError("User ID not found");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://craft-cart-backend.vercel.app/api/user/auth/wishlist/${userId}`
        );

        if (res.data.success) {
          setWishlist(res.data.wishlist || []);
        } else {
          setError(res.data.message || "Failed to fetch wishlist");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const handleBuyNow = (productId) => {
    navigate(`/order/${productId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (wishlist.length === 0) {
    return (
      <div className="text-center p-6">
        <img
          src={noData} // <-- replace with your actual image path or URL
          alt="Empty Wishlist"
          className="w-48 h-48 mx-auto mb-4"
        />
        <p className="text-gray-500 text-lg">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      <h1 className="text-sm uppercase text-[#004080] font-bold mb-4">
        Your Wishlist
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="border p-2 rounded shadow"
            onClick={() => navigate(`/product/${product._id}`)}
          >
            <img
              src={
                product.images?.[0]?.url || "https://via.placeholder.com/150"
              }
              alt={product.name}
              className="h-40 object-cover w-full rounded mb-2"
            />
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
            <p className="font-bold text-blue-900 mt-1">₹{product.price}</p>
            <Button onClick={() => handleBuyNow(product._id)}>Buy Now</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
