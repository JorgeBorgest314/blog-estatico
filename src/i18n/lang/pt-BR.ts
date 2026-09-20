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
  },
  post: {
    by: "Por",
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
