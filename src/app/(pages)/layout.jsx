"use client"

import Nav from "../components/Home/nav";

const layout = ({ children }) => {
  return (
    <div className="">
        <Nav />
        {children}
    </div>
  );
};

export default layout;
