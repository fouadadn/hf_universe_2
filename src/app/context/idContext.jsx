"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const TvContext = createContext();

export const TvProvider = ({ children }) => {
    const [id, setId] = useState(window.localStorage && window.localStorage.id ? window.localStorage.id : 0); // e.g., { dark: 97680 }
    
    function changeId(id) {
        localStorage.id = id
        setId(id)
    }

    function slugify(str) {
        return str
          .toLowerCase()
          .normalize('NFD')                      
          .replace(/[\u0300-\u036f]/g, '')      
          .replace(/[^a-z0-9]+/g, '-')       
          .replace(/^-+|-+$/g, '');
      }

    return (
        <TvContext.Provider value={{ id, changeId , slugify}}>
            {children}
        </TvContext.Provider>
    );
};

export const useTvContext = () => useContext(TvContext);
