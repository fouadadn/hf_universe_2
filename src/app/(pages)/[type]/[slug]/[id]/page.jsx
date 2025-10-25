import Details from "@/app/components/ShowDetails/show"
import api from "@/app/utils/axiosInstance"

// Helper function to fetch show data and avoid duplication
const getShowData = async (type, id) => {
  // Using Promise.all to fetch data in parallel for better performance
  const [show, credits, videos] = await Promise.all([
    api.get(`/${type}/${id}`),
    api.get(`/${type}/${id}/credits`),
    api.get(`/${type}/${id}/videos`),
  ]);

  return {
    show: show.data,
    cast: credits.data.cast,
    trailer: videos.data.results?.find(
      (vid) => vid.type === "Trailer" && vid.site === "YouTube"
    ),
  };
};

const Movie = async ({ params }) => {
  const { slug, type, id } = await params;

  // Fetch all necessary data at once
  const { show, cast, trailer } = await getShowData(type, id);

  const title = show.title ? show.title : show.name;
  const releaseDate = show.release_date ? show.release_date : show.first_air_date;

  const url = `https://hf-universe-2.vercel.app/${type}/${slug}/${id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': type === 'movie' ? 'Movie' : 'TVSeries',
    name: title,
    description: show.overview,
    image: `https://image.tmdb.org/t/p/original${show.poster_path}`,
    datePublished: releaseDate,
    '@id': url,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: show.vote_average,
      bestRating: '10',
      ratingCount: show.vote_count,
    },
    genre: show.genres.map((g) => g.name),
    actor: cast.slice(0, 10).map(person => ({ '@type': 'Person', name: person.name })),
    ...(trailer && {
      trailer: {
        '@type': 'VideoObject',
        name: `${title} Trailer`,
        embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
        thumbnailUrl: `https://i.ytimg.com/vi/${trailer.key}/hqdefault.jpg`,
        description: `Trailer for ${title}`,
        uploadDate: trailer.published_at,
      }
    }),
  };

  return (
    <div>
      {/* Inject JSON-LD for Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Details slug={slug} type={type} id={id} preloadedShowData={{ show, cast, trailer }} />
    </div>
  )

}

export default Movie


export async function generateMetadata({ params }) {
  const { type, id, slug } = await params

  // Fetch data using the helper function
  const { show } = await getShowData(type, id);
  const title = show.title ? show.title : show.name;
  const url = `https://hf-universe-2.vercel.app/${type}/${slug}/${id}`;

  return {
    title: `${title} | HF Universe`,
    description: show.overview,
    keywords: [title, type, 'watch online', 'stream', ...(show.genres?.map(g => g.name) || [])],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | HF Universe`,
      description: show.overview,
      url: url,
      siteName: 'HF Universe',
      images: [
        {
          url: `https://image.tmdb.org/t/p/original${show.poster_path}`,
        },
      ],
      type: type === 'movie' ? 'video.movie' : 'video.tv_show',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | HF Universe`,
      description: show.overview,
      images: [`https://image.tmdb.org/t/p/original${show.poster_path}`],
    },
  };
}