import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://jorge.dev/",
    title: "Jorge",
    description: "Blog sobre programação e matemática.",
    author: "Jorge Borges",
    profile: "https://github.com/JorgeLAB",
    ogImage: "default-og.jpg",
    lang: "pt-BR",
    timezone: "America/Sao_Paulo",
    dir: "ltr",
  },
  posts: {
    perPage: 10,
    perIndex: 5,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: false,
    editPost: { enabled: false },
    search: false,
  },
  socials: [
    { name: "github", url: "https://github.com/JorgeLAB", linkTitle: "GitHub" },
    {
      name: "linkedin",
      url: "https://www.linkedin.com/in/SEU-USUARIO/",
      linkTitle: "LinkedIn",
    },
  ],
  shareLinks: [],
});