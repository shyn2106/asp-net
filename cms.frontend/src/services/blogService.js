import axiosClient from "../api/axiosClient";

const blogService = {

    getBlogCategories: () => {
        return axiosClient.get("/categories");
    },

    getAllPosts: () => {
        return axiosClient.get("/posts");
    }

};

export default blogService;