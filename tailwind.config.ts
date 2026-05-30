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
        background: "#0a0a0a",
        green: "#00ff41",
        purple: "#7c3aed",
        red: "#ff003c",
        text: "#e0e0e0",
        muted: "#888888",
        glass: "rgba(12, 12, 12, 0.88)",
      },
      borderColor: {
        glass: "rgba(255, 255, 255, 0.07)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backdropBlur: {
        glass: "14px",
      },
    },
  },
  plugins: [],
};

export default config;
