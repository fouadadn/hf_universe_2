"use client";

import api from "@/app/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Dot, Star } from "lucide-react";
import Link from "next/link";
import { useTvContext } from "@/app/context/idContext";
import authe from "@/app/firebase";
import apiForHf from "@/app/utils/axiosInstanceForHfApi";
import BackdropSlide from "./backdropSlide";

const PosterSlide = ({ movie, tv }) => {
  const [media, setMedia] = useState([]);
  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/w500`);
  const [providers, setProviders] = useState([]);
  const popularProviderIds = [8, 9, 337, 15, 283, 387, 526, 350, 531]; //80 AMC
  const { slugify, changeProviderId } = useTvContext()
  const [history, setHistory] = useState({})


  useEffect(() => {
    try {
      async function fetchJustRelease() {
        const [movies, shows, movieGenres, tvGenres, movieProviders] =
          await Promise.all([
            (await api.get("/movie/now_playing")).data.results,
            (await api.get("/tv/on_the_air")).data.results,
            (await api.get("genre/movie/list")).data.genres,
            (await api.get("genre/tv/list")).data.genres,
            (
              await api.get("watch/providers/movie")
            ).data?.results?.filter((prov) =>
              popularProviderIds.includes(prov.provider_id)
            ),
            // (await api.get('watch/providers/movie')).data?.results,
          ]);
        // const amcProvider = movieProviders.find(p => p.provider_name === "AMC+");
        // console.log(amcProvider);

        setProviders(movieProviders);

        const combineData = [
          ...(movie ? movie : movies).map((v) => ({
            ...v,
            media_type: "movie",
            genres: v.genre_ids.map((gI) => {
              let ob = {};
              movieGenres.map((g) => {
                if (g.id === gI) {
                  ob = { id: g.id, name: g.name };
                }
              });
              return ob;
            }),
          })),
          ...(tv ? tv : shows).map((v) => ({
            ...v,
            media_type: "tv",
            genres: v.genre_ids.map((gI) => {
              let ob = {};
              tvGenres.map((g) => {
                if (g.id === gI) {
                  ob = { id: g.id, name: g.name };
                }
              });
              return ob;
            }),
          })),
        ]

        setMedia(combineData);
      }

      fetchJustRelease();
    } catch (err) {
      console.log(err);
    }
  }, [movie, tv]);



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

    const scrollAmount = 200
    el.scrollBy({ left: direction === 'right' ? window?.innerWidth : -window?.innerWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (!el) return

    el.addEventListener('scroll', checkScroll)
    return () => el.removeEventListener('scroll', checkScroll)
  }, [])

  const user = authe.currentUser;

  useEffect(() => {
    async function fetchHistory() {
      if (!user) {
        return;
      }

      const token = await user.getIdToken(true);

      const response = await apiForHf.get(
        "/api/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );
      setHistory(response.data)
    }
    fetchHistory()
  }, [user])

  return (
    <>
      {tv && movie ? "" :
        <div className="overflow-auto gap-5 -mt-8 flex hide-scrollbar pb-10 pt-5 px-2">
          {providers?.length > 0
            ? providers.map((p, i) => (
              <Link
                href={`/discover/${slugify(p?.provider_name)}/${p.provider_id}`}
                key={p?.provider_id}
                onClick={() => changeProviderId(p?.provider_id)}
                className="hover:scale-105 duration-200"
              >
                <div
                  className="relative shrink-0 h-[64px] w-62 flex rounded-2xl  items-center gap-3 px-2 py-1 rounded- shadow-xl overflow-hidden group"
                  style={{
                    backgroundImage: `url("https://image.tmdb.org/t/p/original${p?.logo_path}")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "16px",
                    overflow: "hidden"
                  }}
                >
                  {/* Cool Blur Layer */}
                  <div className="absolute inset-0 bg-black/40 transition-all rounded-2xl duration-300 backdrop-blur-xl"></div>

                  {/* <div className=" rounded-2xl absolute top-0 bottom-0 right-0 left-0 z-50 p-6" ></div> */}

                  {/* Optional Gradient Overlay for depth */}
                  {/* <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div> */}

                  {/* Logo */}
                  <img
                    src={`https://image.tmdb.org/t/p/original${p?.logo_path}`}
                    alt={p.provider_name}
                    className="relative z-10 w-[50px] h-[50px] object-cover object-center rounded-xl"
                  />

                  {/* Name */}
                  <div className="relative z-10">
                    <h2 className="text-xl font-bold text-white">{p.provider_name}</h2>
                  </div>
                </div>
              </Link>

            ))
            : Array.from(Array(8)).map((_, i) => (
              <div
                key={i}
                className="w-62 rounded-2xl h-[64px] bg-stone-600 gri shrink-0"></div>
            ))}
        </div>}

      {(user && history?.combined?.length > 0) &&
        <BackdropSlide title="Continue Watching" show={history?.combined} history={true} />
      }


      <h1 className="text-3xl font-bold mt-5">Just Release</h1>
      <div className="relative group ">
        <div className="flex gap-6 overflow-auto mt-3 hide-scrollbar py-3 px-3 "
          ref={scrollRef}>

          {media.length > 0
            ? media.map((show, i) => (
              <Link
                href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name)}/${show?.id}`}
                key={i}
                className="shrink-0 relative hover:scale-105 duration-200">
                <div className="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-t from-black to-transparent to-45%">
                  <div className="absolute bottom-0 z-50">
                    <div className="px-5 pb-3">
                      <h2 className=" font-semibold">
                        {show.title ? String(show.title).split(' ').slice(0, 3).join(' ') : String(show.name).split(' ').slice(0, 3).join(' ')}
                      </h2>
                      <div className="flex items-center text-sm gap-1">
                        <Star fill="gold" stroke="gold" size={15} />

                        <div>
                          <span className="font-semibold">
                            {parseFloat(show.vote_average).toFixed(1)}{" "}
                            <span className="text-gray-400">|</span>{" "}
                          </span>
                          {show?.genres?.slice(0, 2)?.map((g, i, arr) => (
                            <span key={i} className="text-gray-400" style={{ color: " #99a1af" }}>
                              {g.name}{" "}
                              <Dot
                                className={` ${i + 1 === 2 || arr.length === i + 1
                                  ? "hidden"
                                  : "inline"
                                  } -mx-2 px-0`}
                              />{" "}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[linear-gradient(to_top,black_3%,transparent_70%)] absolute top-0 right-0 bottom-0 left-0">

                  </div>
                </div>
                <img
                  src={
                    imgSrc.toString().startsWith("https")
                      ? `${imgSrc}${show?.poster_path}`
                      : imgSrc
                  }
                  alt={show?.title ? show.title : show.name}
                  // Ensures it takes full width and scales height
                  width={250} // Set an arbitrary width
                  height={350}
                  style={{
                    objectFit: "cover", // Use CSS to set objectFit
                    objectPosition: "center", // Optional, if you need to control the position of the image
                  }}
                  className="rounded-xl "
                // onError={handleError}
                />
              </Link>
            ))
            : Array.from(Array(20)).map((_, i) => (
              <div
                key={i}
                className="w-[250px] h-[375px] bg-stone-600 shrink-0 rounded-xl animate-pulse gri"></div>
            ))
          }
        </div>

        <div className="opacity-0 group-hover:opacity-100 duration-300 hidden md:block">
          <div className={`${showLeft ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999] h-[375px] top-0 absolute flex items-center `}>
            <div
              onClick={() => scroll("left")}
              className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
              <ChevronLeft color="black" />
            </div>
          </div>

          <div className={`${showRight ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999] h-[375px] top-0 right-0 absolute flex items-center justify-end`}>
            <div
              onClick={() => scroll("right")}
              className={`text-3xl  font-bold border-[1px] bg-white mr-2 rounded-full p-[1px] cursor-pointer `}>
              <ChevronRight color="black" />
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default PosterSlide;
