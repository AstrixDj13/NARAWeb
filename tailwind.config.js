/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';
import typography from "@tailwindcss/typography";
import scrollbarHide from "tailwind-scrollbar-hide";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["outfit", "monospace"],
        antikor: ["Antikor Mono", "monospace"],
      },
      screens: {
        xs: "475px", // Custom extra small screen
        sm: "640px", // Tailwind's default small screen
        md: "768px", // Tailwind's default medium screen
        tb: "1367px",
        lg: "1024px", // Tailwind's default large screen
        xl: "1280px", // Tailwind's default extra large screen
        "2xl": "1536px", // Tailwind's default 2x extra large screen
        "3xl": "1920px", // Custom 3x extra large screen
      },
      utilities: {
        ".all-unset": {
          all: "revert",
        },
      },
      cursor: {
        custom: "url(/icons/cursor.png), auto",
      },
    },
  },

  plugins: [
    aspectRatio,
    typography,
    scrollbarHide
  ],
};
