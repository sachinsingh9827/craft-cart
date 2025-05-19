import React from "react";
import "./welcome.css";

const WelcomePage = () => {
  return (
    <div className="welcome-wrapper">
      <div className="welcome-container">
        <div className="welcome-text">
          <h1>Welcome to Craft-Cart</h1>
          <p>
            Discover unique, handmade crafts created by talented artisans from
            around the world. Quality, creativity, and passion delivered to your
            doorstep.
          </p>
          <button className="shop-btn">Explore Collections</button>
        </div>
        <div className="welcome-image">
          {/* Placeholder image, replace with your own */}
          <img
            src="https://cdn.stocksnap.io/img-thumbs/280h/craft-paper_UYR9S9MIDW.jpg"
            alt="Crafts and handmade items"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
