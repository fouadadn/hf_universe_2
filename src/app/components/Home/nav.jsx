"use client"

import React, { useEffect, useRef, useState } from 'react'
import { ChevronDown, CircleUserRound, Dot, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import api from '@/app/utils/axiosInstance';
import { useTvContext } from '@/app/context/idContext';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import authe from '@/app/firebase';
import Footer from './footer';

const Nav = () => {

    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchData, setSearchData] = useState([])
    const [displaysearchData, setDisplaysearchData] = useState(false)
    const [noResults, setNoResults] = useState(false)
    const inpurRef = useRef(null)
    const { id, changeId, slugify, setArrows, providerName, currentUser, whishlistChange } = useTvContext()
    const [showLink, setShowLinks] = useState(false)
    const path = usePathname();
    const [dispayAccount, setDisplayAccount] = useState(false)
    const [provider_id, setProvider_id] = useState(8)

    useEffect(() => {
        try {
            async function fetchSearchData() {
                const search = (await api.get(`/search/multi?query=${searchQuery}`))?.data?.results
                    ?.filter((show) => show.media_type !== "person")?.sort((a, b) => b.popularity - a.popularity)
                setSearchData(search)

            }
            fetchSearchData()
        } catch (err) {
            console.log(err)
        }
        // document.body.onclick = () => {
        //     setSearchOpen(false)
        // }
    }, [searchQuery])

    // useEffect(() => {
    //     setDisplaysearchData(false)
    //     setSearchOpen(false)
    // }, [])


    const handleSearchClick = () => {

        setSearchOpen(!searchOpen);
        if (searchOpen) {
            inpurRef.current.blur()
            setSearchOpen(false)
        } else {
            inpurRef.current.focus()
        }
    }

    const [isFocused, setIsFocused] = useState(false);


    const handleSignOut = async () => {
        setDisplayAccount(false)
        try {
            await signOut(authe)
            console.log('User signed out')
        } catch (error) {
            console.error('Error signing out:', error)
        }


    }


    // console.log(currentUser)

    return (
        <>
            <div className={`${dispayAccount ? "block" : "hidden"} absolute top-0 bottom-0 right-0 left-0  z-[9999]`} onClick={() => { setDisplayAccount(false) }}></div>

            <header className="z-[99999] relative font-sans  bg-[linear-gradient(to_bottom,black,transparent_95%)] to-95%">

                <nav className={` ${searchOpen ? "justify-end md:justify-between" : "justify-between"} flex  py-5  mx-2 items-center`}>
                    <Link
                        href={"/"}
                        className={`${searchOpen ? 'hidden md:flex' : 'flex'} text-nowrap text-3xl font-bold font-serif  items-center`}>
                        <span className="text-[#5c00cc] font-sans text-5xl">HF</span>
                        <span>Universe</span>{" "}
                    </Link>

                    <div className={`hidden md:block space-x-6 ml-6 `}>
                        <Link className={`hover:underline ${String(path) === '/' ? "text-gray-300 underline" : "text-white"}`} href={"/"}>Home</Link>
                        <Link className={`hover:underline ${String(path).includes('/discover') ? "text-gray-300 underline" : "text-white"}`} href={`/discover/netflix/8`}>Discover</Link>
                        <Link className={`hover:underline ${String(path).includes('/movierelease') ? "text-gray-300 underline" : "text-white"}`} href={"/movierelease"}>Movie Release</Link>
                        <Link className={`hover:underline ${String(path).includes('/your-watchlist') ? "text-gray-300 underline" : "text-white"}`} href={currentUser ? `/${slugify("your-watchlist")}` : "/auth/login"}>My list</Link>
                    </div>

                    <div className="w-full md:w-fit flex items-center gap-4">

                        <div className={`${searchOpen ? "mb-2" : ""} relative w-[100%] `}>
                            <div onClick={() => setDisplaysearchData(true)} className={`relative -top-5  ${searchOpen ? 'top-0 mt-2 md:mb-2 left-2 h-10 md:h-fit' : "glbo"}   pr-3 `}>
                                <div className={` ${searchOpen ? "md:absolute -top-5 right-1 -mt-3 md:mt-0" : "absolute"}
                          overflow-hidden ${searchOpen ? `bg-[#21262a] w-full` : "bg-transparent"}
                          hover:bg-[#21262a]  flex duration-300 rounded-full p-2 w-10    
                           ${searchOpen ? "w-60 md:w-72 hover:w-full md:hover:w-72" : "hover:w-full md:hover:w-72"}  cursor-pointer`}>

                                    <div className={`relative z-50 w-6 h-6 ${searchOpen ? "order-2" : "order-1"}`} onClick={() => { handleSearchClick() }} >
                                        <div className=''>
                                            {/* <X className={`${searchOpen ? 'relative left-[7px]' : "absolute "}  duration-300 ${searchOpen ? "opacity-100" : 'opacity-0'} `} /> */}
                                            {/* <Search className={`${searchOpen ? 'relative left-[7px]' : "absolute "} duration-300 ${searchOpen ? "opacity-0" : 'opacity-100'} `} /> */}
                                            <Search className={`${searchOpen ? "ml-1" : "glbo"}`} />
                                        </div>
                                    </div>

                                    <div className={`${searchOpen ? 'order-1 relative md:left-[4px] w-[92%] md:w-fit' : "glbo order-2 "} `}>
                                        <input value={searchQuery} onChange={(e) => {
                                            setNoResults(false)
                                            setSearchData([]);
                                            setDisplayAccount(false)
                                            setSearchQuery(e.target.value);
                                            setTimeout(() => {
                                                if (!searchData.lenghth > 0) {
                                                    setNoResults(true)
                                                }
                                            }, 2000);
                                        }} onFocus={() => { setSearchOpen(true); setIsFocused(true) }}
                                            onBlur={() => setIsFocused(false)} ref={inpurRef} type="search" name=""
                                            className={` [&::-webkit-search-cancel-button]:appearance-none w-full md:w-[240px] px-1 outline-0  `} id="" placeholder='Search' />
                                    </div>
                                </div>

                            </div>

                            <div className={`overflow-scroll hide-scrollbar py-3  ${displaysearchData && searchQuery ? 'block' : "hidden"} w-[97%] md:w-[270px] h-[70vh] md:h-96 bg-[#21262a] absolute z-50 top-10 md:top-8 rounded-xl right-1`}>
                                <div className='flex flex-col gap-2  px-3 h-[70vh] md:h-96'>
                                    {
                                        searchData?.length > 0 ? searchData?.map((show, i) =>
                                            show.poster_path &&
                                            <Link key={i}
                                                onClick={() => { setDisplaysearchData(false); setSearchQuery(''); setSearchOpen(false);  }}
                                                href={`/${show.media_type}/${show.title ? slugify(show?.title) : slugify(show?.name)}/${show?.id}`}
                                                className='flex gap-2'>
                                                <img src={`https://image.tmdb.org/t/p/w500${show?.poster_path}`} className=' h-[94.08px] w-16 rounded-lg' alt="" />

                                                <div>
                                                    <h2 className='text- '>{show?.title ? show?.title : show?.name}</h2>
                                                    <div className='flex items-center text-[#909295] '>
                                                        <span>{show?.media_type === 'tv' ? "TV Show" : "Movie"}</span>
                                                        <Dot className={`${show?.first_air_date || show?.release_date ? 'block' : 'hidden'}`} />
                                                        <span>{String(show?.first_air_date ? show?.first_air_date : show?.release_date)?.split('-')[0]}</span>
                                                    </div>
                                                </div>
                                            </Link>) : !noResults ?
                                            <div className='w-full h-full flex justify-center items-center'>
                                                <div className='border-b border-l w-6 h-6 rounded-full animate-spin'></div>
                                            </div> : <div className='text-[#909295] w-full h-full flex justify-center items-center'>
                                                <span>No Results</span>
                                            </div>
                                    }
                                </div>

                            </div>

                        </div>

                        <div className={`${searchOpen ? "hidden" : "block"} gap-2 hidden lg:flex relative`}>
                            {currentUser?.uid ?
                                <button
                                    onClick={
                                        () => {
                                            setDisplayAccount(!dispayAccount)
                                        }
                                    }
                                    className="whitespace-nowrap rounded-full  gri cursor-pointer flex items-center p-1 gap-1"
                                    style={{ backgroundColor: "#21262a50" }}
                                >
                                    <div className={` bg-[#21262a] w-9 h-9  rounded-full`}>
                                        <span className='text-2xl uppercase relative top-[2px] '>{String(currentUser?.displayName)?.split('')[0]}</span>
                                    </div>

                                    <span className={`${dispayAccount ? "rotate-180" : "rotate-0"} duration-200`}>
                                        <ChevronDown size={20} />
                                    </span>
                                </button> :
                                <>
                                    <Link href={"/auth/sign-up"} className=' '>
                                        <button className="border-[1px] rounded-xl px-3 py-[7px] cursor-pointer whitespace-nowrap">
                                            Sign Up
                                        </button>
                                    </Link>
                                    <Link href={"/auth/login"} className=''>
                                        <button className=" rounded-xl px-3 py-[7px] bg-[#5c00cc] cursor-pointer" >
                                            Login
                                        </button>
                                    </Link>
                                </>


                            }

                            <div onClick={()=> setDisplayAccount(false)} className={`${dispayAccount ? "flex" : "hidden"} w-52  py-2 absolute right-0 top-12 rounded-xl  flex-col z-[999999] `} style={{ backgroundColor: "#21262a" }}>
                                <div className='px-3 uppercase font-semibold text-lg text-stone-300' style={{ color: "#d6d3d1" }}>
                                    {currentUser?.displayName}
                                </div>
                                <div className='flex flex-col  pb-2 mt-2'>
                                    <Link href="/account" className='hover:bg-gray-600 duration-200 px-3'>My Account</Link>
                                    <Link href="/your-watchlist" className='hover:bg-gray-600 duration-200 px-3'>My Watchlist </Link>
                                </div>

                                <hr style={{ borderColor: "#ffffff30" }} />
                                <button onClick={handleSignOut} className='cursor-pointer text-start hover:bg-gray-600 duration-200 px-3 mt-2'>Sign Out </button>

                            </div>

                        </div>

                        <div className={`${searchOpen ? "hidden" : "block"}  lg:hidden cursor-pointer relative `}>
                            {currentUser ? <button
                                onClick={
                                    () => {
                                        setDisplayAccount(!dispayAccount)
                                        setShowLinks(false)
                                    }
                                }
                                className="whitespace-nowrap rounded-full  gri cursor-pointer flex items-center p-1 gap-1"
                                style={{ backgroundColor: "#21262a50" }}
                            >
                                <div className={` bg-[#21262a] w-9 h-9  rounded-full`}>
                                    <span className='text-2xl uppercase relative top-[2px] '>{String(currentUser?.displayName)?.split('')[0]}</span>
                                </div>

                                <span className={`${dispayAccount ? "rotate-180" : "rotate-0"} duration-200`}>
                                    <ChevronDown size={20} />
                                </span>
                            </button> :
                                <Link href={'/auth/login'}>
                                    <CircleUserRound />
                                </Link>
                            }


                            <div onClick={()=> setDisplayAccount(false)} className={`${dispayAccount ? "flex" : "hidden"} w-52  py-2 absolute right-0 top-12 rounded-xl z-[999999]  flex-col `} style={{ backgroundColor: "#21262a" }}>
                                <div className='px-3 uppercase font-semibold text-lg' style={{ color: "#d6d3d1" }}>
                                    {currentUser?.displayName}
                                </div>
                                <div className='flex flex-col  pb-2 mt-2'>
                                    <Link href="/account" className='hover:bg-gray-600 duration-200 px-3'>My Account</Link>
                                    <Link href="/your-watchlist" className='hover:bg-gray-600 duration-200 px-3'>My Watchlist </Link>
                                </div>

                                <hr style={{ borderColor: "#ffffff30" }} />
                                <button onClick={handleSignOut} className='cursor-pointer text-start hover:bg-gray-600 duration-200 px-3 mt-2'>Sign Out </button>

                            </div>
                        </div>

                        <button onClick={() => { setShowLinks(!showLink); setDisplayAccount(false) }} className={`${searchOpen ? "hidden " : "inline"} cursor-pointer `}>
                            <Menu size={28} className={`${searchOpen || showLink ? "hidden " : "inline"} block lg:hidden shrink-0`} />
                            <X size={28} className={`${searchOpen || !showLink ? "hidden" : "inline"} block lg:hidden shrink-0`} />
                        </button>
                    </div>
                </nav>
            </header>
            <div className={`${displaysearchData ? 'block' : "hidden"} z-[9999] fixed top-0 bottom-0 right-0 left-0   `} onClick={() => { setDisplaysearchData(false); setSearchOpen(false) }}></div>

            <div className={`${showLink ? 'top-[70px] opacity-100 lg:top-0 lg:opacity-0' : "top-0 opacity-0"} ${searchOpen ? "hidden" : "block"} flex justify-center w-full duration-200   absolute z-50 `} >

                <div className='gap-6 flex rounded-xl px-3 py-1 ' style={{ backgroundColor: "#00000080" }} onClick={() => setShowLinks(false)}>
                    <Link className={`hover:underline ${String(path) === '/' ? "text-gray-300 underline" : "text-white"}`} href={"/"}>Home</Link>
                    <Link className={`hover:underline ${String(path).includes('/discover') ? "text-gray-300 underline" : "text-white"}`} href={`/discover/netflix/8`}>Discover</Link>
                    <Link className={`hover:underline ${String(path).includes('/movierelease') ? "text-gray-300 underline" : "text-white"}`} href={"/movierelease"}>Movie Release</Link>
                    <Link className={`hover:underline ${String(path).includes('/your-watchlist') ? "text-gray-300 underline" : "text-white"}`} href={currentUser ? `/${slugify("your-watchlist")}` : "/auth/login"}>My list</Link>
                </div>
            </div>
        </>
    )
}

export default Nav
