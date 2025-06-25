import axios from "axios";

const hf_api_URL_LOCAL = 'http://localhost:3002'
const hf_api_URL_SERVER = 'https://hf-stream-api.vercel.app'

const apiForHf = axios.create({
    baseURL: hf_api_URL_LOCAL,
});

apiForHf.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiForHf;
