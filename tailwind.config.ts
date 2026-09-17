import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* shadcn-compatible tokens (driven by CSS variables in globals.css) */
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        bg: {
          DEFAULT: "#FFFBF2",
          soft: "#FEF3C7",
          muted: "#FDE9B8",
        },
        ink: {
          /* Move 1: primary text shifts to true near-black for a warm/cold
             pairing against the cream background. Soft + muted stay warm
             brown — the temperature break IS the design move. */
          DEFAULT: "#0A0A0A",
          soft: "#451A03",
          muted: "#78350F",
        },
        /* Move 1: signature accent — deep bottle green. Used <2% of surface
           area, only on functional indicators (in-stock, "what happens next"
           bullets, fulfilled order chips). The single non-warm color in the
           system, which is what makes it read as deliberate. */
        forest: {
          DEFAULT: "#0F3D2E",
          soft: "#C8DCD0",
        },
        brand: {
          50: "#FEF7E6",
          100: "#FDECC4",
          200: "#FBD78A",
          300: "#F7BC4F",
          400: "#F1A12A",
          500: "#D97706",
          600: "#B45309",
          700: "#92400E",
          800: "#78350F",
          900: "#451A03",
        },
        gold: {
          /* Move 1: candy amber-400 swapped for aged brass. Less SaaS,
             more architecture. Soft stays cream-gold for text on dark surfaces. */
          DEFAULT: "#B08D57",
          dark: "#8B6F3F",
          soft: "#FDE68A",
        },
        line: "#EADBB6",
      },
      fontFamily: {
        display: ["Rubik", "system-ui", "sans-serif"],
        sans: ["Nunito Sans", "system-ui", "sans-serif"],
        editorial: ["Fraunces", "Georgia", "serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      transitionTimingFunction: {
        overshoot: "cubic-bezier(0.34, 1.56, 0.64, 1)",
        editorial: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(120, 53, 15, 0.12)",
        glow: "0 8px 32px -4px rgba(251, 191, 36, 0.35)",
        card: "0 1px 2px rgba(120, 53, 15, 0.06), 0 8px 24px -12px rgba(120, 53, 15, 0.15)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 400ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
