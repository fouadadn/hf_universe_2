"use client"

import React from 'react'
// import Nav from './components/Home/Nav'
import Link from 'next/link'

const NotFound = () => {

    return (
        <>
            <div className='brightness-40  absolute top-0 right-0 bottom-0 left-0' 
            style={{ backgroundImage: 'url(https://img.freepik.com/photos-gratuite/ancienne-chapelle-dans-mystere-monochrome-foret-fantasmagorique-genere-par-ia_188544-38492.jpg?t=st=1744386156~exp=1744389756~hmac=f3abf6c926cbb9be662aa10bfb25450d7c1f3afa6e5a07e2a5b9ef4691338f01&w=1380)',
             backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
                {/* <Nav /> */}

            </div>
            <div className='flex flex-col justify-center items-center  absolute top-0 right-0 bottom-0 left-0'>

                
                <div
                    className="text-nowrap text-5xl font-bold font-serif flex items-center">
                    <span className="text-[#5c00cc] font-sans text-7xl">HF</span>
                    <span>Stream</span>
                </div>

                <div className='text-3xl md:text-5xl got-title mt-4 ' style={{wordSpacing: "10px"}}>Error is coming!</div>

                {/* <div className='text-5xl'>  404</div> */}

                <Link href={'/'} className='py-2 px-6 cursor-pointer mt-6 got-title bg-[#5c00cc] rounded-full'> Go Home</Link>

                {/* <span className='text-4xl font-bold'> 404</span>   */}
                {/* <hr className='rotate-90 w-24 h-0' />
                <span>this page could not be found</span> */}
            </div>
        </>
    )
}

export default NotFound
