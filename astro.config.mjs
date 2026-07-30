import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  site: "https://crownstudio-1337.vercel.app",
  output: "static",
  vite: {
    server: {
      fs: {
        allow: ['..']
      }
    }
  }
});