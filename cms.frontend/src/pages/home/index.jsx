import React from 'react';

// IMPORT ĐỦ TẦNG THEO ĐÚNG THỨ TỰ HƯỚNG DẪN CỦA GV (Lưu ý: Header/Footer đã được dời ra App.js)
import HeroBanner from './HeroBanner';
import CategoryMenu from './CategoryMenu';
import ProductGrid from './ProductGrid';
import LatestBlog from './LatestBlog';

function Home() {
    return (
        <div className="container pb-5">
            {/* TẦNG 2: Banner quảng cáo lớn, hình khối trang trí và nút kêu gọi mua hàng */}
            <div className="mt-4">
                <HeroBanner />
            </div>

            {/* TẦNG 3: Menu ngang chuyển hướng sang trang sản phẩm */}
            <CategoryMenu />

            {/* TIÊU CHÍ CHỌN MUA (Tính năng riêng của G-ZONE) */}
            <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                    <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                        <span className="text-neon-cyan me-2">🎯</span> TIÊU CHÍ CHỌN MUA
                    </h3>
                    <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(6, 182, 212, 0.5), transparent)" }}></div>
                </div>
                
                <div className="row g-4">
                    <div className="col-md-3">
                        <div className="p-4 rounded-4 h-100 text-center card-hover-effect" style={{ background: "rgba(10, 15, 29, 0.6)", border: "1px solid rgba(6, 182, 212, 0.2)", backdropFilter: "blur(10px)" }}>
                            <i className="bi bi-cpu display-4 text-info mb-3"></i>
                            <h5 className="fw-bold text-white mb-2">Hiệu Năng Tối Đa</h5>
                            <p className="text-white-50 small mb-0">Chip CPU mới nhất, Card đồ họa RTX cân mọi tựa game AAA.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-4 rounded-4 h-100 text-center card-hover-effect" style={{ background: "rgba(10, 15, 29, 0.6)", border: "1px solid rgba(168, 85, 247, 0.2)", backdropFilter: "blur(10px)" }}>
                            <i className="bi bi-palette display-4 text-primary mb-3" style={{ color: "#a855f7" }}></i>
                            <h5 className="fw-bold text-white mb-2">Thiết Kế Đỉnh Cao</h5>
                            <p className="text-white-50 small mb-0">Led RGB Aura Sync, khung viền kim loại cắt kim cương.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-4 rounded-4 h-100 text-center card-hover-effect" style={{ background: "rgba(10, 15, 29, 0.6)", border: "1px solid rgba(16, 185, 129, 0.2)", backdropFilter: "blur(10px)" }}>
                            <i className="bi bi-shield-check display-4 text-success mb-3"></i>
                            <h5 className="fw-bold text-white mb-2">Bảo Hành Dài Lâu</h5>
                            <p className="text-white-50 small mb-0">1 đổi 1 trong 30 ngày. Bảo hành chính hãng 24 tháng.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-4 rounded-4 h-100 text-center card-hover-effect" style={{ background: "rgba(10, 15, 29, 0.6)", border: "1px solid rgba(245, 158, 11, 0.2)", backdropFilter: "blur(10px)" }}>
                            <i className="bi bi-headset display-4 text-warning mb-3"></i>
                            <h5 className="fw-bold text-white mb-2">Hỗ Trợ 24/7</h5>
                            <p className="text-white-50 small mb-0">Đội ngũ kỹ thuật viên am hiểu công nghệ sẵn sàng hỗ trợ.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* TẦNG 4: Lưới hiển thị danh sách sản phẩm thời trang */}
            <ProductGrid />

            {/* TẦNG 5: Khối hiển thị các bài viết tin tức */}
            <LatestBlog />
        </div>
    );
}

export default Home;
