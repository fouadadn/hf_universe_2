"use client";

import api from "@/app/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Dot, Star } from "lucide-react";
import Link from "next/link";

const PosterSlide = () => {
  const [media, setMedia] = useState([]);
  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/w500`);
  const [providers, setProviders] = useState([]);
  const popularProviderIds = [8, 9, 337, 15, 384, 283, 387, 526]; //80 AMC

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
          ...movies.map((v) => ({
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
          ...shows.map((v) => ({
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
        ].sort(
          (a, b) =>
            new Date(b.release_date || b.first_air_date) -
            new Date(a.release_date || a.first_air_date)
        );

        setMedia(combineData);
      }

      fetchJustRelease();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleError = () => {
    setImgSrc("/assets/black_backdrop.png");
  };

  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  return (
    <>
      <div className="relative">
        <div className="h-6 w-full absolute bg-black -top-4 z-[999]"></div>
        <div className="h-6 bg-black w-full relative top-20 z-[999]"></div>
      </div>
      <div className="overflow-auto gap-5 -mt-8 flex hide-scrollbar pb-10 pt-5">
        {providers?.length > 0
          ? providers.map((p, i) => (
              <>
                <div
                  key={i}
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
              </>
            ))
          : Array.from(Array(8)).map((_, i) => (
              <div
                key={i}
                className="w-62 rounded-2xl h-[64px] bg-stone-600 shrink-0"></div>
            ))}
      </div>
      <h1 className="text-3xl font-bold mt-7">Just Release</h1>
      <div
        className="flex gap-6 overflow-auto mt-3 hide-scrollbar"
        ref={scrollRef}>
        {media.length > 0
          ? media.map((show, i) => (
              <Link
                href={`/${show.media_type}/${show.id}`}
                key={i}
                className="shrink-0 relative">
                <div className="absolute top-0 bottom-0 right-0 left-0 bg-gradient-to-t from-black to-transparent to-45%">
                  <div className="absolute bottom-0 ">
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
                                className={` ${
                                  i + 1 === 2 || arr.length === i + 1
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
                  className="rounded-xl w-auto h-auto"
                  onError={handleError}
                />
              </Link>
            ))
          : Array.from(Array(20)).map((_, i) => (
              <div
                key={i}
                className="w-[250px] h-[375px] bg-stone-600 shrink-0 rounded-xl animate-pulse"></div>
            ))}
      </div>

      <div className="space-x-2 hidden md:flex justify-end mt-2  ">
        <button
          onClick={() => scroll(-window.innerWidth - 16)}
          className="text-3xl font-bold border-[1px] bg-white rounded-full p-1 cursor-pointer">
            <ChevronLeft color="black" />
        </button>
        <button
          onClick={() => scroll(window.innerWidth - 16)}
          className="text-3xl font-bold border-[1px] bg-white rounded-full p-1 cursor-pointer">
          
          <ChevronRight color="black" />
        </button>
      </div>
    </>
  );
};

export default PosterSlide;
