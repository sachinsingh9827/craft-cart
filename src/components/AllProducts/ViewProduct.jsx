import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./ViewProduct.css";

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

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <p>Product not found.</p>;
  }

  // Get other products with same type excluding current product
  const moreProducts = products.filter(
    (p) => p.type === product.type && p.id !== product.id
  );

  const handleBuyNow = () => {
    alert(`Buying ${product.name}`);
  };

  const handleAddToWishlist = () => {
    alert(`${product.name} added to wishlist!`);
  };

  return (
    <div className="view-product-page">
      <button onClick={() => navigate(-1)}>Back to Products</button>

      <div className="product-detail">
        <img
          src={product.image}
          alt={product.name}
          className="product-image-large"
        />
        <div className="product-info">
          <h2>{product.name}</h2>
          <p>Category: {product.type}</p>
          <p>Price: ₹{product.price.toLocaleString()}</p>

          <div className="product-actions">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="wishlist-btn" onClick={handleAddToWishlist}>
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {moreProducts.length > 0 && (
        <div className="more-products">
          <h3>More Products in this Category</h3>
          <div className="more-products-list">
            {moreProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="more-product-card"
              >
                <img src={p.image} alt={p.name} />
                <p className="more-product-name">{p.name}</p>
                <p className="more-product-price">
                  ₹{p.price.toLocaleString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
