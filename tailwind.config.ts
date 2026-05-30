import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050510",
        green: "#00ff41",
        purple: "#7c3aed",
        red: "#ff003c",
        gold: "#f59e0b",
        text: "#e8e8f0",
        muted: "#4a4a6a",
        glass: "rgba(8, 8, 20, 0.75)",
      },
      borderColor: {
        glass: "rgba(255, 255, 255, 0.06)",
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Syne"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};

export default config;
