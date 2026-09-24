# SEO / AEO / GEO — off-site checklist

**Site:** https://abdulrahmanazam.me · **Last reviewed:** 2026-09-23

Everything on the site itself is done in code (see "What's on the site" below). What's left can only be done by you, logged in to other services. Ranked by impact.

No tool can "register" your site inside ChatGPT, Gemini or Claude. They learn from search indexes they query live (Google, Bing, Brave) and from crawling the web. The job is to get indexed everywhere and to have the **same facts** repeated on trusted sites.

## 1. Must do now (blocking)

| # | Action | Why |
|---|--------|-----|
| 1 | **Fix `www.abdulrahmanazam.me` redirect loop in Cloudflare.** It currently 308-redirects to itself forever. In Cloudflare → Rules → Redirect Rules / Page Rules, remove the rule that sends `www` → `www`. Either make `www` DNS-only (grey cloud) CNAME to `cname.vercel-dns.com` and add `www` in Vercel → Domains, or add one rule: `www.abdulrahmanazam.me/*` → `https://abdulrahmanazam.me/$1` (301). Test: `curl -sI https://www.abdulrahmanazam.me/` must show one redirect to the apex. | Anyone (and any crawler) typing www gets an error page. |
| 2 | **Deploy**, then in **Google Search Console**: submit `https://abdulrahmanazam.me/sitemap.xml` (remove the old one if listed), then URL Inspection → Request indexing for `/`, `/blog/who-is-abdul-rahman-azam`, `/services`. | The old build told Google every blog post was a duplicate of the homepage. This must be re-crawled. |
| 3 | **Bing Webmaster Tools** (https://www.bing.com/webmasters): Import from Google Search Console, submit the sitemap. | ChatGPT search, Copilot and part of Perplexity use Bing's index. Not in Bing = invisible there. |
| 4 | **Rotate the Groq API key** and set it in Vercel as `GROQ_API_KEY` (server-only), then delete `NEXT_PUBLIC_GROQ_API_KEY`. | The old chatbot sent the key from the browser, so it was public. The chat now goes through `/api/chat` on the server. |
| 5 | Run the **IndexNow** workflow once (GitHub → Actions → IndexNow ping → Run workflow), or `npm run indexnow` after deploy. | Pushes every URL to Bing/Yandex/Naver immediately. It also runs automatically after each successful Vercel production deploy. |

## 2. Same facts everywhere (entity consistency)

AI models trust a fact when many sources agree. Use this exact wording where there's room:

> **Abdul Rahman Azam — Full Stack AI Engineer in Karachi, Pakistan. Founder of FAST Wheels and AI Season. BS Artificial Intelligence, FAST NUCES (2023–2027). abdulrahmanazam.me**

| Profile | What to set |
|---------|-------------|
| LinkedIn | Headline starting with "Full Stack AI Engineer"; Website = abdulrahmanazam.me; Featured → the site; About = the line above. Use the **same headshot** as the site. |
| GitHub | Bio currently says "AI Agent Builder" — add "Full Stack AI Engineer"; Website field = abdulrahmanazam.me; keep README linking the site. |
| LeetCode, Instagram, VS Code Marketplace publisher | Website/bio link to abdulrahmanazam.me. |
| aiseason.tech/abdul-rahman-azam | Add a link back to abdulrahmanazam.me and the same headshot; add Person JSON-LD with `sameAs` pointing to abdulrahmanazam.me. |
| fastwheels.app | Footer/About: "Built by Abdul Rahman Azam" linking to abdulrahmanazam.me. |
| Resume PDF | Site now uses the Sep 2026 resume. Consider adding AI Season (founder, Jul 2026) and "300+ LeetCode" so resume and site match fully. |

## 3. Earn mentions (what actually moves AI answers)

| Action | Notes |
|--------|-------|
| **Wikidata item** for yourself | https://www.wikidata.org — instance of: human; occupation: software engineer; educated at: FAST NUCES; official website; LinkedIn/GitHub IDs. Every claim needs a source (hackathon result pages, university/news posts). Then add the Wikidata URL to `sameAs` in `src/lib/schema.js`. |
| Hackathon / university news | Ask organizers (PROCOM, Teknofest, Iterate, atomcamp, GDG) to link your name to abdulrahmanazam.me on winner posts. These are independent sources. |
| Cross-post articles | Dev.to, Hashnode, Medium, LinkedIn Articles — republish a blog post with a canonical link back to your site. |
| YouTube / podcast | One talk or AI Season clip with abdulrahmanazam.me in the description — Gemini and Google AI Overviews lean on YouTube. |
| Reddit / Stack Overflow | Real answers in r/pakistan, r/learnmachinelearning, etc. with your profile linking the site (Reddit is the most-cited source across AI engines). |
| Google Knowledge Panel | Appears on its own once Google is confident about the entity. When it shows up, click "Claim this knowledge panel". |

## 4. Check progress (monthly)

- Google: `Abdul Rahman Azam`, `Abdul Rahman Azam FAST NUCES`, `Abdul Rahman Azam AI Season`.
- Ask ChatGPT (search on), Perplexity, Gemini, Claude and Copilot: "Who is Abdul Rahman Azam?" — note whether they cite abdulrahmanazam.me.
- Search Console → Performance → queries containing your name.
- Rich Results Test: https://search.google.com/test/rich-results?url=https%3A%2F%2Fabdulrahmanazam.me%2F
- PageSpeed Insights (mobile): https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fabdulrahmanazam.me%2F

## What's on the site (done in code)

| Item | Where |
|------|-------|
| Person + Organization (AI Season, FAST Wheels, FAST NUCES) + ProfilePage + FAQPage + projects ItemList JSON-LD | `src/lib/schema.js`, rendered on `/` |
| BlogPosting + Breadcrumb JSON-LD per post, Blog JSON-LD on `/blog` | `getBlogPostSchema`, `getBlogIndexSchema` |
| ProfessionalService + OfferCatalog on `/services` | `getServicesSchema` |
| Self-referencing canonical on every page | `src/lib/seo.js` (`buildMetadata`) |
| Generated OG/Twitter images with headshot, per page and per post | `src/lib/og.jsx` + `opengraph-image.jsx` files |
| `robots.txt` welcoming GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, etc. | `src/app/robots.js` |
| `sitemap.xml` with real lastmod dates | `src/app/sitemap.js` |
| `llms.txt`, `llms-full.txt` built from the same data | `src/lib/llms.js` |
| RSS feed | `/feed.xml` |
| Visible About (photo + bio), Experience, FAQ sections — server-rendered | `src/components/About.jsx`, `Experience.jsx`, `FAQ.jsx` |
| Mobile performance: homepage is Server Components with CSS-only animations (no framer-motion/recharts), Lenis desktop-only, chat loads on open, content-visibility on below-fold sections, font-display optional | `src/app/page.js`, `src/app/globals.css` |
| IndexNow after each production deploy | `.github/workflows/indexnow.yml`, `scripts/indexnow-ping.mjs` |

**When facts change** (new job, award, project): edit `src/lib/schema.js`, bump `LAST_UPDATED`, and deploy. The page, JSON-LD, llms.txt, chatbot and sitemap all update from it.
