import React from "react";

const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
  bgColor = "bg-[#004080]", // default bg blue
  hoverBgColor = "hover:bg-gray-700", // default hover blue gray
  darkBgColor = "dark:bg-gray-700", // default dark bg
  darkHoverBgColor = "dark:hover:bg-[#004080]", // default dark hover
  textColor = "text-yellow-400",
  darkTextColor = "dark:text-yellow-400",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${bgColor} ${hoverBgColor}
        ${darkBgColor} ${darkHoverBgColor}
        ${textColor} ${darkTextColor}
        px-5 py-2 rounded
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
