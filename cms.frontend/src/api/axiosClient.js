import axios from "axios";

const axiosClient = axios.create({
    baseURL: "https://localhost:7226/api",
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