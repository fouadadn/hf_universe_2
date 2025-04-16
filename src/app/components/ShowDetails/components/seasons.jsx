"use client"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

const Seasons = ({ show, id }) => {


    const scrollRef = useRef(null)
    const [showLeft, setShowLeft] = useState(false)
    const [showRight, setShowRight] = useState(false)

    const checkScroll = () => {
        const el = scrollRef.current
        if (!el) return

        const isScrollable = el.scrollWidth > el.clientWidth
        const isAtStart = el.scrollLeft === 0
        const isAtEnd = el.scrollLeft + el.offsetWidth >= el.scrollWidth - 1


        setShowLeft(isScrollable && !isAtStart)
        setShowRight(isScrollable && !isAtEnd)

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

        // Listen to scroll and resize
        el.addEventListener('scroll', checkScroll)
        window.addEventListener('resize', checkScroll)

        // Optional: re-check when content loads (for dynamic content)
        const interval = setInterval(checkScroll, 500)

        return () => {
            el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
            clearInterval(interval)
        }
    }, [])


    return (
        <div className='relative group '>
            <div ref={scrollRef} className={`${showRight || showLeft ? "" : "mx-4"} flex gap-3 mt-2 overflow-x-scroll hide-scrollbar`}>
                {
                    show?.seasons?.length > 0 ? show?.seasons?.map((s, i) => !(s?.season_number === 0) &&
                        <Link key={i} href={`/tv/${id}/season/${s?.season_number}`} onClick={() => setSelectedSeason(s?.season_number)} className="shrink-0 cursor-pointer">
                            <div className="overflow-hidden rounded-xl">
                                <img src={`https://image.tmdb.org/t/p/w500${s?.poster_path}`} className=" w-44 scale-110 hover:scale-100 duration-300" alt="" />
                            </div>
                            <div className="text-center">
                                <span>
                                    Season {s?.season_number}
                                </span>
                            </div>
                        </Link>) :
                        Array?.from(Array(10)).map((_, i) => <div key={i} className="shrink-0 w-44 h-[264px] gri rounded-xl animate-pulse">
                        </div>)
                }
            </div>
            {/* */}
            <div className="opacity-0 group-hover:opacity-100  duration-300 ">
                <div className={`${showLeft ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_right,black_5%,transparent_60%)] z-[999999] h-[265px] top-0 absolute flex items-center  `}>
                    <div
                        onClick={() => scroll("left")}
                        className={`text-3xl  font-bold border-[1px] bg-white rounded-full p-[1px] ml-2 cursor-pointer `}>
                        <ChevronLeft color="black" />

                    </div>
                </div>

                <div className={`${showRight ? "opacity-100" : "opacity-0"} duration-400 w-24 bg-[linear-gradient(to_left,black_5%,transparent_60%)] z-[999999] h-[265px] top-0 right-0 absolute flex items-center justify-end`}>
                    <div
                        onClick={() => scroll("right")}
                        className={`text-3xl  font-bold border-[1px] bg-white mr-2 rounded-full p-[1px] cursor-pointer `}>
                        <ChevronRight color="black" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Seasons
