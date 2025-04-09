import Details from "@/app/components/ShowDetails/show"


const Movie = async ({ params }) => {

  const { id } = await params
  const { type } = await params

  return (
    <div>
        <Details id={id} type={type} />
    </div>
  )
}

export default Movie
