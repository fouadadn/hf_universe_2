import TopBackdrop from "@/app/components/ShowDetails/topBackdrop"


const Movie = async ({ params }) => {

  const { id } = await params
  const { type } = await params

  return (
    <div>
      <div>
        <TopBackdrop id={id} type={type} />
      </div>
    </div>
  )
}

export default Movie
