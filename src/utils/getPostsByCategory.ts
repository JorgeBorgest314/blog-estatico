import type { CollectionEntry } from "astro:content";
import { getSortedPosts } from "./getSortedPosts";
import type { CategorySlug } from "./categories";

export function getPostsByCategory(
  posts: CollectionEntry<"posts">[],
  category: CategorySlug
) {
  return getSortedPosts(posts.filter(({ data }) => data.category === category));
}
