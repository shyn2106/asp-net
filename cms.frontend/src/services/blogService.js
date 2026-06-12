import axiosClient from "../api/axiosClient";

const blogService = {
    getAllPosts: () => {
        return axiosClient.get("/posts");
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