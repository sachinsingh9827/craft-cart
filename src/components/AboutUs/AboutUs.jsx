import React from "react";
import OfferBanner from "../Banner/Banner";
import TeamSection from "../TeamSection/TeamSection";
const AboutUs = () => {
  return (
    <>
      <OfferBanner
        imageUrl="https://ouch-prod-var-cdn.icons8.com/bn/illustrations/thumbs/gQFtmdNcClWg365P.webp"
        heading="Exclusive About Page Offer!"
        description="Special deals for visitors who want to know more about us."
        buttonText="Learn More"
        navigateTo="/about-offer"
      />

      <div className="bg-white text-gray-800 font-montserrat">
        <section className="py-14 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#004080] mb-4">Who We Are</h2>
          <p className="text-gray-700 leading-relaxed">
            Craft-Cart is a curated marketplace for handcrafted products created
            by skilled artisans from across India. We bridge the gap between
            traditional craftsmanship and modern buyers, offering products that
            reflect heritage, sustainability, and artistry.
          </p>
        </section>

        {/* Mission and Vision */}
        <section className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6 mb-14">
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-[#004080] mb-2">
              Our Mission
            </h3>
            <p className="text-gray-700">
              To empower local artisans by giving them access to a global market
              and to preserve traditional crafts through sustainable business
              models.
            </p>
          </div>
          <div className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-[#004080] mb-2">
              Our Vision
            </h3>
            <p className="text-gray-700">
              To become the most loved and trusted platform for authentic
              handmade goods, building a vibrant community of conscious buyers
              and skilled creators.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="bg-[#f5faff] py-14 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#004080] mb-6 text-center">
              What Makes Craft-Cart Unique?
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 text-center">
              {[
                "100% Handmade & Authentic",
                "Artisan-First Marketplace",
                "Eco-Friendly Packaging",
                "Safe & Timely Delivery",
                "Secure Payments",
                "Easy 7-Day Returns",
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-5 shadow rounded-lg text-[#004080] font-semibold"
                >
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Delivery & Packaging */}
        <section className="py-14 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#004080] mb-8 text-center">
            Delivery & Packaging
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white shadow p-6 rounded-lg border-l-4 border-[#004080] transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[#007acc]">
              <h3 className="text-xl font-semibold text-[#004080] mb-2">
                Delivery Information
              </h3>
              <p className="text-gray-700">
                We ship across India using trusted delivery partners. Orders are
                processed within 24-48 hours and delivered within 3-7 business
                days. Real-time tracking is available on every order.
              </p>
            </div>
            <div className="bg-white shadow p-6 rounded-lg border-l-4 border-[#004080] transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-[#007acc]">
              <h3 className="text-xl font-semibold text-[#004080] mb-2">
                Packaging Promise
              </h3>
              <p className="text-gray-700">
                All products are packed with care using recyclable and
                eco-friendly materials. Fragile items receive extra protection
                to ensure they arrive in perfect condition.
              </p>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-100 py-14 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#004080] mb-6">
              Trusted by Thousands
            </h2>
            <p className="text-gray-700 mb-6 max-w-3xl mx-auto">
              Your trust is our priority. At Craft-Cart, we’re committed to
              quality, transparency, and exceptional service.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {[
                "✅ Verified Artisans",
                "🔒 Secure Checkout",
                "📦 Safe Packaging",
                "📞 24/7 Support",
                "🛍️ Customer Satisfaction Guaranteed",
              ].map((trustItem, i) => (
                <div
                  key={i}
                  className="bg-white px-4 py-3 rounded shadow border border-green-200 
                     text-green-800 font-semibold text-sm sm:text-base 
                     w-1/2 sm:w-auto sm:min-w-[220px] min-h-[80px] 
                     flex items-center justify-center text-center 
                     transition duration-200 hover:shadow-md"
                >
                  {trustItem}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Team */}
        <TeamSection />

        {/* Final Quote */}
        <section className="text-center py-10 bg-[#f9f9f9] text-gray-600 px-4">
          <p className="italic max-w-2xl mx-auto">
            "Craft is not just a product – it’s a passion, a tradition, and a
            connection to culture."
          </p>
        </section>
      </div>
    </>
  );
};

export default AboutUs;
