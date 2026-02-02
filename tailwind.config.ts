import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class", ".dark"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "sm": "640px",   // Auth pages
        "md": "768px",   // Default content
        "lg": "1024px",  // Wide content
        "xl": "1280px",  // Full dashboard
        "2xl": "1536px", // Max width
      },
    },
    extend: {
      colors: {
        // Primary: Orange
        primary: {
          DEFAULT: "#F97316", // orange-500
          hover: "#EA580C",   // orange-600
          active: "#C2410C",  // orange-700
          soft: "#FFF7ED",    // orange-50
          foreground: "#FFFFFF",
        },
        // Background: Paper & Graphite
        background: {
          DEFAULT: "#FFFFFF",
          subtle: "#F9FAFB",  // gray-50
          muted: "#F3F4F6",   // gray-100
          dark: "#18181B",    // zinc-900
        },
        // Foreground: Graphite Text
        foreground: {
          DEFAULT: "#18181B",  // zinc-900
          muted: "#52525B",    // zinc-600
          subtle: "#A1A1AA",   // zinc-400
          inverse: "#FAFAFA",  // zinc-50
        },
        // Semantic Colors
        success: {
          DEFAULT: "#10B981",  // emerald-500
          soft: "#ECFDF5",     // emerald-50
        },
        warning: {
          DEFAULT: "#F59E0B",  // amber-500
          soft: "#FFFBEB",     // amber-50
        },
        error: {
          DEFAULT: "#EF4444",  // red-500
          soft: "#FEF2F2",     // red-50
        },
        info: {
          DEFAULT: "#3B82F6",  // blue-500
          soft: "#EFF6FF",     // blue-50
        },
        // Border Colors
        border: {
          DEFAULT: "#E5E7EB",  // gray-200
          strong: "#D1D5DB",   // gray-300
          focus: "#F97316",    // orange-500
          dark: "#27272A",     // zinc-800
        },
      },
      borderRadius: {
        lg: "8px",    // Buttons, inputs
        xl: "12px",   // Cards
        "2xl": "16px" // Modals
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "display": ["60px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h1": ["48px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "h2": ["36px", { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "600" }],
        "h3": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        "body-lg": ["18px", { lineHeight: "1.6" }],
        "body": ["16px", { lineHeight: "1.5" }],
        "body-sm": ["14px", { lineHeight: "1.5" }],
        "caption": ["12px", { lineHeight: "1.4", letterSpacing: "0.01em", fontWeight: "500" }],
      },
      boxShadow: {
        glow: "0 0 0 3px rgba(249, 115, 22, 0.3)",
        "glow-lg": "0 0 20px rgba(249, 115, 22, 0.2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
