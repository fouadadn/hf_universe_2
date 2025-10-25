'use client';
import api from "@/app/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Dot,
  ExternalLink,
  Play,
  Star,
  TvMinimalPlay,
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
import apiForHf from "@/app/utils/axiosInstanceForHfApi";
import { useCarouselScroll } from "@/app/Hooks/useCarouselScroll";

const useShowData = (id, type, preloadedShowData) => {
  const [state, setState] = useState({
    show: {},
    cast: [],
    videos: [],
    recommendations: [],
    similares: [],
    seasonInfo: {},
    episodes: [],
    history: {},
    loading: true,
  });
  const [selectedSeason, setSelectedSeason] = useState(1);

  // Effect for main show data, recommendations, and history
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(authe, async (user) => {
      try {
        if (preloadedShowData && isMounted) {
          const token = user ? await user.getIdToken(true) : null;
          const res = user ? (await apiForHf.get(`/api/wishlist/check/${preloadedShowData.show.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })).data : false;

          setState(prev => ({
            ...prev,
            show: { ...preloadedShowData.show, ifSaved: res },
            cast: preloadedShowData.cast,
            videos: preloadedShowData.trailer,
          }));
        }

        if (id && isMounted) {
          const [recommendationss, similar] = await Promise.all([
            api.get(`/${type}/${id}/recommendations`).then(res => res.data.results),
            api.get(`/${type}/${id}/similar`).then(res => res.data.results)
          ]);

          if (!isMounted) return;
          setState(prev => ({ ...prev, recommendations: recommendationss, similares: similar }));
        }

        if (user && isMounted) {
          const token = await user.getIdToken(true);
          const historyResponse = (await apiForHf.get("/api/history", {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          })).data;

          if (isMounted) {
            const seriesHistory = historyResponse.series.find((s) => s.show_id === id);
            setState(prev => ({ ...prev, history: seriesHistory || {} }));
          }
        }
      } catch (err) {
        console.log(err);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [id, preloadedShowData]);

  // Effect for season-specific data
  useEffect(() => {
    let isMounted = true;
    try {
      async function fetchSeasonData() {
        if (state.show?.id && type === "tv") {
          const [season, video] = [
            (await api.get(`/tv/${state.show.id}/season/${selectedSeason}`)).data,
            (await api.get(`/tv/${state.show.id}/season/${selectedSeason}/videos`)),
          ];
          const trailer = video.data?.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );

          if (isMounted) {
            setState(prev => ({
              ...prev,
              seasonInfo: { ...season, trailler: trailer },
              episodes: season?.episodes,
            }));
          }
        }
      }
      fetchSeasonData();
    } catch (err) {
      console.log(err)
    }
    return () => { isMounted = false; };
  }, [selectedSeason, state.show?.id, type]);

  // Effect to set initial season based on history
  useEffect(() => {
    if (state.history?.season) {
      setSelectedSeason(state.history.season);
    }
  }, [state.history]);

  return { ...state, selectedSeason, setSelectedSeason, setShow: (newShow) => setState(prev => ({ ...prev, show: newShow })), setEpisodes: (newEpisodes) => setState(prev => ({ ...prev, episodes: newEpisodes })) };
};

const Details = ({ slug, type, id, preloadedShowData }) => {
  const {
    show, cast, videos, recommendations, similares, seasonInfo, episodes, history,
    selectedSeason, setSelectedSeason, setShow, setEpisodes
  } = useShowData(id, type, preloadedShowData);

  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/original`);
  const [screenWidth, setScreenWidth] = useState(0);
  const { currentUser, slugify } = useTvContext();
  const router = useRouter();
  const itemRefs = useRef({});

  const UseAddToWishList = useAddToWishList();
  const useDeleteFromWishList = UseDeleteFromWishList();

  const { scrollRef: seasonsScrollRef, scroll: scrollSeasons, showLeft: showLeftSeason, showRight: showRightSeason } = useCarouselScroll();
  const { scrollRef: castScrollRef, scroll: scrollCast, showLeft: showLeftCast, showRight: showRightCast } = useCarouselScroll();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenWidth(window.innerWidth);
      const handleResize = () => setScreenWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  function formatTime(time) {
    const hour = parseInt(time) / 60;
    let min = 0;
    if (hour > 1) {
      min = (hour - parseInt(hour)) * 60;
    }
    return `${parseInt(hour)}h${parseInt(min)}min`;
  }

  function compareDate(dateString) {
    const date = new Date();
    const release = new Date(dateString);

    if (release > date) {
      return false
    } else {
      return true
    }
  }

  const handleAddToHistory = async ({ ep = 1, season, ep_backdrop, vote_average }) => {

    const user = authe.currentUser;

    if (!user) {
      return;
    }

    const token = await user.getIdToken(true);

    const item = type === "movie" ? {
      mediaType: "movies",
      item: {
        vote_average,
        show_id: id,
        name: show?.title,
        backdrop_path: show?.backdrop_path,
        genres: show?.genres,
        watchedAt: new Date().toISOString(),
        media_type: "movie"


      }
    } :

      {
        mediaType: "series",
        item: {
          vote_average,
          show_id: id,
          name: show?.name,
          backdrop_path: ep_backdrop,
          genres: show?.genres,
          season: season ? season : selectedSeason,
          episode: ep,
          watchedAt: new Date().toISOString(),
          media_type: "tv"

        }
      }

    // if (season) {
    //   window.location.reload()
    // }


    const response = await apiForHf.post(
      "/api/history",
      item
      ,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
  }

  const handleClick = () => {
    const target = document.getElementById(`${history?.episode || 1}`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };


  useEffect(() => {
    if (selectedSeason && seasonsScrollRef.current && itemRefs.current[selectedSeason]) {
      const container = seasonsScrollRef.current;
      const item = itemRefs.current[selectedSeason];

      // Calculate scroll so item goes to center
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const offset =
        item.offsetLeft -
        container.offsetLeft -
        container.clientWidth / 2 +
        item.clientWidth / 2;

      container.scrollTo({
        left: offset,
        behavior: "smooth",
      });
    }
  }, [selectedSeason]);

  return (
    <>
      <div className="-mt-32">
        {type === "tv" &&
          <button onClick={handleClick} className="p-3 bg-[#21262a] rounded-full fixed z-[99999999] bottom-2 right-2">
            <TvMinimalPlay size={20} />
          </button>
        }
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
              <Link href={type === "movie" ? `/stream/${type}/${slug}/${id}` : '#seasons'} className="bg-[#5c00cc30] p-6 rounded-full cursor-pointer">
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

                <div className="flex text-xs md:text-sm">
                  {show?.genres?.map((g, i, arr) => (
                    <div className="flex items-center" key={i}>
                      <span>{g?.name}</span>{" "}
                      <Dot
                        className={`${arr?.length > i + 1 ? "inline" : "hidden"}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-2">
                  <Link onClick={() => type === "movie" && handleAddToHistory({ vote_average: show?.vote_average })}
                    href={type === "movie" ? `/stream/${type}/${slug}/${id}` : '#seasons'}
                    className={` ${compareDate(show?.release_date
                      ? show?.release_date
                      : show?.first_air_date) ? "block" : 'hidden'} rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]`}>
                    <Play /> <span>Play Now</span>{" "}
                  </Link>
                  <Link href={`/watch/${slugify(show?.name ? show?.name : show?.title)}/${videos?.key}`}>
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
                          UseAddToWishList(show?.id, show?.title ? show?.title : show?.name, show?.backdrop_path, show?.genres, show?.vote_average, type, show?.poster_path, show?.release_date ? show?.release_date : show?.first_air_date)
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
            <div style={{ border: "1px solid white", borderTopWidth: "0", borderLeftWidth: "0", }} className="border-[1px] animate-spin w-10 h-10 rounded-full border-t-0 border-l-0"></div>
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
              <div className="flex gap-3 mt-2 overflow-auto hide-scrollbar" ref={castScrollRef}>
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
                <div className={`${showLeftCast ? "opacity-100" : "opacity-0"} duration-300 w-24 bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999999] h-[80px] top-0 absolute flex items-center `}>
                  <div onClick={() => scrollCast("left")} className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
                    <ChevronLeft color="black" />
                  </div>
                </div>

                <div className={`${showRightCast ? "opacity-100" : "opacity-0"} duration-300 w-24 bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999999] h-[80px] top-0 right-0 absolute flex items-center justify-end`}>
                  <div onClick={() => scrollCast("right")} className={`text-3xl  font-bold border-[1px] bg-white mr-2 rounded-full p-[1px] cursor-pointer `}>
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
              <div className='relative group'>
                <div ref={seasonsScrollRef} className={`mx-1 flex gap-3 mt-2 overflow-x-scroll hide-scrollbar pb-10`}>
                  {
                    show?.seasons?.length > 0 ? show?.seasons?.map((s, i) => !(s?.season_number === 0) &&
                      s?.air_date &&
                      <button
                        ref={(el) => (itemRefs.current[s.season_number] = el)}
                        id={`S${s?.season_number}`}
                        key={i}
                        onClick={() => { setSelectedSeason(s?.season_number); if (selectedSeason !== s?.season_number) { setEpisodes([]) } }}
                        className={`${selectedSeason === s?.season_number ? "border border-gray-600 rounded-xl shadow-lg shadow-[#5c00cca1] " : ""} shrink-0 relative cursor-pointer`}>
                        <div className="overflow-hidden rounded-xl">
                          <img src={`https://image.tmdb.org/t/p/w500${s?.poster_path}`} className=" w-44 scale-110 hover:scale-100 duration-300" alt="" />
                        </div>
                        <div className="text-center">
                          {/* <span>
                            Season {s?.season_number}
                          </span> */}
                        </div>
                        <div className=" text-sm absolute z-50 top-0 right-0  px-2 py-[2px] text-start rounded-bl-md"
                          style={{ backgroundColor: "#00000070" }}
                        >
                          <span>
                            S{s?.season_number}
                          </span>
                        </div>
                      </button>) :
                      Array?.from(Array(10)).map((_, i) => <div key={i} className="shrink-0 w-44 h-[264px] gri rounded-xl animate-pulse">
                      </div>)
                  }
                </div>
                {/* */}
                <div className="md:opacity-0 group-hover:opacity-100  duration-300 ">
                  <div onClick={() => scrollSeasons("left")} className={`${showLeftSeason ? "opacity-100" : "opacity-0"} duration-400 w-10   bg-[linear-gradient(to_right,black_5%,transparent_90%)] z-[999999] h-[265px] top-0 absolute flex items-center  `}>
                    <div
                      className={`text-xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-1 cursor-pointer `}>
                      <ChevronLeft color="black" />

                    </div>
                  </div>

                  <div onClick={() => scrollSeasons("right")} className={`${showRightSeason ? "opacity-100" : "opacity-0"} duration-400 w-10 bg-[linear-gradient(to_left,black_5%,transparent_90%)] z-[999999] h-[265px] top-0 right-0 absolute flex items-center justify-end`}>
                    <div

                      className={`text-xl  font-bold border-[1px] bg-white mr-1 rounded-full p-[1px] cursor-pointer `}>
                      <ChevronRight color="black" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
            <div className="mx-4 font-bold ">
              <h2 className="text-2xl " id="episodes">Episodes of Season {selectedSeason}:</h2>
              <h3>{
                !currentUser &&
                <Link href={'/auth/sign-up'} className="text-sm text-gray-500 underline py-1 flex items-center gap-1">Sign in to track your watching <ExternalLink size={15} /></Link>
              }
              </h3>


              <div className="flex gap-3 mt-2 w-full flex-wrap justify-center  hide-scrollbar">
                {
                  episodes?.length > 0 ? episodes?.map((p, i) =>

                    <Link
                      onClick={() => {
                        handleAddToHistory({
                          ep: p?.episode_number, ep_backdrop: p?.still_path, vote_average: p?.vote_average, season: p?.season_number
                        })
                      }}
                      style={{ pointerEvents: `${!compareDate(p?.air_date) && "none"}`, border: `${(history?.episode === p?.episode_number && history?.season === selectedSeason) && "1px solid #4a5565"} ` }}
                      href={`/stream/tv/${slug}/${show?.id}/${seasonInfo?.season_number}/${p?.episode_number}`}
                      key={i}
                      id={p?.episode_number}
                      className={` relative shrink-0 rounded-xl cursor-pointer  overflow-hidden w-full md:w-72 ${history?.episode === p?.episode_number && history?.season === selectedSeason && "shadow-lg shadow-[#5c00cca1] "} `}
                    >
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
                    </Link>
                  ) :
                    Array?.from(Array(10)).map((_, i) => <div key={i} className="shrink-0 w-72 h-[161.85px] gri rounded-xl animate-pulse">
                    </div>)
                }
              </div>
            </div>
          </div>
        }

        <hr className="mt-6" style={{ borderColor: "#ffffff30" }} />
        <div className="mx-1">
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
                  className="rounded-2xl relative lg:bottom-42 w-full brightness-50 md:brightness-75"
                />

                <div className="bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_right,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>

                <div className=" z-[999] absolute top-2 md:top-10 md:px-20 md:mt-10 space-y-1">
                  <h1 className="text-xl md:text-3xl font-bold">
                    {show?.title ? show?.title : show?.name} {type === 'tv' && `: ${seasonInfo?.name}`}
                  </h1>

                  <div className="flex items-center gap-1">
                    <div className="flex items-center text-xs gap-1">
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
                    <span className={type === "movie" ? "hidden" : "inline-block"}>|</span>
                    <div className="flex items-center text-sm gap-1 text-stone-400">
                      <span className="">
                        {seasonInfo?.release_date
                          ? seasonInfo?.release_date
                          : seasonInfo?.air_date}
                      </span>
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
                      <h2 className="text-md md:text-4xl font-sans font-extrabold">{show?.tagline ? show?.tagline : "No tagline!"} </h2>
                    </div>
                  </div>

                  <div>

                    <h3 className={`${type === "movie" ? "block" : 'hidden'}`}>Networks :</h3>
                    <div className="flex gap-2 flex-wrap">
                      {type === "movie" ?
                        show?.production_companies?.slice(0, 3)?.map((pc, i) => {
                          return (pc?.logo_path ?
                            <div key={i} className="bg-white w-24 py-2 rounded px-1">
                              <img className="w-full aspect-[3] object-contain" src={`https://image.tmdb.org/t/p/w200${pc.logo_path}`} alt={pc?.name} />
                            </div> : '')
                        }) : <div className='flex gap-3'>
                          <Link href={`#seasons`} className=' rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]'><Play /> <span>Play Now</span> </Link>
                          {seasonInfo?.trailler?.key &&
                            <Link href={`/watch/${slugify(show?.name ? show?.name : show?.title)}/${seasonInfo?.trailler?.key}`} className=' rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]'><CirclePlay /> <span>Watch Trailer</span></Link>
                          }
                          <button onClick={
                            () => {
                              if (currentUser) {
                                if (show?.ifSaved) {
                                  useDeleteFromWishList(show?.id)
                                  setShow({ ...show, ifSaved: false })
                                } else {
                                  UseAddToWishList(show?.id, show?.title ? show?.title : show?.name, show?.backdrop_path, show?.genres, show?.vote_average, type, show?.poster_path, show?.release_date ? show?.release_date : show?.first_air_date)
                                  setShow({ ...show, ifSaved: true }
                                  );
                                }
                              } else {
                                router.push('/auth/sign-up')
                              }
                            }
                          } style={{ backgroundColor: "#ffffff20" }} className='cursor-pointer rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200'>
                            {
                              show?.ifSaved ?
                                seasonInfo?.trailler?.key ?
                                  <GoBookmarkSlash size={24} /> :
                                  <div className="flex gap-1 items-center" >
                                    <GoBookmarkSlash size={20} />
                                    <p>Remove from WhatchList</p>
                                  </div>
                                :
                                seasonInfo?.trailler?.key ?
                                  <Bookmark /> :
                                  <div className="flex gap-1 items-center">
                                    <Bookmark />
                                    <p>Add to Watchlist</p>
                                  </div>


                            }

                          </button>
                        </div>
                      }
                    </div>
                  </div>
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