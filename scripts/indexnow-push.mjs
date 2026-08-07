#!/usr/bin/env node
/**
 * indexnow-push.mjs
 * Push the URL set of dse.hkxoptima.com to IndexNow
 * (Bing / Yandex / Seznam / Naver) so changes are indexed quickly.
 *
 * Usage:
 *   node scripts/indexnow-push.mjs            # full push (all URLs)
 *   node scripts/indexnow-push.mjs --url https://dse.hkxoptima.com/dse  # single URL
 */
const HOST = "dse.hkxoptima.com";
const SITE_URL = "https://" + HOST;
const KEY = "d1686ef364e230ddaf65f46d612e0847";
const KEY_LOCATION = `${SITE_URL}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 950; // stay under the 10k limit

// Mirror sitemap.ts
const CORE = [
  "",
  "/dse",
  "/dse/chinese",
  "/dse/chinese/cat",
  "/dse/chinese/error-notebook",
  "/guides/dse-buxi",
  "/privacy",
  "/terms",
];

const TEXTS = [
  "analects",
  "fish",
  "xiaoyaoyou",
  "quanxue",
  "lianpo",
  "chushi",
  "shishuo",
  "xishan",
  "yueyang",
  "liuguo",
  "tangshi",
  "cishi",
];

function buildAllUrls() {
  const urls = CORE.map((p) => SITE_URL + p);
  for (const slug of TEXTS) urls.push(`${SITE_URL}/dse/chinese/${slug}`);
  return urls;
}

async function submitBatch(urls) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    }),
  });
  const ok = res.ok || res.status === 202;
  const body = await res.text().catch(() => "");
  return { ok, status: res.status, body };
}

async function main() {
  const singleUrl = process.argv.find((a) => a.startsWith("--url="))?.split("=")[1];
  if (singleUrl) {
    const { ok, status } = await submitBatch([singleUrl]);
    console.log(`single ${singleUrl} -> ${status}${ok ? " OK" : ""}`);
    process.exit(ok ? 0 : 1);
  }

  const all = buildAllUrls();
  console.log(`Submitting ${all.length} URLs to IndexNow (${HOST})...`);
  let okCount = 0;
  for (let i = 0; i < all.length; i += BATCH) {
    const chunk = all.slice(i, i + BATCH);
    const { ok, status, body } = await submitBatch(chunk);
    if (ok) okCount += chunk.length;
    console.log(`  batch ${i / BATCH + 1}: ${chunk.length} urls -> ${status}${ok ? " OK" : ""}`);
    if (!ok && body) console.log(`    response: ${body.slice(0, 300)}`);
    await new Promise((r) => setTimeout(r, 200));
  }
  console.log(`Done: ${okCount}/${all.length} submitted.`);
  process.exit(okCount === all.length ? 0 : 1);
}

main().catch((e) => {
  console.error("ERROR:", e.message);
  process.exit(1);
});
