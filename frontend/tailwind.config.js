/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#1C2B2B',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#2E6B5E',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F4F4F4',
          foreground: '#1C2B2B'
        },
        background: '#FFFFFF',
        foreground: '#1C2B2B',
        muted: {
          DEFAULT: '#F4F4F4',
          foreground: '#64748B'
        },
        border: '#E2E8F0',
        input: '#E2E8F0',
        ring: '#2E6B5E',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem'
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};
