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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          hover: "var(--primary-hover)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: "var(--muted)",
        accent: "var(--accent)",
        destructive: "var(--destructive)",
        success: "var(--success)",
        
        // Midnight Cinematic Palette
        deepAnchor: {
          DEFAULT: "#000000",
          alt1: "#141414",
          alt2: "#0A0A0A",
        },
        sapphire: {
          DEFAULT: "#1E3A8A",
          alt: "#0F3460",
        },
        neutral: {
          cream: "#E7E2D9",
          grayBeige: "#F4F1EB",
        },
        brass: {
          DEFAULT: "#2563EB",
          alt: "#3B82F6",
        }
      },
      fontFamily: {
        heading: ["Zodiak", "Didot", "Bodoni", "serif"],
        body: ["Satoshi", "Inter", "Poppins", "sans-serif"],
        mono: ["JetBrains Mono", "IBM Plex Mono", "Space Mono", "monospace"],
        slab: ["Neue Machina", "General Sans", "Archivo Black", "sans-serif"],
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      }
    },
  },
  plugins: [],
};
export default config;
