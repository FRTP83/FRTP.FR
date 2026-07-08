import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        frtp: {
          blue: "#294F9B",
          blueDark: "#18356F",
          orange: "#B96812",
          orangeDark: "#874708",
          black: "#121418",
          gray: "#EEF1F3",
          text: "#2B3037",
          steel: "#DDE3E8",
          mist: "#F6F8F9",
          graphite: "#1A1D22"
        }
      },
      fontFamily: {
        sans: ["var(--font-body)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial", "sans-serif"],
        mono: ["Consolas", "monospace"]
      },
      boxShadow: {
        technical: "0 24px 70px -42px rgba(18, 20, 24, 0.42)",
        lifted: "0 18px 45px -30px rgba(24, 53, 111, 0.38)"
      }
    }
  },
  plugins: []
};

export default config;
