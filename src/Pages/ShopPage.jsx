import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import OfferBanner from "../components/Banner/Banner";
import LoadingPage from "../components/LoadingPage";
import Toast, { showToast } from "../components/Toast/Toast";

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

  const fetchProducts = useCallback(
    async (reset = false) => {
      try {
        setLoading(true);
        const res = await axios.get(`${BASE_URL}/api/admin/protect/active`, {
          params: { page, limit: PAGE_SIZE, search },
        });

        const newProducts = Array.isArray(res.data?.data) ? res.data.data : [];
        setProducts((prev) =>
          reset ? newProducts : [...prev, ...newProducts]
        );
        setTotalPages(res.data?.totalPages || 1);
        setError("");
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
        showToast("Failed to load products.", "error");
      } finally {
        setLoading(false);
      }
    },
    [page, search]
  );

  useEffect(() => {
    fetchProducts(page === 1);
  }, [page, fetchProducts]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setPage(1);
      fetchProducts(true);
    }, 500);
    return () => clearTimeout(debounce);
  }, [search, fetchProducts]);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "lowToHigh") return a.price - b.price;
    if (sortOption === "highToLow") return b.price - a.price;
    return 0;
  });

  const handleLoadMore = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handleAddToWishlist = async (productId, e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to add to wishlist.", "warning");
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
        showToast("Product added to wishlist!", "success");
      } else {
        showToast(res.data.message || "Something went wrong.", "error");
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        showToast("Session expired. Please login again.", "warning");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (status === 409) {
        showToast("Already in wishlist.", "info");
      } else {
        showToast("Failed to add to wishlist.", "error");
      }
    }
  };

  const handleBuyNow = (productId, e) => {
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to continue.", "warning");
      navigate("/login");
      return;
    }

    navigate(`/order/${productId}`);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 font-montserrat min-h-screen">
      <Toast />
      <OfferBanner />

      {/* Search & Sort */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#004080] w-full sm:w-auto"
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

      {error && <p className="text-center text-red-600 mt-4">{error}</p>}

      {/* Product Grid */}
      <div className="max-w-6xl mx-auto mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedProducts.length > 0 ? (
          sortedProducts.map(({ _id, name, price, images, stock }) => {
            const imageUrl =
              images?.[0]?.url || "https://via.placeholder.com/260";

            const isOutOfStock = stock === 0;
            const isLowStock = stock > 0 && stock <= 3;

            return (
              <div
                key={_id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/product/${_id}`)}
                className="cursor-pointer bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col w-full"
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
                  <p className="text-yellow-500 font-bold text-md mb-1">
                    ₹{typeof price === "number" ? price.toFixed(2) : "N/A"}
                  </p>

                  {isOutOfStock && (
                    <p className="text-red-500 text-sm">Out of Stock</p>
                  )}

                  {isLowStock && !isOutOfStock && (
                    <p className="text-orange-500 text-sm">
                      Hurry! Only {stock} left
                    </p>
                  )}

                  <div className="flex gap-2 mt-auto pt-3">
                    <button
                      onClick={(e) => handleAddToWishlist(_id, e)}
                      className="w-1/2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 text-sm"
                    >
                      Wishlist
                    </button>
                    <button
                      onClick={(e) => handleBuyNow(_id, e)}
                      className={`w-1/2 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ${
                        isOutOfStock
                          ? "bg-gray-400 text-white cursor-not-allowed"
                          : "bg-[#004080] text-yellow-400 hover:bg-yellow-400 hover:text-[#004080]"
                      }`}
                      disabled={isOutOfStock}
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

      {/* Load More */}
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
