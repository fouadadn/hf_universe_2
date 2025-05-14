'use client';
import api from "@/app/utils/axiosInstance";
import React, { use, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Dot,
  Play,
  Star,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import BackdropSlide from "../Home/backdropSlide";
import Footer from "../Home/footer";
import { useTvContext } from "@/app/context/idContext";
import { useRouter } from "next/navigation";
import useAddToWishList from "@/app/Hooks/useAddToWishList";
import { GoBookmarkSlash } from "react-icons/go";
import UseDeleteFromWishList from "@/app/Hooks/useDeleteFromWishList";
import authe from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import apiForHf from "@/app/utils/axiosInstanceForHfApi";



const Details = ({ slug, type, id }) => {
  const [show, setShow] = useState({});
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [similares, setSimilares] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1)
  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/original`);
  const [screenWidth, setScreenWidth] = useState(0);
  const [seasonInfo, setSeasonInfo] = useState({})
  const [episodes, setEpisodes] = useState([])
  const { currentUser } = useTvContext()
  const [rerender, setRerender] = useState(1)
  const scrollRef = useRef(null)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const router = useRouter()

  const UseAddToWishList = useAddToWishList()
  const useDeleteFromWishList = UseDeleteFromWishList()


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authe, async (user) => {
      try {
        async function fetchMovies() {

          if (id) {
            const [show, casts, video, recommendationss, similar] = [
              (await api.get(`/${type}/${id}`)).data,
              (await api.get(`/${type}/${id}/credits`)).data?.cast,
              (await api.get(`/${type}/${id}/videos`)).data?.results,
              (await api.get(`/${type}/${id}/recommendations`)).data?.results,
              (await api.get(`/${type}/${id}/similar`)).data?.results,
              // (await api.get(`/${type}/${id}/watch/providers`)).data,
            ];
            const filtredVideos = video?.find(
              (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            )

            const token = await user?.getIdToken(true);

            const res = user && (await apiForHf.get(`/api/wishlist/check/${show.id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
              }
            })).data

            setShow({ ...show, ifSaved: res });
            setCast(casts);
            setVideos(filtredVideos);
            setRecommendations(recommendationss)
            setSimilares(similar)
            setRerender(rerender + 1)
          }
        }

        fetchMovies();
      } catch (err) {
        console.log(err);
      }
    })

    return () => {
      unsubscribe();
    };
  }, [id]);

  useEffect(() => {
    try {
      async function fetchSeasonData() {
        if (show?.id) {
          const [season, video] = [
            (await api.get(`/tv/${show?.id}/season/${selectedSeason}`)).data,
            (await api.get(`/tv/${show?.id}/season/${selectedSeason}/videos`)),
          ]
          const trailer = video.data?.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );

          setSeasonInfo({ ...season, trailler: trailer })
          setEpisodes(season?.episodes)
        }
      }

      if (type === "tv") {
        fetchSeasonData()
      }
    } catch (err) {
      console.log(err)
    }

  }, [selectedSeason, id, rerender])

  function formatTime(time) {
    const hour = parseInt(time) / 60;
    let min = 0;
    if (hour > 1) {
      min = (hour - parseInt(hour)) * 60;
    }
    return `${parseInt(hour)}h${parseInt(min)}min`;
  }

  const checkScroll = () => {
    const el = scrollRef.current
    if (!el) return

    const isScrollable = el.scrollWidth > el.clientWidth
    const isAtStart = el.scrollLeft === 0
    const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 1


    setShowLeft(isScrollable && !isAtStart)
    setShowRight(isScrollable && !isAtEnd)

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

    // Listen to scroll and resize
    el.addEventListener('scroll', checkScroll)
    window.addEventListener('resize', checkScroll)

    // Optional: re-check when content loads (for dynamic content)
    const interval = setInterval(checkScroll, 500)

    setScreenWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setScreenWidth(window.innerWidth);
    });

    return () => {
      el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
      clearInterval(interval)
    }
  }, [])

  function compareDate(dateString) {
    const date = new Date();
    const release = new Date(dateString);

    if (release > date) {
      return false
    } else {
      return true
    }
  }

  return (
    <>
      <div className="-mt-32">

        {/* backdrop and poster of the show  */}
        {show?.id ? (
          <div className="relative w-full h-[621px] md:h-auto overflow-hidden">
            <Image
              src={
                imgSrc.toString().startsWith("https")
                  ? `${imgSrc}${screenWidth > 800 ? show?.backdrop_path : show?.poster_path
                  }`
                  : imgSrc
              }
              alt={show?.title ? `${show?.title}` : `${show?.name}`}
              width={1920}
              height={1080}
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              className="min-h-96 w-full"
            />

            {/* <img src={`https://image.tmdb.org/t/p/original/${show?.backdrop_path}` } alt="backdrop image" className='w-full brightness-90' /> */}
            <div className="bg-gradient-to-r from-black to-transparent hidden md:block bg-[linear-gradient(to_right,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>
            <div className="bg-gradient-to-r from-black to-transparent flex justify-center items-center bg-[linear-gradient(to_top,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0">
              <Link href={type === "movie" ? `/stream/${type}/${id}` : '#seasons'} className="bg-[#5c00cc30] p-6 rounded-full cursor-pointer">
                <Play size={70} className="relative left-1" />
              </Link>
            </div>
            <div className="absolute z-[999] text-start bottom-4 md:bottom-10 lg:bottom-26 mx-4  flex  gap-4 items-end ">

              <div className="hidden lg:block ">
                <Image
                  src={`${imgSrc}${show?.poster_path}`}
                  alt={show?.title ? `${show?.title}` : `${show?.name}`}
                  // Ensures it takes full width and scales height
                  width={284}
                  height={376}
                  style={{
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  className=" rounded-xl shadow-xl shadow-[#5c00cca1] "
                />
              </div>

              <div className="flex flex-col ">
                <div>
                  <span className={`${type === "tv" ? "block" : "hidden"}`}>
                    {show?.release_date
                      ? show?.release_date
                      : show?.first_air_date}
                  </span>

                  <h1 className="text-3xl md:text-5xl font-bold">
                    {show?.title ? show?.title : show?.name}
                  </h1>
                  <div className="flex gap-1 ">
                    <span className={`${type === "movie" ? "block" : "hidden"}`}>
                      {formatTime(show?.runtime)} |
                    </span>
                    <span className={`${type === "tv" ? "hidden" : "block"}`}>
                      {show?.release_date
                        ? show?.release_date
                        : show?.first_air_date}
                    </span>
                  </div>
                </div>

                <div className="flex">
                  {show?.genres?.map((g, i, arr) => (
                    <div className="flex" key={i}>
                      <span>{g?.name}</span>{" "}
                      <Dot
                        className={`${arr?.length > i + 1 ? "inline" : "hidden"}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  <Link href={type === "movie" ? `/stream/${type}/${id}` : '#seasons'} className={`${compareDate(show?.release_date
                    ? show?.release_date
                    : show?.first_air_date) ? "block" : 'hidden'} rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]`}>
                    <Play /> <span>Play Now</span>{" "}
                  </Link>
                  <Link href={`/watch/${videos?.key}`}>
                    <button className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]">
                      <CirclePlay /> <span>Watch Trailer</span>
                    </button>
                  </Link>
                  <button onClick={
                    () => {
                      if (currentUser) {
                        if (show?.ifSaved) {
                          useDeleteFromWishList(show?.id)
                          setShow({ ...show, ifSaved: false })
                        } else {
                          UseAddToWishList(show?.id, show?.title ? show?.title : show?.name, show?.backdrop_path, show?.genres, show?.vote_average, type, show?.poster_path)
                          setShow({ ...show, ifSaved: true }
                          );
                        }
                      } else {
                        router.push('/auth/sign-up')
                      }
                    }
                  } style={{ backgroundColor: "#ffffff20" }} className='cursor-pointer rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200'>
                    {
                      show?.ifSaved ? <GoBookmarkSlash size={24} /> : <Bookmark />}

                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center h-screen ">
            <div className="border-[1px] animate-spin w-10 h-10 rounded-full border-t-0 border-l-0"></div>
          </div>
        )}

        <div className=" mt-2">

          {/* stoty line  */}
          <div className="mx-4">
            <h2 className="font-bold text-2xl">Story line</h2>
            {show?.id ? (
              <p className="mt-2">{show?.overview} </p>
            ) : (
              <div className="mt-2 animate-pulse">
                <span className="bg-stone-600 gri w-full h-4 rounded-md block"></span>
                <span className="bg-stone-600 gri w-full h-4 mt-1 rounded-md block"></span>
                <span className="bg-stone-600 gri w-[70%] mt-1 rounded-md h-4 block"></span>
              </div>
            )}
          </div>


          <h2 className={`font-bold text-2xl mt-5  mx-4`}>Cast</h2>
          {
            <div className={`mx-4 group relative`}>
              <div
                className="flex gap-3 mt-2 overflow-auto hide-scrollbar"
                ref={scrollRef}>
                {cast?.length > 0
                  ? cast?.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">

                      <div style={{ overflow: "hidden", zIndex: "222" }}
                        className={`rounded-full  w-20 h-20 items-center justify-center flex bg-stone-400 `}>
                        {c?.profile_path ? (
                          <img
                            // style={{borderRadius: '300%'}}
                            src={`https://image.tmdb.org/t/p/w300${c?.profile_path}`}
                            className={`relative `}
                            alt={c?.name}
                          />
                        ) : (
                          <UserRound size={50} />
                        )}
                      </div>

                      <div>
                        <h2 className="whitespace-nowrap">{c?.name}</h2>
                        <h3 className="text-[#5c00cc] whitespace-nowrap">
                          {c?.character}{" "}
                        </h3>
                      </div>
                    </div>
                  ))
                  : Array.from(Array(20)).map((_, i) => (
                    <div
                      key={i}
                      className="flex gap-2 animate-pulse items-center">
                      <div
                        className={`rounded-full shrink-0 w-20 h-20  items-center justify-center flex bg-stone-600 gri `}></div>
                      <div>
                        <h2 className="w-44 bg-stone-600 gri h-5 rounded-md"></h2>
                        <h3 className="w-32 mt-2 bg-stone-600 gri h-5 rounded-md"></h3>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="opacity-0 group-hover:opacity-100 duration-300 ">
                <div className={`${showLeft ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999999] h-[80px] top-0 absolute flex items-center `}>
                  <div
                    onClick={() => scroll("left")}
                    className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
                    <ChevronLeft color="black" />
                  </div>
                </div>

                <div className={`${showRight ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999999] h-[80px] top-0 right-0 absolute flex items-center justify-end`}>
                  <div
                    onClick={() => scroll("right")}
                    className={`text-3xl  font-bold border-[1px] bg-white mr-2 rounded-full p-[1px] cursor-pointer `}>
                    <ChevronRight color="black" />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>

        {
          type === 'tv' &&
          <div>
            <div className=" font-bold mt-5" id="seasons">
              <h2 className="mx-4 text-2xl ">Seasons</h2>
              <div className='relative group '>
                <div ref={scrollRef} className={`mx-4 flex gap-3 mt-2 overflow-x-scroll hide-scrollbar`}>
                  {
                    show?.seasons?.length > 0 ? show?.seasons?.map((s, i) => !(s?.season_number === 0) &&
                      s?.air_date &&
                      <button key={i} onClick={() => { setSelectedSeason(s?.season_number); selectedSeason !== s?.season_number && setEpisodes([]) }} className="shrink-0 cursor-pointer">
                        <div className="overflow-hidden rounded-xl">
                          <img src={`https://image.tmdb.org/t/p/w500${s?.poster_path}`} className=" w-44 scale-110 hover:scale-100 duration-300" alt="" />
                        </div>
                        <div className="text-center">
                          <span>
                            Season {s?.season_number}
                          </span>
                        </div>
                      </button>) :
                      Array?.from(Array(10)).map((_, i) => <div key={i} className="shrink-0 w-44 h-[264px] gri rounded-xl animate-pulse">
                      </div>)
                  }
                </div>
                {/* */}
                <div className="opacity-0 group-hover:opacity-100  duration-300 ">
                  <div className={`${showLeft ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999999] h-[265px] top-0 absolute flex items-center  `}>
                    <div
                      onClick={() => scroll("left")}
                      className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
                      <ChevronLeft color="black" />

                    </div>
                  </div>

                  <div className={`${showRight ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999999] h-[265px] top-0 right-0 absolute flex items-center justify-end`}>
                    <div
                      onClick={() => scroll("right")}
                      className={`text-3xl  font-bold border-[1px] bg-white mr-2 rounded-full p-[1px] cursor-pointer `}>
                      <ChevronRight color="black" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="mx-4 font-bold mt-16">
              <h2 className="text-2xl " id="episodes">Episodes of Season {selectedSeason}: </h2>

              <div className="flex gap-3 mt-2 w-full flex-wrap justify-center   hide-scrollbar">
                {
                  episodes?.length > 0 ? episodes?.map((p, i) =>
                    <Link style={{ pointerEvents: `${!compareDate(p?.air_date) && "none"}` }} href={`/stream/tv/${show?.id}/${seasonInfo?.season_number}/${p?.episode_number}`} key={i}
                      className={` relative shrink-0 rounded-xl cursor-pointer  overflow-hidden w-full md:w-72 `}>
                      <div className={`${!compareDate(p?.air_date) && "bg-stone-800"} overflow-hidden rounded-xl`}>
                        {
                          compareDate(p?.air_date) ?
                            <img src={`https://image.tmdb.org/t/p/w500${p?.still_path}`}
                              className="w-full  md:h-[161.85px]  md:w-72 scale-110 hover:scale-100 duration-300" alt="" /> :
                            <div className="w-full flex justify-center items-center  md:h-[161.85px]  md:w-72 duration-300 py-10">
                              <div className="flex flex-col items-center">
                                <span>coming soon</span>
                                <span className="text-xs text-stone-400">{p?.air_date}</span>
                              </div>
                            </div>
                        }

                      </div>
                      <div className="text-center mt-1">
                        {
                          compareDate(p?.air_date) &&
                          <span>
                            {p?.name}
                          </span>
                        }
                      </div>

                      <div className=" text-sm absolute z-50 top-0 right-0  px-2 py-[2px] text-start rounded-bl-md"
                        style={{ backgroundColor: "#00000070" }}
                      >
                        <span>
                          E{p?.episode_number}
                        </span>
                      </div>
                    </Link>) :
                    Array?.from(Array(10)).map((_, i) => <div key={i} className="shrink-0 w-72 h-[161.85px] gri rounded-xl animate-pulse">
                    </div>)
                }
              </div>
            </div>
          </div>
        }

        <div className="mx-4">
          <div className="mt-16">
            <BackdropSlide title={'Recommendations'} is_korean={false} media_type={type} show={recommendations} />
          </div>
          <div>
            {show?.id ? (
              <div className=" md:h-96 overflow-hidden mt-16 rounded-2xl relative">
                {/* <Link href={`/${show.media_type}/${show.id}`}> */}
                <Image
                  src={`https://image.tmdb.org/t/p/original${show.backdrop_path}`}
                  alt={show?.title ? `${show.title}` : `${show.name}`}
                  // Ensures it takes full width and scales height
                  width={1920} // Set an arbitrary width
                  height={150}
                  style={{
                    objectFit: "contain", // Use CSS to set objectFit
                    objectPosition: "center", // Optional, if you need to control the position of the image
                  }}
                  className="rounded-2xl relative lg:bottom-42 w-full"
                />

                <div className="bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_right,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>

                <div className=" z-[999] absolute top-2 md:top-10 md:px-20 md:mt-10 space-y-1">
                  <h1 className="text-xl md:text-3xl font-bold">
                    {show?.title ? show?.title : show?.name} {type === 'tv' && `: ${seasonInfo?.name}`}
                  </h1>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-sm gap-1">
                      <Star fill="gold" stroke="gold" size={15} />

                      <div>
                        <span className="font-semibold">
                          {parseFloat(show.vote_average).toFixed(1)}{" "}
                        </span>
                      </div>
                    </div>
                    <span>|</span>
                    <div className="flex text-stone-400" style={{ color: "#a6a09b" }}>
                      {/* <Film className='' stroke='gray' /> */}
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
                  {/* <p className="w-80 md:w-[56%] text-xs md:text-base ">
                      {String(show.overview).split(" ").slice(0, 21).join(" ")}{" "}
                      <span>
                        {String(show.overview).split(" ").length > 21 ? "..." : ""}
                      </span>{" "}
                    </p> */}
                  <div className="flex">
                    <h2 className="whitespace-nowrap">Countries : </h2>
                    {show?.production_countries?.map((c, i, arr) =>
                      <div key={i} className="flex gap-1 " >
                        <span className="ml-1 whitespace-nowrap">{c?.name}</span>
                        <span className={`${arr.length > i + 1 ? "inline" : "hidden"} `} > | </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-1 items-center " >
                    <div className="md:mt-2">
                      <h2 className="text-xl md:text-4xl font-sans font-extrabold">{show?.tagline ? show?.tagline : "No tagline!"} </h2>
                    </div>
                  </div>

                  <div>
                    <h2 className="whitespace-nowrap">Networks :</h2>
                    <div className="flex gap-2 flex-wrap">
                      {type === "movie" ?
                        show?.production_companies?.slice(0, 3)?.map((pc, i) => {
                          return (pc?.logo_path ?
                            <div key={i} className="bg-white w-24 py-2 rounded px-1">
                              <img className="w-full aspect-[3] object-contain" src={`https://image.tmdb.org/t/p/w200${pc.logo_path}`} alt={pc?.name} />
                            </div> : '')
                        }) : <div className='flex gap-3'>
                          <Link href={`#seasons`} className=' rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]'><Play /> <span>Play Now</span> </Link>
                          <Link href={`/watch/${seasonInfo?.trailler?.key}`} className=' rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]'><CirclePlay /> <span>Watch Trailer</span></Link>
                          <button onClick={
                            () => {
                              if (currentUser) {
                                if (show?.ifSaved) {
                                  useDeleteFromWishList(show?.id)
                                  setShow({ ...show, ifSaved: false })
                                } else {
                                  UseAddToWishList(show?.id, show?.title ? show?.title : show?.name, show?.backdrop_path, show?.genres, show?.vote_average, type, show?.poster_path)
                                  setShow({ ...show, ifSaved: true }
                                  );
                                }
                              } else {
                                router.push('/auth/sign-up')
                              }
                            }
                          } style={{ backgroundColor: "#ffffff20" }} className='cursor-pointer rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200'>
                            {
                              show?.ifSaved ? <GoBookmarkSlash size={24} /> : <Bookmark />}

                          </button>                        </div>
                      }
                    </div>
                  </div>

                  {/* <div className="flex gap-3 mt-3">
                      <button className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]">
                        <Play /> <span>Play Now</span>{" "}
                      </button>
                      <button className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]">
                        <CirclePlay /> <span>Watch Trailer</span>
                      </button>
                      <button className="border-[1px] rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200">
                        <Bookmark />
                      </button>
                    </div> */}

                </div>
                {/* </Link> */}
              </div>
            ) : (
              <div className="h-80 md:h-96 overflow-hidden mt-16 rounded-2xl relative bg-stone-600 gri animate-pulse ">
                <div className="bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_right,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>

                <div className=" z-[999] absolute top-10 md:px-20 mt-10 space-y-1">
                  <h1 className="text-3xl font-bold bg-stone-600 gri W-32 h-8 rounded">
                    {" "}
                  </h1>

                  <div className="bg-stone-600 gri w-40 rounded mt-3 h-4"></div>
                  <div className="w-96 md:w-[56%]">
                    <div className="W-full h-4 rounded bg-stone-600 gri my-1"></div>
                    <div className="W-[75%] h-4 rounded bg-stone-600 gri my-1"></div>
                    <div className="W-full h-4 rounded bg-stone-600 gri my-1"></div>
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button className=" rounded-xl px-2 w-32 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-stone-600 gri">
                      {" "}
                    </button>
                    <button className=" rounded-xl px-2 md:px-5 w-[165.65px] py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-stone-600 gri"></button>
                    <button className=" w-[65.5px] h-[49.6px] rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-stone-600 gri"></button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="mt-16">
            <BackdropSlide title={`Similare ${type} for you`} is_korean={false} media_type={type} show={similares} />
          </div>
        </div>

      </div >
      <hr className="mt-6" style={{ borderColor: "#ffffff30" }} />
      <Footer />
    </>
  );
};

export default Details;






// golt lik qchrif bghit n3N9EK 