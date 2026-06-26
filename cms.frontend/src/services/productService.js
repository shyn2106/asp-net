import axiosClient from "../api/axiosClient";

const productService = {
    getAllProducts: async (filters = {}, page = 1, pageSize = 12) => {
        try {
            const params = { ...filters, page, pageSize };
            const response = await axiosClient.get('/Products', { params });
            return response;
        } catch (error) {
            console.error("Lỗi API getAllProducts:", error);
            throw error;
        }
    },

    getLatestProducts: async () => {
        try {
            const response = await axiosClient.get('/Products/latest');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getLatestProducts:", error);
            throw error;
        }
    },

    getHotProducts: async () => {
        try {
            const response = await axiosClient.get('/Products/hot');
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API getHotProducts:", error);
            throw error;
        }
    },

    getProductById: async (id) => {
        try {
            const response = await axiosClient.get(`/Products/${id}`);
            return response.data || response;
        } catch (error) {
            console.error(`Lỗi API getProductById với ID ${id}:`, error);
            throw error;
        }
    },
    
    createProduct: (productData) => {
        return axiosClient.post("/products", productData);
    },
    
    updateProduct: (id, productData) => {
        return axiosClient.put(`/products/${id}`, productData);
    },
    
    deleteProduct: (id) => {
        return axiosClient.delete(`/products/${id}`);
    }
};

export default productService;