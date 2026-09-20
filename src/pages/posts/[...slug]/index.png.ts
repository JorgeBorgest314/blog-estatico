import type { APIRoute } from "astro";
import { getCollection, type CollectionEntry } from "astro:content";
import { getPostSlug } from "@/utils/getPostPaths";
import { CATEGORIES } from "@/utils/categories";
import { renderOgImage } from "@/utils/ogImage";
import config from "@/config";

export async function getStaticPaths() {
  if (!config.features.dynamicOgImage) return [];
  const posts = await getCollection("posts").then(entries =>
    entries.filter(({ data }) => !data.draft && !data.ogImage)
  );
  return posts.map(post => ({
    params: { slug: getPostSlug(post.id, post.filePath) },
    props: post,
  }));
}

export const GET: APIRoute<CollectionEntry<"posts">> = ({ props, url }) =>
  renderOgImage(
    {
      label: CATEGORIES[props.data.category].name,
      title: props.data.title,
      footer: props.data.author,
    },
    url
  );
