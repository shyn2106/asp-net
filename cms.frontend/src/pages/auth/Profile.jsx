import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

function Profile() {
    const customerString = localStorage.getItem('customer');
    const initialCustomer = customerString ? JSON.parse(customerString) : null;
    
    const [customer, setCustomer] = useState(initialCustomer);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: initialCustomer?.fullName || '',
        phone: initialCustomer?.phone || '',
        address: initialCustomer?.address || ''
    });

    const [stats, setStats] = useState({
        totalOrders: 0,
        favorites: 0,
        rewardPoints: 0,
        purchasedProducts: 0
    });

    useEffect(() => {
        if (customer && customer.id) {
            const fetchStats = async () => {
                try {
                    const data = await authService.getStats(customer.id);
                    setStats(data);
                } catch (error) {
                    console.error("Failed to load customer stats");
                }
            };
            fetchStats();
        }
    }, [customer?.id]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.updateProfile(customer.id, formData);
            // Cập nhật Local Storage và State
            localStorage.setItem('customer', JSON.stringify(response.customer));
            setCustomer(response.customer);
            setIsEditing(false);
            alert("✅ " + response.message);
        } catch (error) {
            console.error("Lỗi cập nhật hồ sơ:", error);
            alert("❌ Lỗi khi cập nhật hồ sơ: " + (error.response?.data?.message || "Vui lòng thử lại"));
        }
    };

    if (!customer) {
        return (
            <div className="container py-5 text-center">
                <div className="alert alert-warning my-5 p-4 d-inline-block shadow-sm" style={{ borderRadius: '12px', background: '#1A2235', border: '1px solid #0ff', color: '#fff' }}>
                    <h5 className="font-weight-bold text-info">⛔ BẠN CHƯA ĐĂNG NHẬP HỆ THỐNG</h5>
                    <p className="small mb-3">Vui lòng đăng nhập tài khoản thành viên để truy cập hồ sơ cá nhân.</p>
                    <Link to="/login" className="btn btn-outline-info btn-sm font-weight-bold px-4" style={{ borderRadius: '6px' }}>
                        Đăng nhập ngay
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page flex-grow-1 d-flex flex-column py-5" style={{ backgroundColor: '#0a0f1d' }}>
            {/* Inline CSS dành riêng cho Profile Premium */}
            <style>
                {`
                    .premium-profile-card {
                        background-color: #1A2235;
                        border: 1px solid rgba(0, 255, 255, 0.2);
                        border-radius: 20px;
                        box-shadow: 0 0 15px rgba(0, 255, 255, 0.05);
                        transition: all 0.3s ease;
                        color: #ffffff;
                    }
                    .premium-profile-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 25px rgba(0, 255, 255, 0.15);
                        border-color: rgba(0, 255, 255, 0.4);
                    }
                    .stat-box {
                        background: rgba(255, 255, 255, 0.05);
                        border-radius: 12px;
                        padding: 15px;
                        text-align: center;
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        transition: all 0.3s;
                    }
                    .stat-box:hover {
                        background: rgba(0, 255, 255, 0.1);
                        border-color: rgba(0, 255, 255, 0.3);
                    }
                    .info-row {
                        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                        padding-bottom: 12px;
                        margin-bottom: 12px;
                    }
                    .info-row:last-child {
                        border-bottom: none;
                    }
                    .btn-cyber-outline {
                        background: transparent;
                        border: 1px solid #0ff;
                        color: #0ff;
                        transition: all 0.3s;
                    }
                    .btn-cyber-outline:hover {
                        background: #0ff;
                        color: #000;
                        box-shadow: 0 0 10px #0ff;
                    }
                `}
            </style>
            
            <div className="container flex-grow-1">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="premium-profile-card p-4 p-md-5">
                            
                            {/* Header: Avatar & Basic Info */}
                            <div className="d-flex flex-column align-items-center mb-4 text-center">
                                <div className="position-relative mb-3">
                                    <img 
                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(customer.fullName)}&background=0D8ABC&color=fff&size=120`} 
                                        alt="Avatar" 
                                        className="rounded-circle"
                                        style={{ border: '3px solid #0ff', padding: '3px', boxShadow: '0 0 15px rgba(0,255,255,0.4)' }}
                                    />
                                    <span className="badge bg-danger position-absolute bottom-0 start-50 translate-middle-x" style={{ fontSize: '0.75rem', transform: 'translateY(50%)' }}>
                                        VIP 1
                                    </span>
                                </div>
                                <h3 className="fw-bold mb-1" style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '1px' }}>
                                    {customer.fullName}
                                </h3>
                                <p className="text-info mb-0">Member ID: #{customer.id || '8888'}</p>
                            </div>

                            {/* Statistics Row */}
                            <div className="row g-3 mb-4">
                                <div className="col-6 col-md-3">
                                    <div className="stat-box">
                                        <h4 className="fw-bold text-info mb-1">{stats.totalOrders}</h4>
                                        <div className="small text-white-50">Tổng đơn hàng</div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="stat-box">
                                        <h4 className="fw-bold text-info mb-1">{stats.favorites}</h4>
                                        <div className="small text-white-50">Yêu thích</div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="stat-box">
                                        <h4 className="fw-bold text-warning mb-1">{stats.rewardPoints.toLocaleString()}</h4>
                                        <div className="small text-white-50">Điểm thưởng</div>
                                    </div>
                                </div>
                                <div className="col-6 col-md-3">
                                    <div className="stat-box">
                                        <h4 className="fw-bold text-success mb-1">{stats.purchasedProducts}</h4>
                                        <div className="small text-white-50">Đã mua</div>
                                    </div>
                                </div>
                            </div>

                            <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />

                            {/* Details Information */}
                            <div className="mb-4">
                                <h5 className="fw-bold mb-3 text-uppercase text-white-50" style={{ fontSize: '0.9rem', letterSpacing: '1px' }}>Thông tin liên hệ</h5>
                                <div className="info-row d-flex align-items-center">
                                    <i className="bi bi-envelope text-info me-3 fs-5"></i>
                                    <div>
                                        <div className="small text-white-50">Email</div>
                                        <div className="fw-bold">{customer.email}</div>
                                    </div>
                                </div>
                                <div className="info-row d-flex align-items-center">
                                    <i className="bi bi-telephone text-info me-3 fs-5"></i>
                                    <div>
                                        <div className="small text-white-50">Số điện thoại</div>
                                        <div className="fw-bold">{customer.phone || 'Chưa cập nhật'}</div>
                                    </div>
                                </div>
                                <div className="info-row d-flex align-items-center">
                                    <i className="bi bi-geo-alt text-info me-3 fs-5"></i>
                                    <div>
                                        <div className="small text-white-50">Địa chỉ giao hàng</div>
                                        <div className="fw-bold">{customer.address || 'Chưa cập nhật địa chỉ'}</div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="row g-3 mt-2">
                                <div className="col-sm-6">
                                    <button 
                                        className="btn btn-cyber-outline w-100 py-2 fw-bold" 
                                        style={{ borderRadius: '8px' }}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i> Chỉnh sửa hồ sơ
                                    </button>
                                </div>
                                <div className="col-sm-6">
                                    <button className="btn btn-outline-secondary text-white w-100 py-2 fw-bold" style={{ borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)' }}>
                                        <i className="bi bi-shield-lock me-2"></i> Đổi mật khẩu
                                    </button>
                                </div>
                                <div className="col-sm-6">
                                    <Link to="/my-orders" className="btn btn-primary w-100 py-2 fw-bold" style={{ borderRadius: '8px', backgroundColor: '#005088', border: 'none' }}>
                                        <i className="bi bi-box-seam me-2"></i> Xem đơn hàng
                                    </Link>
                                </div>
                                <div className="col-sm-6">
                                    <Link to="/shop" className="btn btn-success w-100 py-2 fw-bold" style={{ borderRadius: '8px', backgroundColor: '#11CAA0', border: 'none' }}>
                                        <i className="bi bi-cart-plus me-2"></i> Tiếp tục mua sắm
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal Overlay */}
            {isEditing && (
                <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1050 }}>
                    <div className="card border-0 shadow-lg p-4" style={{ backgroundColor: '#1A2235', borderRadius: '15px', width: '100%', maxWidth: '500px', border: '1px solid #0ff' }}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h4 className="fw-bold text-info mb-0">Chỉnh Sửa Hồ Sơ</h4>
                            <button className="btn-close btn-close-white" onClick={() => setIsEditing(false)}></button>
                        </div>
                        <form onSubmit={handleUpdateProfile}>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">Họ và Tên</label>
                                <input type="text" className="form-control text-white" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }} value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">Số điện thoại</label>
                                <input type="text" className="form-control text-white" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white-50 small">Địa chỉ giao hàng</label>
                                <textarea className="form-control text-white" rows="3" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }} value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})}></textarea>
                            </div>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn btn-outline-secondary w-50" onClick={() => setIsEditing(false)}>Hủy bỏ</button>
                                <button type="submit" className="btn btn-info w-50 fw-bold">Lưu thay đổi</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
