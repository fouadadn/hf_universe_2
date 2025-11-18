import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { TvProvider } from "./context/idContext";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://hf-universe-2.vercel.app"),

  title: {
    default: "HF Universe",
    template: "%s | HF Universe",
  },

  description:
    "Stream movies and TV shows for free on HF Universe. Enjoy the latest content without subscriptions. Watch instantly, anywhere, anytime!",

  keywords: [
    "movies",
    "tv shows",
    "streaming",
    "free movies",
    "watch series online",
    "HF Universe",
    "HF Universe 2",
    "streaming free",
    "stream movies free",
    "watch tv shows",
    "latest movies",
    "latest tv shows", 
    "no subscription",
    "online streaming",
    "free streaming",
    "movie database",
    "tv database",
    "watch online",
    "streaming platform",
    "entertainment",
    "cinema",
    "watch free",
    "binge watch",
    "watch instantly",
    "watch trailers",
    "movie reviews",
    "tv reviews",

  ],

  icons: {
    icon: "/favicon.ico",
  },

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

  creator: "HF Universe",

  // ⭐ IMPORTANT FOR GOOGLE INDEXING
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "HF Universe",
    description:
      "Stream movies and TV shows for free on HF Universe. Watch instantly with no subscriptions.",
    url: "https://hf-universe-2.vercel.app",
    siteName: "HF Universe",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "HF Universe Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "HF Universe",
    description:
      "Stream movies and TV shows instantly for free. HF Universe brings the latest content with zero subscriptions needed.",
    images: ["/og-image.png"],
    creator: "@HFUniverse",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Ads & Google Verification */}
        <meta name="admaven-placement" content="Bqdr5rdY9" />
        <meta
          name="google-site-verification"
          content="wTLaJlDKLrjuono-nL7RCoY69PgVhk9EvnEydCDs9_E"
        />
        <link rel="icon" href="/favicon.ico" />

        {/* Google Analytics */} 
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XK35E0KJR1"
        />
        <Script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XK35E0KJR1', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />

        {/* JSON-LD STRUCTURED DATA */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "HF Universe",
              url: "https://hf-universe-2.vercel.app",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://hf-universe-2.vercel.app/",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        <TvProvider>{children}</TvProvider>
      </body>
    </html>
  );
}
