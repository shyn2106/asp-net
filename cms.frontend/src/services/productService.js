import axiosClient from "../api/axiosClient";

const productService = {
    getAllProducts: () => {
        return axiosClient.get("/products");
    }
};

export default productService;