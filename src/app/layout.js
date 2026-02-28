import "./globals.css";
import { portfolioData, getJsonLdSchema, getWebsiteSchema } from "@/lib/schema";

export const metadata = {
  metadataBase: new URL(portfolioData.siteUrl),
  title: `${portfolioData.name} | ${portfolioData.title} - Portfolio`,
  description: portfolioData.description,
  keywords: portfolioData.keywords,
  authors: [{ name: portfolioData.name, url: portfolioData.siteUrl }],
  creator: portfolioData.name,
  robots: { index: true, follow: true },
  verification: {
    google: "k9qEtYU5Qjns6lHG_ypRJWruYzrt_cDDRZaxjWbroLw",
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: portfolioData.siteUrl,
    title: `${portfolioData.name} | ${portfolioData.title}`,
    description: portfolioData.description,
    siteName: `${portfolioData.name} Portfolio`,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: `${portfolioData.name} - ${portfolioData.title} Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${portfolioData.name} | ${portfolioData.title}`,
    description: portfolioData.description,
    images: ["/og-image.png"],
  },
  other: {
    "geo.region": "PK",
    "geo.placename": "Karachi, Pakistan",
    classification: "Portfolio, Technology, AI/ML",
    language: "English",
    "revisit-after": "7 days",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#22c55e" },
  ],
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
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />

        {/* Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLdSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getWebsiteSchema()) }}
        />

        {/* Prevent FOUC: apply dark class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t){var v=JSON.parse(t);if(v==="dark")document.documentElement.classList.add("dark")}else if(matchMedia("(prefers-color-scheme:dark)").matches){document.documentElement.classList.add("dark")}}catch(e){}})();`,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
