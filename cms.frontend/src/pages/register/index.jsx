import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';

function Register() {
    const navigate = useNavigate();
    
    // State bọc tập trung toàn bộ dữ liệu ô nhập liệu: Họ tên, Email, Số điện thoại, Địa chỉ và Mật khẩu
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        password: ''
    });

    // Hàm lắng nghe sự kiện gõ chữ để cập nhật State động dựa trên thuộc tính 'name'
    const handleChange = (e) => {
        setFormData({ 
            ...formData, 
            [e.target.name]: e.target.value 
        });
    };

    // LOGIC VALIDATION (BẮT LỖI) TRƯỚC KHI GỬI LỆNH XUỐNG BACKEND
    const validateForm = () => {
        // 1. Kiểm tra xem các ô bắt buộc có bị bỏ trống không
        if (!formData.fullName || !formData.email || !formData.password) {
            alert("⛔ LỖI: Vui lòng không bỏ trống Họ tên, Email và Mật khẩu!");
            return false;
        }

        // 2. Kiểm tra định dạng Email có đúng quy chuẩn không bằng Regular Expression
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("⛔ LỖI: Định dạng Email không hợp lệ (Ví dụ đúng: NguyenVanA@gmail.com)!");
            return false;
        }

        // 3. Kiểm tra mật khẩu có đủ độ dài an toàn không
        if (formData.password.length < 6) {
            alert("⛔ LỖI: Mật khẩu phải chứa ít nhất 6 ký tự để đảm bảo an toàn!");
            return false;
        }

        return true; // Form hoàn toàn hợp lệ
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Chặn hành vi tải lại trang mặc định của thẻ form HTML
        
        if (!validateForm()) return; // Nếu kiểm thử dữ liệu thất bại -> Ngắt luồng ngay lập tức

        try {
            // Gửi lệnh POST dữ liệu sạch xuống API Backend
            await authService.register(formData);
            alert("🎉 ĐĂNG KÝ THÀNH CÔNG! Chào mừng bạn đến với hệ thống. Hãy đăng nhập ngay.");
            navigate('/login'); // Đẩy người dùng sang trang Đăng nhập
        } catch (error) {
            alert("⛔ ĐĂNG KÝ THẤT BẠI: Email này có thể đã được đăng ký trên hệ thống!");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
                        <h3 className="text-center font-weight-bold text-uppercase mb-4" style={{ color: '#005088' }}>
                            Đăng Ký Tài Khoản
                        </h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label className="small font-weight-bold text-secondary">Họ và Tên *</label>
                                <input type="text" name="fullName" className="form-control" onChange={handleChange} placeholder="Nhập họ và tên của bạn" />
                            </div>
                            <div className="form-group mb-3">
                                <label className="small font-weight-bold text-secondary">Email (Tài khoản đăng nhập) *</label>
                                <input type="email" name="email" className="form-control" onChange={handleChange} placeholder="example@gmail.com" />
                            </div>
                            <div className="row">
                                <div className="col-md-6 form-group mb-3">
                                    <label className="small font-weight-bold text-secondary">Số Điện Thoại</label>
                                    <input type="text" name="phone" className="form-control" onChange={handleChange} placeholder="090xxxxxxx" />
                                </div>
                                <div className="col-md-6 form-group mb-3">
                                    <label className="small font-weight-bold text-secondary">Mật Khẩu *</label>
                                    <input type="password" name="password" className="form-control" onChange={handleChange} placeholder="Tối thiểu 6 ký tự" />
                                </div>
                            </div>
                            <div className="form-group mb-4">
                                <label className="small font-weight-bold text-secondary">Địa Chỉ Nhận Hàng</label>
                                <textarea name="address" className="form-control" rows="2" onChange={handleChange} placeholder="Nhập số nhà, tên đường, quận/huyện..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary btn-block w-100 py-2 font-weight-bold shadow-sm" style={{ backgroundColor: '#005088', borderColor: '#005088', borderRadius: '8px' }}>
                                ĐĂNG KÝ NGAY
                            </button>
                        </form>
                        <p className="text-center mt-3 small m-0 text-muted">
                            Đã có tài khoản thành viên? <Link to="/login" className="font-weight-bold text-primary">Đăng nhập tại đây</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
