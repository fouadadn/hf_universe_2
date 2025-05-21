"use client";

import api from "@/app/utils/axiosInstance";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Dot, Funnel, Star, Trash2, TriangleAlert, X } from "lucide-react";
import Link from "next/link";
import { useTvContext } from "@/app/context/idContext";
import apiForHf from "@/app/utils/axiosInstanceForHfApi";
import authe from "@/app/firebase";
import useDeleteFromhistory from "@/app/Hooks/useDeleteFromHistory";

const BackdropSlide = ({ media_type, is_korean, show, title = "Your WatchList", history = false }) => {
  const [data, setData] = useState([]);
  const [showCombineData, setShowCombineData] = useState([]);
  const [genres, setGenres] = useState([]);
  const [imgSrc, setImgSrc] = useState("/assets/black_backdrop.png");
  const [isfound, setIsFound] = useState(true)
  const { slugify } = useTvContext()
  const date = new Date()
  const deleteFromHistory = useDeleteFromhistory();


  useEffect(() => {
    // console.log(show)
    async function fetchgenresAndCombineData() {
      if (show && show.length > 0) {
        const genres = media_type === "tv"
          ? (await api.get("genre/tv/list")).data.genres
          : (await api.get("genre/movie/list")).data.genres;

        setGenres(genres);

        const combineData = show.map((v) => ({
          ...v,
          media_type: media_type === "movie" ? "movie" : "tv",
          genres: v.genre_ids.map((gI) => {
            let ob = {};
            genres.forEach((g) => {
              if (g.id === gI) {
                ob = { id: g.id, name: g.name };
              }
            });
            return ob;
          }),
        }));

        setShowCombineData(combineData);
      }
    }

    !history ? fetchgenresAndCombineData() : setShowCombineData(title === 'series' ?
      show?.series?.sort((a, b) => {
        return new Date(b.watchedAt) - new Date(a.watchedAt)
      }) : title === "movies" ? show?.movies?.sort((a, b) => {
        return new Date(b.watchedAt) - new Date(a.watchedAt)
      }) : show?.combined);
  }, [show, media_type]);

  useEffect(() => {
    try {
      async function fetchData() {
        if (!show && !history) {
          const [shows, genres] = await Promise.all([

            media_type === "tv"
              ? is_korean
                ? (
                  await api.get(`/discover/tv?with_watch_providers=283&watch_region=US&sort_by=popularity.desc&primary_release_year=${date.getFullYear()}`)
                ).data.results
                : (
                  await api.get("trending/tv/day")
                ).data.results
              : is_korean
                ? (
                  await api.get("/discover/movie")
                ).data.results
                : (
                  await api.get("/discover/movie")
                ).data.results,


            media_type === "tv"
              ? (
                await api.get("genre/tv/list")
              ).data.genres
              : (
                await api.get("genre/movie/list")
              ).data.genres,
          ]);

          const combineData = [
            ...shows.map((v) => ({
              ...v,
              media_type: media_type === "movie" ? "movie" : "tv",
              genres: v.genre_ids.map((gI) => {
                let ob = {};
                genres.map((g) => {
                  if (g.id === gI) {
                    ob = { id: g.id, name: g.name };
                  }
                });
                return ob;
              }),
            })),
          ];
          setData(combineData);
        }
      }

      fetchData();
    } catch (err) {
      console.log(err);
    }
  }, []);



  const handleError = () => {
    setImgSrc("/assets/black_backdrop.png");
  };

  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(true)

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return

    const isAtStart = el.scrollLeft === 0
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 1

    setShowLeft(!isAtStart)
    setShowRight(!isAtEnd)
  }

  const scroll = (direction) => {
    const el = scrollRef.current
    if (!el) return

    el.scrollBy({ left: direction === 'right' ? window?.innerWidth : -window?.innerWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', checkScroll)
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  return (
    <div className=" relative group">

      <div className={`${(history && (title === "series" || title === "movies")) && "bg-gray-800/70 rounded-xl  px-2"}  mx-2 -z-[9999] flex items-center justify-between`}>
        {(history ? showCombineData?.length > 0 : true) &&
          <h1 className="font-bold text-3xl">
            {title}
          </h1>
        }
      </div>

      <div className="flex gap-6 overflow-auto hide-scrollbar mt-4 p-2 " ref={scrollRef}>
        {(showCombineData?.length ? showCombineData : data)?.length > 0
          && (showCombineData?.length > 0 ? showCombineData : data)
            .map((show, i) => (
              show.backdrop_path &&

              <div className="relative hover:scale-105 duration-200" key={i}>
                {
                  history &&
                  <div className="absolute flex  w-full justify-end items-end  top-0 right-0 left-0 bottom-3" >
                    <div title="Delete From History" onClick={() => { setShowCombineData(showCombineData?.filter((s) => s.show_id !== show?.show_id)); deleteFromHistory(show?.show_id, show?.media_type) }} className="mt-2 ml-2 bg-red-500/40 rounded h-fit p-1 z-[9999] cursor-pointer ">
                      <Trash2 size={17} />
                    </div>
                  </div>
                }
                <Link
                  href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name)}/${show?.id ? show?.id : show?.show_id}${history && show?.media_type === "movie" ? `#${show?.episode}` : ""}`}

                  className="shrink-0  relative  ">

                  {
                    (show?.media_type === "tv" && history) &&
                    <div className=" text-sm absolute z-50 top-0 right-0  px-2 py-[2px] text-start rounded-bl-md"
                      style={{ backgroundColor: "#00000070" }}
                    >
                      <span>
                        E{show?.episode}
                      </span>
                    </div>
                  }

                  <div className="h-[168.6px] z-50">
                    <img
                      src={
                        show.backdrop_path
                          ? `https://image.tmdb.org/t/p/w500${show.backdrop_path}`
                          : imgSrc
                      }
                      alt={show?.title ? show.title : show.name}
                      width={300}
                      height={168.75}
                      style={{
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                      className="rounded-2xl"
                      onError={handleError}
                    />
                  </div>

                  <div className="mt-3 w-[300px] ">
                    <h2 className="font-bold">
                      {(history && show?.media_type === "tv") &&
                        <span>S{show?.season}-</span>
                      }
                      {String(show.name ? show?.name : show?.title).split(' ').slice(0, 7).join(' ')}
                    </h2>
                    <div className="mt- flex items-center gap-1">
                      <div className="flex gap-1 items-center">
                        <Star fill="gold" stroke="gold" size={15} />
                        <span className="font-bold">
                          {parseFloat(show.vote_average).toFixed(1)}{" "}
                        </span>
                      </div>

                      <span className="text-stone-500">|</span>

                      <div className="flex text-stone-500 text-xs" style={{ color: "#99a1af" }}>
                        {show?.genres?.slice(0, 2)?.map((g, i, arr) => (
                          <span
                            key={i}
                            className="flex items-center text-nowrap flex-nowrap">
                            <span>{g.name}</span>{" "}
                            <Dot
                              className={`${i + 1 === arr.length ? "hidden" : "inline"
                                } -mx-1`}
                            />
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}


        {
          !(showCombineData?.length ? showCombineData : data)?.length > 0 && isfound &&
          Array.from(Array(20)).map((_, i) => {
            setTimeout(() => {
              setIsFound(false)
            }, 3000);
            return (
              <div key={i} className="animate-pulse">
                <div className="w-[300px] h-[168.75px] rounded-2xl bg-stone-600 gri"></div>

                <div>
                  <span className="w-32 h-4 rounded bg-stone-600 block mt-3 gri"></span>
                  <span className="w-48 h-4 rounded bg-stone-600 block mt-2 gri"></span>
                </div>
              </div>
            )
          }
          )
        }

        {
          !history && (!isfound && !(showCombineData?.length ? showCombineData : data)?.length > 0) ? <div className="flex justify-center w-full">

            <div className="flex gap-2 items-center ">
              <TriangleAlert />
              <span>
                No {String(title).toLocaleLowerCase()} for now
              </span>
            </div>
          </div> : ''
        }
      </div>

      <div className="opacity-0 group-hover:opacity-100 duration-300  hidden md:block ">
        <div className={`${showLeft ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999] h-[290.6px] top-0 absolute flex items-center `}>
          <div
            onClick={() => scroll("left")}
            className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
            <ChevronLeft color="black" />
          </div>
        </div>

        <div className={`${showRight ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999] h-[290.6px] top-0 right-0 absolute flex items-center justify-end`}>
          <div
            onClick={() => scroll("right")}
            className={`text-3xl  font-bold border-[1px] bg-white mr-2 rounded-full p-[1px] cursor-pointer `}>
            <ChevronRight color="black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackdropSlide;
