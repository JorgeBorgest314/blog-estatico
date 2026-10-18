import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Home",
    posts: "Posts",
    tags: "Tags",
    about: "About",
    archives: "Archives",
    search: "Search",
    categories: "Categories",
    series: "Series",
    graph: "Graph",
  },
  post: {
    by: "By",
    video: "The talk",
    tableOfContents: "Contents",
    versions: "Versions",
    versionLabel: "v{{n}}",
    watchOnYouTube: "Watch on YouTube",
    readingTime: "{{minutes}} min read",
    publishedAt: "Published at",
    updatedAt: "Updated",
    sharePostIntro: "Share this post:",
    sharePostOn: "Share this post on {{platform}}",
    sharePostViaEmail: "Share this post via email",
    tagLabel: "Tags",
    backToTop: "Back to top",
    goBack: "Go back",
    editPage: "Edit page",
    previousPost: "Previous Post",
    nextPost: "Next Post",
    seriesPart: "Part {{n}} of {{total}} in the series",
    previousInSeries: "Previous in series",
    nextInSeries: "Next in series",
  },
  pagination: {
    prev: "Prev",
    next: "Next",
    page: "Page",
  },
  home: {
    allPosts: "All Posts",
    more: "More",
    empty: "No posts yet.",
  },
  timeline: {
    hint: "Hover or use the keyboard to read each post",
  },
  graph: {
    empty: "No posts yet — the graph shows up with the first text.",
    hint: "Drag the nodes · scroll to zoom · double-click to reset",
    reset: "Reset",
    ariaLabel: "Graph of posts, categories and tags",
    fallback:
      "Interactive graph linking every post to its category and tags. The same connections are available as text on the tags and categories pages.",
    legendTags: "Tags",
    nodePost: "Post",
    nodeTag: "Tag",
    nodeCategory: "Category",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "All rights reserved.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "All the articles with the tag",

    tagsTitle: "Tags",
    tagsDesc: "All the tags used in posts.",

    postsTitle: "Posts",
    postsDesc: "All the articles I've posted.",

    archivesTitle: "Archives",
    archivesDesc: "All the articles I've archived.",

    searchTitle: "Search",
    searchDesc: "Search any article ...",

    categoriesTitle: "Categories",
    categoriesDesc: "The two big topics of this blog.",

    seriesTitle: "Series",
    seriesDesc: "Posts meant to be read in order.",

    seriesPostCount: "{{count}} posts",
    seriesPostCountOne: "1 post",

    graphTitle: "Graph",
    graphDesc: "How the posts connect through tags and categories.",
  },
  a11y: {
    skipToContent: "Skip to content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    toggleTheme: "Toggle theme",
    searchPlaceholder: "Search posts...",
    noResults: "No results found",
    goToPreviousPage: "Go to previous page",
    goToNextPage: "Go to next page",
  },
  notFound: {
    title: "404 Not Found",
    message: "Page Not Found",
    goHome: "Go back home",
  },
} satisfies UIStrings;
