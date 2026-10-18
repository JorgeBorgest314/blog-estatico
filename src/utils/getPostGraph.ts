import type { CollectionEntry } from "astro:content";
import { getRelativeLocaleUrl } from "astro:i18n";
import { CATEGORIES, type CategorySlug } from "./categories";
import { getPostUrl } from "./getPostPaths";
import { postFilter } from "./postFilter";
import { slugifyStr } from "./slugify";
import config from "@/config";

export type GraphNodeKind = "post" | "category" | "tag";

export type GraphNode = {
  /** unique id, prefixed by kind: `post:slug`, `tag:slug`, `category:slug` */
  id: string;
  kind: GraphNodeKind;
  label: string;
  url: string;
  /** how many links touch the node — drives the circle radius */
  degree: number;
  /** category of the post, or the category itself; absent on tags */
  category?: CategorySlug;
};

export type GraphLink = {
  source: string;
  target: string;
};

export type PostGraph = {
  nodes: GraphNode[];
  links: GraphLink[];
};

/**
 * Builds the post/category/tag graph rendered on `/graph/`.
 *
 * Posts link to their category and to each of their tags, so tags shared by
 * two posts pull them together — the same structure Obsidian's graph view
 * draws from a vault.
 *
 * Drafts and scheduled posts are excluded via `postFilter()`.
 */
export function getPostGraph(
  posts: CollectionEntry<"posts">[],
  locale: string = config.site.lang
): PostGraph {
  const nodes = new Map<string, GraphNode>();
  const links: GraphLink[] = [];

  const addNode = (node: Omit<GraphNode, "degree">) => {
    if (!nodes.has(node.id)) nodes.set(node.id, { ...node, degree: 0 });
    return node.id;
  };

  const addLink = (source: string, target: string) => {
    links.push({ source, target });
    for (const id of [source, target]) {
      const node = nodes.get(id);
      if (node) node.degree += 1;
    }
  };

  for (const post of posts.filter(postFilter)) {
    const { title, category, tags } = post.data;

    const postId = addNode({
      id: `post:${post.id}`,
      kind: "post",
      label: title,
      url: getPostUrl(post.id, post.filePath, locale),
      category,
    });

    const categoryId = addNode({
      id: `category:${category}`,
      kind: "category",
      label: CATEGORIES[category].name,
      url: getRelativeLocaleUrl(locale, `categories/${category}/`),
      category,
    });
    addLink(postId, categoryId);

    for (const tag of tags) {
      const slug = slugifyStr(tag);
      const tagId = addNode({
        id: `tag:${slug}`,
        kind: "tag",
        label: tag,
        url: getRelativeLocaleUrl(locale, `tags/${slug}/`),
      });
      addLink(postId, tagId);
    }
  }

  return { nodes: [...nodes.values()], links };
}
