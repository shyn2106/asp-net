import React, { useContext, useState, useEffect } from 'react';
import { NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const Header = () => {
    const { loggedInCustomer, handleLogout, setAuthTab, setShowAuthModal, cartCount } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();

    // State cho ô tìm kiếm
    const [searchTerm, setSearchTerm] = useState('');
    
    // State cho hiệu ứng giỏ hàng
    const [cartAnimate, setCartAnimate] = useState(false);

    // Kích hoạt hiệu ứng "nảy" (bounce) khi số lượng giỏ hàng thay đổi
    useEffect(() => {
        if (cartCount > 0) {
            setCartAnimate(true);
            const timer = setTimeout(() => setCartAnimate(false), 300);
            return () => clearTimeout(timer);
        }
    }, [cartCount]);

    // Debounce tìm kiếm: chờ 500ms sau khi ngừng gõ mới điều hướng
    useEffect(() => {
        const timer = setTimeout(() => {
            // Chỉ tìm kiếm nếu đang gõ (tránh việc render lần đầu tự navigate)
            if (searchTerm !== '') {
                navigate(`/shop?keyword=${encodeURIComponent(searchTerm.trim())}`);
            } else if (searchTerm === '' && location.pathname === '/shop' && new URLSearchParams(location.search).has('keyword')) {
                // Nếu xóa trắng ô tìm kiếm và đang ở trang shop, xóa param keyword
                navigate(`/shop`);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, navigate]);

    // Xóa ô tìm kiếm nếu chuyển sang trang khác không phải shop
    useEffect(() => {
        if (!location.pathname.includes('/shop')) {
            setSearchTerm('');
        }
    }, [location.pathname]);

    return (
        <nav className="navbar navbar-expand-lg sticky-top premium-navbar">
            <div className="container-fluid px-4 px-xl-5">
                {/* 1. LOGO BÊN TRÁI */}
                <NavLink className="navbar-brand fw-extrabold fs-3 d-flex align-items-center text-neon-cyan m-0" to="/" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                    <span className="me-2 fs-2">⚡</span>
                    G-ZONE
                </NavLink>

                <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                    <i className="bi bi-list fs-2"></i>
                </button>

                <div className="collapse navbar-collapse" id="navContent">
                    
                    {/* 2. MENU Ở GIỮA */}
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 d-flex justify-content-center align-items-center" style={{ gap: '35px' }}>
                        <li className="nav-item">
                            <NavLink className="nav-link premium-nav-link" to="/" end>
                                Home
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link premium-nav-link" to="/shop">
                                Products
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link premium-nav-link" to="/blog">
                                Reviews & News
                            </NavLink>
                        </li>
                    </ul>

                    {/* KHỐI BÊN PHẢI (Search + Actions) */}
                    <div className="d-flex align-items-center gap-4 ms-auto mt-3 mt-lg-0">
                        
                        {/* 3. SEARCH BAR */}
                        <form 
                            className="premium-search-container"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (searchTerm.trim()) {
                                    navigate(`/shop?keyword=${encodeURIComponent(searchTerm.trim())}`);
                                }
                            }}
                        >
                            <input 
                                type="text" 
                                name="searchKeyword"
                                className="premium-search-input" 
                                placeholder="Tìm kiếm laptop, gear, màn hình..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="premium-search-icon" type="submit">
                                <i className="bi bi-search fw-bold"></i>
                            </button>
                        </form>

                        {/* 4. USER ACTIONS */}
                        <div className="d-flex align-items-center gap-3">
                            {loggedInCustomer ? (
                                <div className="dropdown">
                                    <div 
                                        className="d-flex align-items-center gap-2 text-white text-nowrap" 
                                        style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '15px', cursor: 'pointer' }}
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            👤
                                        </div>
                                        <span className="fw-bold">{loggedInCustomer.fullName.split(' ').pop()}</span>
                                    </div>
                                    <ul className="dropdown-menu dropdown-menu-end dropdown-menu-dark" style={{ minWidth: '200px' }}>
                                        <li>
                                            <Link className="dropdown-item py-2" to="/profile">
                                                <i className="bi bi-person-badge me-2 text-info"></i> Hồ sơ cá nhân
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item py-2" to="/my-orders">
                                                <i className="bi bi-box-seam me-2 text-success"></i> Đơn hàng của tôi
                                            </Link>
                                        </li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li>
                                            <button 
                                                className="dropdown-item py-2 text-danger" 
                                                onClick={() => {
                                                    handleLogout();
                                                    navigate('/');
                                                }}
                                            >
                                                <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            ) : (
                                <div className="d-flex align-items-center gap-2">
                                    <Link
                                        className="premium-login-btn text-decoration-none"
                                        to="/login"
                                    >
                                        <i className="bi bi-person"></i> ĐĂNG NHẬP
                                    </Link>
                                    <Link
                                        className="btn btn-outline-light btn-sm text-decoration-none"
                                        to="/register"
                                        style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 'bold' }}
                                    >
                                        <i className="bi bi-person-plus"></i> ĐĂNG KÝ
                                    </Link>
                                </div>
                            )}

                            {/* 5. CART BUTTON */}
                            <NavLink to="/cart" className="premium-cart-btn" title="Giỏ hàng">
                                <i className="bi bi-cart3 fs-5"></i>
                                {cartCount > 0 && (
                                    <span 
                                        className={`position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger ${cartAnimate ? 'cart-bounce' : ''}`} 
                                        style={{ fontSize: "0.7rem", fontFamily: "Rajdhani, sans-serif", transition: 'all 0.3s' }}
                                    >
                                        {cartCount}
                                    </span>
                                )}
                            </NavLink>
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Header;
