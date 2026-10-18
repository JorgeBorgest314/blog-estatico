---
title: "Título do post"
description: "Subtítulo: uma ou duas frases (até 155 caracteres). Aparece abaixo do título nas listagens, no Google, no RSS e ao compartilhar."
pubDatetime: 2026-09-21T10:00:00-03:00
category: computacao
tags:
  - ruby
# opcionais ------------------------------------------------------------
# subtitle: "Linha curta abaixo do título (aparece também nas listagens)"
# series: "Nome da série"
# seriesOrder: 1
# versions:                     # histórico mostrado na lateral direita
#   - version: 1
#     date: 2026-10-18
#     note: "Primeira versão"
# timeline:                     # linha do tempo em D3; posição no texto: <div data-timeline></div>
#   title: "Os marcos da história"
#   events:
#     - date: 2022-10-19
#       title: "O primeiro post"
#       url: "https://exemplo.com"
#       highlight: true
# video:                        # embed no fim do post
#   youtube: "https://youtu.be/ID?t=120"
#   title: "A palestra"
# draft: true                   # rascunho: só aparece em desenvolvimento
# featured: true
---

Primeiro parágrafo — a primeira letra vira a capitular.

## Um subtítulo

Texto normal. Matemática inline com $$E = mc^2$$ e em destaque:
(um cifrão sozinho, como US$ 7 milhões, é texto comum — matemática usa sempre `$$`)

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

```ruby file=exemplo.rb
puts "código com nome de arquivo"
```

Referência inline: link Markdown comum, que no corpo do post sai com sublinhado
pontilhado discreto — [_Why we're leaving the cloud_](https://world.hey.com/dhh/why-we-re-leaving-the-cloud-654b47e0).
Envolva só o trecho que identifica a fonte (o título, de preferência).

> Uma citação em destaque.

Nota de rodapé[^1].

[^1]: Texto da nota.
