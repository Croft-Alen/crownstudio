import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  integrations: [tailwind()],
  site: "https://crownstudio.com",
  output: "server",
  vite: {
    server: {
      fs: {
        allow: ['..']
      }
    }
  }
});