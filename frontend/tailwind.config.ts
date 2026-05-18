import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terminal: { bg: "#0B1020", card: "#11182D", border: "#1F2A44" },
        bull: "#22C55E",
        bear: "#EF4444",
        warn: "#EAB308",
        info: "#3B82F6"
      }
    }
  },
  plugins: []
} satisfies Config;
