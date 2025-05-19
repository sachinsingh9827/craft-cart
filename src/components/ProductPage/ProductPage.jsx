import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "./productPage.css";
import { useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Mehandi Platter For Mehendi Ceremony",
    type: "Alphabet Keychain",
    price: 199,
    image:
      "https://media.istockphoto.com/id/1294925648/photo/cake.webp?b=1&s=612x612&w=0&k=20&c=NXgPLgob3-Ug2jV_tx1iEw4XL2_kPywBPK85Gqyx2Uk=",
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

const ProductPage = () => {
  const [visibleCount, setVisibleCount] = useState(5);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const visibleProducts = products.slice(0, visibleCount);

  const navigate = useNavigate();

  const handleViewMore = () => {
    navigate("/all-products");
  };

  return (
    <section className="product-page">
      <h2 className="page-title">Our Products</h2>

      {isMobile ? (
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
        >
          {visibleProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-type">{product.type}</p>
                <p className="product-price">₹{product.price}</p>
                <button className="add-to-cart">Add to Cart</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="product-list">
          {visibleProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <img
                src={product.image}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="product-type">{product.type}</p>
              <p className="product-price">₹{product.price}</p>
              <button className="add-to-cart">Add to Cart</button>
            </div>
          ))}
        </div>
      )}
      {!isMobile && visibleCount < products.length && (
        <button className="view-more-btn" onClick={handleViewMore}>
          View More
        </button>
      )}
    </section>
  );
};

export default ProductPage;
