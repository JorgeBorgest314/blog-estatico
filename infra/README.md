# Infraestrutura de publicação

O site é estático: o build (`npm run build`) gera `dist/`, que é sincronizado para um bucket S3 **privado** e servido pelo CloudFront com HTTPS. Não há servidor.

```
push na main ──▶ GitHub Actions (deploy.yml)
                   npm ci · npm run build
                   assume role via OIDC (sem chaves de longa duração)
                   aws s3 sync dist/ → s3://blog-estatico-site
                   aws cloudfront create-invalidation /*
                                      │
    leitor ──HTTPS──▶ CloudFront ──OAC──▶ S3 (bucket privado)
                        │
                        └─ CloudFront Function: /posts/x/ → /posts/x/index.html
                                                /posts/x  → 301 /posts/x/
                        └─ 403/404 → /404.html (status 404)
```

## Pré-requisitos (uma vez, pelo autor)

1. **AWS CLI v2** autenticado na conta do projeto (`aws sts get-caller-identity`).
2. **Domínio** registrado e um provedor de DNS que aceite `ALIAS`/`ANAME` no apex (Cloudflare, Porkbun, deSEC, Route 53…) — ou aceitar `www` como canônico e redirecionar o apex.
3. **Certificado ACM em `us-east-1`** (obrigatório para CloudFront), validado por DNS:
   ```bash
   aws acm request-certificate --region us-east-1 \
     --domain-name jorge.dev --subject-alternative-names www.jorge.dev \
     --validation-method DNS
   aws acm describe-certificate --region us-east-1 --certificate-arn <arn> \
     --query 'Certificate.DomainValidationOptions[].ResourceRecord'
   ```
   Crie os registros CNAME de validação no DNS e aguarde `Status: ISSUED`.

## Provisionar

```bash
# sem domínio (site fica em https://dXXXX.cloudfront.net)
infra/aws/setup.sh

# com domínio
DOMAIN=jorge.dev ACM_CERT_ARN=arn:aws:acm:us-east-1:...:certificate/... \
BUDGET_EMAIL=voce@exemplo.com infra/aws/setup.sh
```

O script é idempotente e cria/atualiza:

| Recurso | Nome | Observações |
| --- | --- | --- |
| Bucket S3 | `blog-estatico-site` | block public access, SSE-S3, sem website hosting |
| CloudFront Function | `blog-estatico-rewrite-index` | código em `infra/aws/rewrite-index.js` |
| Origin Access Control | `blog-estatico-site-oac` | só a distribuição lê o bucket (bucket policy com `AWS:SourceArn`) |
| Distribuição | — | HTTP/2+3, redirect para HTTPS, compressão, cache policy *CachingOptimized*, erros 403/404 → `/404.html`, PriceClass 100 |
| Role IAM | `blog-estatico-github-deploy` | trust via OIDC do GitHub restrito a `repo:JorgeBorgest314/blog-estatico:*`; permissões mínimas: `s3:ListBucket`, `s3:PutObject`, `s3:DeleteObject` no bucket e `cloudfront:CreateInvalidation` na distribuição |
| Budget | `blog-estatico` | US$ 5/mês, alerta em 80 % (se `BUDGET_EMAIL` for informado) |

Ao final ele imprime o ARN da role, o ID da distribuição e os comandos `gh secret set` / `gh variable set` para configurar o repositório. Depois, aponte o DNS para o domínio da distribuição.

## Deploy

- **Automático:** todo push na `main` roda `.github/workflows/deploy.yml` (também disponível em *Actions → Deploy → Run workflow*).
- **Manual**, com credenciais locais:
  ```bash
  npm run build
  aws s3 sync dist/_astro s3://blog-estatico-site/_astro --delete --cache-control "public, max-age=31536000, immutable"
  aws s3 sync dist s3://blog-estatico-site --delete --exclude "_astro/*" --cache-control "public, max-age=300, must-revalidate"
  aws cloudfront create-invalidation --distribution-id <ID> --paths "/*"
  ```

### Cache

- `dist/_astro/*` tem hash no nome → `max-age=31536000, immutable`.
- HTML, RSS, sitemap, imagens OG → `max-age=300, must-revalidate`; a invalidação `/*` a cada deploy (1.000 gratuitas/mês) elimina a espera.

### Trocar o domínio

`site.url` em `astro-paper.config.ts` alimenta canonical, RSS, sitemap e OG images. Ao definir o domínio: trocar esse valor, emitir o certificado, rodar o `setup.sh` com `DOMAIN`/`ACM_CERT_ARN` e apontar o DNS.
