# Jorge.dev — blog estático

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

Crie `src/content/posts/<slug>.md` com o frontmatter:

```yaml
---
title: "Título"
description: "Resumo de até 155 caracteres."
pubDatetime: 2026-09-20T12:00:00-03:00
tags: [ruby, matematica]
draft: false
---
```

Arquivos com prefixo `_` são ignorados pela collection.

## Licença

Código sob [MIT](LICENSE), derivado do AstroPaper (© Sat Naing). O conteúdo dos posts é © Jorge Borges.
