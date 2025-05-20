"use client"

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import authe from "@/app/firebase";
import { useTvContext } from "@/app/context/idContext";
import { redirect, useRouter } from "next/navigation";
import { Eye, EyeClosed } from "lucide-react";

const SignUp = () => {

  const { currentUser } = useTvContext();
  const [height, setHeight] = useState(0)
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [err, setErr] = useState('')
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({ showPassword: false, showPasswordConfirmation: false })


  useEffect(() => {
    setHeight(window.innerHeight)
  }, [])

  const signUp = async (email, password) => {

    try {
      if (!formData.username || !formData.email || !formData.password || !formData.password_confirmation) {
        return alert('all fields required')
      }

      if (formData.password !== formData.password_confirmation) {
        return alert('passwords does not match')
      }

      setLoading(true)

      const userCredential = await createUserWithEmailAndPassword(authe, email, password)
      await updateProfile(userCredential.user, {
        displayName: formData.username
      });

      setLoading(false)
    } catch (err) {
      console.log(err);
      setErr('the email has already been taken')
      // setLoading(false)

    }
  }

  if (currentUser) {
    return redirect('/')
  }

  return (
    <div className="flex justify-center font-sans items-center duration-300" style={{ height: height }}>
      <form onSubmit={(e) => {
        e.preventDefault();
        signUp(formData.email, formData.password)
      }} style={{ backgroundColor: "#44403b30", border: "0.2px solid #ffffff35" }} className="border-[0.5px] border-white/20 p-10 rounded-4xl bg-stone-700/30 w-96 md:w-[500px] ">
        <div className="flex items-center justify-between">
          <div>
            <Link
              href={"/"}
              className="text-nowrap text-3xl font-bold font-serif flex items-center">
              <span className="text-[#5c00cc] font-sans text-5xl">HF</span>
              <span>Stream</span>{" "}
            </Link>

            <span className="text-xs text-stone-500 relative bottom-3">
              Register to enjoy features
            </span>
          </div>
          <div onClick={() => router.back()} style={{ border: "0.2px solid #ffffff35" }} className="border-white/30 border rounded-lg px-4 py-2 cursor-pointer">
            Close
          </div>
        </div>
        {
          err &&
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
                <p class="alert-text">{err}</p>
              </div>
            </div>
          </div>
        }
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex flex-col">
            <label htmlFor="username" className="font-bold">
              Username
            </label>
            <input
              onChange={(e) => {
                setFormData({ ...formData, username: e.target.value })
                setErr('')
              }
              }
              style={{ border: "1px solid #ffffff55" }}
              type="text"
              id="username"
              placeholder="Username"
              className="outline-0 border-[1px] border-white/20 rounded-lg px-5 py-3 mt-1 bg-black"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="font-bold">
              Email
            </label>
            <input
              onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErr('') }}
              style={{ border: "1px solid #ffffff55" }}
              type="email"
              id="email"
              placeholder="Email"
              className="outline-0 border-[1px] border-white/20 rounded-lg px-5 py-3 mt-1 bg-black"
            />
          </div>

          <div className="flex flex-col">

            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <div style={{ border: "1px solid #ffffff55" }} className="flex justify-between items-center  border-[1px] border-white/20 rounded-lg px-5 py-3 mt-1 bg-black">
              <input
                onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setErr('') }}

                type={`${showPassword.showPassword ? "text" : "password"}`}
                placeholder="password"
                className="w-full outline-0"
              />
              <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, showPassword: !showPassword.showPassword })}>
                {showPassword.showPassword ? <Eye /> : <EyeClosed />}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-bold">
              Password
            </label>
            <div className="border-[1px] border-white/20 rounded-lg px-5 py-3 mt-1 bg-black flex justify-between"
              style={{ border: "1px solid #ffffff55" }}
            >
              <input
                onChange={(e) => { setFormData({ ...formData, password_confirmation: e.target.value }); setErr('') }}
                type={`${showPassword.showPasswordConfirmation ? "text" : "password"}`}
                placeholder="Confirm password"
                className="outline-0"
              />

              <div className="cursor-pointer" onClick={() => setShowPassword({ ...showPassword, showPasswordConfirmation: !showPassword.showPasswordConfirmation })}>
                {showPassword.showPasswordConfirmation ? <Eye /> : <EyeClosed />}
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
          <button disabled={loading ? true : false} className="hover:bg-stone-700/50 flex justify-center items-center gap-2 hover:text-white w-full text-stone-700 bg-white  rounded-xl py-2 font-bold duration-200 cursor-pointer" style={{ color: "#44403b" }}>
            <span>Sign Up</span>
            {
              loading && <span style={{ border: "1px solid black", borderTopWidth: "0", borderLeftWidth: "0", }} className="inline-block w-5 h-5 border-b-[1px] border-l-[1px] animate-spin rounded-full border-black  group-hover:border-white" ></span>
            }
          </button>
        </div>

        <div className="text-sm flex justify-center mt-4">
          <span className="text-[#797979] ">Already have an account?</span>
          <Link href={"/auth/login"} className="font-bold">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
