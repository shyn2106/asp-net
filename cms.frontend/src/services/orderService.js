import axiosClient from "../api/axiosClient";

const orderService = {
    getAllOrders: () => {
        return axiosClient.get("/orders");
    },
    
    getOrderById: (id) => {
        return axiosClient.get(`/orders/${id}`);
    },

    getOrdersByCustomer: (customerId) => {
        return axiosClient.get(`/orders/customer/${customerId}`);
    },
    
    createOrder: (orderData) => {
        // orderData contains CustomerId, Status (0: Chờ duyệt), Notes
        return axiosClient.post("/orders", orderData);
    },
    
    updateOrder: (id, orderData) => {
        return axiosClient.put(`/orders/${id}`, orderData);
    },
    
    deleteOrder: (id) => {
        return axiosClient.delete(`/orders/${id}`);
    },
    
    // Order Details API
    getAllOrderDetails: () => {
        return axiosClient.get("/orderdetails");
    },
    
    createOrderDetail: (detailData) => {
        // detailData contains OrderId, ProductId, Quantity, UnitPrice
        return axiosClient.post("/orderdetails", detailData);
    }
};

export default orderService;
