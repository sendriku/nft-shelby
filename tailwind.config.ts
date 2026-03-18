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
        void: "#030508",
        obsidian: "#0a0d14",
        carbon: "#111520",
        slate: "#1a1f2e",
        frost: {
          DEFAULT: "#4df0ff",
          dim: "#1a9aaa",
          faint: "#0d2d33",
        },
        gold: {
          DEFAULT: "#e8b84b",
          bright: "#f5d06e",
          dim: "#8a6a1f",
        },
        ash: {
          100: "#c8cdd8",
          200: "#8892a4",
          300: "#4a5268",
          400: "#252a3a",
        },
      },
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        mono: ["'JetBrains Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(77,240,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(77,240,255,0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(77,240,255,0.08) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(26,31,46,0.9) 0%, rgba(10,13,20,0.95) 100%)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 8s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.4s ease-out forwards",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 20px rgba(77,240,255,0.3)" },
          "50%": { opacity: "0.7", boxShadow: "0 0 40px rgba(77,240,255,0.6)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      boxShadow: {
        "glow-frost": "0 0 30px rgba(77,240,255,0.25), 0 0 60px rgba(77,240,255,0.1)",
        "glow-gold": "0 0 30px rgba(232,184,75,0.25), 0 0 60px rgba(232,184,75,0.1)",
        "inner-frost": "inset 0 1px 0 rgba(77,240,255,0.1)",
        card: "0 4px 40px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)",
      },
      borderColor: {
        "frost-dim": "rgba(77,240,255,0.15)",
        "frost-bright": "rgba(77,240,255,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
