import React from 'react'
import Stream from '@/app/components/stream/stream'
import api from '@/app/utils/axiosInstance';

const getShowData = async (type, id) => {
    try {
        const show = await api.get(`/${type}/${id}`);
        return {
            show: show.data,
        };
    } catch (error) {
        console.error("Failed to fetch show data for metadata", error);
        return { show: null };
    }
};


const page = async ({ params }) => {
    const paramsArr = (await params).params


    const type = paramsArr[0] || null;
    const id = paramsArr[2] || null;
    const season = paramsArr[3] || null
    const episode = paramsArr[4] || null



    return (
        <div>
            <Stream id={id} type={type} season={season} episode={episode} lengthParams={paramsArr?.length} />
        </div>
    )
}

export default page
export async function generateMetadata({ params }) {
    const paramsArr =(await params).params;
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

    const { show } = await getShowData(type, id);

    if (!show) {
        return {
            title: "Content Not Found | HF Universe",
            description: "The movie or TV show you are looking for could not be found.",
        };
    }

    const title = show.title || show.name;
    let pageTitle = `Watch ${title}`;
    if (type === 'tv' && season && episode) {
        pageTitle += ` - Season ${season} Episode ${episode}`;
    }
    pageTitle += ' | HF Universe';

    let description = `Stream ${title} online for free on HF Universe. ${show.overview}`;
    let url = `https://hf-universe-2.vercel.app/stream/${type}/${slug}/${id}`;
    if (type === 'tv' && season && episode) {
        url += `/${season}/${episode}`;
    }

    return {
        title: pageTitle,
        description: description,
        keywords: [title, type, 'watch online', 'stream', 'free', ...(show.genres?.map(g => g.name) || [])],
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: pageTitle,
            description: description,
            url: url,
            images: [`https://image.tmdb.org/t/p/original${show.backdrop_path}`],
        },
    };
}
