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
import { useTvContext } from "@/app/context/idContext";
import useAddToWishList from '@/app/Hooks/useAddToWishList';
import { useRouter } from "next/navigation";
import axios from "axios";
import authe from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { GoBookmarkSlash } from "react-icons/go";
import UseDeleteFromWishList from "@/app/Hooks/useDeleteFromWishList";
import useDeleteFromWishList from "@/app/Hooks/useDeleteFromWishList";
import apiForHf from "@/app/utils/axiosInstanceForHfApi";

const PopularWeek = ({ shows }) => {
  const [data, setData] = useState([]);
  const [popular, setPopular] = useState({});
  const { slugify, currentUser } = useTvContext()
  const router = useRouter();
  const UseDeleteFromWishList = useDeleteFromWishList();
  const UseAddToWishList = useAddToWishList()





  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authe, async (user) => {

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
            ...(shows ? shows : popular).map((v) => ({
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
          const token = await user?.getIdToken(true);

          const res = user && (await apiForHf.get(`/api/wishlist/check/${combineData[0]?.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            }
          })).data
          setPopular({ ...combineData[0], ifSaved: res });
        }


        fetchPopular();
      } catch (err) {
        console.log(err);
      }
    })


    return () => {
      // window.removeEventListener('resize', resize);
      unsubscribe(); // clean up Firebase listener
    };
  }, [shows]);


  useEffect(() => {
    try {
      async function fetchTraillerForPupular() {

        if (shows?.id || popular.id) {
          if (shows ? shows : popular.id) {
            const response = await api.get(`/${(shows ? shows : popular)?.media_type}/${(shows ? shows : popular)?.id}/videos`);
            // console.log(popular.id)
            const trailer = response.data?.results?.find(
              (vid) => vid.type === "Trailer" && vid.site === "YouTube"
            );
            setPopular({ ...popular, trailler: trailer })
          }
        }


      }
      fetchTraillerForPupular()
    }
    catch (err) {
      console.log(err)
    }
  }, [popular?.id, shows])

  const scrollRef = useRef(null);

  const scroll = (scrollOffset) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }
  };



  const handleAddToHistory = async ({ vote_average }) => {

    const user = authe.currentUser;

    if (!user) {
      return;
    }

    const token = await user.getIdToken(true);

    const item = popular?.media_type === "movie" && {
      mediaType: "movies",
      item: {
        vote_average,
        show_id: popular?.id,
        name: popular?.title,
        backdrop_path: popular?.backdrop_path,
        genres: popular?.genres,
        watchedAt: new Date().toISOString(),
        media_type: "movie"


      }
    }

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

  return (
    <div>
      <div className="flex overflow-x-scroll overflow-y-hidden hide-scrollbar gap-16 mt-2 px-2" ref={scrollRef}>
        {data.length > 0
          ? data.map((show, i) => (
            <Link
              href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name)}/${show?.id}`}
              className="shrink-0 flex items-center gap-4 duration-200 py-2 hover:scale-105"
              key={i}>
              <span className="text-5xl font-bold">{i + 1}</span>
              <img
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
                  {show.title ? String(show.title).split(' ').slice(0 , 3).join(' ') : show.name}
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
                <div className="rounded-2xl w-[100px] h-[150px] bg-stone-600 gri"></div>

                <div className="mt-4">
                  <span className="border-[1px] border-stone-600 gri rounded-lg px-3 py-1 mb-2 inline-block w-10 h-6 bg-stone-600"></span>
                  <span className="font-semibold text-xl w-32 h-6 bg-stone-600 gri block rounded"></span>
                  <span className="font-semibold text-xl w-24 h-6 bg-stone-600 gri block rounded mt-2"></span>
                  <span className="font-semibold text-xl w-32 h-6 bg-stone-600 gri block rounded mt-2"></span>
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
              <Link onClick={() => popular?.media_type === "movie" && handleAddToHistory({ vote_average: popular?.vote_average })}
                href={`/stream/${popular?.media_type}/${slugify(popular?.name ? popular?.name : popular?.title)}/${popular?.id}`} className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#5c00cc]">
                <Play /> <span>Play Now</span>{" "}
              </Link>
              <Link href={`/watch/${slugify(popular?.name ? popular?.name : popular?.title)}/${popular?.trailler?.key}`} className=" rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 bg-[#37007a98]">
                <CirclePlay /> <span>Watch Trailer</span>
              </Link>
              <button onClick={
                () => {
                  if (currentUser) {
                    if (popular?.ifSaved) {
                      UseDeleteFromWishList(popular?.id)
                      setPopular({ ...popular, ifSaved: false })
                    } else {
                      UseAddToWishList(popular?.id, popular?.title ? popular?.title : popular?.name, popular?.backdrop_path, popular?.genre_ids, popular?.vote_average, popular?.media_type, popular?.poster_path, popular?.release_date)
                      setPopular({ ...popular, ifSaved: true }
                      );
                    }
                  } else {
                    router.push('/auth/sign-up')
                  }
                }
              } style={{ backgroundColor: "#ffffff20" }} className='cursor-pointer rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200'>
                {
                  popular?.ifSaved ? <GoBookmarkSlash size={24} /> : <Bookmark />}

              </button>
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
              <button className=" rounded-xl px-2 w-32 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 gri bg-stone-600">
                {" "}
              </button>
              <button className=" rounded-xl px-2 md:px-5 w-[165.65px] py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 gri bg-stone-600"></button>
              <button className=" w-[65.5px] h-[49.6px] rounded-xl px-2 md:px-5 py-2 md:py-3 flex gap-2 hover:opacity-80 duration-200 gri bg-stone-600"></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PopularWeek;
