import axios from "axios";

export const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || "https://localhost:7226";

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://localhost:7226/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

axiosClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API Error:", error);
        return Promise.reject(error);
    }
);

export default axiosClient;