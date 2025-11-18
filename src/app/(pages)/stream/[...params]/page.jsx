import React from "react";
import Stream from "@/app/components/stream/stream";
import api from "@/app/utils/axiosInstance";

// Fetch show data
const getShowData = async (type, id) => {
  try {
    const response = await api.get(`/${type}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch show data:", error);
    return null;
  }
};

// Fetch episode data (for still image)
const getEpisodeData = async (showId, seasonNumber, episodeNumber) => {
  try {
    const response = await api.get(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch episode data:", error);
    return null;
  }
};

const StreamPage = async ({ params }) => {
  const paramsArr = params.params;
  const type = paramsArr[0] || null;
  const id = paramsArr[2] || null;
  const season = paramsArr[3] || null;
  const episode = paramsArr[4] || null;

  return (
    <div>
      <Stream
        id={id}
        type={type}
        season={season}
        episode={episode}
        lengthParams={paramsArr?.length}
      />
    </div>
  );
};

export default StreamPage;

// ⛳ Dynamic Metadata
export async function generateMetadata({ params }) {
  const paramsArr = params.params;
  const type = paramsArr[0] || null;
  const slug = paramsArr[1] || null;
  const id = paramsArr[2] || null;
  const season = paramsArr[3] || null;
  const episode = paramsArr[4] || null;

  if (!type || !id) {
    return {
      title: "Stream | HF Universe",
      description: "Watch your favorite movies and TV shows online for free on HF Universe.",
    };
  }

  const show = await getShowData(type, id);
  if (!show) {
    return {
      title: "Content Not Found | HF Universe",
      description: "The movie or TV show you are looking for could not be found.",
    };
  }

  let imageUrl = `https://image.tmdb.org/t/p/original${show.backdrop_path}`;

  // If it's a TV episode, get the episode still_path
  if (type === "tv" && season && episode) {
    const episodeData = await getEpisodeData(id, season, episode);
    if (episodeData?.still_path) {
      imageUrl = `https://image.tmdb.org/t/p/original${episodeData.still_path}`;
    }
  }

  const title = show.title || show.name;
  let pageTitle = `Watch ${title}`;
  if (type === "tv" && season && episode) {
    pageTitle += ` - Season ${season} Episode ${episode}`;
  }
  pageTitle += " | HF Universe";

  const description = `Stream ${title} online for free on HF Universe. ${show.overview}`;
  let url = `https://hf-universe-2.vercel.app/stream/${type}/${slug}/${id}`;
  if (type === "tv" && season && episode) {
    url += `/${season}/${episode}`;
  }

  return {
    title: pageTitle,
    description,
    keywords: [title, type, "watch online", "stream", "free", ...(show.genres?.map(g => g.name) || [])],
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      images: [imageUrl],
      type: type === "movie" ? "video.movie" : "video.tv_show",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [imageUrl],
    },
  };
}
