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

  const [allProducts, setAllProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [banner, setBanner] = useState(null);
  const [bannerLoading, setBannerLoading] = useState(true);

  const goToProduct = (id) => navigate(`/product/${id}`);

  // Fetch Products
  const fetchProducts = async (pageNumber) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/admin/protect?page=${pageNumber}&limit=${PAGE_SIZE}`
      );
      const newProducts = res.data?.data || [];
      setAllProducts((prev) => [...prev, ...newProducts]);
      setTotalPages(res.data?.totalPages || 1);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Banner
  const fetchBanner = async () => {
    try {
      setBannerLoading(true);
      const res = await axios.get(`${BASE_URL}/api/banners`);
      // Assuming API returns an array of banners
      if (res.data?.data?.length > 0) {
        setBanner(res.data.data[0]); // Get the first banner
      }
    } catch (err) {
      console.error("Failed to fetch banner");
    } finally {
      setBannerLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  useEffect(() => {
    fetchBanner();
  }, []);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  const getFilteredProducts = () => {
    let filtered = allProducts.filter((product) =>
      product.name.toLowerCase().includes(search.toLowerCase())
    );

    if (sortOption === "lowToHigh") {
      filtered = filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === "highToLow") {
      filtered = filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="font-montserrat">
      {/* Banner Section */}
      {bannerLoading ? (
        <LoadingPage />
      ) : banner ? (
        <OfferBanner
          imageUrl={banner.image} // assuming API returns `image`
          heading={banner.heading || "Welcome!"}
          description={banner.description || ""}
          buttonText={banner.buttonText || "Explore"}
          navigateTo={banner.navigateTo || "/shop"}
        />
      ) : null}

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

      {/* Product Grid */}
      <div className="max-w-full mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 font-montserrat">
        {loading && allProducts.length === 0 ? (
          <p className="col-span-full text-center">
            <LoadingPage />
          </p>
        ) : error ? (
          <p className="col-span-full text-center text-red-500">{error}</p>
        ) : filteredProducts.length > 0 ? (
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
                    ₹{price.toFixed(2)}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      goToProduct(_id);
                    }}
                    className="mt-auto w-full bg-[#004080] text-yellow-400 py-2 rounded-lg font-semibold hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300 text-sm"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            );
          })
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
