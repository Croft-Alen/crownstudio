/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"
  ],
  theme: {
    extend: {
      colors: {
        "brand": "#E89209",
"page-bg": "#F2F3F5",
"card-bg": "#FAFAFA",
        "border": "#E5E7EB",
        "text-heading": "#111827",
        "text-body": "#1F2937",
        "text-muted": "#6B7280",
      },
      fontFamily: {
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};