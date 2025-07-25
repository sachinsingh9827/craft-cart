import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const VideoUploader = ({ orderId, deliveryBoyId, onUploadSuccess }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("video/")) {
      if (file.size > 100 * 1024 * 1024) {
        toast.error("Video size should be under 100MB.");
        return;
      }
      setVideoFile(file);
    } else {
      toast.error("Please upload a valid video file.");
      setVideoFile(null);
    }
  };

  const handleUpload = async () => {
    if (!videoFile) {
      toast.error("Please select a video first.");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("video", videoFile);
    formData.append("deliveryBoyId", deliveryBoyId);

    setUploading(true);
    try {
      const response = await axios.post(
        `https://craft-cart-backend.vercel.app/api/delivery-video/upload/${orderId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Video uploaded successfully!");

        const uploadedData = response.data.data?.video;
        if (uploadedData) {
          setUploadedVideo(uploadedData);
          onUploadSuccess(); // notify parent
        }

        setVideoFile(null);
      } else {
        toast.error(response.data.message || "Upload failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload video.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-gray-300 rounded p-4 bg-gray-100">
      {!uploadedVideo?.url && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="text-sm"
          />
          <button
            onClick={handleUpload}
            disabled={uploading || !videoFile}
            className={`px-4 py-2 text-white rounded ${
              uploading || !videoFile
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {uploading ? "Uploading..." : "Upload Video"}
          </button>
        </div>
      )}

      {uploadedVideo?.url && (
        <div className="mt-4">
          <p className="text-sm font-medium text-green-600 mb-1">
            Uploaded Video Preview:
          </p>
          <video
            src={uploadedVideo.url}
            controls
            className="w-full max-w-md rounded shadow"
          />
          <p className="text-xs text-gray-600 mt-1 break-all">
            Cloudinary ID: {uploadedVideo.public_id}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoUploader;
