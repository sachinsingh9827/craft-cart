import React, { useState } from "react";
import "./ProductStyles.css";
import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Mehandi Platter For Mehendi Ceremony",
    type: "Alphabet Keychain",
    price: 199,
    image:
      "https://media.istockphoto.com/id/1294925648/photo/cake.webp?b=1&s=612x612&w=0&k=20&c=NXgPLgob3-Ug2jEw4XL2_kPywBPK85Gqyx2Uk=",
  },
  {
    id: 2,
    name: "Resin Keychain M",
    type: "Alphabet Keychain",
    price: 249,
    image:
      "https://image.shutterstock.com/image-photo/keychain-alphabet-m-resin-art-260nw-1924196675.jpg",
  },
  {
    id: 3,
    name: "Wedding Hoop Art",
    type: "Personalized Wedding Gifts",
    price: 199,
    image:
      "https://media.istockphoto.com/id/1171638539/photo/gold-sparkles-on-white-background-white-circle-shape-for-text-and-design.webp?b=1&s=612x612&w=0&k=20&c=Tnxx8gLMT2HD7PK1njxoG-1Va6gWMXfl5DYGHJ6Enkc=",
  },
  {
    id: 4,
    name: "Lippan Art Wall Decor",
    type: "Mud & Mirror Work Frame (White,18*18 sq inches)",
    price: 299,
    image:
      "https://media.istockphoto.com/id/1314236759/photo/beautiful-decorative-mandala-hanging-on-wall.webp?b=1&s=612x612&w=0&k=20&c=wVWi5UeJuHPSfQFS_WsNgTuDfgC0XDsnvPVyQRmgzM4=",
  },
  {
    id: 5,
    name: "Wall Hanging",
    type: "Wall Hanging",
    price: 399,
    image:
      "https://image.shutterstock.com/image-photo/handmade-macrame-100-cotton-wall-260nw-2143166935.jpg",
  },
  {
    id: 6,
    name: "Product 6",
    type: "Type 6",
    price: 499,
    image: "https://via.placeholder.com/260x180.png?text=Product+6",
  },
];

const AllProducts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());
  const handleCategory = (e) => setSelectedCategory(e.target.value);
  const handleSort = (e) => setSortOrder(e.target.value);
  const toggleFilters = () => setShowFilters((prev) => !prev);

  let filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.type.toLowerCase().includes(searchTerm)
  );

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(
      (product) => product.type === selectedCategory
    );
  }

  if (sortOrder === "low-to-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "high-to-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  // Extract unique categories dynamically for dropdown
  const categories = [...new Set(products.map((p) => p.type))].sort();

  return (
    <div className="product-page">
      {" "}
      <header className="page-header">
        <h1 className="page-title">All Products</h1>
        <button
          className="menu-btn"
          onClick={toggleFilters}
          aria-label="Toggle filters"
        >
          &#8942;
        </button>
      </header>
      <div className={`filters ${showFilters ? "active" : ""}`}>
        <input
          type="text"
          placeholder="Search by name or type"
          onChange={handleSearch}
          className="search-input"
        />

        <select
          onChange={handleCategory}
          className="select-dropdown"
          value={selectedCategory}
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          onChange={handleSort}
          className="select-dropdown"
          value={sortOrder}
        >
          <option value="">Sort by Price</option>
          <option value="low-to-high">Low to High</option>
          <option value="high-to-low">High to Low</option>
        </select>
      </div>
      <div className="product-page">
        <div className={`filters ${showFilters ? "active" : ""}`}>
          {/* your filters */}
        </div>

        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="product" key={product.id}>
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                  />
                  <h3 className="product-name">{product.name}</h3>
                </Link>
                <p className="product-type">{product.type}</p>
                <p className="product-price">
                  ₹{product.price.toLocaleString()}
                </p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            ))
          ) : (
            <p className="no-products">No matching products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
