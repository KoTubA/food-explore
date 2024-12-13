import type { Config } from "tailwindcss";

export default {
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}", "./src/components/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primaryRed: "hsl(10, 92%, 66%)",
        primaryGreen: "hsl(145, 67%, 45%)",
        primaryYellow: "hsl(47, 96%, 66%)",
        secondaryYellow: "hsl(35, 82%, 57%)",
        titleText: "hsl(0, 0%, 23%)",
        bodyText: "hsl(0, 0%, 53%)",
      },
      fontFamily: {
        lato: ["var(--font-lato)"],
        roboto: ["var(--font-roboto)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
