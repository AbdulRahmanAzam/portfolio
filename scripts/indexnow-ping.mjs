/**
 * Pings IndexNow (Bing, Yandex, Seznam, Naver, etc.) with all public URLs.
 * Run after deploy: npm run indexnow
 * Docs: https://indexnow.org/documentation
 */

const HOST = "abdulrahmanazam.me";
const SITE = `https://${HOST}`;
const KEY = process.env.INDEXNOW_KEY || "a1b2c3d4e5f6g7h8";
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

const URLS = [
  `${SITE}/`,
  `${SITE}/blog`,
  `${SITE}/blog/who-is-abdul-rahman-azam`,
  `${SITE}/blog/abdul-rahman-azam-ai-ml-projects-portfolio`,
  `${SITE}/blog/building-income-prediction-system-with-ml`,
  `${SITE}/blog/minimax-alpha-beta-pruning-game-ai`,
  `${SITE}/blog/my-journey-into-full-stack-ai-engineering`,
  `${SITE}/llms.txt`,
  `${SITE}/llms-full.txt`,
  `${SITE}/robots.txt`,
  `${SITE}/sitemap.xml`,
];

async function main() {
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
