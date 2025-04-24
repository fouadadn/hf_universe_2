import Details from "@/app/components/ShowDetails/show"
import { useTvContext } from "@/app/context/idContext"


const Movie = async ({ params }) => {

  const { slug } = await params
  const { type } = await params

  return (
    <div>
      <Details slug={slug} type={type} />
    </div>
  )

}

export default Movie

export async function generateMetadata({ params }) {
  return {
    title: `HF Stream | ${params.slug}`,
  };
}
