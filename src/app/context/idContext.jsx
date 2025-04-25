"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { authe } from '../firebase.js';
import { onAuthStateChanged } from 'firebase/auth';

const TvContext = createContext();

export const TvProvider = ({ children }) => {
    const [arrows, setArrows] = useState(false);
    const [providerId, setProviderId] = useState(null);
    const [providerName, setProviderName] = useState("netflix");
    const [currentUser, setCurrentUser] = useState(null)
    const [id, setId] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authe, (user) => {
            setCurrentUser(user ? user : null);
        })
        return () => {
            unsubscribe();
        }
    }, [])



    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedId = localStorage.getItem('id');
            const storedproviderId = localStorage.getItem('providerId')
            const storedproviderName = localStorage.getItem('providerName')
            if (storedId) setId(storedId);
            if (storedproviderId) setProviderId(providerId);
            if (storedproviderName) setProviderName(name);
        }
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && id) {
            localStorage.setItem('id', id);
            localStorage.setItem('providerId', providerId)
            localStorage.setItem('name', providerName)
        }
    }, [id, providerId, providerName]);

    function changeId(id) {
        localStorage.id = id
        setId(id)
    }

    function changeProviderId(id) {
        localStorage.providerId = id
        setProviderId(id)
    }

    function slugify(str) {
        return String(str)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    return (
        <TvContext.Provider value={{
            id, changeId, slugify, arrows, setArrows, providerId, changeProviderId, setProviderName, providerName,
            currentUser, setCurrentUser
        }}>
            {children}
        </TvContext.Provider>
    );
};

export const useTvContext = () => useContext(TvContext);
