import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";

export default defineConfig({
  integrations: [tailwind()],
  site: "https://crownstudio.com",
  output: "server",
  adapter: vercel({
    runtime: 'nodejs18.x',
  }),
  vite: {
    server: {
      fs: {
        allow: ['..']
      }
    }
  }
});