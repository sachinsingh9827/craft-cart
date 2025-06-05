import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const currentIndex = useRef(0);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/banners`);
      if (res.data?.banners) {
        setBanners(res.data.banners);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto scroll every 2 seconds
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length;
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        const bannerWidth = scrollContainer.children[0]?.offsetWidth || 0;
        scrollContainer.scrollTo({
          left: bannerWidth * currentIndex.current,
          behavior: "smooth",
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [banners]);

  if (loading) {
    return <div className="text-center mt-10">Loading banners...</div>;
  }

  if (!banners.length) {
    return <div className="text-center mt-10">No banners available</div>;
  }

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth no-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {banners.map((banner) => {
          const layout = banner.templateId.layout || {};
          const {
            imagePosition = "left",
            textPosition = "right",
            backgroundColor = "#fff",
            textColor = "#000",
            fontSize = "16px",
            borderRadius = "0px",
            boxShadow = "none",
            padding = "0",
            borderStyle = "none",
            borderWidth = "0",
            borderColor = "transparent",
            shape = "rectangle",
            animation = "",
          } = layout;

          return (
            <div
              key={banner._id}
              className="flex-shrink-0 w-full sm:w-3/4 md:w-1/2 lg:w-1/3"
              style={{
                backgroundColor,
                color: textColor,
                fontSize,
                borderRadius,
                boxShadow,
                padding,
                borderStyle,
                borderWidth,
                borderColor,
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: imagePosition === "left" ? "row" : "row-reverse",
                alignItems: "center",
                gap: "1rem",
                animation: animation ? animation : "none",
                minHeight: "180px",
              }}
            >
              <img
                src={banner.imageUrl}
                alt={banner.offerText || "Banner image"}
                className="object-contain max-h-40 rounded"
                style={{ flex: "1 1 50%" }}
              />
              <div
                className="flex flex-col justify-center flex-1"
                style={{ textAlign: textPosition }}
              >
                <h2 className="font-bold" style={{ fontSize }}>
                  {banner.offerText}
                </h2>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        /* Hide scrollbar for all browsers */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        /* Basic animation example (bounceIn) */
        @keyframes bounceIn {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-20px);
          }
          60% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default BannerPage;
