/** @type {import('tailwindcss').Config} */

import typos from "./src/theme/typos";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities(typos);
    },
  ],
};
