import type { Config } from "tailwindcss";
const withMT = require("@material-tailwind/react/utils/withMT");

const config: Config = withMT({
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        switzer: ["Switzer"],
      },
      colors: {
        "very-dark-grayish-blue": "#282833",
        "grayish-blue": "#6F6F76",
      },
      boxShadow: {
        custom: "0px 4px 30px 0px rgba(80, 88, 159, 0.2)",
        custom2: "0px 0px 50px 0px rgba(80, 88, 159, 0.2)",
        custom3 : "0px 0px 20px 0px rgba(80, 88, 159, 0.102)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      placeholderColor: {
        "custom-gray": "#363641",
      },
    },
  },
  plugins: [
    // Any additional plugins you want to include
    // require('tailwind-scrollbar')({ noncompatible: true }),
  ],
});

export default config;
