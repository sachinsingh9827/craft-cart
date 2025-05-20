import React from "react";

const WelcomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center  px-6">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center bg-white rounded-3xl shadow-lg overflow-hidden">
        {/* Text Section */}
        <div className="md:w-1/2 p-10 md:pl-16 md:pr-12 text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-[#004080] mb-6">
            Welcome to Craft-Cart
          </h1>
          <p className="text-gray-700 mb-8 leading-relaxed text-lg">
            Discover unique, handmade crafts created by talented artisans from
            around the world. Quality, creativity, and passion delivered to your
            doorstep.
          </p>
          <button className="bg-[#004080] text-yellow-400 px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 hover:text-[#004080] transition-colors duration-300">
            Explore Collections
          </button>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 w-full">
          <img
            src="https://cdn.stocksnap.io/img-thumbs/280h/craft-paper_UYR9S9MIDW.jpg"
            alt="Crafts and handmade items"
            className="w-full h-auto object-cover rounded-tr-3xl rounded-br-3xl"
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
