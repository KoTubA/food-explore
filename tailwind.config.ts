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
        darkGray: "hsl(0, 0%, 23%)",
        mediumGray: "hsl(0, 0%, 53%)",
        lightGray: "hsl(0, 0%, 91%)",
        veryLightGray: "hsl(0, 0%, 98%)",
      },
      fontFamily: {
        lato: ["var(--font-lato)"],
        roboto: ["var(--font-roboto)"],
      },
      animation: {
        bounceOnce: "bounce 1.2s 1",
        fadeIn: "fadeIn 0.15s ease-in",
      },
      keyframes: {
        bounce: {
          "0%": {
            transform: "translateY(-25%)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0, 0, 0.2, 1)",
          },
          "75%": {
            transform: "translateY(-15%)",
            animationTimingFunction: "cubic-bezier(1, 0, 1, 1)",
          },
          "100%": {
            transform: "translateY(0)",
            animationTimingFunction: "cubic-bezier(0.8, 0, 1, 1)",
          },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
