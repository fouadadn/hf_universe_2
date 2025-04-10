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
  Play,
  UserRound,
} from "lucide-react";
import Link from "next/link";

const Details = ({ id, type }) => {
  const [show, setShow] = useState({});
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/original`);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    try {
      setScreenWidth(window.innerWidth);
      window.addEventListener("resize", () => {
        setScreenWidth(window.innerWidth);
      });
      async function fetchMovies() {
        const [show, casts, video] = [
          (await api.get(`/${type}/${id}`)).data,
          (await api.get(`/${type}/${id}/credits`)).data?.cast,
          (await api.get(`/${type}/${id}/videos`)).data?.results?.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          ),
        ];
        setShow(show);
        setCast(casts);
        setVideos(video);
      }
      fetchMovies();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const handleError = () => {
    // setImgSrc(image);
  };

  console.log(show);
  console.log(videos);

  function formatTime(time) {
    const hour = parseInt(time) / 60;
    let min = 0;
    if (hour > 1) {
      min = (hour - parseInt(hour)) * 60;
    }
    return `${parseInt(hour)}h${min}min`;
  }

  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };

  return (
    <div className="-mt-32">
      {show?.id ? (
        <div className="relative w-full h-[621px] md:h-auto overflow-hidden">
          <Image
            src={
              imgSrc.toString().startsWith("https")
                ? `${imgSrc}${
                    screenWidth > 800 ? show?.backdrop_path : show?.poster_path
                  }`
                : imgSrc
            }
            onError={handleError}
            alt={show?.title ? `${show?.title}` : `${show?.name}`}
            // Ensures it takes full width and scales height
            width={1920} // Set an arbitrary width
            height={1080}
            style={{
              objectFit: "cover", // Use CSS to set objectFit
              objectPosition: "center", // Optional, if you need to control the position of the image
            }}
            // fill
            className="min-h-96 w-full "
          />
          {/* <img src={`https://image.tmdb.org/t/p/original/${show?.backdrop_path}` } alt="backdrop image" className='w-full brightness-90' /> */}
          <div className="bg-gradient-to-r from-black to-transparent hidden md:block bg-[linear-gradient(to_right,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>
          <div className="bg-gradient-to-r from-black to-transparent  bg-[linear-gradient(to_top,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0"></div>
          <div className="absolute z-[999] text-start bottom-4 md:bottom-10 lg:bottom-26 mx-4  flex  gap-4 items-end ">
            <div className="hidden lg:block ">
              <Image
                src={`${imgSrc}${show?.poster_path}`}
                onError={handleError}
                alt={show?.title ? `${show?.title}` : `${show?.name}`}
                // Ensures it takes full width and scales height
                width={284}
                height={576}
                style={{
                  objectFit: "cover", // Use CSS to set objectFit
                  objectPosition: "center", // Optional, if you need to control the position of the image
                }}
                // fill
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

              <div className="flex ">
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
                <button className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]">
                  <Play /> <span>Play Now</span>{" "}
                </button>
                <Link href={`/watch/${videos?.key}`}>
                  <button className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]">
                    <CirclePlay /> <span>Watch Trailer</span>
                  </button>
                </Link>
                <button className="border-[1px] rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200">
                  <Bookmark />
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

      <div className="mx-4 mt-2">
        <div>
          <h2 className="font-bold text-2xl">Story line</h2>
          {show?.id ? (
            <p className="mt-2">{show?.overview} </p>
          ) : (
            <div className="mt-2 animate-pulse">
              <span className="bg-stone-600 w-full h-4 rounded-md block"></span>
              <span className="bg-stone-600 w-full h-4 mt-1 rounded-md block"></span>
              <span className="bg-stone-600 w-[70%] mt-1 rounded-md h-4 block"></span>
            </div>
          )}
        </div>

        <h2 className="font-bold text-2xl mt-5">Cast</h2>
        {
          <div className="">
            <div
              className="flex gap-3 mt-2 overflow-auto hide-scrollbar"
              ref={scrollRef}>
              {cast?.length > 0
                ? cast?.map((c, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`rounded-full overflow-hidden w-20 h-20 items-center justify-center flex bg-stone-400 `}>
                        {c?.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w300${c?.profile_path}`}
                            className={`relative`}
                            alt=""
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
                        className={`rounded-full shrink-0 w-20 h-20  items-center justify-center flex bg-stone-600 `}></div>
                      <div>
                        <h2 className="w-44 bg-stone-600 h-5 rounded-md"></h2>
                        <h3 className="w-32 mt-2 bg-stone-600 h-5 rounded-md"></h3>
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
        }
      </div>
    </div>
  );
};

export default Details;
