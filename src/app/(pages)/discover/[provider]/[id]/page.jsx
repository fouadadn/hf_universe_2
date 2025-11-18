import React from "react";
import DiscoverDetails from "@/app/components/discoverDetails/DiscoverDetails";

export default async function Discover({ params }) {
  const { provider, id } = await params;

  return (
    <div>
      <DiscoverDetails provider={provider} p_id={id} />
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { provider, id } = await params;

  const title = `Discover ${provider} | HF Universe`;
  const url = `https://hf-universe-2.vercel.app/discover/${provider}/${id}`;

  return {
    metadataBase: new URL("https://hf-universe-2.vercel.app"),
    title,
    description: `Discover movies and TV shows available on ${provider}. Updated lists, trending content, and more on HF Universe.`,
    keywords: ["discover", provider, "stream", "movies", "tv shows"],

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description: `Explore movies and shows available on ${provider}`,
      url,
      siteName: "HF Universe",
      images: [
        {
          url: "https://hf-universe-2.vercel.app/og-image.png", // optional
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description: `Explore movies and shows available on ${provider}`,
      images: ["https://hf-universe-2.vercel.app/og-image.png"], // optional
    },
  };
}
