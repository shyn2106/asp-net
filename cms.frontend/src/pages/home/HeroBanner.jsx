import React from 'react';
import { useNavigate } from 'react-router-dom';

const HeroBanner = () => {
    const navigate = useNavigate();

    return (
        <div className="col-lg-12 mb-5">
            <div id="heroCarousel" className="carousel slide carousel-fade h-100 rounded-5 overflow-hidden shadow-2xl border border-secondary border-opacity-10" data-bs-ride="carousel" data-bs-interval="3000">
                {/* Indicators */}
                <div className="carousel-indicators mb-2">
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>

                <div className="carousel-inner h-100">
                    {/* SLIDE 1 */}
                    <div className="carousel-item active h-100">
                        <div
                            className="p-5 p-md-5 text-white h-100"
                            style={{ background: "linear-gradient(135deg, #0a0f1d 0%, #151b2d 50%, #251b3d 100%)", minHeight: "460px", display: "flex", alignItems: "center" }}
                        >
                            <div className="row align-items-center w-100 m-0">
                                <div className="col-lg-7 px-0 pe-lg-3">
                                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill font-monospace mb-3">
                                        🚀 GIẢM SỐC HÈ 2026
                                    </span>
                                    <h1 className="display-4 fw-black text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                                        LAPTOP GAMING & <br /> SMARTPHONE ĐỈNH CAO
                                    </h1>
                                    <p className="lead text-white-50 mb-4" style={{ fontSize: "1.05rem" }}>
                                        Trang bị card RTX 40 Series, màn hình 240Hz, và vi xử lý thế hệ mới.
                                    </p>
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-cyber px-5 py-3 rounded-pill fw-bold text-dark fs-5" onClick={() => navigate('/shop')}>
                                            KHÁM PHÁ NGAY
                                        </button>
                                    </div>
                                </div>
                                <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                                    <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-info bg-opacity-10 blur-3xl" style={{ width: "350px", height: "350px", zIndex: 0 }}></div>
                                    <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=600" alt="ROG Laptop" className="img-fluid rounded-4 shadow-lg position-relative" style={{ maxWidth: "100%", zIndex: 1, border: "2px solid rgba(6, 182, 212, 0.2)" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SLIDE 2 */}
                    <div className="carousel-item h-100">
                        <div
                            className="p-5 p-md-5 text-white h-100"
                            style={{ background: "linear-gradient(135deg, #1d0a1b 0%, #2d1522 50%, #3d1b25 100%)", minHeight: "460px", display: "flex", alignItems: "center" }}
                        >
                            <div className="row align-items-center w-100 m-0">
                                <div className="col-lg-7 px-0 pe-lg-3">
                                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill font-monospace mb-3">
                                        🌟 SIÊU PHẨM MỚI
                                    </span>
                                    <h1 className="display-4 fw-black text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                                        GALAXY S25 ULTRA <br /> CAMERA VIỄN VỌNG
                                    </h1>
                                    <p className="lead text-white-50 mb-4" style={{ fontSize: "1.05rem" }}>
                                        Chụp ảnh mặt trăng sắc nét với AI ISP và zoom quang học siêu xa.
                                    </p>
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-cyber px-5 py-3 rounded-pill fw-bold text-dark fs-5" style={{ background: "linear-gradient(45deg, #f59e0b, #ef4444)" }} onClick={() => navigate('/shop')}>
                                            ĐẶT TRƯỚC MUA NGAY
                                        </button>
                                    </div>
                                </div>
                                <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                                    <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-warning bg-opacity-10 blur-3xl" style={{ width: "350px", height: "350px", zIndex: 0 }}></div>
                                    <img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600" alt="S25 Ultra" className="img-fluid rounded-4 shadow-lg position-relative" style={{ maxWidth: "100%", zIndex: 1, border: "2px solid rgba(245, 158, 11, 0.2)" }} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SLIDE 3 */}
                    <div className="carousel-item h-100">
                        <div
                            className="p-5 p-md-5 text-white h-100"
                            style={{ background: "linear-gradient(135deg, #0a1d1c 0%, #152d2a 50%, #1b3d39 100%)", minHeight: "460px", display: "flex", alignItems: "center" }}
                        >
                            <div className="row align-items-center w-100 m-0">
                                <div className="col-lg-7 px-0 pe-lg-3">
                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill font-monospace mb-3">
                                        🎧 ÂM THANH HI-RES
                                    </span>
                                    <h1 className="display-4 fw-black text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                                        SONY WH-1000XM5 <br /> CHỐNG ỒN TUYỆT ĐỐI
                                    </h1>
                                    <p className="lead text-white-50 mb-4" style={{ fontSize: "1.05rem" }}>
                                        Trải nghiệm không gian tĩnh lặng để tập trung làm việc và giải trí cực đã.
                                    </p>
                                    <div className="d-flex gap-3">
                                        <button className="btn btn-cyber px-5 py-3 rounded-pill fw-bold text-dark fs-5" style={{ background: "linear-gradient(45deg, #10b981, #059669)" }} onClick={() => navigate('/shop')}>
                                            SẮM NGAY CHO NÓNG
                                        </button>
                                    </div>
                                </div>
                                <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                                    <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-success bg-opacity-10 blur-3xl" style={{ width: "350px", height: "350px", zIndex: 0 }}></div>
                                    <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=600" alt="Sony Headphones" className="img-fluid rounded-4 shadow-lg position-relative" style={{ maxWidth: "100%", zIndex: 1, border: "2px solid rgba(16, 185, 129, 0.2)" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    );
};

export default HeroBanner;
