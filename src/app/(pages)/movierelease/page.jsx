"use client"
import Footer from '@/app/components/Home/footer';
import { useTvContext } from '@/app/context/idContext';
import api from '@/app/utils/axiosInstance';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const Movie = () => {

  const [thisMonth, setThisMonth] = useState([])
  const [nextMonth, setNextMonth] = useState([])
  const [nextTwoMonth, setTwoNextMonth] = useState([])
  const [page, setPage] = useState(2)
  const date = new Date();
  const currentMonth = date.getMonth() + 1
  const { changeId, setArrows } = useTvContext()

  const monthsWithIndex = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December"
  };

  useEffect(() => {
    async function fetchData() {
      const fetchNetflixMovies = async (totalPages = 2) => {
        const requests = [];

        for (let i = 1; i <= totalPages; i++) {
          requests.push(
            api.get("/movie/upcoming", {
              params: {
                page: i,
              },
            })
          );
        }

        const responses = await Promise.all(requests);
        return responses.flatMap(res => res.data.results);
      };
      const netflixMovies = await fetchNetflixMovies(page);


      function filterBymounth(month, data) {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();

        const filtered = data.filter((movie) => {
          const date = new Date(movie.release_date);
          return (
            date.getMonth() + 1 === month &&
            date.getFullYear() === currentYear
          );
        }).filter((movie, index, self) =>
          index === self.findIndex((m) => m.id === movie.id)
        ).sort((a, b) => String(a.release_date).split('-')[2] - String(b.release_date).split('-')[2]);
        return filtered
      }

      setThisMonth(filterBymounth(currentMonth, netflixMovies))
      setNextMonth(filterBymounth(currentMonth + 1, netflixMovies))
      setTwoNextMonth(filterBymounth(currentMonth + 2, netflixMovies))
    }
    fetchData()
  }, [page])

  return (
    <div className='absolute top-0'>
      <div className='mb-10 '>
        <div className='relative -top-1 h-[50vh] md:h-[90vh] overflow-hidden'>
          <img src="/assets/upcoming.jpg" alt="" className=' w-full' />
          <div className='bg-gradient-to-t from-black to-transparent flex  items-end bg-[linear-gradient(to_top,black_15%,transparent_80%)] absolute top-0 bottom-0  right-0 left-0'>
            <div className='relative bottom-12 px-4 '>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white max-w-[450px] ">Schedule Release Of All Movies Around The World</h1>
              <p className="text-gray-500 ">
                Stay up to date with the hottest upcoming movie releases.
              </p>
            </div>
          </div>


        </div>


        <div className='mx-4  font-bold text-2xl'>
          <h2>UPCOMING RELEASE</h2>
        </div>

        <div className='mt-12 mx-4'>
          <h2 className='font-bold text-2xl mb-2'>{monthsWithIndex[currentMonth]}</h2>
          <hr className=' ' style={{ borderColor: '#ffffff30' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mt-4">
            {
              thisMonth.length > 0 ? thisMonth.map((movie) => (
                <Link
                  href={`movie/${movie.title}`}
                  onClick={() => { changeId(movie?.id); setArrows(false) }}
                  key={movie.id} className=" text-white rounded-lg p-2 shadow-md justify-items-start flex items-center gap-2">
                  <div className='bg-white h-12 w-12 rounded-full flex items-center justify-center'>
                    <span className='text-black text-2xl font-bold'>{String(movie.release_date)?.split('-')[2]}</span>
                  </div>
                  <div className='w-14 h-16 overflow-hidden rounded-2xl'>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-14  relative bottom-2"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                    <p className="text-sm text-gray-400" style={{ color: "#99a1af" }}>Release: {movie.release_date}</p>
                  </div>
                </Link>
              ))
                : Array.from(Array(15)).map((_, i) => <div key={i} className='flex gap-3 items-center animate-pulse'>
                  <div className='w-14 h-14 rounded-full gri'>

                  </div>
                  <div className='w-14 h-16 rounded-2xl gri'>

                  </div>

                  <div className='flex flex-col gap-1'>
                    <span className='w-44 h-3 rounded gri block'></span>
                    <span className='w-32 h-3 rounded gri block'></span>
                  </div>
                </div>
                )
            }
          </div>

        </div>



        <div className='mt-12 mx-4'>
          <h2 className='font-bold text-2xl mb-2'>{monthsWithIndex[currentMonth + 1]}</h2>
          <hr className=' ' style={{ borderColor: '#ffffff30' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mt-4">
            {
              nextMonth.length > 0 ? nextMonth.map((movie) => (
                <Link
                  href={`movie/${movie.title}`}
                  onClick={() => { changeId(movie?.id); setArrows(false) }}
                  key={movie.id} className=" text-white rounded-lg p-2 shadow-md justify-items-start flex items-center gap-2 ">
                  <div className='bg-white h-12 w-12 rounded-full flex items-center justify-center shrink-0'>
                    <span className='text-black text-2xl font-bold'>{String(movie.release_date)?.split('-')[2]}</span>
                  </div>
                  <div className='w-14 h-16 rounded-2xl overflow-hidden'>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-14 relative bottom-2 "
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                    <p className="text-sm text-gray-400" style={{ color: "#99a1af" }}>Release: {movie.release_date}</p>
                  </div>
                </Link>
              )) : Array.from(Array(15)).map((_, i) => <div key={i} className='flex gap-3 items-center animate-pulse'>
                <div className='h-14 w-14 rounded-full gri'>

                </div>
                <div className='w-14 h-16 rounded-2xl gri'>

                </div>

                <div className='flex flex-col gap-1'>
                  <span className='w-44 h-3 rounded gri block'></span>
                  <span className='w-32 h-3 rounded gri block'></span>
                </div>
              </div>
              )
            }
          </div>

          <div className='flex justify-center ' >
            <button onClick={() => { setThisMonth([]); setNextMonth([]); setPage(page + 1); }} className='rounded-2xl px-4 py-2 cursor-pointer hover:bg-white hover:text-black font-bold duration-300' style={{ border: "1px solid white" }}>Show more</button>
          </div>

        </div>






      </div>
      <hr style={{ borderColor: "#ffffff30" }} className='mt-16' />
      <Footer />
    </div>
  )
}

export default Movie
