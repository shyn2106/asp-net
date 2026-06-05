import React from "react";
import CategoryProductList from "./components/CategoryProductList";
import ProductList from "./components/ProductList";
import PostList from "./components/PostList";
import "./App.css";

function App() {
    return (
        <div className="bg-light min-vh-100">
            {/* HEADER */}
            <nav className="navbar navbar-expand-lg navbar-dark shadow-lg sticky-top"
                style={{ background: "linear-gradient(90deg, #0f172a, #1e2937)" }}>
                <div className="container">
                    <a className="navbar-brand fw-bold fs-3 d-flex align-items-center" href="/">
                        <span className="me-2 fs-2">📱</span>
                        PHONE STORE
                    </a>

                    <div className="ms-auto d-flex align-items-center gap-3">
                        <div className="text-white d-flex align-items-center gap-2">
                            <i className="bi bi-person-circle fs-5"></i>
                            <span>Xin chào, <strong>Phạm Văn Quỳnh Phúc</strong></span>
                        </div>
                        <button className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold">
                            <i className="bi bi-cart3 me-2"></i>Giỏ hàng
                        </button>
                        <button className="btn btn-primary rounded-pill px-4 py-2 fw-semibold">
                            <i className="bi bi-search me-2"></i>Tìm kiếm
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mt-4">
                {/* HERO BANNER */}
                <div className="position-relative rounded-5 overflow-hidden shadow-xl mb-5">
                    <div
                        className="p-5 p-md-5 text-white"
                        style={{
                            background: "linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)",
                            minHeight: "400px",
                            display: "flex",
                            alignItems: "center"
                        }}
                    >
                        <div className="row align-items-center">
                            <div className="col-lg-7">
                                <div className="badge bg-warning text-dark mb-3 px-3 py-2">
                                    🔥 NEW ARRIVAL 2026
                                </div>
                                <h1 className="display-4 fw-bold mb-3">
                                    Smartphone Cao Cấp<br />
                                    Giá Tốt Nhất
                                </h1>
                                <p className="lead mb-4 opacity-90">
                                    iPhone, Samsung, Xiaomi, OPPO, Realme...
                                    Đầy đủ phiên bản mới nhất với bảo hành chính hãng.
                                </p>
                                <div className="d-flex gap-3">
                                    <button className="btn btn-light btn-lg px-5 rounded-pill fw-bold shadow">
                                        Mua Ngay
                                    </button>
                                    <button className="btn btn-outline-light btn-lg px-5 rounded-pill fw-semibold">
                                        Xem Tất Cả
                                    </button>
                                </div>
                            </div>
                            <div className="col-lg-5 d-none d-lg-block text-end">
                                <div className="display-1 fw-bold opacity-25">📱</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* SIDEBAR */}
                    <div className="col-lg-3">
                        <CategoryProductList />

                        {/* Thông tin hệ thống */}
                        <div className="card mt-4 shadow border-0 rounded-4">
                            <div className="card-header bg-white border-0 pt-4">
                                <h5 className="fw-bold text-primary mb-0">
                                    <i className="bi bi-info-circle me-2"></i>
                                    Thông tin hệ thống
                                </h5>
                            </div>
                            <div className="card-body">
                                <div className="d-flex flex-column gap-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3">
                                            <i className="bi bi-server fs-5"></i>
                                        </div>
                                        <div><strong>ASP.NET Core API</strong></div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-info bg-opacity-10 text-info p-2 rounded-3">
                                            <i className="bi bi-bootstrap fs-5"></i>
                                        </div>
                                        <div><strong>ReactJS Frontend</strong></div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="bg-success bg-opacity-10 text-success p-2 rounded-3">
                                            <i className="bi bi-database fs-5"></i>
                                        </div>
                                        <div><strong>SQL Server</strong></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="col-lg-9">
                        <div className="card border-0 shadow-sm rounded-4 mb-4">
                            <div className="card-body">
                                <h3 className="fw-bold text-dark mb-1">
                                    📱 Danh sách sản phẩm
                                </h3>
                                <p className="text-muted mb-0">
                                    Dữ liệu được tải trực tiếp từ ASP.NET Core Web API • Cập nhật realtime
                                </p>
                            </div>
                        </div>
                        <ProductList />
                    </div>
                </div>

                {/* TIN TỨC & BLOG */}
                <div className="row mt-5">
                    <div className="col-12">
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <h2 className="fw-bold mb-0">📰 Tin tức công nghệ &amp; Review</h2>
                            <div className="flex-grow-1 border-bottom border-2"></div>
                        </div>
                        <div className="card border-0 shadow-sm rounded-4">
                            <div className="card-body p-4">
                                <PostList />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer className="bg-dark text-white mt-5 py-5">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <h5 className="fw-bold mb-3">📱 PHONE STORE</h5>
                            <p className="opacity-75">
                                Chuyên cung cấp điện thoại chính hãng.<br />
                                Giá tốt - Bảo hành dài hạn - Giao hàng nhanh toàn quốc.
                            </p>
                        </div>
                        <div className="col-md-6 text-md-end mt-3 mt-md-0">
                            <small className="opacity-75">
                                ASP.NET Core Web API + ReactJS + SQL Server
                            </small>
                        </div>
                    </div>
                    <hr className="my-4 opacity-25" />
                    <div className="text-center opacity-50 small">
                        © 2026 Phone Store. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;