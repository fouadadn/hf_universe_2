"use client"
import React from 'react'
import Whishlist from '@/app/components/Home/whishlistcomp'
import { useTvContext } from '@/app/context/idContext'
import { redirect } from 'next/navigation'
import Footer from '@/app/components/Home/footer'

const page = () => {

  const { currentUser } = useTvContext()

  // if (!currentUser) {
  //   redirect('/auth/login')
  // }
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