"use client";

import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import authe from '@/app/firebase';
import api from '@/app/utils/axiosInstance';
import apiForHf from '@/app/utils/axiosInstanceForHfApi';

const useStreamHistory = (type, id, season, episode) => {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(authe, async (user) => {
            if (user && type && id) {
                try {
                    const token = await user.getIdToken(true);
                    const show = (await api.get(`/${type}/${id}`)).data;

                    let item;
                    if (type === 'movie') {
                        item = {
                            mediaType: "movies",
                            item: { vote_average: show?.vote_average, show_id: id, name: show?.title, backdrop_path: show?.backdrop_path, genres: show?.genres, watchedAt: new Date().toISOString(), media_type: "movie" }
                        };
                    } else if (type === 'tv' && season && episode) {
                        const chosenSeason = (await api.get(`/tv/${id}/season/${season}`)).data;
                        const chosenEpisode = chosenSeason?.episodes?.find(ep => ep.episode_number == episode);
                        item = {
                            mediaType: "series",
                            item: { vote_average: show?.vote_average, show_id: id, name: show?.name, backdrop_path: chosenEpisode?.still_path, genres: show?.genres, season: parseInt(season), episode: parseInt(episode), watchedAt: new Date().toISOString(), media_type: "tv" }
                        };
                    }

                    if (item) {
                        await apiForHf.post("/api/history", item, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                                Accept: "application/json",
                            },
                        });
                    }
                } catch (error) {
                    console.error("Failed to add to history:", error);
                }
            }
        });

        return () => unsubscribe();
    }, [type, id, season, episode]);
};

export default useStreamHistory;