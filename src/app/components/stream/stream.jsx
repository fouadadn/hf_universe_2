"use client"
import { Server } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';

const Stream = ({ id, type, season, episode }) => {
    console.log(id)
    const [displayServers, setDisplayServers] = useState(false)
    const [selectedServer, setSelectedServer] = useState(localStorage && localStorage?.server ?
        {
            url: type === "movie" ? `${JSON.parse(localStorage.server).url}${id}` :
                JSON.parse(localStorage.server).server === 1 ?
                    `${JSON.parse(localStorage.server).url}${id}-${season}-${episode}` :
                    `${JSON.parse(localStorage.server).url}${id}/${season}-${episode}`
            ,
            server: JSON.parse(localStorage.server).server
        } :
        {
            url: type === "movie" ? `https://moviesapi.club/movie/${id}` : `https://moviesapi.club/tv/${id}-${season}-${episode}`,
            server: 1
        }
    )

    const handleChangeServerToServer1 = () => {
        if (type === "movie") {
            setSelectedServer({ url: `https://moviesapi.club/movie/${id}`, server: 1 })
            localStorage.setItem('server', JSON.stringify({ url: `https://moviesapi.club/movie/`, server: 1 }))
        } else {
            setSelectedServer({ url: `https://moviesapi.club/tv/${id}-${season}-${episode}`, server: 1 })
            localStorage.setItem('server', JSON.stringify({ url: `https://moviesapi.club/tv/`, server: 1 }))

        }

    }

    const handleChangeServerToServer2 = () => {

        if (type === "movie") {
            setSelectedServer({ url: `https://vidsrc.xyz/embed/movie/${id}`, server: 2 })
            localStorage.setItem('server', JSON.stringify({ url: `https://moviesapi.club/movie/`, server: 2 }))
        } else {
            setSelectedServer({ url: `https://vidsrc.xyz/embed/tv/${id}/${season}-${episode}`, server: 2 })
            localStorage.setItem('server', JSON.stringify({ url: `https://vidsrc.xyz/embed/tv`, server: 2 }))

        }
    }

    document.body.onclick = () => {
        setDisplayServers(false)
    }

    console.log(selectedServer.url)

    // const pathname = usePathname();
    // const fullUrl = typeof window !== 'undefined' ? window.location.href : '';


    // console.log(fullUrl)

    const router = useRouter();
    const pathname = usePathname();

    const refreshPage = () => {
        router.push(pathname); // or router.refresh()
    };


    const iframeRef = useRef(null);

    useEffect(() => {
        const iframe = iframeRef.current;

        if (!iframe) return;

        const handleClick = () => {
            alert('iframe clicked!');
        };

        iframe.addEventListener('mousedown', handleClick);

        return () => {
            iframe.removeEventListener('mousedown', handleClick);
        };
    }, []);


    return (
        <div>
            <div  >
                <iframe ref={iframeRef} id="myIframe" className="absolute top-0 bottom-0 right-0 left-0 w-[100%] h-[100%] "
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
        </div>
    )
}

export default Stream
