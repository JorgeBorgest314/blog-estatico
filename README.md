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
   | `draft`       | não         | `true` esconde o post em qualquer ambiente                        |

3. Escreva em Markdown: `$…$`/`$$…$$` para matemática, fences com `file=nome.ext` para código com rótulo, `[^1]` para notas.
4. `npm run dev` para conferir em `http://localhost:4321`; depois `git push` na `main` (ou PR) — o deploy é automático em ~2 min.

O `.md` não vai para o S3: quem publica é o GitHub Actions, que gera o HTML e sincroniza o bucket.

## Deploy

Publicação em S3 + CloudFront via GitHub Actions a cada push na `main`. Arquitetura, provisionamento (`infra/aws/setup.sh`) e deploy manual em [infra/README.md](infra/README.md).

## Licença

Código sob [MIT](LICENSE), derivado do AstroPaper (© Sat Naing). O conteúdo dos posts é © Jorge Borges.
