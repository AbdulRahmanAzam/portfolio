# GEO / AIO / AEO — citation & discovery checklist

**Site:** https://abdulrahmanazam.me  

No tool can “register” your URL inside ChatGPT, Meta AI, or Google as a global memory. Those systems learn from **crawling the web** and **training data**. This checklist lists **legitimate** places where a link to your site increases discovery, backlinks, and the chance answer engines cite you.

## Already on your site (automated / files)

| Item | URL |
|------|-----|
| Sitemap | https://abdulrahmanazam.me/sitemap.xml |
| robots.txt | https://abdulrahmanazam.me/robots.txt |
| llms.txt | https://abdulrahmanazam.me/llms.txt |
| llms-full.txt | https://abdulrahmanazam.me/llms-full.txt |
| IndexNow key | https://abdulrahmanazam.me/a1b2c3d4e5f6g7h8.txt |

After each deploy, run: `npm run indexnow` (pings Bing/Yandex partners via [IndexNow](https://indexnow.org)).

## Search consoles (you log in once)

| Engine | Action |
|--------|--------|
| [Google Search Console](https://search.google.com/search-console) | Add property, verify, submit sitemap `https://abdulrahmanazam.me/sitemap.xml`, request indexing for `/` and `/blog/who-is-abdul-rahman-azam` |
| [Bing Webmaster Tools](https://www.bing.com/webmasters) | Import from Google or verify site, submit same sitemap, URL submission / IndexNow |
| [Yandex Webmaster](https://webmaster.yandex.com/) | Optional; IndexNow also notifies Yandex |

## High-signal profiles (paste your site URL in bio / website field)

Do **not** use spam directories. Use real profiles you control:

| Source | What to add |
|--------|-------------|
| [GitHub profile](https://github.com/settings/profile) | Website: `https://abdulrahmanazam.me` — add a profile README repo linking the site |
| [LinkedIn](https://www.linkedin.com/) | Contact info → Website, Featured link, About section with same wording as llms.txt |
| [LeetCode profile](https://leetcode.com/) | Website / bio if available |
| [Dev.to](https://dev.to/) | Bio URL + republish or summarize one blog post with canonical link to your site |
| [Hashnode](https://hashnode.com/) | Custom domain optional; at minimum bio link |
| [Medium](https://medium.com/) | Bio link + story pointing to abdulrahmanazam.me |
| [Stack Overflow](https://stackoverflow.com/users/edit/current) | Developer story / bio link (if you use SO) |
| [Twitter / X](https://x.com/) | Bio URL (if you use it) |

## Structured data & testing (no signup for basic tests)

| Tool | Use |
|------|-----|
| [Google Rich Results Test](https://search.google.com/test/rich-results) | Paste homepage URL — validate Person / ProfilePage JSON-LD |
| [Schema.org Validator](https://validator.schema.org/) | Paste URL or JSON-LD |

## What “100% AIO/GEO” really means

1. **On-site:** Clear facts, `llms.txt` + `llms-full.txt`, schema, sitemap, fast pages (you have most of this).  
2. **Off-site:** The same entity (name + FAST NUCES + Karachi + projects) repeated on **trusted** URLs (GitHub, LinkedIn, articles).  
3. **Time:** Crawlers and model refresh cycles are slow (weeks to months).  
4. **No API** exists to “store this site globally” in ChatGPT or Meta AI — only better crawlability + mentions.

## Optional: CI IndexNow

If you add a GitHub secret `INDEXNOW_KEY` matching `public/{key}.txt`, use `.github/workflows/indexnow.yml` (included in repo) on push to `main`.
