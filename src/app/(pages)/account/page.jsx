"use client"

import BackdropSlide from '@/app/components/Home/backdropSlide';
import Footer from '@/app/components/Home/footer';
import { useTvContext } from '@/app/context/idContext'
import authe from '@/app/firebase';
import apiForHf from '@/app/utils/axiosInstanceForHfApi';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, sendEmailVerification, signOut, updateEmail, updatePassword, updateProfile, verifyBeforeUpdateEmail } from 'firebase/auth';
import { AlertTriangle, History, LogOut, Mail, Shield, X } from 'lucide-react';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
 
const page = () => {
    const { currentUser } = useTvContext();
    const [userData, setUserData] = useState({ displayName: "", email: "" })
    const [message, setMessage] = useState('')
    const [errors, setErrors] = useState('');
    const [newpassword, setNewPassword] = useState('')
    const [history, setHistory] = useState({})
    const [confirmShow, setConfirmShow] = useState(false)
    const [confirmShowLoading, setConfirmShowLoading] = useState(false)


    if (!currentUser) {
        redirect('/auth/login')

    }

    useEffect(() => {
        onAuthStateChanged(authe, function (user) {
            setUserData({ displayName: user?.displayName, email: user?.email })
        })

    }, [])

    const handleSignOut = async () => {
        try {
            await signOut(authe)
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }


    const handleSubmitChanges = async () => {

        const auth = getAuth();
        const user = auth.currentUser;

        // console.log(user?.email !== userData?.email)
        const passwordP = prompt('enter your current password')

        if (!passwordP) return

        try {
            updateProfile(authe.currentUser, {
                displayName: userData.displayName
            })
            // Step 1: Re-authenticate
            const credential = EmailAuthProvider.credential(user.email, passwordP);
            await reauthenticateWithCredential(user, credential);

            // Step 2: Send email verification to new email
            if (user?.email !== userData?.email) {
                await verifyBeforeUpdateEmail(user, userData.email);
                setMessage('To change your email, please verify it first. A verification email has been sent.')
            }


            if (newpassword) {
                await updatePassword(user, newpassword);
                setMessage('Password changed successfully!')

            }

            setTimeout(() => {
                setMessage('')
            }, 10000);

            window.location.reload();
        } catch (error) {
            setErrors("invalid password");
            setTimeout(() => {
                setErrors('')
            }, 5000);
        }



    }


    const user = authe.currentUser;

    useEffect(() => {
        async function fetchHistory() {
            if (!user) {
                return;
            }

            const token = await user.getIdToken(true);
            const response = await apiForHf.get(
                "/api/history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
            setHistory(response.data)
        }
        fetchHistory()
    }, [user])

    const handleClearHostory = async () => {
        if (!user) {
            return;
        }

        setConfirmShowLoading(true)
        const token = await user.getIdToken(true);
        const response = await apiForHf.delete(
            "/api/history/clear",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            }
        );
        setConfirmShowLoading(false)
        window.location.reload()
    }
    return (
        <>
            <div className={`top-0 bottom-0 right-0 left-0 ${confirmShow ? "block" : "hidden"} flex justify-center items-center z-[999999999] fixed`} style={{ backgroundColor: "#00000090 " }}>
                <div
                    className=" flex flex-col  items-center rounded-lg p-2 px-4 w-80 sm:max-w-md  bg-gradient-to-b "
                    style={{ backgroundColor: "#21262a " }}>
                    <div className="flex justify-between w-full ">
                        <div className=""></div>
                        <button className="cursor-pointer duration-200 hover:scale-110" onClick={() => { setConfirmShow(false) }}>
                            <X />
                        </button>
                    </div>
                    <div className="mx-auto bg-red-500/10 p-3 rounded-full" style={{ backgroundColor: "#fb2c3615" }}>
                        <AlertTriangle className="h-8 w-8 text-red-500" style={{ color: "#fb2c36" }} />
                    </div>
                    <span className="text-center" >Are you sure you want clear your History</span>

                    <div className="flex gap-2  w-full mt-2">
                        <button onClick={() => setConfirmShow(false)} className="border border-white/20 hover:bg-[#5c00cc] hover:scale-105 cursor-pointer duration-200 rounded-lg text-lg px-3 py-1 w-full " style={{ border: "1px solid #ffffff30" }}>Cancel</button>
                        <button onClick={handleClearHostory} className=" border-white rounded-lg flex items-center gap-1 justify-center hover:bg-red-500/70 cursor-pointer duration-200 hover:scale-105 bg-red-500 w-full text-lg px-3 py-1" style={{ backgroundColor: "#fb2c36" }}>
                            <span >Clear</span>
                            {
                                confirmShowLoading && <span className="inline-block w-4 h-4 border-b-[1px] border-l-[1px] animate-spin rounded-full border-white group-hover:border-white " style={{ borderBottom: "solid 1px white", borderLeft: "solid 1px white" }}></span>
                            }
                        </button>
                    </div>
                </div>
            </div>
            <div className='mx-4 font-sans relative '>
                {
                    message &&
                    <div className='fixed bottom-3 justify-center flex w-full z-[999]'>

                        <div className=" relative mt-2 bg-teal-700 text-sm text-white rounded-lg p-4" role="alert"  >
                            <div className='absolute top-1 right-1 cursor-pointer' onClick={() => setMessage('')}>
                                <X size={17} />
                            </div>
                            <span id="hs-solid-color-success-label" className="font-semibold">
                                {message}
                            </span>
                        </div>
                    </div>
                }
                <div className='flex justify-between items-center'>
                    <div>
                        <h1 className="acc text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-[#5c00cc99] via-purple-400 to-blue-500 bg-clip-text text-transparent ">
                            My Account
                        </h1>
                        <h2 className='text-stone-500 text-sm md:text-base font-semibold'>Manage your Profile</h2>
                    </div>

                    <button style={{ backgroundColor: "#fb2c36" }} onClick={handleSignOut} className='bg-red-500 px-6 py-2 rounded-full flex items-center text-sm gap-1 duration-200 hover:scale-105 cursor-pointer'>
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>


                <div className='bg-gray-800/70 relative rounded-xl mt-10 w-full h-[530px] md:h-[500px] p-3'>
                    <h2 className='font-semibold text-xl'>Personal Information</h2>

                    <div className='flex gap-2 md:gap-6 mt-2 items-center justify-start'>

                        <div className={` bg-[#21262a] w-20 md:w-32 h-20 md:h-32 shrink-0 flex justify-center items-center rounded-full mt-2`} style={{ border: "0.2px solid #ffffff40" }}>
                            <span className='text-5xl md:text-7xl uppercase relative top-[2px] '>
                                {String(currentUser?.displayName)?.split('')[0]}
                            </span>
                        </div>
                        <div className='flex flex-col'>

                            <div>
                                <h2 className='capitalize font-semibold text-2xl md:text-3xl'>{currentUser?.displayName}</h2>

                                <div className='flex gap-1 bg-[#5c00cc30] rounded-full justify-center text-sm md:text-md items-center w-fit px-5 py-[2px]  mt-1' >
                                    <Mail size={20} className='text-[#5c00cc] ' />
                                    <span>{currentUser?.email} </span>
                                </div>

                                <div style={{ color: "#c27aff", backgroundColor: "#c27aff20" }} className='flex gap-1 mt-2 bg-purple-400/20 text-sm items-center text-purple-400 rounded-full py-[2px] px-6 w-fit'>
                                    <Shield size={15} />
                                    <span>Since {String(currentUser?.metadata?.creationTime).split(' ').slice(0, 4).join(' ')}</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className={`flex  md:ml-[155px] gap-x-4  max-w-[1000px]  flex-wrap`}>
                        {
                            errors &&
                            <div className="bg-red-50 border-s-4 border-red-500 p-4 w-[80%] relative rounded-xl dark:bg-red-800/30" role="alert" aria-labelledby="hs-bordered-red-style-label">
                                <div className='absolute top-2 right-2 cursor-pointer' onClick={() => setErrors('')}>
                                    <X size={18}></X>
                                </div>
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

                        <div className='mt-4 w-full md:w-fit'>
                            <div className='flex flex-col'>
                                <label htmlFor="">Username</label>
                                <input style={{ border: "1px solid #ffffff20" }} onChange={(e) => { setUserData({ ...userData, displayName: e.target.value }), setErrors('') }} type="text" value={userData?.displayName} className='outline-0 mt-2 focus:border-purple-700 md:w-96 px-3 py-2 rounded-md' />
                            </div>
                        </div>

                        <div className='mt-4 w-full md:w-fit'>
                            <div className='flex flex-col'>
                                <label htmlFor="">email</label>
                                <input style={{ border: "1px solid #ffffff20" }} onChange={(e) => { setUserData({ ...userData, email: e.target.value }), setErrors('') }} type="text" value={userData?.email} className='outline-0 mt-2 focus:border-purple-700 md:w-96 px-3 py-2 rounded-md' />
                            </div>
                        </div>

                        <div className='mt-4 w-full md:w-fit'>
                            <div className='flex flex-col'>
                                <label htmlFor="">Change Password</label>
                                <input style={{ border: "1px solid #ffffff20" }} onChange={(e) => setNewPassword(e.target.value)} type="password" className='outline-0 mt-2 focus:border-purple-700 md:w-96 px-3 py-2 rounded-md' />
                            </div>
                        </div>
                    </div>


                    <button onClick={handleSubmitChanges} className='absolute bottom-3 right-3 bg-[#5c00cc] rounded-lg px-4 py-2 hover:scale-105 duration-200 cursor-pointer'> Submit Changes </button>
                </div>


                {
                    history?.combined?.length > 0 &&
                    <div className=' w-full  mt-10 rounded-xl'>
                        <div className='flex justify-between items-center'>
                            <h1 className='text-xl md:text-3xl font-bold px-2 flex gap-1 items-center'>
                                <History className='text-[#5c00cc] ' />
                                <span>
                                    Recent Activity
                                </span>
                            </h1>

                            <button onClick={() => setConfirmShow(true)} className="border cursor-pointer border-white/20 rounded-lg px-3 py-1 hover:bg-[#5c00cc]  duration-200" style={{ border: "1px solid  #ffffff30" }}>Clear History</button>

                        </div>
                        <div className='mt-3 flex flex-col gap-2'>
                            <BackdropSlide show={history} title={"series"} history={true} />
                            <BackdropSlide show={history} title={"movies"} history={true} />
                        </div>
                    </div>
                }


            </div>
            <div className='mt-10'></div>
            <Footer></Footer>
        </>
    )
}

export default page