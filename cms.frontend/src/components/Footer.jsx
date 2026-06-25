import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-auto py-5" style={{ background: "linear-gradient(to top, #0a0f1d, #151b2d)", borderTop: "1px solid rgba(168, 85, 247, 0.2)" }}>
            <div className="container">
                <div className="row g-5">

                    {/* Cột 1: Thông tin G-ZONE */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <div className="mb-3 d-flex align-items-center">
                            <span className="fs-2 me-2 text-neon-cyan">⚡</span>
                            <h3 className="fw-black mb-0" style={{ fontFamily: "Outfit, sans-serif", letterSpacing: "1px", background: "linear-gradient(90deg, #fff, #a855f7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                G-ZONE
                            </h3>
                        </div>
                        <p className="cyber-footer-text mb-4">
                            Hệ thống bán lẻ thiết bị công nghệ và phần cứng máy tính cao cấp. Trải nghiệm mua sắm chuẩn Cyberpunk của tương lai.
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="cyber-social-icon"><i className="bi bi-facebook"></i></a>
                            <a href="#" className="cyber-social-icon"><i className="bi bi-youtube"></i></a>
                            <a href="#" className="cyber-social-icon"><i className="bi bi-tiktok"></i></a>
                            <a href="#" className="cyber-social-icon"><i className="bi bi-discord"></i></a>
                        </div>
                    </div>

                    {/* Cột 2: Liên hệ */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5 className="cyber-footer-title">Thông Tin Liên Hệ</h5>
                        <ul className="list-unstyled cyber-footer-text d-flex flex-column gap-3">
                            <li className="d-flex align-items-start">
                                <i className="bi bi-geo-alt-fill cyber-footer-icon mt-1"></i>
                                <span>TP. Hồ Chí Minh, Việt Nam</span>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="bi bi-telephone-fill cyber-footer-icon"></i>
                                <span>09032722106</span>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="bi bi-envelope-fill cyber-footer-icon"></i>
                                <a href="mailto:support@gzone.vn" className="cyber-footer-link">phucp8110@gmail.com</a>
                            </li>
                            <li className="d-flex align-items-center">
                                <i className="bi bi-clock-fill cyber-footer-icon"></i>
                                <span>08:00 - 22:00 (T2 - CN)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Cột 3: Sinh Viên Thực Hiện */}
                    <div className="col-12 col-md-6 col-lg-4">
                        <h5 className="cyber-footer-title">Sinh Viên Thực Hiện</h5>
                        <ul className="list-unstyled cyber-footer-text d-flex flex-column gap-2">
                            <li><strong className="text-white me-2">Họ tên:</strong> Phạm Văn Quỳnh Phúc</li>
                            <li><strong className="text-white me-2">MSSV:</strong> 2123110202</li>
                            <li><strong className="text-white me-2">Lớp:</strong> CCQ2311F</li>
                            <li>
                                <strong className="text-white me-2">Môn học:</strong>
                                <span style={{ color: "#00D4FF", fontWeight: "500" }}>Chuyên Đề ASP.NET</span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Footer Bottom */}
                <hr className="cyber-divider my-4" />
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-center cyber-footer-text small">
                    <span className="mb-2 mb-md-0">© 2026 G-ZONE Gaming Store. All rights reserved.</span>
                    <span style={{ color: "#A855F7", fontWeight: "600", letterSpacing: "1px", textShadow: "0 0 5px rgba(168, 85, 247, 0.4)" }}>
                        Powered by React + ASP.NET Core
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
