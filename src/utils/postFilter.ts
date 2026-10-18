import type { CollectionEntry } from "astro:content";
import config from "@/config";

/**
 * Determines whether a post is eligible to be listed/rendered.
 *
 * - In dev, shows everything (including drafts and scheduled posts) so the
 *   author can review a text before publishing it
 * - In production, excludes drafts and posts scheduled for the future
 */
export function postFilter({ data }: CollectionEntry<"posts">) {
  if (import.meta.env.DEV) return true;

  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - config.posts.scheduledPostMargin;
  return !data.draft && isPublishTimePassed;
}
