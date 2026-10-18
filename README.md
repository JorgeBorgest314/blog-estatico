# Jorge — blog estático

Blog sobre programação e matemática, gerado como site estático com [Astro](https://astro.build/) a partir do template [AstroPaper](https://github.com/satnaing/astro-paper) (Tailwind v4, Pagefind, RSS, sitemap). Publicado em S3 + CloudFront.

## Pré-requisitos

- Node 24 (via [nvm](https://github.com/nvm-sh/nvm): `nvm use 24`)
- npm 11+

Nada de Docker: o projeto não tem dependências nativas.

## Desenvolvimento

```bash
npm install
npm run dev          # http://localhost:4321
```

| Script            | O que faz                                                   |
| ----------------- | ----------------------------------------------------------- |
| `npm run dev`     | Servidor de desenvolvimento com hot reload                  |
| `npm run build`   | `astro check` + build em `dist/` + índice do Pagefind       |
| `npm run preview` | Serve o `dist/` (a busca só funciona aqui, depois do build) |
| `npm run lint`    | ESLint                                                      |
| `npm run format`  | Prettier (`format:check` só verifica)                       |
| `npx astro check` | Checagem de tipos dos arquivos `.astro`                     |

## Estrutura

```
astro-paper.config.ts   # título, autor, idioma, fuso, features, redes sociais
astro.config.ts         # integrações, i18n, markdown/shiki
src/content/posts/      # posts em Markdown/MDX (frontmatter validado em src/content.config.ts)
src/content/pages/      # páginas em Markdown (sobre)
src/i18n/lang/pt-BR.ts  # textos da interface
src/components/         # componentes do layout
src/pages/              # rotas
src/utils/getPostGraph.ts  # dados do grafo de posts/tags (página /grafo/)
docs/poc/               # PoC do layout (HTML + Tailwind via CDN)
docs/astropaper/        # README e posts-guia do template, para consulta
```

## Escrevendo um post

1. Copie [`templates/post.md`](templates/post.md) para `src/content/posts/<slug>.md` (o nome do arquivo vira a URL: `/posts/<slug>/`).
2. Preencha o frontmatter:

   | Campo         | Obrigatório | Valores                                                           |
   | ------------- | ----------- | ----------------------------------------------------------------- |
   | `title`       | sim         | texto                                                             |
   | `description` | sim         | até 155 caracteres                                                |
   | `pubDatetime` | sim         | `AAAA-MM-DDTHH:MM:SS-03:00`; data futura só publica quando chegar |
   | `category`    | sim         | `computacao` ou `matematica`                                      |
   | `tags`        | não         | lista livre                                                       |
   | `series`      | não         | nome da série; `seriesOrder` (número) define a posição            |
   | `draft`       | não         | `true` publica só em desenvolvimento (fica fora do site)          |

3. Escreva em Markdown: `$$…$$` para matemática (inline e em bloco; um `$` solto é texto, para não quebrar valores em dólar), fences com `file=nome.ext` para código com rótulo, `[^1]` para notas.
4. `npm run dev` para conferir em `http://localhost:4321`; depois `git push` na `main` (ou PR) — o deploy é automático em ~2 min.

O `.md` não vai para o S3: quem publica é o GitHub Actions, que gera o HTML e sincroniza o bucket.

### Referência inline (link suave)

Quando o texto cita uma data, um título ou um fato que tem fonte, basta escrever um link Markdown comum:

```md
O ponto de partida público é o post de 19 de outubro de 2022, [_Why we're leaving the cloud_](https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0).
```

Não há classe, atributo nem sintaxe nova para decorar: no corpo do post todo link já sai no estilo suave — sublinhado pontilhado de baixa opacidade, na cor do texto, sem mudar a cor da palavra. Só no mouse em cima o sublinhado fica sólido e laranja; no foco pelo teclado aparece o contorno tracejado padrão do site. O sublinhado nunca desaparece, então o link continua perceptível sem depender de cor (WCAG 1.4.1).

Na prática:

- Envolva o **trecho mínimo** que identifica a fonte — de preferência o título da obra, não a frase inteira nem a data solta.
- Um link por fato. A tabela de Referências no fim do post continua valendo como índice completo e usa o mesmo estilo.
- O estilo vale só dentro do corpo do texto (`.app-prose`, em `src/styles/typography.css`); sumário lateral, histórico de versões, rodapé e cards de listagem têm os estilos próprios deles.

### Linha do tempo

Posts que contam uma história com datas podem desenhar uma linha do tempo em D3. Os eventos ficam no frontmatter:

```yaml
timeline:
  title: "Os 16 posts, de 19/10/2022 a 26/03/2025"
  caption: "Frase curta abaixo do gráfico (opcional)"
  events:
    - date: 2022-10-19
      title: "Por que estamos saindo da nuvem"
      url: "https://..." # opcional
      highlight: true # marco numerado
    - date: 2023-02-21
      title: "Podemos economizar US$ 7 milhões em cinco anos"
```

E a posição no texto é marcada com uma linha de HTML, onde você quiser que ela apareça:

```md
<div data-timeline></div>
```

Como funciona: cada evento vira um ponto no eixo do tempo, posicionado pela data real — então rajadas de eventos aparecem como aglomerados, e os períodos de silêncio como vazios. Datas próximas demais para caber lado a lado são empilhadas, ligadas por uma haste à linha. Os eventos com `highlight: true` recebem um número em laranja, na ordem. Passar o mouse (ou navegar pelo teclado) mostra data e título na linha abaixo do gráfico; clicar abre a `url`.

Em telas estreitas, e também sem JavaScript, a linha do tempo vira a mesma lista em ordem cronológica — que é como ela já existe no HTML antes de o gráfico ser desenhado.

## Grafo (`/grafo/`)

Visão em grafo das ligações entre os textos, no espírito do grafo do Obsidian: cada post vira um nó ligado à sua categoria e a cada uma das suas tags, e tags compartilhadas aproximam posts diferentes. Nada a configurar — a página se monta a partir do frontmatter.

- Cor pelo tema: azul (Computação), vermelho (Matemática), cinza (tags).
- Arrastar reposiciona um nó; a roda aproxima; duplo clique (ou **Reposicionar**) reenquadra.
- Passar o mouse acende o nó e seus vizinhos; clicar abre o post, a categoria ou a tag.
- Cada nó é um link de verdade, então também dá para navegar pelo teclado.

A simulação de forças usa [D3](https://d3js.org) (`d3-force`, `d3-selection`, `d3-drag`, `d3-zoom`) e só é carregada nessa página (~22 KB comprimidos). Rascunhos entram no grafo em desenvolvimento e ficam fora do site publicado, como nas demais listagens.

## Deploy

Publicação em S3 + CloudFront via GitHub Actions a cada push na `main`. Arquitetura, provisionamento (`infra/aws/setup.sh`) e deploy manual em [infra/README.md](infra/README.md).

## Licença

Código sob [MIT](LICENSE), derivado do AstroPaper (© Sat Naing). O conteúdo dos posts é © Jorge Borges.
