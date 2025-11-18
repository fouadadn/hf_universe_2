import Details from "@/app/components/ShowDetails/show";
import api from "@/app/utils/axiosInstance";

// Shared helper: fetch all TMDB data in parallel
const getShowData = async (type, id) => {
  const [show, credits, videos] = await Promise.all([
    api.get(`/${type}/${id}`),
    api.get(`/${type}/${id}/credits`),
    api.get(`/${type}/${id}/videos`)
  ]);

  return {
    show: show.data,
    cast: credits.data.cast,
    trailer: videos.data.results?.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    )
  };
};

// ⛳ MAIN PAGE
const Movie = async ({ params }) => {
  const { slug, type, id } = await params;
  const { show, cast, trailer } = await getShowData(type, id);

  const title = show.title || show.name;
  const releaseDate = show.release_date || show.first_air_date;

  const pageUrl = `https://hf-universe-2.vercel.app/${type}/${slug}/${id}`;

  // JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": type === "movie" ? "Movie" : "TVSeries",
    name: title,
    description: show.overview,
    image: `https://image.tmdb.org/t/p/original${show.poster_path}`,
    datePublished: releaseDate,
    "@id": pageUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: show.vote_average,
      bestRating: "10",
      ratingCount: show.vote_count
    },
    genre: show.genres?.map((g) => g.name),
    actor: cast.slice(0, 10).map((person) => ({
      "@type": "Person",
      name: person.name
    })),
    ...(trailer && {
      trailer: {
        "@type": "VideoObject",
        name: `${title} Trailer`,
        embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${trailer.key}/hqdefault.jpg`,
        uploadDate: trailer.published_at
      }
    })
  };

  return (
    <div>
      {/* SEO – Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page Component */}
      <Details
        slug={slug}
        type={type}
        id={id}
        preloadedShowData={{ show, cast, trailer }}
      />
    </div>
  );
};

export default Movie;

// ⛳ DYNAMIC METADATA
export async function generateMetadata({ params }) {
  const { type, id, slug } = await params;
  const { show } = await getShowData(type, id);

  const title = show.title || show.name;
  const pageUrl = `https://hf-universe-2.vercel.app/${type}/${slug}/${id}`;
  const imageUrl = `https://image.tmdb.org/t/p/original${show.poster_path}`;

  return {
    metadataBase: new URL("https://hf-universe-2.vercel.app"),
    title: `${title} | HF Universe`,
    description: show.overview,
    keywords: [
      title,
      type,
      "watch online",
      "stream",
      ...(show.genres?.map((g) => g.name) || [])
    ],
    alternates: {
      canonical: pageUrl
    },
    openGraph: {
      title: `${title} | HF Universe`,
      description: show.overview,
      url: pageUrl,
      siteName: "HF Universe",
      type: type === "movie" ? "video.movie" : "video.tv_show",
      images: [{ url: imageUrl }]
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | HF Universe`,
      description: show.overview,
      images: [imageUrl]
    }
  };
}
 