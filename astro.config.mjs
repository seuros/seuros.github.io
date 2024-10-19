import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import cloudflare from "@astrojs/cloudflare";
import tailwind from "@astrojs/tailwind";


const baseConfig = {
  site: "https://seuros.com",
  integrations: [mdx(), sitemap(), tailwind()],
  image: { service: passthroughImageService() },
};

const config = process.env.CI
  ? {
      ...baseConfig,
      output: "dist",
    }
  : {
      ...baseConfig,
      adapter: cloudflare({ imageService: "cloudflare" }),
      output: "server",
    };

// https://astro.build/config
export default defineConfig(config);
