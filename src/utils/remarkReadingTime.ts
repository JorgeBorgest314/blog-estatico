import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import type { VFile } from "vfile";

const WORDS_PER_MINUTE = 200;

type AstroFile = VFile & {
  data: { astro?: { frontmatter?: Record<string, unknown> } };
};

export function remarkReadingTime() {
  return (tree: Root, file: AstroFile) => {
    const words = toString(tree).split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
    const frontmatter = file.data.astro?.frontmatter;
    if (frontmatter) frontmatter.readingTime = minutes;
  };
}
