"use client"
import api from '@/app/utils/axiosInstance';
import React, { useEffect, useState } from 'react'
import image from "../../../assets/black_backdrop.png"
import Image from "next/image";

const TopBackdrop = ({ id, type }) => {
  const [show, setShow] = useState([]);
  const [imgSrc, setImgSrc] = useState(`https://image.tmdb.org/t/p/original`);
  const [screenWidth, setScreenWidth] = useState(0)


  // async function getParams() {
  //   const { type } = await params;
  //   const { id } = await params;
  //   setType(type)
  //   setId(id)
  // }

  // getParams()

  useEffect(() => {
    try {
      setScreenWidth(window.innerWidth)
      window.addEventListener('resize', () => {
        setScreenWidth(window.innerWidth)

      });
      async function fetchMovies() {
        setShow((await api.get(`/${type}/${id}`)).data);
      }
      fetchMovies()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const handleError = () => {
    setImgSrc(image);
  };

  console.log(show)


  return (
    <div>
      <div className='-mt-32 relative'>
        <Image src={imgSrc.toString().startsWith('https') ? `${imgSrc}${screenWidth > 800 ? show?.backdrop_path : show?.poster_path}` : imgSrc} onError={handleError}
          alt={`${show.title}`}
          // Ensures it takes full width and scales height
          width={1920}        // Set an arbitrary width
          height={1080}
          style={{
            objectFit: "cover", // Use CSS to set objectFit
            objectPosition: "center", // Optional, if you need to control the position of the image
          }}
          className='min-h-96 ' />
                <div className='bg-gradient-to-t from-black to-transparent  bg-[linear-gradient(to_top,black_15%,transparent_80%)] absolute top-0 bottom-0 right-0 left-0'></div>


      </div>
    </div>
  )
}

export default TopBackdrop
