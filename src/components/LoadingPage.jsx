import React from "react";

const LoadingPage = ({ theme = "light", type = "spinner" }) => {
  const bgClass = theme === "dark" ? "bg-gray-900" : "";
  const textClass = theme === "dark" ? "text-white" : "text-yellow-400";
  const spinnerColor = theme === "dark" ? "text-yellow-400" : "text-blue-600";

  const renderLoader = () => {
    switch (type) {
      case "dots":
        return (
          <div className="flex space-x-2 mt-2">
            <div
              className={`w-4 h-4 rounded-full ${spinnerColor} animate-bounce`}
            />
            <div
              className={`w-4 h-4 rounded-full ${spinnerColor} animate-bounce`}
              style={{ animationDelay: "0.2s" }}
            />
            <div
              className={`w-4 h-4 rounded-full ${spinnerColor} animate-bounce`}
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        );
      case "bar":
        return (
          <div className="w-48 h-2 bg-gray-200 dark:bg-gray-700 overflow-hidden rounded mt-2">
            <div className={`h-2 ${spinnerColor} animate-pulse w-full`} />
          </div>
        );
      case "circle":
      default:
        return (
          <svg
            className={`animate-spin h-16 w-16 ${spinnerColor}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        );
    }
  };

  return (
    <div
      className={`${bgClass} ${textClass} flex flex-col items-center justify-center`}
    >
      {renderLoader()}
      <p className="mt-4 text-xl font-semibold uppercase">Loading...</p>
    </div>
  );
};

export default LoadingPage;
