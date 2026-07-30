import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [tailwind()],
  site: "https://crownstudio-1337.vercel.app",
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  build: {
    client: ".vercel/output/static",
    server: ".vercel/output/functions/server"
  }
});