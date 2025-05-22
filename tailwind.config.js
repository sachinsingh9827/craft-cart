/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#004080",
      },
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        lora: ["Lora", "serif"],
        "open-sans": ['"Open Sans"', "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(-5%)" },
          "50%": { transform: "translateY(0)" },
        },
      },
      animation: {
        bounceIn: "bounceIn 1s ease-in-out infinite",
        rotate: "rotate 2s linear infinite",
        fadeIn: "fadeIn 1.5s ease-out forwards",
        fadeOut: "fadeOut 1s ease-out forwards",
        slideUp: "slideUp 1s ease-out forwards",
        slideDown: "slideDown 1s ease-out forwards",
        slideLeft: "slideLeft 1s ease-out forwards",
        slideRight: "slideRight 1s ease-out forwards",
        zoomIn: "zoomIn 0.5s ease-in-out forwards",
        zoomOut: "zoomOut 0.5s ease-in-out forwards",
        wiggle: "wiggle 1s ease-in-out infinite",
        heartbeat: "heartbeat 1.5s ease-in-out infinite",
        flash: "flash 1.2s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        swing: "swing 1s ease-in-out infinite",
        bounce: "bounce 1s infinite",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
      });
    },
  ],
};
