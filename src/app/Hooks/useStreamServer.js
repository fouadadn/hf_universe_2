"use client";

import { useState, useEffect } from 'react';

const useStreamServer = (type, id, season, episode) => {
    const [selectedServer, setSelectedServer] = useState({ url: null, server: 1 });

    useEffect(() => {
        const storedServer = localStorage.getItem('server');
        const serverConfig = storedServer ? JSON.parse(storedServer) : { url: 'https://moviesapi.club', server: 1 };

        let streamUrl;
        if (type === "movie") {
            streamUrl = `${serverConfig.url}/movie/${id}`;
        } else {
            if (serverConfig.server === 1) {
                streamUrl = `${serverConfig.url}/tv/${id}-${season}-${episode}`;
            } else {
                streamUrl = `${serverConfig.url}/tv/${id}/${season}/${episode}`;
            }
        }
        setSelectedServer({ url: streamUrl, server: serverConfig.server });
    }, [type, id, season, episode]);

    const setServer = (url, server) => {
        localStorage.setItem('server', JSON.stringify({ url, server }));
        window.location.reload(); // Reload to apply the new server URL
    };

    return { selectedServer, setServer };
};

export default useStreamServer;