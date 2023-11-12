/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        neue: ['"Neue Machina"'],
        space: ['"Space Grotesk"'],
      },
      colors: {
        dark: "#232120",
        darker: "#131313",
        "dark-light": "#434343",
        "dark-lighter": "#B9B9B9",
      },
    },
  },
  plugins: [],
};
