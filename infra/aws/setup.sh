#!/usr/bin/env bash
# Provisiona a infraestrutura de publicação do site: bucket S3 privado,
# CloudFront (OAC + Function de reescrita), role IAM para o GitHub Actions
# (OIDC) e um orçamento de alerta. Idempotente: pode ser executado de novo.
#
# Uso:
#   DOMAIN=jorge.dev infra/aws/setup.sh            # com domínio (exige ACM_CERT_ARN)
#   infra/aws/setup.sh                              # sem domínio: usa *.cloudfront.net
#
# Variáveis:
#   BUCKET          nome do bucket (padrão: blog-estatico-site)
#   DOMAIN          domínio custom (opcional); com ele, ACM_CERT_ARN é obrigatório
#   ACM_CERT_ARN    certificado ACM em us-east-1 cobrindo DOMAIN e www.DOMAIN
#   GITHUB_REPO     owner/repo autorizado a assumir a role (padrão: JorgeBorgest314/blog-estatico)
#   BUDGET_EMAIL    e-mail para o alerta de orçamento (opcional)
set -euo pipefail

BUCKET="${BUCKET:-blog-estatico-site}"
DOMAIN="${DOMAIN:-}"
ACM_CERT_ARN="${ACM_CERT_ARN:-}"
GITHUB_REPO="${GITHUB_REPO:-JorgeBorgest314/blog-estatico}"
BUDGET_EMAIL="${BUDGET_EMAIL:-}"
REGION="us-east-1"
PROJECT_TAG="Project=blog-estatico"
ROLE_NAME="blog-estatico-github-deploy"
FUNCTION_NAME="blog-estatico-rewrite-index"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export AWS_DEFAULT_REGION="$REGION"
ACCOUNT_ID="$(aws sts get-caller-identity --query Account --output text)"

log() { printf '\n==> %s\n' "$*"; }

if [ -n "$DOMAIN" ] && [ -z "$ACM_CERT_ARN" ]; then
  echo "DOMAIN definido sem ACM_CERT_ARN. Emita o certificado em us-east-1 primeiro:" >&2
  echo "  aws acm request-certificate --domain-name $DOMAIN --subject-alternative-names www.$DOMAIN --validation-method DNS" >&2
  exit 1
fi

# ---------------------------------------------------------------- S3
log "Bucket S3 privado: $BUCKET"
if ! aws s3api head-bucket --bucket "$BUCKET" 2>/dev/null; then
  aws s3api create-bucket --bucket "$BUCKET" --region "$REGION" >/dev/null
fi
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
aws s3api put-bucket-encryption --bucket "$BUCKET" \
  --server-side-encryption-configuration '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"}}]}'
aws s3api put-bucket-tagging --bucket "$BUCKET" --tagging "TagSet=[{Key=${PROJECT_TAG%=*},Value=${PROJECT_TAG#*=}}]"

# ---------------------------------------------------------------- CloudFront Function
log "CloudFront Function: $FUNCTION_NAME"
FUNCTION_CODE="$SCRIPT_DIR/rewrite-index.js"
if aws cloudfront describe-function --name "$FUNCTION_NAME" >/dev/null 2>&1; then
  ETAG="$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query ETag --output text)"
  aws cloudfront update-function --name "$FUNCTION_NAME" --if-match "$ETAG" \
    --function-config Comment="Reescreve /x/ para /x/index.html",Runtime=cloudfront-js-2.0 \
    --function-code "fileb://$FUNCTION_CODE" >/dev/null
else
  aws cloudfront create-function --name "$FUNCTION_NAME" \
    --function-config Comment="Reescreve /x/ para /x/index.html",Runtime=cloudfront-js-2.0 \
    --function-code "fileb://$FUNCTION_CODE" >/dev/null
fi
ETAG="$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query ETag --output text)"
aws cloudfront publish-function --name "$FUNCTION_NAME" --if-match "$ETAG" >/dev/null
FUNCTION_ARN="$(aws cloudfront describe-function --name "$FUNCTION_NAME" --query FunctionSummary.FunctionMetadata.FunctionARN --output text)"

# ---------------------------------------------------------------- OAC
log "Origin Access Control"
OAC_ID="$(aws cloudfront list-origin-access-controls \
  --query "OriginAccessControlList.Items[?Name=='$BUCKET-oac'].Id | [0]" --output text)"
if [ "$OAC_ID" = "None" ] || [ -z "$OAC_ID" ]; then
  OAC_ID="$(aws cloudfront create-origin-access-control --origin-access-control-config \
    "Name=$BUCKET-oac,OriginAccessControlOriginType=s3,SigningBehavior=always,SigningProtocol=sigv4" \
    --query OriginAccessControl.Id --output text)"
fi

# ---------------------------------------------------------------- Distribuição
log "Distribuição CloudFront"
DIST_ID="$(aws cloudfront list-distributions \
  --query "DistributionList.Items[?Origins.Items[0].DomainName=='$BUCKET.s3.$REGION.amazonaws.com'].Id | [0]" --output text)"

ALIASES='{"Quantity":0}'
VIEWER_CERT='{"CloudFrontDefaultCertificate":true,"MinimumProtocolVersion":"TLSv1"}'
if [ -n "$DOMAIN" ]; then
  ALIASES="{\"Quantity\":2,\"Items\":[\"$DOMAIN\",\"www.$DOMAIN\"]}"
  VIEWER_CERT="{\"ACMCertificateArn\":\"$ACM_CERT_ARN\",\"SSLSupportMethod\":\"sni-only\",\"MinimumProtocolVersion\":\"TLSv1.2_2021\"}"
fi

DIST_CONFIG="$(cat <<JSON
{
  "CallerReference": "$BUCKET-$(date +%s)",
  "Comment": "Blog estático (Astro) - $BUCKET",
  "Enabled": true,
  "HttpVersion": "http2and3",
  "IsIPV6Enabled": true,
  "PriceClass": "PriceClass_100",
  "DefaultRootObject": "index.html",
  "Aliases": $ALIASES,
  "ViewerCertificate": $VIEWER_CERT,
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "s3-$BUCKET",
      "DomainName": "$BUCKET.s3.$REGION.amazonaws.com",
      "OriginAccessControlId": "$OAC_ID",
      "S3OriginConfig": {"OriginAccessIdentity": ""}
    }]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "s3-$BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "AllowedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"], "CachedMethods": {"Quantity": 2, "Items": ["GET", "HEAD"]}},
    "CachePolicyId": "658327ea-f89d-4fab-a63d-7e88639e58f6",
    "FunctionAssociations": {"Quantity": 1, "Items": [{"EventType": "viewer-request", "FunctionARN": "$FUNCTION_ARN"}]}
  },
  "CustomErrorResponses": {
    "Quantity": 2,
    "Items": [
      {"ErrorCode": 403, "ResponsePagePath": "/404.html", "ResponseCode": "404", "ErrorCachingMinTTL": 60},
      {"ErrorCode": 404, "ResponsePagePath": "/404.html", "ResponseCode": "404", "ErrorCachingMinTTL": 60}
    ]
  }
}
JSON
)"

if [ "$DIST_ID" = "None" ] || [ -z "$DIST_ID" ]; then
  DIST_ID="$(aws cloudfront create-distribution --distribution-config "$DIST_CONFIG" --query Distribution.Id --output text)"
  aws cloudfront tag-resource --resource "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DIST_ID" \
    --tags "Items=[{Key=${PROJECT_TAG%=*},Value=${PROJECT_TAG#*=}}]"
else
  echo "Distribuição $DIST_ID já existe; para alterar aliases/certificado, edite pelo console ou via update-distribution."
fi
DIST_DOMAIN="$(aws cloudfront get-distribution --id "$DIST_ID" --query Distribution.DomainName --output text)"

# ---------------------------------------------------------------- Bucket policy (só o CloudFront lê)
log "Bucket policy restrita à distribuição $DIST_ID"
aws s3api put-bucket-policy --bucket "$BUCKET" --policy "$(cat <<JSON
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowCloudFrontServicePrincipalReadOnly",
    "Effect": "Allow",
    "Principal": {"Service": "cloudfront.amazonaws.com"},
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::$BUCKET/*",
    "Condition": {"StringEquals": {"AWS:SourceArn": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DIST_ID"}}
  }]
}
JSON
)"

# ---------------------------------------------------------------- Role OIDC para o GitHub Actions
log "Role IAM para o GitHub Actions: $ROLE_NAME"
OIDC_ARN="arn:aws:iam::$ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
if ! aws iam get-open-id-connect-provider --open-id-connect-provider-arn "$OIDC_ARN" >/dev/null 2>&1; then
  aws iam create-open-id-connect-provider --url https://token.actions.githubusercontent.com \
    --client-id-list sts.amazonaws.com --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1 >/dev/null
fi
TRUST_POLICY="$(cat <<JSON
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Federated": "$OIDC_ARN"},
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {"token.actions.githubusercontent.com:aud": "sts.amazonaws.com"},
      "StringLike": {"token.actions.githubusercontent.com:sub": "repo:$GITHUB_REPO:*"}
    }
  }]
}
JSON
)"
if aws iam get-role --role-name "$ROLE_NAME" >/dev/null 2>&1; then
  aws iam update-assume-role-policy --role-name "$ROLE_NAME" --policy-document "$TRUST_POLICY"
else
  aws iam create-role --role-name "$ROLE_NAME" --assume-role-policy-document "$TRUST_POLICY" \
    --tags "Key=${PROJECT_TAG%=*},Value=${PROJECT_TAG#*=}" >/dev/null
fi
aws iam put-role-policy --role-name "$ROLE_NAME" --policy-name deploy-site --policy-document "$(cat <<JSON
{
  "Version": "2012-10-17",
  "Statement": [
    {"Effect": "Allow", "Action": ["s3:ListBucket"], "Resource": "arn:aws:s3:::$BUCKET"},
    {"Effect": "Allow", "Action": ["s3:PutObject", "s3:DeleteObject"], "Resource": "arn:aws:s3:::$BUCKET/*"},
    {"Effect": "Allow", "Action": ["cloudfront:CreateInvalidation"], "Resource": "arn:aws:cloudfront::$ACCOUNT_ID:distribution/$DIST_ID"}
  ]
}
JSON
)"
ROLE_ARN="$(aws iam get-role --role-name "$ROLE_NAME" --query Role.Arn --output text)"

# ---------------------------------------------------------------- Orçamento
if [ -n "$BUDGET_EMAIL" ]; then
  log "Orçamento de US\$ 5/mês com alerta para $BUDGET_EMAIL"
  aws budgets create-budget --account-id "$ACCOUNT_ID" \
    --budget '{"BudgetName":"blog-estatico","BudgetLimit":{"Amount":"5","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}' \
    --notifications-with-subscribers "[{\"Notification\":{\"NotificationType\":\"ACTUAL\",\"ComparisonOperator\":\"GREATER_THAN\",\"Threshold\":80},\"Subscribers\":[{\"SubscriptionType\":\"EMAIL\",\"Address\":\"$BUDGET_EMAIL\"}]}]" \
    2>/dev/null || echo "Orçamento blog-estatico já existe."
fi

# ---------------------------------------------------------------- Resumo
cat <<EOF

Pronto.

  Bucket:            s3://$BUCKET
  Distribuição:      $DIST_ID  →  https://$DIST_DOMAIN
  Role de deploy:    $ROLE_ARN

Configure no GitHub (Settings → Secrets and variables → Actions):
  secret   AWS_DEPLOY_ROLE_ARN            = $ROLE_ARN
  variable S3_BUCKET                      = $BUCKET
  variable CLOUDFRONT_DISTRIBUTION_ID     = $DIST_ID

Ou via gh:
  gh secret set AWS_DEPLOY_ROLE_ARN --body "$ROLE_ARN"
  gh variable set S3_BUCKET --body "$BUCKET"
  gh variable set CLOUDFRONT_DISTRIBUTION_ID --body "$DIST_ID"
EOF
if [ -n "$DOMAIN" ]; then
  cat <<EOF

DNS (no seu provedor):
  www.$DOMAIN   CNAME  $DIST_DOMAIN
  $DOMAIN       ALIAS/ANAME  $DIST_DOMAIN   (ou redirecione o apex para www)
EOF
fi
