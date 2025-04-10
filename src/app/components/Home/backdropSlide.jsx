"use client";

import api from "@/app/utils/axiosInstance";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Dot, Star } from "lucide-react";
import Link from "next/link";

const BackdropSlide = ({ media_type, is_korean }) => {
  const [data, setData] = useState([]);
  const [imgSrc, setImgSrc] = useState("/assets/black_backdrop.png");

  useEffect(() => {
    try {
      async function fetchData() {
        const [shows, genres] = await Promise.all([
          media_type === "tv"
            ? is_korean
              ? (
                  await api.get("/discover/tv?with_original_language=ko")
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

        console.log(shows);

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

      fetchData();
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

  // console.log(data)

  return (
    <div className="mt-20">
      <h1 className="text-3xl font-bold">
        {media_type === "tv"
          ? is_korean
            ? "Korean Series"
            : "Series"
          : "Movies"}
      </h1>

      <div className="flex gap-10 overflow-auto hide-scrollbar mt-4" ref={scrollRef}>
        {data.length > 0
          ? data.map((show, i) => (
              <Link
                href={`/${show.media_type}/${show.id}`}
                key={i}
                className="shrink-0">
                <Image
                  src={
                    show.backdrop_path
                      ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
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

                <div className="mt-3 w-[300px] ">
                  <h2 className="font-bold">
                    {media_type === "tv" ? show.name : show.title}
                  </h2>
                  <div className="mt- flex items-center gap-1">
                    <div className="flex gap-1 items-center">
                      <Star fill="gold" stroke="gold" size={15} />
                      <span className="font-bold">
                        {parseFloat(show.vote_average).toFixed(1)}{" "}
                      </span>
                    </div>

                    <span className="text-stone-500">|</span>

                    <div className="flex text-stone-500">
                      {show?.genres?.slice(0, 2)?.map((g, i, arr) => (
                        <span
                          key={i}
                          className="flex items-center text-nowrap flex-nowrap">
                          <span>{g.name}</span>{" "}
                          <Dot
                            className={`${
                              i + 1 === arr.length ? "hidden" : "inline"
                            } -mx-1`}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))
          : Array.from(Array(20)).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-[300px] h-[168.75px] rounded-2xl bg-stone-600"></div>

                <div>
                  <span className="w-32 h-4 rounded bg-stone-600 block mt-3"></span>
                  <span className="w-48 h-4 rounded bg-stone-600 block mt-2"></span>
                </div>
              </div>
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
    </div>
  );
};

export default BackdropSlide;
