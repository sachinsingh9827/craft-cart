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

  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    const newVideos = files.map((file, index) => ({
      id: Date.now() + index,
      url: URL.createObjectURL(file),
      title: file.name,
    }));

    setVideos((prev) => [...prev, ...newVideos]);
    e.target.value = null;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 font-poppins min-h-screen flex flex-col lg:flex-row gap-8">
      {/* Left Panel: Product Info */}
      <div className="lg:w-1/2 max-h-screen overflow-y-auto space-y-2">
        <h3 className="text-2xl font-semibold">Featured Product</h3>
        <h4 className="text-xl font-semibold">Mud and mirror art</h4>
        <p className="text-lg font-medium">$55.00</p>
        <p className="mb-4 leading-relaxed">
          Krishna lippan art, wall decor, good gift, good vibes, Indian folk
          art, handmade, home decor.
        </p>
        <ul className="text-gray-600 text-base space-y-1">
          <li>
            <strong>Material:</strong> Genuine leather
          </li>
          <li>
            <strong>Dimensions:</strong> 12 x 9 x 2 cm
          </li>
          <li>
            <strong>Weight:</strong> 150 grams
          </li>
          <li>
            <strong>Color:</strong> Dark brown
          </li>
          <li>
            <strong>Stock:</strong> 18
          </li>
          <li>
            <strong>Brand:</strong> Urban Style
          </li>
          <li>
            <strong>Warranty:</strong> 1 year
          </li>
          <li>
            <strong>Care:</strong> Avoid water, clean with leather conditioner.
          </li>
        </ul>

        <div className="mt-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Upload Video:
          </label>
          <input
            type="file"
            accept="video/*"
            multiple
            onChange={handleUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>
      </div>

      {/* Right Panel: Videos */}
      <div className="lg:w-1/2 max-h-screen overflow-y-auto space-y-6">
        {videos.map(({ id, url, title }) => {
          const isYouTube =
            url.includes("youtube.com") || url.includes("youtu.be");
          const youtubeId = extractYouTubeId(url);

          return (
            <div key={id} className="rounded-lg overflow-hidden shadow-lg">
              {isYouTube && youtubeId ? (
                <iframe
                  className="w-full aspect-video"
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
                  className="w-full h-auto block rounded-lg"
                  aria-label={`Creative video: ${title}`}
                />
              )}
              <div className="p-2 bg-gray-100 text-gray-700 font-medium text-center text-base">
                {title}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
