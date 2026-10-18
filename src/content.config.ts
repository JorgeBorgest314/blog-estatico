import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";
import config from "@/config";
import { CATEGORY_SLUGS } from "@/utils/categories";

export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(config.site.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      subtitle: z.string().optional(),
      category: z.enum(CATEGORY_SLUGS),
      series: z.string().optional(),
      seriesOrder: z.number().int().positive().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
      versions: z
        .array(
          z.object({
            version: z.number().int().positive(),
            date: z.date(),
            note: z.string().optional(),
          })
        )
        .optional(),
      video: z
        .object({
          youtube: z.string(),
          start: z.union([z.string(), z.number()]).optional(),
          title: z.string().optional(),
        })
        .optional(),
      // Linha do tempo desenhada no ponto onde o post tiver <div data-timeline>
      timeline: z
        .object({
          title: z.string().optional(),
          caption: z.string().optional(),
          events: z
            .array(
              z.object({
                date: z.date(),
                title: z.string(),
                url: z.string().optional(),
                /** marco da narrativa: ganha rótulo fixo e destaque */
                highlight: z.boolean().optional(),
              })
            )
            .min(2),
        })
        .optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/[^_]*.{md,mdx}", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    ogImage: z.string().optional(),
    canonicalURL: z.string().optional(),
  }),
});

export const collections = { posts, pages };
