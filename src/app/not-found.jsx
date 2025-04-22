"use client"

import React from 'react'
// import Nav from './components/Home/Nav'
import Link from 'next/link'

const NotFound = () => {

    return (
        <>
            <div className='brightness-40  absolute top-0 right-0 bottom-0 left-0' 
            style={{ backgroundImage: 'url(/assets/throne.jpeg)',
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
