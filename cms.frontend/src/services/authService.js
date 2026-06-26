// Import cấu hình axiosClient dùng chung từ thư mục api
import axiosClient from '../api/axiosClient';

const authService = {
    /**
     * 1. Hàm gửi yêu cầu đăng ký tài khoản khách hàng mới
     * Endpoint này kết nối tới CustomerController trong ASP.NET Core
     */
    register: async (customerData) => {
        try {
            const url = '/Customers/register';
            const response = await axiosClient.post(url, customerData);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API register:", error);
            throw error;
        }
    },

    /**
     * 2. Hàm gửi yêu cầu xác thực đăng nhập tài khoản
     */
    login: async (credentials) => {
        try {
            const url = '/Customers/login';
            // Gửi Email và Mật khẩu xuống API Backend để xác thực quyền truy cập
            const response = await axiosClient.post(url, credentials);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API login:", error);
            throw error;
        }
    },

    /**
     * 3. Hàm lấy thống kê của khách hàng
     */
    getStats: async (customerId) => {
        try {
            const response = await axiosClient.get(`/Customers/${customerId}/stats`);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi lấy thống kê khách hàng:", error);
            throw error;
        }
    },

    /**
     * 4. Hàm cập nhật thông tin khách hàng
     */
    updateProfile: async (id, profileData) => {
        try {
            const response = await axiosClient.put(`/Customers/${id}/profile`, profileData);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi cập nhật thông tin khách hàng:", error);
            throw error;
        }
    },

    /**
     * 5. Hàm gửi yêu cầu khôi phục mật khẩu
     */
    forgotPassword: async (email) => {
        try {
            const response = await axiosClient.post("/CustomerAuth/ForgotPassword", { email });
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API forgotPassword:", error);
            throw error;
        }
    },

    /**
     * 6. Hàm gửi yêu cầu đổi mật khẩu
     */
    changePassword: async (data) => {
        try {
            const response = await axiosClient.post("/CustomerAuth/ChangePassword", data);
            return response.data || response;
        } catch (error) {
            console.error("Lỗi API changePassword:", error);
            throw error;
        }
    }
};

// Xuất mặc định đối tượng này để các trang Auth import vào không bị lỗi 'default was not found'
export default authService;
