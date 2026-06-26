import axiosClient from "../api/axiosClient";

const customerAuthService = {
    login: (email, password) => {
        return axiosClient.post("/CustomerAuth/Login", { email, password });
    },
    
    register: (customerData) => {
        return axiosClient.post("/CustomerAuth/Register", customerData);
    },

    forgotPassword: (email) => {
        return axiosClient.post("/CustomerAuth/ForgotPassword", { email });
    }
};

export default customerAuthService;
