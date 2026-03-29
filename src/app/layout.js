import "./globals.css";
import { portfolioData, getStructuredDataGraph } from "@/lib/schema";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(portfolioData.siteUrl),
  title: `${portfolioData.name} | ${portfolioData.title} - Portfolio`,
  description: portfolioData.description,
  authors: [{ name: portfolioData.name, url: portfolioData.siteUrl }],
  creator: portfolioData.name,
  robots: { index: true, follow: true },
  verification: {
    google: "k9qEtYU5Qjns6lHG_ypRJWruYzrt_cDDRZaxjWbroLw",
  },
  alternates: {
    canonical: `${portfolioData.siteUrl}/`,
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
    url: portfolioData.siteUrl,
    title: `${portfolioData.name} | ${portfolioData.title}`,
    description: portfolioData.description,
    images: ["/og-image.png"],
  },
  other: {
    "geo.region": "PK",
    "geo.placename": "Karachi, Pakistan",
    classification: "Portfolio, Technology, AI/ML",
    language: "English",
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

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredDataGraph()) }}
        />

        {/* Prevent FOUC: apply dark class before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t){var v=JSON.parse(t);if(v==="dark")document.documentElement.classList.add("dark")}else if(matchMedia("(prefers-color-scheme:dark)").matches){document.documentElement.classList.add("dark")}}catch(e){}})();`,
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
