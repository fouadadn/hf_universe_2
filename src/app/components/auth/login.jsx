"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"
import authe from "@/app/firebase";
import { redirect, useRouter } from 'next/navigation';
import { useTvContext } from "@/app/context/idContext";
import { Eye, EyeClosed } from "lucide-react";



const Login = () => {
  const { currentUser } = useTvContext();
  const [height, setHeight] = useState(0)
  const [errors, setErrors] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)


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
      localStorage.setItem('GToken', token)
      setLoading(false)
    }
    catch (err) {
      setErrors('invalid email or password')
      setLoading(false)

    }
  }

  if (currentUser) {
    return redirect('/')
  }


  return (
    <div className="flex justify-center font-sans items-center duration-300" style={{ height: height }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          login(formData.email, formData.password)
        }}
        style={{ backgroundColor: "#44403b30", border: "0.2px solid #ffffff35" }} className="border-[0.5px] border-white/20 p-10 rounded-4xl bg-stone-700/30 w-96 md:w-[500px] ">
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
          <div onClick={() => router.back()} style={{ border: "0.2px solid #ffffff35" }} className="border-white/30 border rounded-lg px-4 py-2 cursor-pointer">
            Close </div>
        </div>

        {
          errors &&
          <div class="alert" role="alert" aria-labelledby="hs-bordered-red-style-label">
            <div class="alert-flex">
              <div class="icon-container">
                <span class="icon-circle">
                  <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </span>
              </div>

              <div class="text-container">
                <h3 id="hs-bordered-red-style-label" class="alert-title">Error!</h3>
                <p class="alert-text">{errors}</p>
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
            <div style={{ border: "1px solid #ffffff55" }} className="flex justify-between items-center  border-[1px] border-white/20 rounded-lg px-5 py-3 mt-1 bg-black">
              <input
                onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErrors('') }}

                type={`${showPassword ? "text" : "password"}`}
                placeholder="password"
                className="w-full outline-0"
              />
              <div onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center my-5">
          <Link href="/auth/forget-password" className="font-bold">
            Forget Password?
          </Link>
        </div>

        <div className="mt-2 group">
          <button disabled={loading ? true : false} className="flex items-center gap-1 justify-center hover:bg-stone-700/50 hover:text-white w-full bg-white text-black rounded-xl py-2 font-bold duration-200 cursor-pointer">
            <span>Login</span>

            {
              loading && <span style={{ border: "1px solid black", borderTopWidth: "0", borderLeftWidth: "0", }} className="inline-block w-5 h-5 border-b-[1px] border-l-[1px] animate-spin rounded-full border-black group-hover:border-white " ></span>
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

