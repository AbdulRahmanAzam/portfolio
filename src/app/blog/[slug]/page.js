import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPost, getAllPublishedPosts } from "@/lib/blog";
import { portfolioData, getBlogPostSchema, PROFILE_IMAGE } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { ArrowLeft, Clock, Calendar, Tag, Github, Linkedin } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ReadingProgress } from "@/components/ReadingProgress";

export async function generateStaticParams() {
  return getAllPublishedPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return {
    ...buildMetadata({
      title: post.title,
      absoluteTitle: post.title.includes(portfolioData.name),
      description: post.excerpt,
      path: `/blog/${post.slug}`,
      openGraph: {
        type: "article",
        publishedTime: post.date,
        modifiedTime: post.updated || post.date,
        authors: [`${portfolioData.siteUrl}/`],
        tags: post.tags,
      },
    }),
    authors: [{ name: portfolioData.name, url: `${portfolioData.siteUrl}/` }],
  };
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderMarkdown(content) {
  const lines = content.split("\n");
  const elements = [];
  let i = 0;
  let inTable = false;
  let tableRows = [];
  let inCodeBlock = false;
  let codeLines = [];

  function flushTable() {
    if (tableRows.length < 2) return;
    const headers = tableRows[0];
    const dataRows = tableRows.slice(2);
    elements.push(
      <div key={`table-${elements.length}`} className="my-8 overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-muted/40">
              {headers.map((h, j) => (
                <th
                  key={j}
                  className="text-left py-3 px-4 border-b border-border font-semibold text-foreground text-xs uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, ri) => (
              <tr key={ri} className="border-b border-border/30 even:bg-muted/20 transition-colors hover:bg-muted/30">
                {row.map((cell, ci) => (
                  <td key={ci} className="py-3 px-4 text-muted-foreground">
                    {cell.includes("**") ? (
                      <strong className="text-foreground font-semibold">
                        {cell.replace(/\*\*/g, "")}
                      </strong>
                    ) : (
                      cell
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="my-8 p-5 rounded-xl bg-muted/50 border border-border/50 overflow-x-auto text-sm font-mono text-foreground leading-relaxed"
          >
            <code>{codeLines.join("\n")}</code>
          </pre>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        if (inTable) {
          flushTable();
          inTable = false;
        }
        inCodeBlock = true;
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      i++;
      continue;
    }

    if (line.includes("|") && line.trim().startsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (!inTable) inTable = true;
      tableRows.push(cells);
      i++;
      continue;
    } else if (inTable) {
      flushTable();
      inTable = false;
    }

    if (line.startsWith("## ")) {
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="text-2xl sm:text-3xl font-bold text-foreground mt-14 mb-5 tracking-tight"
        >
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="text-xl font-semibold text-foreground mt-10 mb-4"
        >
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        const text = lines[i].slice(2);
        items.push(text);
        i++;
      }
      elements.push(
        <ul
          key={`ul-${elements.length}`}
          className="my-5 space-y-2.5 pl-6 text-muted-foreground"
        >
          {items.map((item, j) => (
            <li key={j} className="list-disc leading-relaxed pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    } else if (line.match(/^\d+\.\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(lines[i].replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol
          key={`ol-${elements.length}`}
          className="my-5 space-y-2.5 pl-6 text-muted-foreground list-decimal"
        >
          {items.map((item, j) => (
            <li key={j} className="leading-relaxed pl-1">
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    } else if (line.trim() === "") {
      i++;
      continue;
    } else {
      elements.push(
        <p
          key={`p-${elements.length}`}
          className="my-5 text-muted-foreground leading-[1.8] text-[1.0625rem]"
        >
          {renderInline(line)}
        </p>
      );
    }

    i++;
  }

  if (inTable) flushTable();
  return elements;
}

function renderInline(text) {
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const codeMatch = remaining.match(/`([^`]+)`/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

    const matches = [
      boldMatch && { type: "bold", index: boldMatch.index, match: boldMatch },
      codeMatch && { type: "code", index: codeMatch.index, match: codeMatch },
      linkMatch && { type: "link", index: linkMatch.index, match: linkMatch },
    ].filter(Boolean);

    if (matches.length === 0) {
      parts.push(remaining);
      break;
    }

    matches.sort((a, b) => a.index - b.index);
    const first = matches[0];

    if (first.index > 0) {
      parts.push(remaining.slice(0, first.index));
    }

    if (first.type === "bold") {
      parts.push(
        <strong key={key++} className="text-foreground font-semibold">
          {first.match[1]}
        </strong>
      );
      remaining = remaining.slice(first.index + first.match[0].length);
    } else if (first.type === "code") {
      parts.push(
        <code
          key={key++}
          className="px-1.5 py-0.5 rounded-md bg-muted/80 border border-border/50 text-sm font-mono text-foreground"
        >
          {first.match[1]}
        </code>
      );
      remaining = remaining.slice(first.index + first.match[0].length);
    } else if (first.type === "link") {
      // Internal links stay in the same tab so they pass as normal site navigation.
      const href = first.match[2];
      const isInternal = href.startsWith("/") || href.startsWith(portfolioData.siteUrl);
      parts.push(
        <a
          key={key++}
          href={isInternal ? href.replace(portfolioData.siteUrl, "") || "/" : href}
          target={isInternal ? undefined : "_blank"}
          rel={isInternal ? undefined : "noopener noreferrer"}
          className="text-primary font-medium hover:underline underline-offset-2 decoration-primary/40 hover:decoration-primary"
        >
          {first.match[1]}
        </a>
      );
      remaining = remaining.slice(first.index + first.match[0].length);
    }
  }

  return parts;
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const allPosts = getAllPublishedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const articleSchema = getBlogPostSchema(post);

  return (
    <div className="min-h-screen bg-background noise-bg relative">
      {/* Reading progress bar */}
      <ReadingProgress />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* Decorative gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-32 w-[350px] h-[350px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-3xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            All Posts
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 group"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-[10px] font-extrabold text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/50">
                AR
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Post header */}
        <header className="mb-14">
          <div className="flex flex-wrap gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary border border-primary/15"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-foreground mb-6 leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-5 text-sm text-muted-foreground pb-8 border-b border-border/50">
            <Link href="/" rel="author" className="flex items-center gap-3 group">
              <Image
                src="/abdul-rahman-azam-square.jpg"
                alt={PROFILE_IMAGE.alt}
                width={36}
                height={36}
                className="w-9 h-9 rounded-full border border-primary/20 object-cover flex-shrink-0"
              />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">{portfolioData.name}</span>
            </Link>
            <span className="text-border">|</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <time dateTime={post.date}>{formatDate(post.date)}</time>
            </span>
            {post.updated && post.updated !== post.date ? (
              <span className="hidden sm:inline-flex items-center gap-1.5">
                Updated <time dateTime={post.updated}>{formatDate(post.updated)}</time>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
        </header>

        {/* Article content */}
        <article>{renderMarkdown(post.content)}</article>

        {/* Post navigation */}
        {(prevPost || nextPost) && (
          <div className="mt-16 pt-8 border-t border-border/50 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/60 transition-all duration-300 group"
              >
                <span className="text-xs text-muted-foreground mb-1 block">Previous</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {prevPost.title}
                </span>
              </Link>
            ) : <div />}
            {nextPost && (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="p-4 rounded-xl border border-border/50 bg-card/30 hover:border-primary/30 hover:bg-card/60 transition-all duration-300 group text-right"
              >
                <span className="text-xs text-muted-foreground mb-1 block">Next</span>
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {nextPost.title}
                </span>
              </Link>
            )}
          </div>
        )}

        {/* Author card */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm gradient-border">
          <div className="flex items-start gap-4">
            <Image
              src="/abdul-rahman-azam-square.jpg"
              alt={PROFILE_IMAGE.alt}
              width={56}
              height={56}
              className="w-14 h-14 rounded-full border border-primary/20 object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground text-lg">
                <Link href="/" rel="author" className="hover:text-primary transition-colors">
                  {portfolioData.name}
                </Link>
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {portfolioData.title} from Karachi, Pakistan. Founder of FAST Wheels and AI Season;
                builds AI agents and full-stack products from model to deployment.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <a
                  href={portfolioData.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a
                  href={portfolioData.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-primary transition-colors">
              All Posts
            </Link>
            <Link href="/" className="hover:text-primary transition-colors">
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
