import "./globals.css";
import { portfolioData } from "@/lib/schema";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";

// display: "optional" means a font that isn't ready at first paint is skipped
// for that page view instead of swapping in later, so text never re-wraps and
// shifts the hero (CLS) on slow mobile connections. Preloaded Inter is almost
// always ready; next/font's size-adjusted fallback covers the rest.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "optional",
});

// Only used for small accents, so it isn't preloaded ahead of the main font.
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "optional",
  preload: false,
});

// Site-wide defaults. Each page sets its own canonical URL and page-specific
// title/description; Open Graph and Twitter images come from the
// opengraph-image / twitter-image files in each route segment.
export const metadata = {
  metadataBase: new URL(portfolioData.siteUrl),
  title: {
    default: `${portfolioData.name} | ${portfolioData.title}`,
    template: `%s | ${portfolioData.name}`,
  },
  description: portfolioData.description,
  applicationName: portfolioData.name,
  authors: [{ name: portfolioData.name, url: `${portfolioData.siteUrl}/` }],
  creator: portfolioData.name,
  publisher: portfolioData.name,
  formatDetection: { telephone: false, address: false, email: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "k9qEtYU5Qjns6lHG_ypRJWruYzrt_cDDRZaxjWbroLw",
  },
  openGraph: {
    type: "website",
    siteName: portfolioData.name,
    locale: "en_US",
    title: `${portfolioData.name} | ${portfolioData.title}`,
    description: portfolioData.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${portfolioData.name} | ${portfolioData.title}`,
    description: portfolioData.description,
  },
};

export const viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon-light.svg" media="(prefers-color-scheme: light)" />
        <link rel="icon" type="image/svg+xml" href="/favicon-dark.svg" media="(prefers-color-scheme: dark)" />
        <link id="favicon-dynamic" rel="icon" type="image/svg+xml" href="/favicon-light.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Machine-readable discovery: RSS feed and llms.txt for AI crawlers */}
        <link rel="alternate" type="application/rss+xml" title={`${portfolioData.name} – Blog`} href="/feed.xml" />
        <link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />

        {/* Prevent FOUC: light is the default; apply dark only if the visitor chose it */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t&&JSON.parse(t)==="dark")document.documentElement.classList.add("dark")}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.className} ${inter.variable} ${jetBrainsMono.variable}`} suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
