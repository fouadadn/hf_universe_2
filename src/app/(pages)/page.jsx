"use client"
import HomePageSlider from "../components/Home/HomePageSlider";
import PosterSlide from "../components/Home/posterSlide";
import PopularWeek from "../components/Home/popularWeek";
import BackdropSlide from "../components/Home/backdropSlide";
import Footer from "../components/Home/footer";
import Whishlist from "../components/Home/whishlistcomp";
import { useTvContext } from "../context/idContext";

export default function Home() {
  const { currentUser } = useTvContext();


  return (
    <div className="font-sans">

      <div className=" xl:min-h-[115vh] ">
        <HomePageSlider />
      </div>
 
      <div className="bg-black mt-6 lg:-mt-28 z-[9999] relative ">

        <div className="mx-2 ">
          <PosterSlide />
        </div>

        <div className={`${currentUser ? "block" : "hidden"} mt-10`}>
          <div className="-mt-16 -mb-10">
            <Whishlist check={true} />
          </div>
        </div>

        <div className="mt-20 mx-2">
          <h2 className="text-3xl font-bold mt-14">Popular of the week</h2>
          <PopularWeek />
        </div>

        <div className="mt-14 ">
          <BackdropSlide title={"Trending Movies"} media_type={"movie"} />
        </div>

        <div className="mt-14 ">
          <BackdropSlide title={"Trending Series"} media_type={"tv"} />
        </div>

        <div className="mt-14 ">
          <BackdropSlide title={"Popular Anime"} media_type={"tv"} is_korean={true} />
        </div>

        <hr className="border-white/30 mt-5" />

        <Footer />

      </div>

    </div>
  );
}
