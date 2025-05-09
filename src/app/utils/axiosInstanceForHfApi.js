import axios from "axios";

const hf_api_URL_LOCAL = 'http://localhost:3001'
const hf_api_URL_SERVER = 'https://hf-stream-api.vercel.app/api'

const apiForHf = axios.create({
    baseURL: hf_api_URL_SERVER,
});

apiForHf.interceptors.request.use(
    (config) => {
        // console.log("Request sent:", config);
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiForHf;
