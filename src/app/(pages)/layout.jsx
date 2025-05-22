"use client"

import Script from "next/script";
import Nav from "../components/Home/nav";
import authe from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const layout = ({ children }) => {
  const [user, setUser] = useState('')

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authe, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const hideAdsFor = "fouadadnan07@gmail.com";
  const showAds = !user || user?.email !== hideAdsFor;

  return (
    <div className="">
      {
        showAds &&
        <>
          <Script
            data-cfasync="false"
            src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1181800"
            strategy="afterInteractive"
          />
          <Script src="/adblock.js" strategy="afterInteractive" />
        </>
      }

      <Nav />
      {children}
    </div>
  );
};

export default layout;
