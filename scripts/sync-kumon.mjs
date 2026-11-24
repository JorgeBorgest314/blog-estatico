#!/usr/bin/env node
// Copia as folhas de treino "Kumon X - Título.html" (MAP2226) para
// public/map2226/kumon/, com nomes seguros para URL. Os arquivos vão como
// estão, byte a byte: são páginas prontas para imprimir e não passam pelo
// layout do site.
//
// Uso:
//   node scripts/sync-kumon.mjs <pasta-de-origem>
//   KUMON_SRC=<pasta-de-origem> node scripts/sync-kumon.mjs
//
// Pode rodar quantas vezes quiser: só regrava o que mudou e apaga do destino
// os kumon-*.html que não têm mais arquivo de origem. A pasta de origem nunca
// é alterada.

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const URL_BASE = "/map2226/kumon/";
const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);
const destDir = path.join(
  repoRoot,
  "public",
  ...URL_BASE.split("/").filter(Boolean)
);

const SOURCE_NAME = /^Kumon (\S+) - (.+)\.html$/u;

const out = text => process.stdout.write(`${text}\n`);
const fail = text => {
  process.stderr.write(`sync-kumon: ${text}\n`);
  process.exit(1);
};

/** "Kumon C - Resolver N' = aN + b.html" → "kumon-c-resolver-n-linha-an-b.html" */
export function slugFor(fileName) {
  const slug = fileName
    .replace(/\.html$/iu, "")
    .replace(/(\p{L})['’′]/gu, "$1 linha") // N' (derivada) → "n-linha"
    .replace(/×/gu, "x")
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // tira os acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug}.html`;
}

function sameBytes(a, b) {
  return fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b));
}

function main() {
  const srcDir = process.argv[2] ?? process.env.KUMON_SRC;
  if (!srcDir) fail("informe a pasta de origem (argumento ou KUMON_SRC).");
  if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) {
    fail(`pasta de origem não encontrada: ${srcDir}`);
  }

  const sources = fs
    .readdirSync(srcDir)
    .filter(name => SOURCE_NAME.test(name))
    .sort((a, b) => a.localeCompare(b, "pt-BR"));
  if (sources.length === 0) {
    fail(`nenhum "Kumon * - *.html" em ${srcDir}; nada foi alterado.`);
  }

  const bySlug = new Map();
  for (const name of sources) {
    const slug = slugFor(name);
    if (bySlug.has(slug)) {
      fail(`"${bySlug.get(slug)}" e "${name}" dariam o mesmo nome: ${slug}`);
    }
    bySlug.set(slug, name);
  }

  fs.mkdirSync(destDir, { recursive: true });

  for (const [slug, name] of bySlug) {
    const from = path.join(srcDir, name);
    const to = path.join(destDir, slug);
    const unchanged = sameBytes(from, to);
    if (!unchanged) fs.copyFileSync(from, to);
    out(
      `${unchanged ? "igual   " : "copiado "} ${name}  →  ${URL_BASE}${slug}`
    );
  }

  for (const name of fs.readdirSync(destDir)) {
    if (/^kumon-.*\.html$/u.test(name) && !bySlug.has(name)) {
      fs.rmSync(path.join(destDir, name));
      out(`removido ${URL_BASE}${name} (sem arquivo de origem)`);
    }
  }

  out(`${bySlug.size} folha(s) em ${path.relative(repoRoot, destDir)}/`);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main();
}
