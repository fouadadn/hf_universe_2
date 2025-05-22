import Details from "@/app/components/ShowDetails/show"
import { useTvContext } from "@/app/context/idContext"
import api from "@/app/utils/axiosInstance"


const Movie = async ({ params }) => {

  const { slug } = await params
  const { type } = await params
  const { id } = await params



  return (
    <div>
      <Details slug={slug} type={type} id={id} />
    </div>
  )

}

export default Movie



export async function generateMetadata({ params }) {

  const { slug } = await params
  const { type } = await params
  const { id } = await params

  const movie = (await api.get(`/${type}/${id}`)).data;
  return {
    title: `${slug} | HF Universe`,
    description: movie.overview,
    openGraph: {
      title: `${movie.title ? movie.title : movie.name} | HF Universe`,
      description: movie.overview,
      images: [`https://image.tmdb.org/t/p/original${movie.poster_path}`],
      type: 'video.movie',
    },
  };
}