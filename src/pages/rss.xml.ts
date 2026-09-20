import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { getSortedPosts } from "@/utils/getSortedPosts";
import { getPostUrl } from "@/utils/getPostPaths";
import { CATEGORIES } from "@/utils/categories";
import config from "@/config";

export async function GET() {
  const posts = await getCollection("posts");
  const sortedPosts = getSortedPosts(posts);

  return rss({
    title: config.site.title,
    description: config.site.description,
    site: config.site.url,
    xmlns: { content: "http://purl.org/rss/1.0/modules/content/" },
    customData: `<language>${config.site.lang.toLowerCase()}</language>`,
    items: sortedPosts.map(({ data, id, filePath, rendered }) => ({
      link: getPostUrl(id, filePath, config.site.lang),
      title: data.title,
      description: data.description,
      pubDate: new Date(data.modDatetime ?? data.pubDatetime),
      categories: [CATEGORIES[data.category].name, ...data.tags],
      content: rendered?.html,
    })),
  });
}
