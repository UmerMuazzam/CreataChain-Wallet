import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#0989FF",
        topHeadingPrimary: "#0101fc",
        topHeadingSecondary: "#021d35",
        pink: "#FD4B6B",
        blue: "#013EB7",
      },
      container: {
        center: true,
        padding: "15px",
      },
    },
  },
  plugins: [],
};
export default config;
