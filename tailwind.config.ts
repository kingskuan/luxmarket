import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        lux: {
          bg: "#0a0a12",
          card: "#14141f",
          gold: "#d4af37",
          up: "#10b981",
          down: "#ef4444",
        },
      },
    },
  },
  plugins: [],
};
export default config;
