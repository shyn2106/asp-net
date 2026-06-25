import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Login() {
    const navigate = useNavigate();

    // State lưu trữ cặp tài nguyên đăng nhập từ người dùng
    const [credentials, setCredentials] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Gửi Email và Mật khẩu xuống API Backend để thực hiện xác thực ngầm
            const response = await authService.login(credentials);
            const data = response.data || response;

            // 2. LOGIC XỬ LÝ CỐT LÕI: 
            // Nếu Backend báo thành công và trả về thông tin dữ liệu sạch,
            // sinh viên phải lưu ngay thông tin Customer vào bộ nhớ trình duyệt dưới dạng String.
            localStorage.setItem('customer', JSON.stringify(data));

            alert(`🎉 XÁC THỰC THÀNH CÔNG: Chào mừng ${data.fullName} đã đăng nhập hệ thống!`);

            // 3. Sử dụng lệnh điều hướng đưa người dùng quay lại trang chủ dưới trạng thái đã đăng nhập
            navigate('/');

            // Ép trình duyệt nạp lại để component Header bóc tách LocalStorage hiển thị UI mới lập tức
            window.location.reload();
        } catch (error) {
            alert("⛔ ĐĂNG NHẬP THẤT BẠI: Sai tài khoản Email hoặc Mật khẩu không chính xác!");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center py-5">
                <div className="col-md-4 col-sm-8">
                    <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '15px' }}>
                        <div className="text-center mb-4">
                            <div className="icon-wrapper text-primary mb-2" style={{ fontSize: '50px' }}>
                                <i className="fas fa-user-shield"></i>
                            </div>
                            <h4 className="font-weight-bold text-uppercase m-0" style={{ color: '#005088', letterSpacing: '0.5px' }}>
                                ĐĂNG NHẬP HỆ THỐNG
                            </h4>
                        </div>
                        <form onSubmit={handleLoginSubmit}>
                            <div className="form-group mb-3">
                                <label className="small font-weight-bold text-secondary">TÀI KHOẢN EMAIL</label>
                                <input type="email" name="email" className="form-control" placeholder="example@gmail.com" onChange={handleChange} required />
                            </div>
                            <div className="form-group mb-4">
                                <label className="small font-weight-bold text-secondary">MẬT KHẨU</label>
                                <input type="password" name="password" className="form-control" placeholder="******" onChange={handleChange} required />
                            </div>
                            <button type="submit" className="btn btn-primary btn-block w-100 py-2 font-weight-bold" style={{ backgroundColor: '#005088', borderColor: '#005088', borderRadius: '8px' }}>
                                ĐĂNG NHẬP
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
