import type { UIStrings } from "../types";

export default {
  nav: {
    home: "Início",
    posts: "Posts",
    tags: "Tags",
    about: "Sobre",
    archives: "Arquivo",
    search: "Busca",
    categories: "Categorias",
    series: "Séries",
    graph: "Grafo",
  },
  post: {
    by: "Por",
    video: "A palestra",
    tableOfContents: "Sumário",
    versions: "Versões",
    versionLabel: "v{{n}}",
    watchOnYouTube: "Assistir no YouTube",
    readingTime: "{{minutes}} min de leitura",
    publishedAt: "Publicado em",
    updatedAt: "Atualizado em",
    sharePostIntro: "Compartilhe este post:",
    sharePostOn: "Compartilhar este post no {{platform}}",
    sharePostViaEmail: "Compartilhar este post por e-mail",
    tagLabel: "Tags",
    backToTop: "Voltar ao topo",
    goBack: "Voltar",
    editPage: "Editar página",
    previousPost: "Post anterior",
    nextPost: "Próximo post",
    seriesPart: "Parte {{n}} de {{total}} da série",
    previousInSeries: "Anterior na série",
    nextInSeries: "Próximo na série",
  },
  pagination: {
    prev: "Anterior",
    next: "Próxima",
    page: "Página",
  },
  home: {
    allPosts: "Todos os posts",
    more: "Mais",
    empty: "Nenhum post publicado ainda.",
  },
  timeline: {
    hint: "Passe o mouse ou navegue pelo teclado para ler cada post",
  },
  graph: {
    empty:
      "Nenhum post publicado ainda — o grafo aparece com o primeiro texto.",
    hint: "Arraste os nós · role para aproximar · duplo clique reposiciona",
    reset: "Reposicionar",
    ariaLabel: "Grafo de posts, categorias e tags",
    fallback:
      "Grafo interativo que liga cada post à sua categoria e às suas tags. As mesmas ligações estão disponíveis em texto nas páginas de tags e de categorias.",
    legendTags: "Tags",
    nodePost: "Post",
    nodeTag: "Tag",
    nodeCategory: "Categoria",
  },
  footer: {
    copyright: "Copyright",
    allRightsReserved: "Todos os direitos reservados.",
  },
  pages: {
    tagTitle: "Tag",
    tagDesc: "Todos os posts com a tag",

    tagsTitle: "Tags",
    tagsDesc: "Todas as tags usadas nos posts.",

    postsTitle: "Posts",
    postsDesc: "Todos os posts publicados.",

    archivesTitle: "Arquivo",
    archivesDesc: "Todos os posts, organizados por data.",

    searchTitle: "Busca",
    searchDesc: "Busque qualquer post ...",

    categoriesTitle: "Categorias",
    categoriesDesc: "Os dois grandes temas do blog.",

    seriesTitle: "Séries",
    seriesDesc: "Posts pensados para serem lidos em sequência.",

    seriesPostCount: "{{count}} posts",
    seriesPostCountOne: "1 post",

    graphTitle: "Grafo",
    graphDesc: "Como os posts se ligam pelas tags e pelas categorias.",
  },
  a11y: {
    skipToContent: "Pular para o conteúdo",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    toggleTheme: "Alternar tema",
    searchPlaceholder: "Buscar posts...",
    noResults: "Nenhum resultado encontrado",
    goToPreviousPage: "Ir para a página anterior",
    goToNextPage: "Ir para a próxima página",
  },
  notFound: {
    title: "Página não encontrada",
    message: "O endereço que você abriu não existe ou foi movido.",
    goHome: "Voltar para o início",
  },
} satisfies UIStrings;
