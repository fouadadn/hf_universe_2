"use client";

import Script from "next/script";
import Nav from "../components/Home/nav";
import authe, { db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [siteParams, setSiteParams] = useState(null)


  useEffect(() => {

    const unsubscribe = onAuthStateChanged(authe, (user) => {
      async function getUserByUid() {
        try {
          const userRef = doc(db, "users", user?.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            console.log("No such user!");
            return setUser(null);
          }

          setUser({ id: userSnap.id, ...userSnap.data() })
        } catch (error) {
          return setUser(null)
        }
      }
      if (user) getUserByUid()
      setAuthChecked(true);
    });

    async function getSiteParams() {
      try {
        const paramsRef = doc(db, "siteparams", "01ZdDCGd5dxwRHw8JRlc");
        const paramsSnap = await getDoc(paramsRef);

        if (!paramsSnap.exists()) {
          console.log('matl9atx')
          return setSiteParams(null)
        }

        return setSiteParams({ id: paramsSnap.id, ...paramsSnap.data() })
      }
      catch (err) {
        console.log('err')
        return setSiteParams(null)
      }
    }
    getSiteParams()

 
    return () => unsubscribe();
  }, []);

  const showAds = authChecked && (!user || user.show_ads === true);

  return (
    <div className="">
      {(siteParams?.show_ads ? showAds : false) && (
        <>
          <Script
            data-cfasync="false"
            src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1181800"
            strategy="afterInteractive"
          />
          {/* <Script
            data-cfasync="false"
            src="//dcbbwymp1bhlf.cloudfront.net/?wbbcd=1181798"
            strategy="afterInteractive"
          /> */}
        </>
      )}

      <Nav />
      {children}
    </div>
  );
};

export default Layout;
