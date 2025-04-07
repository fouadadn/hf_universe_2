import HomePageSlider from "../components/Home/HomePageSlider";
import PosterSlide from "../components/Home/posterSlide";
import PopularWeek from "../components/Home/popularWeek";
import BackdropSlide from "../components/Home/backdropSlide";


export default function Home() {

  return (
    <div className="">
      <div className=" xl:min-h-[115vh] ">
        <HomePageSlider />
      </div>

      <div className="bg-black mt-6 lg:-mt-28 z-[9999] relative mx-4">
        <div>
          <PosterSlide />
        </div>

        <div className="mt-20">
          <h1 className="text-3xl font-bold mt-14">Popular of the week</h1>
          <PopularWeek />
        </div>

        <div className="mt-14">
          <BackdropSlide media_type={"movie"} />
        </div>

        <div className="mt-14">
          <BackdropSlide media_type={"tv"} />
        </div>

        <div className="mt-14">
          <BackdropSlide media_type={"tv"} is_korean={true} />
        </div>

      </div>
    </div>
  );
}
