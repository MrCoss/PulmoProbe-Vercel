/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // Your custom color palette is perfect for a consistent design system.
      colors: {
        primary: '#1e3a8a', // A strong, professional blue
        accent: '#f97316',  // A vibrant orange for highlights and CTAs
        background: '#f8fafc', // A soft, clean background (slate-50)
        text: '#111827',     // A dark, readable text color (gray-900)
        secondary: '#e5e7eb', // A light gray for borders and dividers
      },
      // We set 'Inter' as the default font to match our index.html
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  // We add the official forms plugin for beautiful default form styles.
  plugins: [
    require('@tailwindcss/forms'),
  ],
};