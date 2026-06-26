import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

function Login() {
    const navigate = useNavigate();

    // State lưu trữ cặp tài nguyên đăng nhập từ người dùng
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isForgot, setIsForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (isForgot) {
                const response = await authService.forgotPassword(forgotEmail);
                if (response.temporaryPassword) {
                    alert(`${response.message}\n\nMật khẩu tạm thời của bạn là: ${response.temporaryPassword}\n\n(Vui lòng thay thông tin App Password trong Backend để gửi Email thật)`);
                } else {
                    alert(response.message || "Mật khẩu mới đã được gửi đến Email của bạn.");
                }
                setIsForgot(false);
            } else {
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
            }
        } catch (error) {
            const msg = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
            alert(isForgot ? `⛔ LỖI: ${msg}` : "⛔ ĐĂNG NHẬP THẤT BẠI: Sai tài khoản Email hoặc Mật khẩu không chính xác!");
        } finally {
            setIsLoading(false);
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
                                {isForgot ? "QUÊN MẬT KHẨU" : "ĐĂNG NHẬP HỆ THỐNG"}
                            </h4>
                            {isForgot && <p className="text-muted small mt-2">Nhập Email của bạn để nhận mật khẩu khôi phục qua hòm thư.</p>}
                        </div>
                        <form onSubmit={handleLoginSubmit}>
                            {isForgot ? (
                                <div className="form-group mb-4">
                                    <label className="small font-weight-bold text-secondary">TÀI KHOẢN EMAIL</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        placeholder="example@gmail.com" 
                                        value={forgotEmail}
                                        onChange={(e) => setForgotEmail(e.target.value)} 
                                        required 
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="form-group mb-3">
                                        <label className="small font-weight-bold text-secondary">TÀI KHOẢN EMAIL</label>
                                        <input type="email" name="email" className="form-control" placeholder="example@gmail.com" onChange={handleChange} required />
                                    </div>
                                    <div className="form-group mb-4">
                                        <label className="small font-weight-bold text-secondary">MẬT KHẨU</label>
                                        <input type="password" name="password" className="form-control" placeholder="******" onChange={handleChange} required />
                                        <div className="text-end mt-2">
                                            <span 
                                                className="text-primary small" 
                                                style={{ cursor: "pointer", textDecoration: "underline" }}
                                                onClick={() => setIsForgot(true)}
                                            >
                                                Quên mật khẩu?
                                            </span>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            <button type="submit" className={`btn btn-block w-100 py-2 font-weight-bold ${isForgot ? 'btn-danger' : 'btn-primary'}`} style={!isForgot ? { backgroundColor: '#005088', borderColor: '#005088', borderRadius: '8px' } : { borderRadius: '8px' }} disabled={isLoading}>
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                ) : null}
                                {isForgot ? "GỬI YÊU CẦU" : "ĐĂNG NHẬP"}
                            </button>

                            {isForgot && (
                                <div className="text-center mt-3">
                                    <span 
                                        className="text-secondary small font-weight-bold" 
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                        onClick={() => setIsForgot(false)}
                                    >
                                        Quay lại đăng nhập
                                    </span>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
