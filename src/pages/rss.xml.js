import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const posts = await getCollection("blog");
  return rss({
    title: "Seuros Blog",
    description: "Latest posts from Seuros Blog",
    site: context.site || "https://www.seuros.com",
    items: posts
      .sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate))
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/blog/${post.slug}/`,
        author: post.data.author,
        enclosure: post.data.image?.url
          ? { url: post.data.image.url, type: "image/png" }
          : undefined,
      })),
  });
}
