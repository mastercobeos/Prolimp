// Scrape blog.prolimp.com and import posts into Sanity as `post` documents.
// - Crawls each topic listing page (with pagination) to build url -> [categories] map.
// - Fetches each post, extracts title/description/cover/date + converts body HTML
//   into Portable Text blocks, uploading inline images as Sanity assets.
// - Idempotent: uses slug-based _id so re-runs update the same document.
//
// Usage:
//   node scripts/import-blog-posts.mjs             full import
//   node scripts/import-blog-posts.mjs --dry       collect + parse, no writes
//   node scripts/import-blog-posts.mjs --limit=3   process only first 3 posts
//   node scripts/import-blog-posts.mjs --only=lavado-unidades-de-transport   single post

import { createClient } from "@sanity/client";
import * as cheerio from "cheerio";
import crypto from "node:crypto";
import { writeFile } from "node:fs/promises";
import { config } from "dotenv";
config({ path: ".env.local" });

const argv = process.argv.slice(2);
const flag = (name) => argv.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const flagVal = (name) => {
  const f = flag(name);
  if (!f) return null;
  const eq = f.indexOf("=");
  return eq >= 0 ? f.slice(eq + 1) : true;
};
const DRY = !!flag("dry");
const LIMIT = flagVal("limit") ? parseInt(flagVal("limit"), 10) : null;
const ONLY = flagVal("only");
const SAMPLE = !!flag("sample");
const PATCH_CATS = !!flag("patch-cats"); // Only re-crawl categories and patch categoria arrays

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!DRY && (!projectId || !dataset || !token)) {
  console.error("Missing env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = DRY
  ? null
  : createClient({ projectId, dataset, token, apiVersion: "2024-10-01", useCdn: false });

const BASE = "https://blog.prolimp.com";
const CATEGORIES = [
  { slug: "aseo-general", url: `${BASE}/blog/topic/aseo-general`, pages: 1 },
  { slug: "banos", url: `${BASE}/blog/topic/ba%C3%B1os`, pages: 1 },
  { slug: "albercas", url: `${BASE}/blog/topic/albercas`, pages: 1 },
  { slug: "automotriz", url: `${BASE}/blog/topic/automotriz`, pages: 1 },
  { slug: "cocina", url: `${BASE}/blog/topic/cocina`, pages: 2 },
  { slug: "industria-alimentaria", url: `${BASE}/blog/topic/industria-alimentaria`, pages: 2 },
  { slug: "desinfeccion", url: `${BASE}/blog/topic/desinfecci%C3%B3n`, pages: 1 },
  { slug: "pisos", url: `${BASE}/blog/topic/pisos`, pages: 1 },
  { slug: "lavanderia", url: `${BASE}/blog/topic/lavanderia`, pages: 1 },
];

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const k = () => crypto.randomBytes(6).toString("hex");

const imageCache = new Map(); // src -> { _ref, alt }

async function fetchText(url) {
  const res = await fetch(url, { headers: { "user-agent": UA, accept: "text/html" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.text();
}

function cleanSlug(input) {
  return (input || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[″"'`]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
}

function slugFromUrl(url) {
  const path = new URL(url).pathname.replace(/\/$/, "");
  const last = path.split("/").filter(Boolean).pop() || "";
  let decoded = last;
  try {
    decoded = decodeURIComponent(last);
  } catch {}
  return cleanSlug(decoded);
}

function isPostUrl(href) {
  try {
    const u = new URL(href, BASE);
    if (u.host !== new URL(BASE).host) return false;
    if (!u.pathname.startsWith("/blog/")) return false;
    if (u.pathname === "/blog" || u.pathname === "/blog/") return false;
    if (u.pathname.includes("/topic/")) return false;
    if (u.pathname.includes("/tag/")) return false;
    if (u.pathname.includes("/page/")) return false;
    if (u.pathname.includes("/author/")) return false;
    if (u.pathname.includes("/subscribe")) return false;
    if (u.hash) return false;
    return true;
  } catch {
    return false;
  }
}

async function collectPostsByCategory() {
  const urlMap = new Map(); // canonicalUrl -> Set<categorySlug>
  for (const cat of CATEGORIES) {
    for (let p = 1; p <= cat.pages; p++) {
      const pageUrl = p === 1 ? cat.url : `${cat.url}/page/${p}`;
      console.log(`[list] ${pageUrl}`);
      let html;
      try {
        html = await fetchText(pageUrl);
      } catch (err) {
        console.warn(`  skip: ${err.message}`);
        continue;
      }
      const $ = cheerio.load(html);
      const seen = new Set();
      $("a[href]").each((_, el) => {
        const $a = $(el);
        // Skip anchors inside the sidebar column (HubSpot shows the same
        // "recent posts" list on every category page — pollutes tagging).
        if ($a.closest(".col-md-3, .col-lg-3, aside, .sidebar").length > 0) return;
        const href = $a.attr("href");
        if (!href) return;
        if (!isPostUrl(href)) return;
        const canon = new URL(href, BASE).origin + new URL(href, BASE).pathname.replace(/\/$/, "");
        if (seen.has(canon)) return;
        seen.add(canon);
        if (!urlMap.has(canon)) urlMap.set(canon, new Set());
        urlMap.get(canon).add(cat.slug);
      });
      await sleep(300);
    }
  }
  return urlMap;
}

async function uploadImageFromUrl(src, alt = "") {
  if (!src) return null;
  let full;
  try {
    full = new URL(src, BASE).href;
  } catch {
    return null;
  }
  if (imageCache.has(full)) {
    const cached = imageCache.get(full);
    return { _type: "image", _key: k(), asset: { _type: "reference", _ref: cached._ref }, alt };
  }
  if (DRY) {
    imageCache.set(full, { _ref: `image-DRY-${cleanSlug(full).slice(-20)}` });
    return { _type: "image", _key: k(), asset: { _type: "reference", _ref: `image-DRY` }, alt };
  }
  try {
    const res = await fetch(full, { headers: { "user-agent": UA } });
    if (!res.ok) {
      console.warn(`    image HTTP ${res.status}: ${full}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const filename = decodeURIComponent(full.split("/").pop().split("?")[0]) || `image-${k()}.jpg`;
    const asset = await client.assets.upload("image", buf, { filename });
    imageCache.set(full, { _ref: asset._id });
    return { _type: "image", _key: k(), asset: { _type: "reference", _ref: asset._id }, alt };
  } catch (err) {
    console.warn(`    image error ${full}: ${err.message}`);
    return null;
  }
}

function textSpan(text, marks = []) {
  return { _type: "span", _key: k(), text, marks };
}

function normalizeText(t) {
  return t.replace(/\u00a0/g, " ").replace(/\s+/g, " ");
}

function spansFromInline($, el, markDefs) {
  const spans = [];
  function walk(nodes, activeMarks) {
    nodes.each((_, node) => {
      if (node.type === "text") {
        const text = normalizeText(node.data);
        if (text && text.trim().length > 0) {
          spans.push(textSpan(text, [...activeMarks]));
        } else if (spans.length > 0 && text === " ") {
          const last = spans[spans.length - 1];
          if (!last.text.endsWith(" ")) last.text += " ";
        }
      } else if (node.type === "tag") {
        const tag = node.name.toLowerCase();
        const $node = $(node);
        let extra = [];
        if (tag === "strong" || tag === "b") extra.push("strong");
        else if (tag === "em" || tag === "i") extra.push("em");
        else if (tag === "u") extra.push("underline");
        else if (tag === "code") extra.push("code");
        else if (tag === "a") {
          const href = $node.attr("href");
          if (href) {
            const defKey = k();
            markDefs.push({ _key: defKey, _type: "link", href });
            extra.push(defKey);
          }
        } else if (tag === "br") {
          if (spans.length > 0) {
            const last = spans[spans.length - 1];
            last.text = last.text.replace(/\s+$/, "") + "\n";
          }
          return;
        }
        walk($node.contents(), [...activeMarks, ...extra]);
      }
    });
  }
  walk($(el).contents(), []);
  if (spans.length === 0) spans.push(textSpan(""));
  return spans;
}

function makeBlock(style, spans, markDefs, extra = {}) {
  const block = {
    _type: "block",
    _key: k(),
    style,
    markDefs,
    children: spans,
    ...extra,
  };
  return block;
}

async function elementToBlocks($, el) {
  const blocks = [];
  const $el = $(el);
  const nodes = $el.contents().toArray();
  for (const node of nodes) {
    if (node.type === "text") {
      const text = normalizeText(node.data).trim();
      if (text) {
        const md = [];
        blocks.push(makeBlock("normal", [textSpan(text)], md));
      }
      continue;
    }
    if (node.type !== "tag") continue;
    const tag = node.name.toLowerCase();
    const $node = $(node);
    switch (tag) {
      case "p": {
        const md = [];
        const spans = spansFromInline($, node, md);
        const combined = spans.map((s) => s.text).join("").trim();
        // Also handle images embedded inside <p>
        const imgs = $node.find("img").toArray();
        if (imgs.length > 0) {
          for (const img of imgs) {
            const src = $(img).attr("src");
            const alt = $(img).attr("alt") || "";
            const block = await uploadImageFromUrl(src, alt);
            if (block) blocks.push(block);
          }
          if (combined) blocks.push(makeBlock("normal", spans, md));
        } else if (combined) {
          blocks.push(makeBlock("normal", spans, md));
        }
        break;
      }
      case "h1":
      case "h2":
      case "h3":
      case "h4": {
        const md = [];
        const spans = spansFromInline($, node, md);
        const combined = spans.map((s) => s.text).join("").trim();
        if (combined) blocks.push(makeBlock(tag, spans, md));
        break;
      }
      case "h5":
      case "h6": {
        const md = [];
        const spans = spansFromInline($, node, md);
        const combined = spans.map((s) => s.text).join("").trim();
        if (combined) blocks.push(makeBlock("h4", spans, md));
        break;
      }
      case "blockquote": {
        const md = [];
        const spans = spansFromInline($, node, md);
        const combined = spans.map((s) => s.text).join("").trim();
        if (combined) blocks.push(makeBlock("blockquote", spans, md));
        break;
      }
      case "ul":
      case "ol": {
        const listType = tag === "ul" ? "bullet" : "number";
        $node.children("li").each((_, li) => {
          const md = [];
          const spans = spansFromInline($, li, md);
          const combined = spans.map((s) => s.text).join("").trim();
          if (combined) {
            blocks.push(makeBlock("normal", spans, md, { listItem: listType, level: 1 }));
          }
        });
        // Also pull images inside list items
        for (const img of $node.find("img").toArray()) {
          const src = $(img).attr("src");
          const alt = $(img).attr("alt") || "";
          const block = await uploadImageFromUrl(src, alt);
          if (block) blocks.push(block);
        }
        break;
      }
      case "img": {
        const src = $node.attr("src");
        const alt = $node.attr("alt") || "";
        const block = await uploadImageFromUrl(src, alt);
        if (block) blocks.push(block);
        break;
      }
      case "figure": {
        const kids = await elementToBlocks($, node);
        blocks.push(...kids);
        break;
      }
      case "table": {
        // Flatten: bullet list of non-empty cells + preserve images
        const rows = $node.find("tr").toArray();
        for (const row of rows) {
          const cells = $(row).find("th,td").toArray();
          for (const cell of cells) {
            const $cell = $(cell);
            const imgs = $cell.find("img").toArray();
            for (const img of imgs) {
              const src = $(img).attr("src");
              const alt = $(img).attr("alt") || "";
              const block = await uploadImageFromUrl(src, alt);
              if (block) blocks.push(block);
            }
            const md = [];
            const spans = spansFromInline($, cell, md);
            const text = spans.map((s) => s.text).join("").trim();
            if (text && !imgs.length) {
              blocks.push(makeBlock("normal", spans, md, { listItem: "bullet", level: 1 }));
            } else if (text && imgs.length) {
              blocks.push(makeBlock("normal", spans, md));
            }
          }
        }
        break;
      }
      case "div":
      case "section":
      case "article":
      case "span": {
        const inner = await elementToBlocks($, node);
        blocks.push(...inner);
        break;
      }
      case "hr": {
        blocks.push(makeBlock("normal", [textSpan("---")], []));
        break;
      }
      case "iframe":
      case "script":
      case "style":
      case "noscript":
      case "form":
      case "button":
      case "input":
      case "svg":
        break;
      default: {
        const md = [];
        const spans = spansFromInline($, node, md);
        const text = spans.map((s) => s.text).join("").trim();
        if (text) blocks.push(makeBlock("normal", spans, md));
      }
    }
  }
  return blocks;
}

function cleanBlocks(blocks) {
  // Merge consecutive empty blocks; drop leading/trailing empties
  const out = [];
  for (const b of blocks) {
    if (b._type === "block") {
      const text = (b.children || []).map((s) => s.text).join("").trim();
      if (!text && !b.listItem) continue;
      out.push(b);
    } else {
      out.push(b);
    }
  }
  return out;
}

async function scrapePost(url, categories) {
  const html = await fetchText(url);
  const $ = cheerio.load(html);
  const title = $('meta[property="og:title"]').attr("content") || $("h1").first().text().trim();
  const description = ($('meta[property="og:description"]').attr("content") || "").trim();
  const coverUrl = $('meta[property="og:image"]').attr("content");
  const publishedAt = $('meta[property="article:published_time"]').attr("content") || null;
  const authorMeta = $('meta[name="author"]').attr("content");

  const bodyEl = $("#hs_cos_wrapper_post_body");
  if (bodyEl.length === 0) throw new Error(`no body wrapper for ${url}`);

  const rawBlocks = await elementToBlocks($, bodyEl.get(0));
  const contenido = cleanBlocks(rawBlocks);

  let cover = null;
  if (coverUrl) cover = await uploadImageFromUrl(coverUrl, title);

  const slug = slugFromUrl(url);
  const excerpt = (description || title).slice(0, 218);

  return {
    _id: `post-${slug}`,
    _type: "post",
    titulo: title,
    slug: { _type: "slug", current: slug },
    excerpt,
    imagenPortada: cover ? { _type: "image", asset: cover.asset, alt: title } : undefined,
    fechaPublicacion: publishedAt || new Date().toISOString(),
    autor: authorMeta || "Equipo Prolimp",
    categoria: [...categories],
    contenido,
    destacado: false,
    metaTitle: title,
    metaDescription: description,
    originalUrl: url,
  };
}

async function main() {
  console.log(`Mode: ${DRY ? "DRY (no writes)" : "LIVE"}${LIMIT ? ` limit=${LIMIT}` : ""}${ONLY ? ` only=${ONLY}` : ""}`);
  const urlMap = await collectPostsByCategory();
  console.log(`\nCollected ${urlMap.size} unique post URLs across ${CATEGORIES.length} categories.\n`);

  let entries = [...urlMap.entries()];
  if (ONLY) entries = entries.filter(([u]) => u.includes(ONLY));
  if (LIMIT) entries = entries.slice(0, LIMIT);

  // patch-cats: only update categoria on existing docs (match by originalUrl)
  if (PATCH_CATS) {
    console.log("\n=== PATCH-CATS mode: only updating categoria arrays ===\n");
    const existing = await client.fetch(
      '*[_type == "post" && defined(originalUrl)]{_id, originalUrl, categoria}'
    );
    console.log(`Loaded ${existing.length} existing posts with originalUrl.\n`);
    let patched = 0, missing = 0;
    const report = [];
    for (const [url, catsSet] of entries) {
      const cats = [...catsSet];
      const canonNoSlash = url.replace(/\/$/, "");
      const doc = existing.find((d) => {
        if (!d.originalUrl) return false;
        return d.originalUrl.replace(/\/$/, "") === canonNoSlash;
      });
      if (!doc) {
        console.log(`  ? no doc for ${url}`);
        missing++;
        report.push({ url, status: "missing", cats });
        continue;
      }
      const prev = (doc.categoria || []).join(",");
      const next = cats.join(",");
      if (prev === next) {
        console.log(`  = ${doc._id} unchanged (${next})`);
        report.push({ url, id: doc._id, status: "unchanged", cats });
        continue;
      }
      console.log(`  ~ ${doc._id}: [${prev}] -> [${next}]`);
      await client.patch(doc._id).set({ categoria: cats }).commit();
      patched++;
      report.push({ url, id: doc._id, status: "patched", prev: doc.categoria || [], cats });
    }
    console.log(`\nPatched ${patched}, missing ${missing}.`);
    await writeFile("import-blog-report.json", JSON.stringify(report, null, 2), "utf8");
    return;
  }

  const results = [];
  let idx = 0;
  for (const [url, catsSet] of entries) {
    idx++;
    const cats = [...catsSet];
    console.log(`[${idx}/${entries.length}] ${url}`);
    console.log(`  categorias: ${cats.join(", ")}`);
    try {
      const doc = await scrapePost(url, cats);
      console.log(`  titulo: ${doc.titulo}`);
      console.log(`  bloques: ${doc.contenido.length}, imagenes uploaded so far: ${imageCache.size}`);
      if (!DRY) {
        await client.createOrReplace(doc);
        console.log(`  ✓ saved as ${doc._id}`);
      }
      results.push({ url, id: doc._id, titulo: doc.titulo, cats, blocks: doc.contenido.length });
      if (SAMPLE) {
        await writeFile(`sample-${doc._id}.json`, JSON.stringify(doc, null, 2), "utf8");
        console.log(`  ~ sample dumped to sample-${doc._id}.json`);
      }
      await sleep(400);
    } catch (err) {
      console.warn(`  ✗ failed: ${err.message}`);
      results.push({ url, error: err.message });
    }
  }

  await writeFile("import-blog-report.json", JSON.stringify(results, null, 2), "utf8");
  console.log(`\nDone. Report written to import-blog-report.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
