import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "http://localhost/"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Artomos landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Artomos/i);
  assert.match(html, /Software, Aplicativos e Intelig.ncia Artificial/i);
  assert.match(html, /CRIAMOS/i);
  assert.match(html, /SOBRE A ARTOMOS/i);
  assert.match(html, /PROJETOS/i);
  assert.match(html, /favicon\.ico/i);
  assert.match(html, /favicon\.svg/i);
  assert.match(html, /favicon-32x32\.png/i);
  assert.match(html, /apple-touch-icon\.png/i);
  assert.match(html, /contato@artomos\.com/i);
  assert.doesNotMatch(html, /contato@artomos\.com\.br/i);
  assert.match(html, /https:\/\/github\.com\/Mosarto\/aether/i);
  assert.match(html, /ENVIAR POR E-MAIL/i);
  assert.match(html, /Projeto privado/i);
  assert.match(html, /https:\/\/artomos\.com\/#organization/i);
  assert.match(html, /https:\/\/artomos\.com\/#website/i);
  assert.doesNotMatch(html, /artomos\.com\.br/i);
  assert.doesNotMatch(html, /artomos-loader/i);
});

test("publishes crawl discovery files with the canonical domain", async () => {
  const [robots, sitemap, manifest] = await Promise.all([
    readFile(new URL("../dist/client/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/sitemap.xml", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/manifest.webmanifest", import.meta.url), "utf8"),
  ]);

  assert.match(robots, /Sitemap: https:\/\/artomos\.com\/sitemap\.xml/i);
  assert.match(sitemap, /<loc>https:\/\/artomos\.com\/<\/loc>/i);
  assert.match(manifest, /"short_name": "Artomos"/i);
});

test("keeps starter-only surfaces out of the production app", async () => {
  const [page, layout, packageJson, transition] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(
      new URL(
        "../src/components/sections/HeroToAboutTransition.tsx",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);

  assert.doesNotMatch(page, /_sites-preview|SkeletonPreview|codex-preview/);
  assert.doesNotMatch(layout, /Starter Project|codex-preview|_sites-preview/);
  assert.doesNotMatch(packageJson, /drizzle|react-loading-skeleton/);
  assert.doesNotMatch(transition, /artomos-loader|artomos-is-loading/);
});
