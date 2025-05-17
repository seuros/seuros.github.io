import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rss from "@astrojs/rss";

const baseConfig = {
  site: "https://seuros.com",
  integrations: [mdx(), sitemap(), tailwind(), rss()],
  image: { service: passthroughImageService() },
};

// https://astro.build/config
export default defineConfig({
  ...baseConfig,
  output: "static",
});
