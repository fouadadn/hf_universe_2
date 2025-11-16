"use client"

import HomePageSlider from "../Home/HomePageSlider";
import PosterSlide from "../Home/posterSlide";
import PopularWeek from "../Home/popularWeek";
import BackdropSlide from "../Home/backdropSlide";
import Footer from "../Home/footer";
import { useEffect, useState } from "react";
import api from "@/app/utils/axiosInstance";

export default function DiscoverDetails({ provider, p_id }) {
    const date = new Date();
 
    const [show, setShows] = useState([])
    const [movies, setMovies] = useState([])
    const [providerMovies, setProviderMovies] = useState([])
    const [providerTvs, setProviderTvs] = useState([])
    const [releaseMovie, setReleaseMovie] = useState([])
    const [releaseTv, setReleaseTv] = useState([])
    const [tvs, setTvs] = useState([])

    useEffect(() => {
        async function fetchData() {
            const movie = (await api.get(`/discover/movie?with_watch_providers=${p_id}&watch_region=US&sort_by=popularity.desc&primary_release_year=${date.getFullYear()}`)).data.results;
            const tv = (await api.get(`/discover/tv?with_watch_providers=${p_id}&watch_region=US&sort_by=popularity.desc&primary_release_year=${date.getFullYear()}`)).data.results;

            setProviderMovies((await api.get(`/discover/movie?with_watch_providers=${p_id}&watch_region=US`)).data.results)
            setProviderTvs((await api.get(`/discover/tv?with_watch_providers=${p_id}&watch_region=US`)).data.results)


            const movieWithMediaType = movie.map((e) => { return { ...e, media_type: "movie" } })
            const tvWithMediaType = tv.map((e) => { return { ...e, media_type: "tv" } })

            setMovies(movieWithMediaType)
            setTvs(tvWithMediaType)

            const arr = [...movieWithMediaType.slice(0, 10), ...tvWithMediaType.slice(0, 10)].sort((a, b) => {
                a.popularity - b.popularity
            })

            setShows(arr)

            const getDateRangeForLastMonth = () => {
                const today = new Date();
                const lastMonth = new Date();
                lastMonth.setDate(today.getDate() - 30);

                return {
                    from: lastMonth.toISOString().split("T")[0],
                    to: today.toISOString().split("T")[0],
                };
            };

            const fetchNetflixMovies = async (totalPages = 2) => {
                const { from, to } = getDateRangeForLastMonth();

                const requests = [];

                for (let i = 1; i <= totalPages; i++) {
                    requests.push(
                        api.get("/discover/movie", {
                            params: {
                                with_watch_providers: p_id, 
                                watch_region: "US",
                                sort_by: "primary_release_date.desc",
                                'primary_release_date.gte': from,
                                'primary_release_date.lte': to,
                                page: i,
                            },
                        })
                    );
                }

                const responses = await Promise.all(requests);
                return responses.flatMap(res => res.data.results);
            };

            const netflixMovies = await fetchNetflixMovies(3);
            setReleaseMovie(netflixMovies)



            const fetchNetflixTvShows = async (totalPages = 2) => {
                const { from, to } = getDateRangeForLastMonth();

                const requests = [];

                for (let i = 1; i <= totalPages; i++) {
                    requests.push(
                        api.get("/discover/tv", {
                            params: {
                                with_watch_providers: p_id, // Netflix
                                watch_region: "US",
                                sort_by: "first_air_date.desc",
                                'first_air_date.gte': from,
                                'first_air_date.lte': to,
                                page: i,
                            },
                        })
                    );
                }

                const responses = await Promise.all(requests);
                return responses.flatMap(res => res.data.results);
            };

            const netflixTvShows = await fetchNetflixTvShows(3);
            setReleaseTv(netflixTvShows)
        }

        fetchData()



    }, [p_id])




    return (
        <div className="font-sans">

            <div className=" xl:min-h-[115vh] ">
                <HomePageSlider shows={show} />
            </div>

            <div className="bg-black mt-6 lg:-mt-28 z-[9999] relative ">
                <div className=" ">
                    <PosterSlide movie={releaseMovie} tv={releaseTv} />
                </div>

                <div className="mt-20 ">
                    <h1 className="text-3xl font-bold mt-14">Popular of the week</h1>
                    <PopularWeek shows={show} />
                </div>

                <div className="mt-14">
                    <BackdropSlide title={"Movies"} media_type={"movie"} show={providerMovies} />
                </div>

                <div className="mt-14 ">
                    <BackdropSlide title={"Seires"} media_type={"tv"} show={providerTvs} />
                </div>

                <hr className="border-white/30 mt-5" />

                <Footer />

            </div>

        </div>
    );
}
