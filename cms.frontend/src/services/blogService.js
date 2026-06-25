import axiosClient from "../api/axiosClient";

const blogService = {
    getAllPosts: (page = 1, pageSize = 6) => {
        return axiosClient.get("/posts", { params: { page, pageSize } });
    },
    
    getPostById: (id) => {
        return axiosClient.get(`/posts/${id}`);
    },
    
    createPost: (postData) => {
        return axiosClient.post("/posts", postData);
    },
    
    updatePost: (id, postData) => {
        return axiosClient.put(`/posts/${id}`, postData);
    },
    
    deletePost: (id) => {
        return axiosClient.delete(`/posts/${id}`);
    }
};

export default blogService;