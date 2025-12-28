/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'unibridge-blue': '#2563a8',
        'unibridge-navy': '#1e3a5f',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'serif': ['Playfair Display', 'Georgia', 'Times New Roman', 'serif'],
        'display': ['Playfair Display', 'Georgia', 'serif'],
        'script': ['Dancing Script', 'cursive'],
        'body-serif': ['Crimson Text', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
