"use client"

import Nav from "../components/Home/nav";
import { TvProvider } from "../context/idContext";
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
