/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Rutas donde buscar las clases
  ],
  theme: {
    extend: {
      colors: {
        // Base
        white: "#FFFFFF",
        light: "#F8F8F8",
        lighter: "#F5F5F5",
        lightest: "#F4F4F4",

        // Primary colors
        primary: "#1965B3",
        "primary-light": "#3785D8",
        "primary-dark": "#1C1DAB",
        "primary-deep": "#1E0F75",

        // Grayscale
        gray: "#CCCCCC",
        "gray-dark": "#999999",
        "gray-darker": "#333333",
        "gray-deep": "#2A2A2A",

        // Accent Blues
        "blue-100": "#E6F0F7",
        "blue-200": "#E0E9F5",
        "blue-300": "#CBD8E8",
        "blue-400": "#ADC6E5",

        // Accent Pinks / Purples
        "pink-light": "#EBB2C3",
        pink: "#E893C5",
        purple: "#BF8CE1",
      },
    },
  },
  plugins: [],
};
