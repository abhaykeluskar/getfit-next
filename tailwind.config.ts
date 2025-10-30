import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  extend: {
    colors: {
      primary: {
        50: "#EEF2FF",
        100: "#E0E7FF",
        500: "#6366F1",
        600: "#4F46E5",
        700: "#4338CA",
      },
    },
  },
};

export default config;
