/**
 * Pings IndexNow (Bing, Yandex, Seznam, Naver, etc.) with all public URLs.
 * Run after deploy: npm run indexnow
 * Docs: https://indexnow.org/documentation
 */

const HOST = "abdulrahmanazam.me";
const SITE = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY || "a1b2c3d4e5f6g7h8";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

// Discovery files that are not listed in the sitemap itself.
const EXTRA_URLS = [
  `${SITE}/llms.txt`,
  `${SITE}/llms-full.txt`,
  `${SITE}/feed.xml`,
];

// Read page URLs from the deployed sitemap so new pages and posts are picked up automatically.
async function getUrls() {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Could not fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return [...new Set([...pages, ...EXTRA_URLS])];
}

async function main() {
  const URLS = await getUrls();
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: URLS,
  });

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  });

  const text = await res.text();
  console.log("IndexNow status:", res.status, res.statusText);
  if (text) console.log("Body:", text);
  console.log("URLs submitted:", URLS.length);

  if (!res.ok && res.status !== 202) {
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
