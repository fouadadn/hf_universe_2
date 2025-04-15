"use client";

import api from "@/app/utils/axiosInstance";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  Dot,
  Film,
  Play,
  Star,
} from "lucide-react";
import Link from "next/link";

const PopularWeek = () => {
  const [data, setData] = useState([]);
  const [popular, setPopular] = useState({});

  useEffect(() => {
    try {
      async function fetchPopular() {
        const [popular, movieGenres, tvGenres] = [
          (await api.get("/trending/all/week"))?.data?.results?.sort(
            (a, b) => b.popularity - a.popularity
          ),
          (await api.get("/genre/movie/list")).data.genres,
          (await api.get("/genre/tv/list")).data.genres,
        ];

        const combineData = [
          ...popular.map((v) => ({
            ...v,
            genres: v.genre_ids.map((gI) => {
              let ob = {};
              if (v.media_type === "movie") {
                movieGenres.map((g) => {
                  if (g.id === gI) {
                    ob = { id: g.id, name: g.name };
                  }
                });
              }

              if (v.media_type === "tv") {
                tvGenres.map((g) => {
                  if (g.id === gI) {
                    ob = { id: g.id, name: g.name };
                  }
                });
              }
              return ob;
            }),
          })),
        ];

        setData(combineData);
        setPopular(combineData[0]);
      }


      fetchPopular();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    try {
      async function fetchTraillerForPupular() {
        if (popular.id) {
          const response = await api.get(`/${popular?.media_type}/${popular?.id}/videos`);
          // console.log(popular.id)
          const trailer = response.data?.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );

          setPopular({ ...popular, trailler: trailer })
        }
      }
      fetchTraillerForPupular()
    }
    catch (err) {
      console.log(err)
    }
  }, [popular])

  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  console.log(popular)

  return (
    <div>
      <div className="flex overflow-auto hide-scrollbar gap-16 mt-4" ref={scrollRef}>
        {data.length > 0
          ? data.map((show, i) => (
            <Link
              href={`/${show.media_type}/${show.id}`}
              className="shrink-0 flex items-center gap-4 "
              key={i}>
              <span className="text-5xl font-bold">{i + 1}</span>
              <Image
                src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                alt={show?.title ? show.title : show.name}
                // Ensures it takes full width and scales height
                width={100} // Set an arbitrary width
                height={150}
                style={{
                  objectFit: "cover", // Use CSS to set objectFit
                  objectPosition: "center", // Optional, if you need to control the position of the image
                }}
                className="rounded-2xl "
              />

              <div className="text-sm space-y-1 ">
                <span className="border-[1px] border-stone-600 rounded-lg px-3 py-1 mb-2 inline-block">
                  {show.original_language}
                </span>
                <h2 className="font-semibold text-xl">
                  {show.title ? show.title : show.name}
                </h2>
                <div className="flex items-center gap-1">
                  <Film className="" stroke="gray" />
                  <div className="flex text-stone-400">
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
                <div className="flex items-center text-sm gap-1">
                  <Star fill="gold" stroke="gold" size={15} />

                  <div>
                    <span className="font-semibold">
                      {parseFloat(show.vote_average).toFixed(1)}{" "}
                      <span className="text-gray-400">|</span>{" "}
                    </span>
                    <span key={i} className="text-gray-400 capitalize">
                      {show.media_type}{" "}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
          : Array.from(Array(20)).map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <span className="text-5xl font-bold ">{i + 1}</span>

              <div className="flex gap-3">
                <div className="rounded-2xl w-[100px] h-[150px] bg-stone-600"></div>

                <div className="mt-4">
                  <span className="border-[1px] border-stone-600 rounded-lg px-3 py-1 mb-2 inline-block w-10 h-6 bg-stone-600"></span>
                  <span className="font-semibold text-xl w-32 h-6 bg-stone-600 block rounded"></span>
                  <span className="font-semibold text-xl w-24 h-6 bg-stone-600 block rounded mt-2"></span>
                  <span className="font-semibold text-xl w-32 h-6 bg-stone-600 block rounded mt-2"></span>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="space-x-2 hidden md:flex justify-end mt-4  ">
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

      {popular?.media_type ? (
        <div className=" md:h-96 overflow-hidden mt-16 rounded-2xl relative">
          {/* <Link href={`/${popular.media_type}/${popular.id}`}> */}
          <Image
            src={`https://image.tmdb.org/t/p/original${popular.backdrop_path}`}
            alt={popular?.title ? `${popular.title}` : `${popular.name}`}
            // Ensures it takes full width and scales height
            width={1920} // Set an arbitrary width
            height={150}
            style={{
              objectFit: "contain", // Use CSS to set objectFit
              objectPosition: "center", // Optional, if you need to control the position of the image
            }}
            className="rounded-2xl relative lg:bottom-52 w-full"
          />

          <div className="bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_right,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>

          <div className=" z-[999] absolute top-5 md:top-10 md:px-20 md:mt-10 space-y-1">
            <h1 className="text-xl md:text-3xl font-bold">
              {popular.title}{" "}
            </h1>

            <div className="flex items-center gap-1">
              <div className="flex items-center text-sm gap-1">
                <Star fill="gold" stroke="gold" size={15} />

                <div>
                  <span className="font-semibold">
                    {parseFloat(popular.vote_average).toFixed(1)}{" "}
                  </span>
                </div>
              </div>
              <span>|</span>
              <div className="flex text-stone-400">
                {/* <Film className='' stroke='gray' /> */}
                {popular?.genres?.slice(0, 2)?.map((g, i, arr) => (
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
            <p className="w-80 md:w-[56%] text-xs md:text-base ">
              {String(popular.overview).split(" ").slice(0, 21).join(" ")}{" "}
              <span>
                {String(popular.overview).split(" ").length > 21 ? "..." : ""}
              </span>{" "}
            </p>

            <div className="flex gap-3 mt-3">
              <Link href={`/stream/${popular?.media_type}/${popular?.id}`} className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]">
                <Play /> <span>Play Now</span>{" "}
              </Link>
              <Link href={`/watch/${popular?.trailler?.key}`} className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]">
                <CirclePlay /> <span>Watch Trailer</span>
              </Link>
              <button style={{backgroundColor: "#ffffff20"}} className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200">
                <Bookmark />
              </button>
            </div>
          </div>
          {/* </Link> */}
        </div>
      ) : (
        <div className="h-80 md:h-96 overflow-hidden mt-16 rounded-2xl relative bg-stone-600 animate-pulse ">
          <div className="bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_right,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>

          <div className=" z-[999] absolute top-10 md:px-20 mt-10 space-y-1">
            <h1 className="text-3xl font-bold bg-stone-600 W-32 h-8 rounded">
              {" "}
            </h1>

            <div className="bg-stone-600 w-40 rounded mt-3 h-4"></div>
            <div className="w-96 md:w-[56%]">
              <div className="W-full h-4 rounded bg-stone-600 my-1"></div>
              <div className="W-[75%] h-4 rounded bg-stone-600 my-1"></div>
              <div className="W-full h-4 rounded bg-stone-600 my-1"></div>
            </div>

            <div className="flex gap-3 mt-3">
              <button className=" rounded-xl px-2 w-32 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-stone-600">
                {" "}
              </button>
              <button className=" rounded-xl px-2 md:px-5 w-[165.65px] py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-stone-600"></button>
              <button className=" w-[65.5px] h-[49.6px] rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-stone-600"></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularWeek;
