import Link from "next/link";
import { getAllPublishedPosts } from "@/lib/blog";
import { portfolioData } from "@/lib/schema";
import { ArrowLeft, Clock, Calendar, Tag, ArrowRight, Newspaper } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndex() {
  const posts = getAllPublishedPosts();

  return (
    <div className="min-h-screen bg-background noise-bg relative">
      {/* Decorative gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] bg-primary/3 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="border-b border-border/50 bg-background/70 backdrop-blur-xl sticky top-0 z-50">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-xs font-extrabold text-primary transition-all duration-300 group-hover:bg-primary/20 group-hover:border-primary/50">
              AR
            </span>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">
              Portfolio
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-foreground">
              Blog
            </span>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Hero section */}
        <div className="mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/8 border border-primary/15 text-primary text-xs font-medium mb-6">
            <Newspaper className="w-3.5 h-3.5" />
            Technical Writing
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
            <span className="gradient-text">Blog</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Deep dives into AI/ML, full-stack engineering, and lessons learned
            from building real-world software projects.
          </p>
        </div>

        {/* Posts grid */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative p-6 sm:p-8 rounded-2xl border border-border/50 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:bg-card/70 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 gradient-border">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                    {/* Post number */}
                    <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-primary/8 border border-primary/15 text-primary font-mono text-lg font-bold flex-shrink-0">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-primary/8 text-primary/90 border border-primary/15"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2.5 group-hover:text-primary transition-colors duration-300 leading-snug">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="inline-flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5" />
                            {formatDate(post.date)}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>

                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Read
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Newspaper className="w-7 h-7 text-primary" />
            </div>
            <p className="text-muted-foreground text-lg mb-2">No posts yet</p>
            <p className="text-muted-foreground/60 text-sm">
              Check back soon for technical articles.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/50 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
          <Link href="/" className="hover:text-primary transition-colors">
            Back to Portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
}
