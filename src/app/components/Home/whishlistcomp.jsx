"use client"
import { useTvContext } from "@/app/context/idContext";
import authe, { db } from "@/app/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AlertTriangle, Bookmark, ChevronLeft, ChevronRight, CloudAlert, Dot, Star, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import api from "@/app/utils/axiosInstance";
import { redirect, useRouter } from "next/navigation";
import Footer from "./footer";
import apiForHf from "@/app/utils/axiosInstanceForHfApi";

const Whishlist = ({ filter, check, poster }) => {
    const [data, setData] = useState([])
    const [isfound, setIsFound] = useState(true)
    const { slugify, currentUser, changeId, setArrows, whishlistChange } = useTvContext();
    const [loading, setLoading] = useState(true);
    const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/w500`);
    const [isFull, setIsFull] = useState(true)
    const [confirmShow, setConfirmShow] = useState(false)
    const [confirmShowLoading, setConfirmShowLoading] = useState(false)
    const router = useRouter()

    const [seriesFound, setSeriesFound] = useState(false)
    const [moviesFound, setMoviesFound] = useState(false)

    async function handleClearWatchlist() {
        setConfirmShowLoading(true)

        const user = authe.currentUser;

        if (!user) {
            return;
        }
        const token = await user.getIdToken(true);

        await apiForHf.delete('/api/wishlist/all', {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
        setConfirmShowLoading(false)
        window.location.reload()
    }


    useEffect(() => {
        try {
            async function fetchData() {
                setLoading(true);

                if (currentUser) {
                    const wishlistRef = collection(db, "wishlist");
                    const q = query(wishlistRef, where("uid", "==", currentUser?.uid));


                    const querySnapshot = await getDocs(q);
                    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


                    const genresTv = (await api.get("genre/tv/list")).data.genres
                    const genresMovie = (await api.get("genre/movie/list")).data.genres;

                    const combineData = [
                        ...items.map((v) => ({
                            ...v,
                            genres:
                                // v?.genre_ids[0].name &&

                                v?.media_type === "tv" ?
                                    v.genre_ids?.map((gI) => {
                                        let ob = {};
                                        genresTv.map((g) => {
                                            if (g.id === (typeof gI == "object" ? gI.id : gI)) {
                                                ob = { id: g.id, name: g.name };
                                            }
                                        });
                                        return ob;
                                    }) :

                                    v.genre_ids?.map((gI) => {
                                        let ob = {};
                                        genresMovie.map((g) => {
                                            if (g.id === (typeof gI == "object" ? gI.id : gI)) {
                                                ob = { id: g.id, name: g.name };
                                            }
                                        });
                                        return ob;
                                    })
                        })),
                    ];
                    setData(combineData);
                    setData((prev) =>
                        prev.map((item) => { return { ...item, ifSaved: true } }
                        ));
                    setLoading(false);

                    const recentlyAdded = [...combineData]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 5);



                    if (poster) {
                        setData(recentlyAdded)
                    }

                }

            }
            fetchData();
        }
        catch (err) {
            console.log(err)
        }

    }, [currentUser, whishlistChange])

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

    useEffect(() => {
        if (!data.length > 0) {
            setIsFull(false)
        } else {
            setIsFull(true)
        }

        for (const i in data) {
            if (data[i].media_type === "tv") {
                setSeriesFound(true)
                break;
            } else {
                setSeriesFound(false)
            }
        }

        for (const i in data) {
            if (data[i].media_type === "movie") {
                setMoviesFound(true)
                break;
            } else {
                setMoviesFound(false)
            }
        }
    }, [data])

    return (
        <>

            <div className={`top-0 bottom-0 right-0 left-0 ${confirmShow ? "block" : "hidden"} flex justify-center items-center z-[999999999] fixed`} style={{ backgroundColor: "#00000090 " }}>
                <div
                    className=" flex flex-col  items-center rounded-lg p-2 px-4 w-80 sm:max-w-md  bg-gradient-to-b "
                    style={{ backgroundColor: "#21262a " }}>
                    <div className="flex justify-between w-full ">
                        <div className=""></div>
                        <button className="cursor-pointer " onClick={() => { setConfirmShow(false) }}>
                            <X />
                        </button>
                    </div>
                    <div className="mx-auto bg-red-500/10 p-3 rounded-full" style={{ backgroundColor: "#fb2c3615" }}>
                        <AlertTriangle className="h-8 w-8 text-red-500" style={{ color: "#fb2c36" }} />
                    </div>
                    <span className="text-center" >Are you sure you want clear your Watchlist</span>

                    <div className="flex gap-2  w-full mt-2">
                        <button onClick={() => setConfirmShow(false)} className="border border-white/20 hover:bg-[#5c00cc] cursor-pointer duration-200 rounded-lg text-lg px-3 py-1 w-full " style={{ border: "1px solid #ffffff30" }}>Cancel</button>
                        <button onClick={handleClearWatchlist} className=" border-white rounded-lg flex items-center gap-1 justify-center hover:bg-red-500/70 cursor-pointer duration-200 bg-red-500 w-full text-lg px-3 py-1" style={{ backgroundColor: "#fb2c36" }}>
                            <span>Clear</span>
                            {
                                confirmShowLoading && <span className="inline-block w-4 h-4 border-b-[1px] border-l-[1px] animate-spin rounded-full border-white group-hover:border-white " ></span>
                            }
                        </button>
                    </div>
                </div>
            </div>
            {(!isFull && poster && data.length === 0) &&
                <div className="mt-10 h-[81vh]">
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="gri p-3 rounded-full">
                            <Bookmark size={35} />
                        </div>
                        <span className="mt-1 text-center">
                            Your Watchlist is empty explore our movies and tv shows
                        </span>

                        <Link href={"/"} className="border-white border rounded-full px-4 py-2 hover:bg-5c00cc hover:text-black hover:bg-white duration-200 mt-2 ">Discover our Shows</Link>
                    </div>
                </div>
            }
            {
                isFull &&
                <div className={` group relative  ${filter ? "mt-1" : "mt-24"}`}>
                    <div className="flex justify-between">
                        {
                            poster &&
                            <h2 className="text-3xl font-bold">
                                Recently Added
                            </h2>
                        }
                        {
                            (filter === "tv" && seriesFound) &&
                            <h2 className="text-3xl font-bold">
                                Series
                            </h2>
                        }
                        {
                            (filter === "movie" && moviesFound) &&
                            <h2 className="text-3xl font-bold">
                                Movies
                            </h2>
                        }
                        {
                            check &&
                            <h2 className="text-3xl font-bold mx-2">Your Watchlist</h2>

                        }
                        {
                            poster &&
                            <button onClick={() => setConfirmShow(true)} className="border cursor-pointer border-white/20 rounded-lg px-3 hover:bg-[#5c00cc]  duration-200" style={{ border: "1px solid  #ffffff30" }}>Clear Watchlist</button>
                        }
                    </div>

                    <div className={`flex gap-6 overflow-scroll p-2  hide-scrollbar`} ref={scrollRef}>
                        {!loading > 0 ?
                            data.map((show, i) => (
                                poster ? <Link
                                    href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name)}/${show?.show_id}`}
                                    onClick={() => { changeId(show?.show_id); setArrows(false) }}
                                    key={i}
                                    className="shrink-0 relative hover:scale-105 duration-200 py-2">
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
                                </Link> :
                                    (show.media_type === filter || check) &&
                                    <Link
                                        href={`/${show?.media_type}/${slugify(show?.title)}/${show?.show_id}`}
                                        onClick={() => { changeId(show?.show_id); setArrows(false) }}
                                        key={i}
                                        className="shrink-0 hover:scale-105 duration-300">
                                        <div className="h-[168.6px] ">
                                            <img
                                                src={
                                                    show?.backdrop_path
                                                    && `https://image.tmdb.org/t/p/w500${show?.backdrop_path}`

                                                }
                                                alt={show?.title ? show?.title : show?.name}
                                                width={300}
                                                height={168.75}
                                                style={{
                                                    objectFit: "cover",
                                                    objectPosition: "center",
                                                }}
                                                className="rounded-2xl"
                                            />
                                        </div>

                                        <div className="mt-3 w-[300px] ">
                                            <h2 className="font-bold">
                                                {String(show?.title).split(' ').slice(0, 7).join(' ')}


                                            </h2>
                                            <div className="mt- flex items-center gap-1">
                                                <div className="flex gap-1 items-center">
                                                    <Star fill="gold" stroke="gold" size={15} />
                                                    <span className="font-bold">
                                                        {parseFloat(show?.vote_average).toFixed(1)}{" "}
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
                                                                className={`${i + 1 === arr.length ? "hidden" : "inline"
                                                                    } -mx-1`}
                                                            />
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </Link>

                            )) :
                            poster ? Array.from(Array(20)).map((_, i) => (
                                <div
                                    key={i}
                                    className="w-[250px] h-[375px] bg-stone-600 shrink-0 rounded-xl animate-pulse gri"></div>
                            )) :
                                Array.from(
                                    Array(20)).map((_, i) => {
                                        setTimeout(() => {
                                            setIsFound(false)
                                        }, 3000);
                                        return (
                                            <div key={i} className="animate-pulse">
                                                {/* ddd */}
                                                <div className="w-[300px] h-[168.75px] rounded-2xl bg-stone-600 gri"></div>

                                                <div>
                                                    <span className="w-32 h-4 rounded bg-stone-600 block mt-3 gri"></span>
                                                    <span className="w-48 h-4 rounded bg-stone-600 block mt-2 gri"></span>
                                                </div>
                                            </div>
                                        )
                                    })
                        }


                        {/* {
                    !(data).length > 0  &&
                    
                    )
                } */}

                        {/* {
                !isfound && !(data).length > 0 ? <div className="flex justify-center w-full">

                    <div className="flex gap-2 items-center ">
                        <TriangleAlert />
                        <span>
                            No {String(title).toLocaleLowerCase()} for now
                        </span>
                    </div>
                </div> : ''
            } */}
                    </div>

                    <div className={`opacity-0 group-hover:opacity-100 duration-300  hidden md:block `}>
                        <div className={`${showLeft ? "opacity-100" : "opacity-0"} duration-400 w-24 mt-[52px
                          bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999] ${poster ? "h-[380.6px]" : "h-[179.6px]"}  top-0 absolute flex items-center `}>
                            <div
                                onClick={() => scroll("left")}
                                className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
                                <ChevronLeft color="black" />
                            </div>
                        </div>

                        <div className={`${showRight ? "opacity-100" : "opacity-0"} mt-[52px] duration-400 w-24  bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999] ${poster ? "h-[380.6px]" : "h-[179.6px]"} top-0 right-0 absolute flex items-center justify-end`}>
                            <div
                                onClick={() => scroll("right")}
                                className={`text-3xl  font-bold border-[1px] bg-white mr-2 rounded-full p-[1px] cursor-pointer `}>
                                <ChevronRight color="black" />
                            </div>
                        </div>
                    </div>
                </div>
            }


        </>


        // <div></div>
    )
}


export default Whishlist