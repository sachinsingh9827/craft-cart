import React from "react";
import "./banner.css";

const Banner = () => {
  return (
    <section className="banner-container full-width">
      {/* Discount badge */}
      <div className="discount-badge">30% OFF</div>

      <div className="banner-content">
        <div className="banner-image">
          <img
            src="https://image.shutterstock.com/image-photo/keychain-made-resin-shape-letter-260nw-2058950864.jpg"
            alt="Resin Letter Keychain"
          />
        </div>
        <div className="banner-text">
          <h2 className="banner-title">Resin Letter Keychain</h2>
          <p className="banner-description">
            Personalize your style with our handcrafted resin letter keychains.
            Each piece is uniquely made to add a touch of charm and
            individuality to your keys or bags.
          </p>
          <button className="banner-button">Shop Now</button>
        </div>
      </div>
    </section>
  );
};

export default Banner;
