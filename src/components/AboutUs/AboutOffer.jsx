import React from "react";

const AboutOffer = () => {
  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-full mx-auto bg-white shadow-xl rounded-xl p-6 sm:p-10">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-[#004080] uppercase mb-8">
          Exclusive Offer Details
        </h1>

        {/* Introduction */}
        <p className="text-center text-gray-600 text-lg max-w-3xl mx-auto mb-8">
          We believe in rewarding our customers! Every purchase you make brings
          you closer to exciting rewards. With our special offer, you can
          receive up to{" "}
          <span className="font-bold text-[#004080]">50% OFF</span> — and 1
          lucky winner will even receive a{" "}
          <span className="font-bold text-green-600">100% discount</span> coupon
          daily!
        </p>

        {/* Steps to Get the Offer */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              step: 1,
              title: "Browse Products",
              desc: "Explore our wide range of quality products at unbeatable prices.",
            },
            {
              step: 2,
              title: "Place Your Order",
              desc: "Add your favorite items to the cart and complete checkout.",
            },
            {
              step: 3,
              title: "Receive Your Coupon",
              desc: "After purchase, receive a discount coupon up to 50% off.",
            },
            {
              step: 4,
              title: "Lucky Winner!",
              desc: "One lucky customer gets a 100% discount coupon every day.",
            },
            {
              step: 5,
              title: "Check Your Email",
              desc: "Your coupon code will be sent via email. Use it on your next order — valid for a limited time only!",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-[#f0f8ff] border-l-4 border-[#004080] p-4 rounded-lg shadow hover:shadow-md transition duration-300"
            >
              <div className="text-xl font-bold text-[#004080] mb-2">
                Step {item.step}: {item.title}
              </div>
              <p className="text-gray-700">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Offer Highlights */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-[#004080] mb-4">
            What You Get
          </h2>
          <ul className="text-gray-700 space-y-3 max-w-xl mx-auto text-left">
            <li>✅ Surprise Coupon up to 50% OFF with every order</li>
            <li>🎁 1 Lucky Customer daily gets a 100% OFF coupon</li>
            <li>📩 Coupon code delivered via email — easy to apply</li>
            <li>🕒 Coupons valid for a limited time only</li>
            <li>🚚 Fast Delivery and Premium Support</li>
            <li>🔁 Offer valid on every product, every time</li>
          </ul>
        </div>

        {/* Why Us */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-[#004080] mb-3">
            Why Shop With Us?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform isn’t just about great products — it’s about giving
            back to customers. Whether you're buying one item or many, each
            order brings exclusive rewards and a chance to win BIG.
          </p>
        </div>

        {/* Call to Action */}
        <div className="mt-14 text-center">
          <h2 className="text-2xl font-bold text-[#004080] mb-2">
            Ready to Grab Your Discount?
          </h2>
          <p className="text-gray-600 mb-6">
            Start shopping today and increase your chances to win a 100% OFF
            coupon!
          </p>
          <a
            href="/shop"
            className="inline-block bg-[#004080] hover:bg-[#003366] text-white font-bold py-3 px-6 rounded-lg transition duration-300"
          >
            Shop Now
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutOffer;
