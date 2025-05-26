"use client";

import Script from "next/script";
import Nav from "../components/Home/nav";
import authe from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authe, (user) => {
      setUser(user);
      setAuthChecked(true);
    });

    return () => unsubscribe();
  }, []);

  const hideAdsFor = "fouadadnan07@gmail.com";
  const showAds =
    authChecked && (!user || user.email?.toLowerCase().trim() !== hideAdsFor);

  return (
    <div className="">
      {showAds && (
        <>
          <Script
            data-cfasync="false"
            src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1181800"
            strategy="afterInteractive"
          />
          <Script
            data-cfasync="false"
            src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1181798"
            strategy="afterInteractive"
          />
        </>
      )}

      <Nav />
      {children}
    </div>
  );
};

export default Layout;
