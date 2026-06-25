import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import customerAuthService from '../services/customerAuthService';

const AuthModal = () => {
    const { showAuthModal, setShowAuthModal, authTab, setAuthTab, setLoggedInCustomer } = useContext(AppContext);
    
    const [authForm, setAuthForm] = useState({
        fullName: "", email: "", phone: "", address: "", password: ""
    });
    const [authLoading, setAuthLoading] = useState(false);

    if (!showAuthModal) return null;

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            if (authTab === "login") {
                const res = await customerAuthService.login(authForm.email, authForm.password);
                setLoggedInCustomer(res.customer);
                localStorage.setItem("gzone_customer", JSON.stringify(res.customer));
                setShowAuthModal(false);
                alert(res.message || "Đăng nhập thành công!");
            } else {
                const res = await customerAuthService.register(authForm);
                setLoggedInCustomer(res.customer);
                localStorage.setItem("gzone_customer", JSON.stringify(res.customer));
                setShowAuthModal(false);
                alert(res.message || "Đăng ký thành công!");
            }
        } catch (error) {
            console.error("Lỗi xác thực:", error);
            const msg = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
            alert(msg);
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(10, 15, 29, 0.85)", backdropFilter: "blur(8px)", zIndex: 1060 }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-sm">
                <div className="modal-content border-0 shadow-lg text-white" style={{ backgroundColor: "#151b2d", borderRadius: "20px" }}>

                    <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center p-4">
                        <div className="d-flex w-100 gap-3 border-bottom border-secondary border-opacity-25 pb-2">
                            <span 
                                className={`fw-bold cursor-pointer pb-2 ${authTab === "login" ? "text-info border-bottom border-info border-2" : "text-white-50"}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setAuthTab("login")}
                            >
                                Đăng Nhập
                            </span>
                            <span 
                                className={`fw-bold cursor-pointer pb-2 ${authTab === "register" ? "text-info border-bottom border-info border-2" : "text-white-50"}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => setAuthTab("register")}
                            >
                                Đăng Ký
                            </span>
                        </div>
                        <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={() => setShowAuthModal(false)}></button>
                    </div>

                    <div className="modal-body p-4 pt-3">
                        <form onSubmit={handleAuthSubmit}>
                            {authTab === "register" && (
                                <>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            placeholder="Họ và tên"
                                            className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                            required
                                            value={authForm.fullName}
                                            onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="tel"
                                            placeholder="Số điện thoại"
                                            className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                            required
                                            value={authForm.phone}
                                            onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <input
                                            type="text"
                                            placeholder="Địa chỉ"
                                            className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                            required
                                            value={authForm.address}
                                            onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}
                            
                            <div className="mb-3">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                    required
                                    value={authForm.email}
                                    onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <input
                                    type="password"
                                    placeholder="Mật khẩu"
                                    className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                    required
                                    value={authForm.password}
                                    onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-cyber w-100 py-2 rounded-pill fw-bold text-dark font-monospace mb-2"
                                disabled={authLoading}
                            >
                                {authLoading ? (
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                ) : null}
                                {authTab === "login" ? "XÁC NHẬN ĐĂNG NHẬP" : "TẠO TÀI KHOẢN"}
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AuthModal;
