import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OfferBanner from "../components/Banner/Banner";
import LoadingPage from "../components/LoadingPage";

const BASE_URL = "https://craft-cart-backend.vercel.app";
const PAGE_SIZE = 10;

const ShopPage = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const goToProduct = (id) => navigate(`/product/${id}`);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchProducts = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/protect/active`, {
        params: {
          page: pageNumber,
          limit: PAGE_SIZE,
          search,
        },
      });

      const newProducts = Array.isArray(res.data?.data) ? res.data.data : [];
      setProducts((prev) => [...prev, ...newProducts]);
      setTotalPages(res.data?.totalPages || 1);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const handleLoadMore = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation();

    // Check if user is authenticated (token presence check)
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to wishlist.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/user/auth/wishlist/add`,
        { productId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Product added to wishlist!");
        // Optionally update UI state here (e.g. show filled heart)
      } else {
        alert(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Add to Wishlist Error:", err);

      // Unauthorized (token expired or invalid)
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token"); // clear invalid token
        navigate("/login");
      } else if (err.response?.status === 409) {
        // Conflict: Product already in wishlist
        alert(err.response.data.message || "Product is already in wishlist.");
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || "Invalid product ID.");
      } else {
        alert("Failed to add product to wishlist. Please try again.");
      }
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "lowToHigh") return a.price - b.price;
      if (sortOption === "highToLow") return b.price - a.price;
      return 0;
    });

  return (
    <div className="font-montserrat min-h-screen">
      <OfferBanner />

      {/* Search and Sort */}
      <div className="max-w-6xl mx-auto px-4 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004080]"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004080]"
        >
          <option value="">Sort by Price</option>
          <option value="lowToHigh">Low to High</option>
          <option value="highToLow">High to Low</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <p className="max-w-6xl mx-auto px-4 mt-4 text-red-600 text-center">
          {error}
        </p>
      )}

      {/* Product Grid */}
      <div className="max-w-full mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(({ _id, name, price, images }) => {
            const imageUrl =
              images && images.length > 0
                ? images[0].url
                : "https://via.placeholder.com/260";

            return (
              <div
                key={_id}
                onClick={() => goToProduct(_id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") goToProduct(_id);
                }}
                className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col max-w-[260px] w-full mx-auto"
              >
                <img
                  src={imageUrl}
                  alt={name}
                  className="w-full object-cover aspect-square"
                  loading="lazy"
                />
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-semibold text-[#004080] mb-1 truncate">
                    {name}
                  </h2>
                  <p className="text-yellow-500 font-bold text-md mb-3">
                    ₹{typeof price === "number" ? price.toFixed(2) : "N/A"}
                  </p>

                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={(e) => handleAddToWishlist(_id, e)}
                      className="w-1/2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm"
                    >
                      ❤️ Wishlist
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        goToProduct(_id);
                      }}
                      className="w-1/2 bg-[#004080] text-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300 text-sm"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : loading ? (
          <div className="col-span-full text-center">
            <LoadingPage />
          </div>
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found.
          </p>
        )}
      </div>

      {/* Load More Button */}
      {page < totalPages && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-[#004080] text-yellow-400 font-semibold rounded hover:bg-yellow-400 hover:text-[#004080] transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
