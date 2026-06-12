import axiosClient from "../api/axiosClient";

const productService = {
    getAllProducts: () => {
        return axiosClient.get("/products");
    },
    
    getProductById: (id) => {
        return axiosClient.get(`/products/${id}`);
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