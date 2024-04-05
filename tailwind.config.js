/** @type {import('tailwindcss').Config} */

import typos from './src/theme/typos';
import colors from './src/theme/colors';
import buttons from './src/theme/buttons';

export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      gap: {
        0.5: '.125rem',
        1.5: '.375rem',
      },
      fontFamily: {
        suite: 'SUITE Variable',
      },
      keyframes: {
        fadeDown: {
          from: {
            opacity: 0,
            transform: 'translateY(-1.5rem)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        'fade-down': 'fadeDown 0.5s linear',
      },
    },
    colors: colors,
  },
  plugins: [
    ({ addUtilities, addComponents }) => {
      addUtilities(typos);
      addComponents(buttons);
    },
  ],
};
