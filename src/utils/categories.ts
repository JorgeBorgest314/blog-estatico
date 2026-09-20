export const CATEGORY_SLUGS = ["computacao", "matematica"] as const;

export type CategorySlug = (typeof CATEGORY_SLUGS)[number];

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
  textClass: string;
};

export const CATEGORIES: Record<CategorySlug, Category> = {
  computacao: {
    slug: "computacao",
    name: "Computação",
    description:
      "Programação, linguagens, infraestrutura e o que mais envolve fazer software funcionar.",
    textClass: "text-sky-700 dark:text-sky-400",
  },
  matematica: {
    slug: "matematica",
    name: "Matemática",
    description:
      "Álgebra, probabilidade, análise e as ideias que sustentam a computação.",
    textClass: "text-hn",
  },
};

export const CATEGORY_LIST: Category[] = CATEGORY_SLUGS.map(
  slug => CATEGORIES[slug]
);
