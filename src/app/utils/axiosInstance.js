import axios from "axios";

const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwOTFkNDgxN2Y5MDQ1NjIyMTQyZmZkNjdhMDhiMmQxNSIsIm5iZiI6MTcyNzUyMDEyMS41ODksInN1YiI6IjY2ZjdkZDc5MmM0YmRjOWRiMDVmMjUwMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.WnastJIEwkEk38mW6ewWBD1LXTt5-ITmx6LJNlqDMts`
    },
});

api.interceptors.request.use(
    (config) => {
        // console.log("Request sent:", config);
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
