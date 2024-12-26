import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pastelBlue: '#B3CDE0',   // Pastel blue
        pastelGreen: '#A8D5BA',  // Pastel green
        pastelDarkGreen: '#80B79B', // Dark pastel green
        pastelIndigo: '#D0A9F5', // Pastel indigo
        pastelPink: '#F7B7A3',   // Pastel pink
        pastelPurple: "#d0a6f0", // pastel pur
      },
    },
  },
  plugins: [],
} satisfies Config;
