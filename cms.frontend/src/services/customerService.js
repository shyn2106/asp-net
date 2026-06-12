import axiosClient from "../api/axiosClient";

const customerService = {
    getAllCustomers: () => {
        return axiosClient.get("/customers");
    },
    
    getCustomerById: (id) => {
        return axiosClient.get(`/customers/${id}`);
    },
    
    createCustomer: (customerData) => {
        // customerData should contain FullName, Email, Phone, Address, Password (raw/simplified)
        return axiosClient.post("/customers", customerData);
    },
    
    updateCustomer: (id, customerData) => {
        return axiosClient.put(`/customers/${id}`, customerData);
    },
    
    deleteCustomer: (id) => {
        return axiosClient.delete(`/customers/${id}`);
    }
};

export default customerService;
