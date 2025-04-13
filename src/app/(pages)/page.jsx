"use client"

import HomePageSlider from "../components/Home/HomePageSlider";
import PosterSlide from "../components/Home/posterSlide";
import PopularWeek from "../components/Home/popularWeek";
import BackdropSlide from "../components/Home/backdropSlide";
import Footer from "../components/Home/footer";

export default function Home() {


  return (
    <div className="font-sans">

      <div className=" xl:min-h-[115vh] ">
        <HomePageSlider />
      </div>

      <div className="bg-black mt-6 lg:-mt-28 z-[9999] relative ">
        <div className=" mx-4">
          <PosterSlide />
        </div>

        <div className="mt-20 mx-4">
          <h1 className="text-3xl font-bold mt-14">Popular of the week</h1>
          <PopularWeek />
        </div>

        <div className="mt-14 mx-4">
          <BackdropSlide title={"Movies"} media_type={"movie"} />
        </div>

        <div className="mt-14 mx-4">
          <BackdropSlide title={"Seires"} media_type={"tv"} />
        </div>

        <div className="mt-14 mx-4">
          <BackdropSlide title={"Korean Series"} media_type={"tv"} is_korean={true} />
        </div>

        <hr className="border-white/30 mt-5" />

        <Footer />

      </div>

    </div>
  );
}
