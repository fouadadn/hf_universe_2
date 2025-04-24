"use client"

import Nav from "../components/Home/nav";
import { TvProvider } from "../context/idContext";
import Head from 'next/head';

const layout = ({ children }) => {
  return (
    <div className="">
      
      <TvProvider>
        <Nav />
        {children}
      </TvProvider>
    </div>
  );
};

export default layout;
