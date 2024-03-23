/** @type {import('tailwindcss').Config} */

import typos from "./src/theme/typos";
import colors from "./src/theme/colors";

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: colors,
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities(typos);
    },
  ],
};
