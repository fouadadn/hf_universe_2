'use client'
import api from '@/app/utils/axiosInstance';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/css/pagination";
import 'swiper/css';
import "swiper/css/autoplay";
import "swiper/css/navigation";
import { useEffect, useState } from 'react';
import { Bookmark, CirclePlay, Play } from 'lucide-react';
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import image from "../../../assets/black_backdrop.png"

const HomePageSlider = () => {

  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetchMovies() {
      setData((await api.get("/trending/all/day")).data.results);
    }
    fetchMovies()

  }, [])

  console.log(data)

  const show5 = data.filter(v=> v.media_type !=='person' ).slice(0, 5)
  return (
    <div className='w-full -mt-[71px] z-10'>
      <Swiper
      className='relative'
        modules={[Navigation, Pagination, Autoplay]}
        autoplay={{ delay: 50000, disableOnInteraction: false }}
        spaceBetween={1}
        slidesPerView={1}
        pagination={{ clickable: true }}
      // onSlideChange={() => console.log('slide change')}
      // onSwiper={async (swiper) => {
      //   const { data } = await api.get("/movie/1233575")
      //   // console.log(data)
      // }}
      >
        {
          show5.map((show) =>
            <SwiperSlide >
              <div className='relative '>
                <img src={show.backdrop_path ? `https://image.tmdb.org/t/p/original/${show?.backdrop_path}` : image.src } alt="backdrop image" className='w-full brightness-80' />
                {/* <img src={`https://image.tmdb.org/t/p/original/${show?.backdrop_path}` } alt="backdrop image" className='w-full brightness-90' /> */}
                <div className='bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_top,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0'></div>

                <div className='absolute z-[999] text-start bottom-10 lg:bottom-44 mx-4 md:space-y-2'>
                  <span className='bg-black/70 px-3 py-1 rounded-full md:mb-5 inline-block capitalize'>{show.media_type}</span>
                  <h1 className='text-xl md:text-5xl font-bold'>{show?.title ? show.title : show.name}</h1>
                  <span className='block md:mt-2'>{show.release_date ? show.release_date : show.first_air_date} </span>
                  <p className='w-[460px] text-sm'>{String(show.overview).split(' ').slice(0 ,40).length < String(show.overview).split(" ").length ? `${String(show.overview).split(' ').slice(0 ,20).join(" ")} ...`  : show.overview}</p>
                  <div className='flex gap-3'>
                    <button className=' rounded-xl px-2 md:px-5 py-1 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]'><Play /> <span>Play Now</span> </button>
                    <button className=' rounded-xl px-2 md:px-5 py-1 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]'><CirclePlay /> <span>Watch Trailer</span></button>
                    <button className='border-[1px] rounded-xl px-2 md:px-5 py-1 md:py-3 flex gap-2 hover:opacity-80 duration-200'><Bookmark /></button>
                  </div>
                </div>

              </div>
            </SwiperSlide>
          )
        }


      </Swiper>

    </div>
  )
}

export default HomePageSlider
