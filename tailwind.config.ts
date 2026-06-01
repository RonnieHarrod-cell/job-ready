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
        // Core palette
        bg: {
          primary: "#0A0A0F",
          secondary: "#111118",
          tertiary: "#16161F",
          card: "#1A1A25",
          hover: "#1F1F2E",
        },
        border: {
          subtle: "#1E1E2E",
          default: "#2A2A3D",
          strong: "#3A3A55",
        },
        accent: {
          DEFAULT: "#6C63FF",
          hover: "#7B74FF",
          muted: "#6C63FF20",
          glow: "#6C63FF40",
        },
        emerald: {
          glow: "#10B98140",
        },
        text: {
          primary: "#F0EFF8",
          secondary: "#9B9AB0",
          muted: "#5A5972",
          inverse: "#0A0A0F",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#6C63FF",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "Menlo", "monospace"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(ellipse at center, rgba(108,99,255,0.12) 0%, transparent 70%)",
        "card-gradient":
          "linear-gradient(135deg, #1A1A25 0%, #16161F 100%)",
      },
      backgroundSize: {
        "grid-sm": "32px 32px",
        "grid-md": "48px 48px",
      },
      boxShadow: {
        "accent-sm": "0 0 20px rgba(108,99,255,0.15)",
        "accent-md": "0 0 40px rgba(108,99,255,0.2)",
        "card": "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover": "0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(108,99,255,0.1)" },
          "100%": { boxShadow: "0 0 40px rgba(108,99,255,0.3)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;