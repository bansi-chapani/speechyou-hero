/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        // vertical marquee: one copy scrolls a full height, the duplicate
        // backfills, so the seam is invisible. Ported from
        // 21st.dev/lyanchouss/cta-with-text-marquee.
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
      },
      animation: {
        // --duration is set inline per instance (default 30s, as the reference)
        "marquee-vertical":
          "marquee-vertical var(--duration, 30s) linear infinite",
      },
    },
  },
  plugins: [],
};
