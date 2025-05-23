import React, { useEffect, useRef, useState } from "react";

// Extract YouTube ID from URL
const extractYouTubeId = (url) => {
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/;
  const match = url.match(regExp);
  return match && match[1] ? match[1] : null;
};

export default function AdminVideoUpload() {
  const [videos, setVideos] = useState([
    {
      id: 1,
      url: "https://youtube.com/shorts/r3BZCwBYcp4?si=Dbxrbm5b5fJ6WyL",
      title: "Sample Creative Video",
    },
  ]);

  const videoRefs = useRef({});

  // Auto play/pause local videos based on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRefs.current[entry.target.dataset.id];
          if (!video) return;
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    Object.entries(videoRefs.current).forEach(([id, video]) => {
      if (video && !video.src.includes("youtube.com")) {
        observer.observe(video);
      }
    });

    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video) observer.unobserve(video);
      });
    };
  }, [videos]);

  return (
    <div className="max-w-full text-[#004080] mx-auto p-4 sm:p-6 md:p-8 font-poppins min-h-[50vh] flex flex-col lg:flex-row gap-6 mt-4">
      {/* Left Panel: Product Info */}
      <div className="lg:w-1/2 max-h-[70vh] overflow-y-auto space-y-3">
        <h3 className="text-xl md:text-2xl text-[#004080] font-semibold">
          Featured Product
        </h3>
        <h4 className="text-sm md:text-xl text-[#004080] font-semibold">
          Mud and mirror art
        </h4>
        <p className="text-base md:text-lg text-[#004080] font-medium">
          550.00
        </p>
        <p className="mb-4 leading-relaxed text-sm md:text-base text-[#004080]">
          Krishna lippan art, wall decor, good gift, good vibes, Indian folk
          art, handmade, home decor.
        </p>
        <ul className="text-gray-600 text-sm md:text-base space-y-1 text-[#004080]">
          <li>
            <strong className="text-[#004080]">Material:</strong> Genuine
            leather
          </li>
          <li>
            <strong className="text-[#004080]">Dimensions:</strong> 12 x 9 x 2
            cm
          </li>
          <li>
            <strong className="text-[#004080]">Weight:</strong> 150 grams
          </li>

          <li>
            <strong className="text-[#004080]">Stock:</strong> 18
          </li>

          <li>
            <strong className="text-[#004080]">Care:</strong> Avoid water, clean
            with leather conditioner.
          </li>
        </ul>
      </div>

      {/* Right Panel: Videos */}
      <div className="lg:w-1/2 max-h-[70vh] overflow-y-auto space-y-4">
        {videos.map(({ id, url, title }) => {
          const isYouTube =
            url.includes("youtube.com") || url.includes("youtu.be");
          const youtubeId = extractYouTubeId(url);

          return (
            <div
              key={id}
              className="w-full max-w-[480px] h-[270px] rounded-lg overflow-hidden shadow-md bg-black"
            >
              {isYouTube && youtubeId ? (
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0`}
                  title={title}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  data-id={id}
                  ref={(el) => (videoRefs.current[id] = el)}
                  src={url}
                  muted
                  playsInline
                  autoPlay
                  loop
                  className="w-full h-full object-cover"
                  aria-label={`Creative video: ${title}`}
                />
              )}
              <div className="p-2 bg-gray-100 text-center text-[#004080] text-sm font-medium">
                {title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
