import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

const baseConfig = {
  site: "https://seuros.com",
  integrations: [mdx(), sitemap(), tailwind()],
  image: { service: passthroughImageService() },
};

// https://astro.build/config
export default defineConfig({
  ...baseConfig,
  output: "static",
});
