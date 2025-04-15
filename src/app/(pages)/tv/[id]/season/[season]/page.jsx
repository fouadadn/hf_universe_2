import TvDetails from "@/app/components/ShowDetails/tvDetails"

const Movie = async ({ params }) => {

    const { id } = await params
    const { season } = await params

    return (
        <div>
            <TvDetails id={id} type={"tv"} seasonNum={season} />
        </div>
    )

}

export default Movie
