import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./i18n/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--c-primary)",
        brand: "var(--c-brand)",
        navy: "var(--c-navy)",
        accent: "var(--c-accent)",
        paper: "var(--c-paper)",
        mist: "var(--c-mist)",
        wash: "var(--c-wash)",
        ink: "var(--c-ink)",
        muted: "var(--c-muted)",
        mute: "var(--c-mute)",
        line: "var(--c-line)",
        ice: "var(--c-ice)",
        slate: "var(--c-slate)",
      },
    },
  },
};

export default config;
