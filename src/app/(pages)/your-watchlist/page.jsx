"use client"
import React, { useEffect } from 'react'
import Whishlist from '@/app/components/Home/whishlistcomp'
import { redirect } from 'next/navigation'
import Footer from '@/app/components/Home/footer'
import authe from '@/app/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const page = () => {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authe, async (user) => {
      if (!user) {
        redirect('/auth/login')
      }
    })

    return () => {
      unsubscribe();
    };
  }, [])
  return (
    <>
      <div className='mx-3'>
        <div>
          <div>
            <Whishlist filter={"Recently Added"} poster={true}></Whishlist>
          </div>
        </div>

        <div>
          <div className='mt-4'>
            <Whishlist filter={"movie"} poster={false}></Whishlist>
          </div>
        </div>


        <div>
          <div className='mt-8'>
            <Whishlist filter={"tv"} poster={false}></Whishlist>
          </div>
        </div>


        <div>
          <div className='mt-8'>
            <Whishlist filter={"Upcoming"} poster={false} check={true}></Whishlist>
          </div>
        </div>


      </div>

      <hr className="border-white/30 mt-5" />

      <Footer />
    </>
  )
}

export default page