import axiosClient from "../api/axiosClient";

const categoryProductService = {

    getAllCategoryProducts: () => {
        return axiosClient.get("/categoriesproducts");
    }

};

export default categoryProductService;