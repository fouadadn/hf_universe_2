"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"
import { authe } from "@/app/firebase";
import { redirect } from 'next/navigation';
import { useTvContext } from "@/app/context/idContext";


const Login = () => {
  const { currentUser } = useTvContext();
  const [height, setHeight] = useState(0)
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })


  useEffect(() => {
    setHeight(window.innerHeight)
  }, [])



  const login = async (email, password) => {
    try {
      if (!formData.password || !formData.email) {
        return alert('all fields required')
      }
      setLoading(true)

      const userCredential = await signInWithEmailAndPassword(authe, email, password)
      const token = await userCredential.user.getIdToken()
      localStorage.setItem('GToken', JSON.stringify(token))
      setLoading(false)
    }
    catch (err) {
      setErrors('invalid email or password')
      setLoading(false)

    }
  }

  return (
    <div className="flex justify-center font-sans items-center duration-300" style={{ height: height }}>
      <form onSubmit={(e) => {
        e.preventDefault();
        login(formData.email, formData.password)
      }} style={{ backgroundColor: "#44403b30", border: "0.2px solid #ffffff35" }} className="border-[0.5px] border-white/20 p-10 rounded-4xl bg-stone-700/30 w-96 md:w-[500px] ">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={"/"}
              className="text-nowrap text-3xl font-bold font-serif flex items-center">
              <span className="text-[#5c00cc] font-sans text-5xl">HF</span>
              <span>Stream</span>{" "}
            </Link>

            <span className="text-xs text-stone-500 relative bottom-3">Login to your account</span>
          </div>
          <Link href={'/'}>
            <button style={{ border: "0.2px solid #ffffff35" }} className="border-white/30 border rounded-lg px-4 py-2 cursor-pointer">Close</button>
          </Link>
        </div>

        {
          errors &&
          <div className="bg-red-50 border-s-4 border-red-500 p-4 rounded-xl dark:bg-red-800/30" role="alert" aria-labelledby="hs-bordered-red-style-label">
            <div className="flex">
              <div className="shrink-0">

                <span className="inline-flex justify-center items-center size-8 rounded-full border-4 border-red-100 bg-red-200 text-red-800 dark:border-red-900 dark:bg-red-800 dark:text-red-400">
                  <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"   >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </span>
              </div>
              <div className="ms-3">
                <h3 id="hs-bordered-red-style-label" className="text-gray-800 font-semibold dark:text-white">
                  Error!
                </h3>
                <p className="text-sm text-gray-700 dark:text-neutral-400">
                  {errors}
                </p>
              </div>
            </div>
          </div>
        }


        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors('') }}
              type="email"
              id="email"
              placeholder="Email"
              className="outline-0 border border-white/30 rounded-lg px-5 py-3 mt-1 bg-black"
              style={{ border: "1px solid #ffffff55" }} />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <input
              onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors('') }}
              style={{ border: "1px solid #ffffff55" }}
              type="password"
              placeholder="password"
              className="outline-0 border-[1px] border-white/20 rounded-lg px-5 py-3 mt-1 bg-black"
            />
          </div>
        </div>
        <div className="flex justify-center my-5">
          <a href="" className="font-bold">
            Forget Password
          </a>
        </div>

        <div className="mt-2 ">
          <button disabled={loading ? true : false} className="flex items-center gap-1 justify-center hover:bg-stone-700/50 hover:text-white w-full bg-white text-black rounded-xl py-2 font-bold duration-200 cursor-pointer">
            Login

            {
              loading && <span className="inline-block w-5 h-5 border-b-[1px] border-l-[1px] animate-spin rounded-full border-black  " ></span>
            }
          </button>
        </div>

        <div className="text-sm flex justify-center mt-4">
          <span className="text-[#797979] ">Don't have an accout?</span><Link href={"/auth/sign-up"} className="font-bold">Sign Up</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

