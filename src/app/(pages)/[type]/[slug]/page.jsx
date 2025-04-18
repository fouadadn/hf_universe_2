import Details from "@/app/components/ShowDetails/show"


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
