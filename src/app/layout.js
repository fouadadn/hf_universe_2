import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HF stream",
  description: "Stream movies and TV shows for free on HF Stream. Enjoy the latest content without the hassle of subscriptions. Watch instantly, anywhere, anytime!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="wTLaJlDKLrjuono-nL7RCoY69PgVhk9EvnEydCDs9_E" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Analytics />
        {children}
      </body>
    </html>
  );
}
