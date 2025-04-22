"use client";

import api from "@/app/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Dot, Star } from "lucide-react";
import Link from "next/link";
import { useTvContext } from "@/app/context/idContext";

const PosterSlide = ({ movie, tv }) => {
  const [media, setMedia] = useState([]);
  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/w500`);
  const [providers, setProviders] = useState([]);
  const popularProviderIds = [8, 9, 337, 15, 283, 387, 526 , 350 , 531]; //80 AMC
  const { id, changeId, setArrows, slugify, changeProviderId } = useTvContext()


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

  return (
    <>
      <div className="relative">
        {
          tv && movie ? "" :
            <>
              <div className="h-6 w-full absolute bg-black -top-4 z-[999]"></div>
              <div className="h-6 bg-black w-full relative top-20 z-[999]"></div>
            </>
        }
      </div>
      {tv && movie ? "" : <div className="overflow-auto gap-5 -mt-8 flex hide-scrollbar pb-10 pt-5">
        {providers?.length > 0
          ? providers.map((p, i) => (
            <Link href={`/discover/${slugify(p?.provider_name)}`} key={p?.provider_id} onClick={() => { changeProviderId(p?.provider_id) }}>
              <div
                className="shrink-0 h-[64px] relative flex items-center gap-3 w-62 bg-stone-500/30 rounded-2xl px-2 py-1 shadow-xl shadow-white/15 bg-cover"
                style={{
                  backgroundImage: `url("https://image.tmdb.org/t/p/original${p?.logo_path}")`,
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}>
                <Image
                  src={`https://image.tmdb.org/t/p/original${p?.logo_path}`}
                  alt={p.provider_name}
                  // Ensures it takes full width and scales height
                  width={50} // Set an arbitrary width
                  height={50}
                  style={{
                    objectFit: "cover", // Use CSS to set objectFit
                    objectPosition: "center", // Optional, if you need to control the position of the image
                  }}
                  className="rounded-xl w-[50px] h-[50px] z-[9999] "
                />
                <div
                  className="absolute -top-5 -bottom-5 -left-5 -right-5 backdrop-blur-xs blur-lg  bg-black/30  rounded-2xl"
                  style={{ backgroundColor: "#00000054" }}></div>
                <div className="absolute -top-5 -bottom-5 -left-5 -right-5 backdrop-blur-xs blur-lg    rounded-2xl"></div>
                <div className="absolute -top-5 -bottom-5 -left-5 -right-5 backdrop-blur-xs blur-lg    rounded-2xl"></div>
                <div className="absolute -top-5 -bottom-5 -left-5 -right-5 backdrop-blur-xs blur-lg    rounded-2xl"></div>
                <div className="absolute top-0 bottom-0 left-0 right-0  z-[999] shadow_hf  rounded-2xl"></div>
                <div className="absolute top-0 bottom-0 left-0 right-0  z-[999] shadow_hf  rounded-2xl"></div>
                <div className="z-[9999] ">
                  <h2 className="text-xl font-bold ">{p.provider_name} </h2>
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


      <h1 className="text-3xl font-bold mt-">Just Release</h1>

      <div className="relative group ">
        <div className="flex gap-6 overflow-auto mt-3 hide-scrollbar"
          ref={scrollRef}>

          {media.length > 0
            ? media.map((show, i) => (
              <Link
                href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name).toLocaleLowerCase().split(' ').join('-')}`}
                onClick={() => { changeId(show?.id); setArrows(false) }}
                key={i}
                className="shrink-0 relative">
                <div className="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-t from-black to-transparent to-45%">
                  <div className="absolute bottom-0 z-50">
                    <div className="px-5 pb-3">
                      <h2 className=" font-semibold">
                        {show.title ? show.title : show.name}
                      </h2>
                      <div className="flex items-center text-sm gap-1">
                        <Star fill="gold" stroke="gold" size={15} />

                        <div>
                          <span className="font-semibold">
                            {parseFloat(show.vote_average).toFixed(1)}{" "}
                            <span className="text-gray-400">|</span>{" "}
                          </span>
                          {show?.genres?.slice(0, 2)?.map((g, i, arr) => (
                            <span key={i} className="text-gray-400">
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
                <Image
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
                  onError={handleError}
                />
              </Link>
            ))
            : Array.from(Array(20)).map((_, i) => (
              <div
                key={i}
                className="w-[250px] h-[375px] bg-stone-600 shrink-0 rounded-xl animate-pulse gri"></div>
            ))}


        </div>

        <div className="opacity-0 group-hover:opacity-100 duration-300 hidden md:block">
          <div className={`${showLeft ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999999] h-[375px] top-0 absolute flex items-center `}>
            <div
              onClick={() => scroll("left")}
              className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
              <ChevronLeft color="black" />
            </div>
          </div>

          <div className={`${showRight ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999999] h-[375px] top-0 right-0 absolute flex items-center justify-end`}>
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
