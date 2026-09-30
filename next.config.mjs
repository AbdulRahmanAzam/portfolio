import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === "production";
const RESUME_PDF = "/Abdul_Rahman_Azam__Resume.pdf";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  outputFileTracingRoot: __dirname,
  images: {
    // AVIF first (smallest), WebP fallback.
    formats: ["image/avif", "image/webp"],
    // Fewer widths = shorter srcset attributes in the HTML and fewer variants to generate.
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{ kebabCase member }}",
    },
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.abdulrahmanazam.me" }],
        destination: "https://abdulrahmanazam.me/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "abdulrahmanazam.com" }],
        destination: "https://abdulrahmanazam.me/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.abdulrahmanazam.com" }],
        destination: "https://abdulrahmanazam.me/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    // Shareable resume link for recruiters: /resume serves the PDF while the URL stays clean.
    return [{ source: "/resume", destination: RESUME_PDF }];
  },
  async headers() {
    // Open the PDF in the browser's viewer instead of downloading, with a proper file name.
    const resumeHeaders = [
      {
        source: "/resume",
        headers: [
          { key: "Content-Disposition", value: 'inline; filename="Abdul_Rahman_Azam_Resume.pdf"' },
          { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
        ],
      },
    ];

    if (!isProduction) {
      // In development, Next.js uses eval/react-refresh for HMR.
      // A strict CSP here can block client runtime and make sections appear missing.
      return resumeHeaders;
    }

    return [
      ...resumeHeaders,
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
