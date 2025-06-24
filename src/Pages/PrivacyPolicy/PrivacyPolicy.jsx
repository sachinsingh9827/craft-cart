import React from "react";

import contactusbanner from "../../assets/4862931.webp";

const PrivacyPolicy = () => {
  return (
    <>
      <div className="flex items-center justify-center p-4 md:p-6 font-montserrat">
        <div className="w-full max-w-full bg-white shadow-2xl rounded-2xl overflow-hidden p-6 md:p-10">
          <h1 className="text-4xl font-extrabold text-[#004080] mb-10 uppercase text-center tracking-wide">
            Privacy Policy & Order Terms
          </h1>

          {/* 1. User Info */}
          <section className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-[#004080]">
              1. User Info
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                Valid email required for account creation, updates, and
                notifications.
              </li>
              <li>
                We will notify you via email for all orders, updates, and
                account activities.
              </li>
            </ul>
          </section>

          {/* 2. Order Cancellation */}
          <section className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-[#004080]">
              2. Order Cancellation
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                You may cancel orders within <strong>3 days</strong> of
                confirmation.
              </li>
              <li>After 3 days, the cancellation option is disabled.</li>
            </ul>
          </section>

          {/* 3. COD */}
          <section className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-[#004080]">
              3. Cash on Delivery (COD)
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>For COD orders, accept delivery when it arrives.</li>
              <li>
                Repeated refusals may result in <strong>blacklisting</strong>.
              </li>
            </ul>
          </section>

          {/* 4. Returns & Damages */}
          <section className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-[#004080]">
              4. Returns & Damages
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                Returns accepted within <strong>3 days</strong> of delivery
                only.
              </li>
              <li>Items must be unopened and in original condition.</li>
              <li>
                Damaged product? <strong>Refuse delivery</strong> during
                delivery.
              </li>
              <li>
                Delivery agents will record an <strong>unboxing video</strong>{" "}
                for proof.
              </li>
            </ul>
          </section>

          {/* 5. Delivery & Tracking */}
          <section className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-[#004080]">
              5. Delivery & Tracking
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>We ship across India via trusted partners.</li>
              <li>
                Orders processed within 24–48 hrs; delivery within 3–7 business
                days.
              </li>
              <li>You’ll receive tracking via email/SMS.</li>
            </ul>
          </section>

          {/* 6. Policy Updates */}
          <section className="space-y-2 mb-8">
            <h2 className="text-2xl font-semibold text-[#004080]">
              6. Policy Updates
            </h2>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              <li>
                This is our first release—policies may evolve based on feedback.
              </li>
              <li>
                We prioritize transparency and trust. Contact us with concerns.
              </li>
            </ul>
          </section>

          <p className="text-center text-sm text-gray-500 mt-10">
            © 2025 Craft-Cart. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
