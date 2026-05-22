import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7a2e2e",
          dark: "#4a1f1f",
          soft: "#f7ece7"
        },
        ink: "#211c18"
      }
    }
  },
  plugins: []
};

export default config;
