import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

const BASE_URL = "https://craft-cart-backend.vercel.app";

const BannerPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const currentIndex = useRef(0);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/banners`);
      if (res.data?.banners && Array.isArray(res.data.banners)) {
        setBanners(res.data.banners);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      currentIndex.current = (currentIndex.current + 1) % banners.length;
      const scrollContainer = scrollRef.current;
      if (scrollContainer) {
        const bannerWidth = scrollContainer.clientWidth;
        scrollContainer.scrollTo({
          left: bannerWidth * currentIndex.current,
          behavior: "smooth",
        });
      }
    }, 3000); // Changed to 3 seconds for better UX

    return () => clearInterval(interval);
  }, [banners]);

  if (loading)
    return <div className="text-center mt-10">Loading banners...</div>;
  if (!banners.length)
    return <div className="text-center mt-10">No banners available</div>;

  return (
    <div className="w-full max-w-full mx-auto px-4 py-6">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scroll-smooth no-scrollbar"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {banners.map((banner) => {
          const layout = banner.templateId?.layout || {};
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
            animation = "none",
          } = layout;

          return (
            <div
              key={banner._id || Math.random()} // fallback key if _id missing
              className="flex-shrink-0 w-full"
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
                animation,
                minHeight: "250px",
                boxSizing: "border-box",
              }}
            >
              {banner.imageUrl ? (
                <img
                  src={banner.imageUrl}
                  alt={banner.offerText || "Banner image"}
                  className="object-contain max-h-48 rounded"
                  style={{ flex: "1 1 50%" }}
                />
              ) : (
                <div
                  style={{
                    flex: "1 1 50%",
                    height: "192px",
                    backgroundColor: "#eee",
                    borderRadius: "8px",
                  }}
                  aria-label="No banner image"
                />
              )}

              <div
                className="flex flex-col justify-center flex-1"
                style={{ textAlign: textPosition, padding: "0 1rem" }}
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
      `}</style>
    </div>
  );
};

export default BannerPage;
