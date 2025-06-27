import React, { useState } from "react";
import Button from "./Button";

const Pagination = ({ page, totalPages, onPageChange, loading }) => {
  const [startIndex, setStartIndex] = useState(0);
  const maxVisiblePages = 3;

  const getVisiblePages = () => {
    const pages = [];
    const end = Math.min(startIndex + maxVisiblePages, totalPages);
    for (let i = startIndex + 1; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleScrollLeft = () => {
    if (startIndex > 0) setStartIndex(startIndex - 1);
  };

  const handleScrollRight = () => {
    if (startIndex + maxVisiblePages < totalPages)
      setStartIndex(startIndex + 1);
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className="mt-6 flex flex-wrap justify-center items-center gap-2"
    >
      {/* Previous Button */}
      <Button
        aria-label="Previous page"
        disabled={page === 1 || loading}
        onClick={() => onPageChange(page - 1)}
        className="px-2 py-1.5 rounded sm:px-2 sm:py-2 sm:w-auto w-15 text-sm sm:text-base"
        bgColor={page === 1 || loading ? "bg-gray-400" : "bg-[#004080]"}
        hoverBgColor={page === 1 || loading ? "" : "hover:bg-gray-700"}
        textColor={page === 1 || loading ? "text-gray-700" : "text-yellow-400"}
        darkBgColor={page === 1 || loading ? "" : "dark:bg-gray-700"}
        darkHoverBgColor={
          page === 1 || loading ? "" : "dark:hover:bg-[#004080]"
        }
        darkTextColor={page === 1 || loading ? "" : "dark:text-yellow-400"}
      >
        Prev
      </Button>

      {/* Scroll Left Button */}
      {totalPages > maxVisiblePages && (
        <Button
          onClick={handleScrollLeft}
          disabled={startIndex === 0}
          className="px-2 py-1.5 rounded sm:px-2 sm:py-2 sm:w-auto w-15 text-sm sm:text-base"
          bgColor="bg-gray-200"
          hoverBgColor="hover:bg-gray-300"
          textColor="text-gray-800"
          darkBgColor="dark:bg-gray-700"
          darkHoverBgColor="dark:hover:bg-gray-600"
          darkTextColor="dark:text-gray-300"
        >
          &lt;
        </Button>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-2 overflow-x-auto max-w-[180px] sm:max-w-none">
        {getVisiblePages().map((pageNumber) => {
          const isActive = pageNumber === page;
          return (
            <Button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              disabled={loading}
              className="w-10 h-10 flex items-center justify-center rounded border text-sm sm:text-base"
              bgColor={isActive ? "bg-[#004080]" : "bg-white"}
              hoverBgColor={
                isActive ? "hover:bg-gray-700" : "hover:bg-gray-200"
              }
              textColor={isActive ? "text-yellow-400" : "text-gray-800"}
              darkBgColor={isActive ? "dark:bg-[#004080]" : "dark:bg-gray-800"}
              darkHoverBgColor={
                isActive ? "dark:hover:bg-[#003366]" : "dark:hover:bg-gray-600"
              }
              darkTextColor={
                isActive
                  ? "dark:text-yellow-400 dark:bg-[#004080]"
                  : "dark:text-gray-300"
              }
            >
              {pageNumber}
            </Button>
          );
        })}
      </div>

      {/* Scroll Right Button */}
      {totalPages > maxVisiblePages && (
        <Button
          onClick={handleScrollRight}
          disabled={startIndex + maxVisiblePages >= totalPages}
          className="px-2 py-1.5 rounded sm:px-2 sm:py-2 sm:w-auto w-15 text-sm sm:text-base"
          bgColor="bg-gray-200"
          hoverBgColor="hover:bg-gray-300"
          textColor="text-gray-800"
          darkBgColor="dark:bg-gray-700"
          darkHoverBgColor="dark:hover:bg-gray-600"
          darkTextColor="dark:text-gray-300"
        >
          &gt;
        </Button>
      )}

      {/* Next Button */}
      <Button
        aria-label="Next page"
        disabled={page === totalPages || totalPages === 0 || loading}
        onClick={() => onPageChange(page + 1)}
        className="px-2 py-1.5 rounded sm:px-2 sm:py-2 sm:w-auto w-15 text-sm sm:text-base"
        bgColor={
          page === totalPages || totalPages === 0 || loading
            ? "bg-gray-400"
            : "bg-[#004080]"
        }
        hoverBgColor={
          page === totalPages || totalPages === 0 || loading
            ? ""
            : "hover:bg-gray-700"
        }
        textColor={
          page === totalPages || totalPages === 0 || loading
            ? "text-gray-700"
            : "text-yellow-400"
        }
        darkBgColor={
          page === totalPages || totalPages === 0 || loading
            ? ""
            : "dark:bg-gray-700"
        }
        darkHoverBgColor={
          page === totalPages || totalPages === 0 || loading
            ? ""
            : "dark:hover:bg-[#004080]"
        }
        darkTextColor={
          page === totalPages || totalPages === 0 || loading
            ? ""
            : "dark:text-yellow-400"
        }
      >
        Next
      </Button>
    </nav>
  );
};

export default Pagination;
