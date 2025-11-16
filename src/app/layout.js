import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"
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
  metadataBase: new URL('https://hf-universe-2.vercel.app'),
  title: "HF Universe",
  description: "Stream movies and TV shows for free on HF Universe. Enjoy the latest content without the hassle of subscriptions. Watch instantly, anywhere, anytime!",
  icons: {
    icon: '/favicon.ico',
  },
  robots: {
    index: true,
    follow: true,
  },
  creator: 'HF Universe',
};


export default function RootLayout({ children }) {



  return (
    <html lang="en">
      <head>
        <meta name='admaven-placement' content='Bqdr5rdY9' />
        <meta name="google-site-verification" content="wTLaJlDKLrjuono-nL7RCoY69PgVhk9EvnEydCDs9_E" />
        <link rel="icon" href="/favicon.ico" />

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




      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        <TvProvider>
          {children}
        </TvProvider>

      </body>
    </html>
  );
}
