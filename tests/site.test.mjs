// Smoke tests over the rendered site in public/. They assert observable
// behaviour: one page with every section, nothing reaches outside the origin,
// and nothing private or descriptive of the server is published.
import { test } from "node:test";
import assert from "node:assert/strict";
import { globSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const SITE = "public";

const page = (path) => readFileSync(join(SITE, path), "utf8");
const pages = () => globSync(`${SITE}/**/*.html`);
const published = () => globSync(`${SITE}/**/*`, { withFileTypes: true })
  .filter((f) => f.isFile() && /\.(html|css|js|txt|svg)$/.test(f.name))
  .map((f) => join(f.parentPath, f.name));

test("the site is one page, a not-found page and a generic error page", () => {
  for (const file of ["index.html", "404.html", "error.html", "robots.txt"]) {
    assert.ok(existsSync(join(SITE, file)), `missing ${file}`);
  }
  assert.deepEqual(pages().map((p) => p.replace(`${SITE}/`, "")).sort(), ["404.html", "error.html", "index.html"]);
});

test("the page carries the profile and every section", () => {
  const html = page("index.html");
  assert.match(html, /<h1 class="hero__name" id="name">Yuriy Kovalchuk<\/h1>/);
  for (const id of ["about", "experience", "projects", "skills"]) {
    assert.match(html, new RegExp(`<section class="section" id="${id}"`), `no ${id} section`);
    assert.ok(html.includes(`href="#${id}"`), `the top bar does not link to ${id}`);
  }
  for (const want of ["Platform Engineer", "Swisscard AECS GmbH", "Swiss Re", "NTT DATA Italia", "Currently exploring"]) {
    assert.ok(html.includes(want), `the page is missing ${want}`);
  }
});

test("every project links to its public repository", () => {
  const html = page("index.html");
  const links = [...html.matchAll(/<h3 class="project__title"><a href="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(links.length, 6, "expected six projects");
  for (const url of links) {
    assert.match(url, /^https:\/\/github\.com\/yuriy-kovalchuk\/[\w.-]+$/, `${url} is not a repository link`);
  }
});

test("only GitHub and LinkedIn are published as contact details", () => {
  for (const file of published()) {
    const text = readFileSync(file, "utf8");
    assert.ok(!/mailto:|tel:|@[\w-]+\.(com|me|dev|io)\b/i.test(text), `${file} publishes an email address or phone number`);
    assert.ok(!/\+\d{2}[\s\d]{8,}/.test(text), `${file} publishes a phone number`);
  }
});

test("the site does not describe how it is built or served", () => {
  for (const file of published()) {
    const text = readFileSync(file, "utf8");
    assert.ok(!/\b(hugo|nginx|chainguard)\b/i.test(text), `${file} names the tooling behind the site`);
    assert.ok(!/name="generator"/i.test(text), `${file} carries a generator tag`);
  }
});

test("the page makes no availability or job-seeking claims", () => {
  const html = page("index.html");
  assert.ok(!/open to|available for|looking for|hire me/i.test(html), "the page reads as a job advert");
});

test("nothing reaches outside this origin", () => {
  for (const file of pages()) {
    const html = readFileSync(file, "utf8");
    for (const forbidden of [/<script[^>]+src="https?:/, /<link[^>]+href="https?:/, /<img[^>]+src="https?:/, /<use href="https?:/]) {
      assert.ok(!forbidden.test(html), `${file} loads a subresource externally`);
    }
  }
});

test("no inline scripts or handlers, so CSP can stay closed", () => {
  for (const file of pages()) {
    const html = readFileSync(file, "utf8");
    assert.ok(!/<script>(?!<\/script>)/.test(html), `${file} has an inline script`);
    assert.ok(!/\son(click|change|input|load|error)=/i.test(html), `${file} has an inline event handler`);
    assert.ok(!/<style>/.test(html), `${file} has an inline stylesheet`);
    assert.ok(!/\sstyle="/.test(html), `${file} has an inline style attribute`);
  }
});

test("referenced assets exist", () => {
  const referenced = new Set();
  for (const file of pages()) {
    for (const match of readFileSync(file, "utf8").matchAll(/(?:href|src)="(\/(?:css|js|img|font)\/[^"]+)"/g)) {
      referenced.add(match[1]);
    }
  }
  assert.ok(referenced.size >= 4, `expected the stylesheet, script, photo and icon, saw ${referenced.size}`);
  for (const ref of referenced) {
    assert.ok(existsSync(join(SITE, ref)), `${ref} is linked but not built`);
  }
});

test("in-page links land on a section", () => {
  const html = page("index.html");
  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const [, anchor] of html.matchAll(/href="(?:\/)?#([^"]+)"/g)) {
    assert.ok(ids.has(anchor), `#${anchor} points at nothing`);
  }
});

test("the not-found page leads back home", () => {
  const html = page("404.html");
  assert.ok(html.includes("Page not found"));
  assert.ok(html.includes('href="/"'));
  assert.ok(html.includes('name="robots" content="noindex"'));
});

test("the only script is the appearance control, hidden until it runs", () => {
  const html = page("index.html");
  const scripts = [...html.matchAll(/<script[^>]*src="(\/js\/[^"]+)"/g)].map((m) => m[1]);
  assert.equal(scripts.length, 1, "expected theme.js alone");
  assert.match(html, /<form class="segmented"[^>]*\shidden>/, "the appearance control should be hidden until theme.js runs");
});

test("files referenced from the stylesheet exist", () => {
  const [css] = globSync(`${SITE}/css/*.css`);
  assert.ok(css, "no stylesheet was built");
  const urls = [...readFileSync(css, "utf8").matchAll(/url\(\s*["']?(\/[^"')]+)/g)].map((m) => m[1]);
  assert.ok(urls.length >= 1, "expected the self-hosted font to be referenced");
  for (const url of urls) {
    assert.ok(existsSync(join(SITE, url)), `${url} is referenced from CSS but not built`);
  }
});

test("no feeds or sitemaps with relative URLs are published", () => {
  assert.deepEqual(globSync(`${SITE}/**/*.xml`), []);
});
