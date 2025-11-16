"use client";

import React from "react";
import YouTube from "react-youtube";

const Trailler = ({ keyID }) => {

  return (
    // <div >
      <YouTube videoId={keyID} opts={{ width: "100%", height: "100%" }} className="absolute top-0 right-0 left-0 bottom-0 " />
    // </div>
  );
};
 
export default Trailler;
