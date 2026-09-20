import type { CollectionEntry } from "astro:content";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";

export type Series = {
  slug: string;
  name: string;
  posts: CollectionEntry<"posts">[];
};

export function getSeries(posts: CollectionEntry<"posts">[]): Series[] {
  const bySlug = new Map<string, Series>();

  for (const post of posts.filter(postFilter)) {
    const name = post.data.series;
    if (!name) continue;
    const slug = slugifyStr(name);
    const series = bySlug.get(slug) ?? { slug, name, posts: [] };
    series.posts.push(post);
    bySlug.set(slug, series);
  }

  return [...bySlug.values()]
    .map(series => ({ ...series, posts: sortBySeriesOrder(series.posts) }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function findSeriesOfPost(
  allSeries: Series[],
  post: CollectionEntry<"posts">
) {
  if (!post.data.series) return undefined;
  const slug = slugifyStr(post.data.series);
  return allSeries.find(series => series.slug === slug);
}

function sortBySeriesOrder(posts: CollectionEntry<"posts">[]) {
  return [...posts].sort(
    (a, b) =>
      (a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) -
        (b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER) ||
      a.data.pubDatetime.getTime() - b.data.pubDatetime.getTime()
  );
}
