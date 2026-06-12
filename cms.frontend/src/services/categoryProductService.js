import axiosClient from "../api/axiosClient";

const categoryProductService = {
    getAllCategoryProducts: () => {
        return axiosClient.get("/categoriesproducts");
    },
    
    getCategoryProductById: (id) => {
        return axiosClient.get(`/categoriesproducts/${id}`);
    },
    
    createCategoryProduct: (categoryData) => {
        return axiosClient.post("/categoriesproducts", categoryData);
    },
    
    updateCategoryProduct: (id, categoryData) => {
        return axiosClient.put(`/categoriesproducts/${id}`, categoryData);
    },
    
    deleteCategoryProduct: (id) => {
        return axiosClient.delete(`/categoriesproducts/${id}`);
    }
};

export default categoryProductService;