"use client"
import authe from '@/app/firebase'
import api from '@/app/utils/axiosInstance'
import apiForHf from '@/app/utils/axiosInstanceForHfApi'
import { Server } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const Stream = ({ type, season, episode, id }) => {

    const [displayServers, setDisplayServers] = useState(false)
    const [selectedServer, setSelectedServer] = useState({})

    useEffect(() => {
        setSelectedServer(localStorage?.server ?
            {
                url: type === "movie" ? `${JSON.parse(localStorage.server).url}/${type}/${id}` :
                    JSON.parse(localStorage.server).server === 1 ?
                        `${JSON.parse(localStorage.server).url}/${type}/${id}-${season}-${episode}` :
                        `${JSON.parse(localStorage.server).url}/${type}/${id}/${season}-${episode}`
                ,
                server: JSON.parse(localStorage.server).server
            } :
            {
                url: type === "movie" ? `https://moviesapi.club/${type}/${id}` : `https://moviesapi.club/${type}/${id}-${season}-${episode}`,
                server: 1
            })
    }, [])

    // const handleAddToHistory = async ({ ep = 1, ep_backdrop, vote_average }) => {

    //     const show = (await api.get(`/${type}/${id}`)).data

    //     console.log(show)

    //     const user = authe.currentUser;

    //     if (!user) {
    //         return;
    //     }

    //     const token = await user.getIdToken(true);

    //     const item = type === "movie" ? {
    //         mediaType: "movies",
    //         item: {
    //             vote_average,
    //             show_id: id,
    //             name: show?.title,
    //             backdrop_path: show?.backdrop_path,
    //             genres: show?.genres,
    //             watchedAt: new Date().toISOString(),
    //             media_type: "movie"


    //         }
    //     } :

    //         {
    //             mediaType: "series",
    //             item: {
    //                 vote_average,
    //                 show_id: id,
    //                 name: show?.name,
    //                 backdrop_path: ep_backdrop,
    //                 genres: show?.genres,
    //                 season: season,
    //                 episode: ep,
    //                 watchedAt: new Date().toISOString(),
    //                 media_type: "tv"

    //             }
    //         }

    //     if (season) {
    //         window.location.reload()
    //     }


    //     const response = await apiForHf.post(
    //         "/api/history",
    //         item
    //         ,
    //         {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //                 Accept: "application/json",
    //             },
    //         }
    //     );
    // }

    //  handleAddToHistory()

    const handleChangeServerToServer1 = () => {
        if (type === "movie") {
            setSelectedServer({ url: `https://moviesapi.club/${type}/${id}`, server: 1 })
            localStorage.setItem('server', JSON.stringify({ url: `https://moviesapi.club`, server: 1 }))
        } else {
            setSelectedServer({ url: `https://moviesapi.club/${type}/${id}-${season}-${episode}`, server: 1 })
            localStorage.setItem('server', JSON.stringify({ url: `https://moviesapi.club`, server: 1 }))

        }
    }

    const handleChangeServerToServer2 = () => {

        if (type === "movie") {
            setSelectedServer({ url: `https://vidsrc.xyz/embed/${type}/${id}`, server: 2 })
            localStorage.setItem('server', JSON.stringify({ url: `https://vidsrc.xyz/embed`, server: 2 }))
        } else {
            setSelectedServer({ url: `https://vidsrc.xyz/embed/${type}/${id}/${season}-${episode}`, server: 2 })
            localStorage.setItem('server', JSON.stringify({ url: `https://vidsrc.xyz/embed`, server: 2 }))

        }
    }

    return (
        <div >
            <div >
                <iframe id="myIframe" className="absolute top-0 bottom-0 right-0 left-0 w-[100%] h-[100%] "
                    src={selectedServer.url} scrolling="no" frameBorder="0" allowFullScreen ></iframe>
            </div>


            <button onClick={() => setDisplayServers(!displayServers)}
                className={` ${displayServers ? "bg-[#2b0060]" : "bg-[#5c00cc]"} p-4 hover:bg-[#2b0060] duration-200  cursor-pointer rounded-full bottom-3 left-3 absolute z-[999] `}>
                <Server />
            </button>

            <div className={`w-32  py-2 px-2 space-y-1 bg-[#5c00cc] rounded-xl ${displayServers ? "left-2" : "-left-32"} duration-300 bottom-20 absolute z-[999] `}>
                <button onClick={handleChangeServerToServer1} className={`bg-[#2f0069] px-2 w-full cursor-pointer rounded-lg py-1 hover:opacity-40 duration-200  ${selectedServer.server === 1 ? "opacity-30" : "opacity-100"}  `}>Server 1</button>
                <button onClick={handleChangeServerToServer2} className={`bg-[#2f0069] px-2 w-full cursor-pointer rounded-lg py-1 hover:opacity-40 duration-200 ${selectedServer.server === 2 ? "opacity-30" : "opacity-100"} `}>Server 2</button>
            </div>
        </div >
    )
}

export default Stream
