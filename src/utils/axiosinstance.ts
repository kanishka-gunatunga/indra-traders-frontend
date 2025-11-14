import axios from 'axios';
import {getSession} from "next-auth/react";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true",
    },
});

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("accessToken");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
// });


axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await getSession();

        const token = session?.user?.accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;