import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  site: "https://seuros.com",
  integrations: [mdx(), sitemap()],
  adapter: cloudflare({ imageService: "cloudflare" }),
  image: { service: passthroughImageService() },
  output: "server",
});
