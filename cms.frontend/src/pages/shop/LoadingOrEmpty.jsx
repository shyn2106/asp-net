import React from 'react';

function LoadingOrEmpty({ isLoading, totalItems, children }) {
    // 1. Kịch bản đang tải dữ liệu qua mạng
    if (isLoading) {
        return (
            <div className="text-center py-5 my-5">
                <div className="spinner-border text-info" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-white-50 mt-3 font-monospace">G-ZONE đang đồng bộ dữ liệu kho hàng, vui lòng chờ...</p>
            </div>
        );
    }

    // 2. Kịch bản bộ lọc không tìm thấy kết quả nào
    if (totalItems === 0) {
        return (
            <div className="text-center py-5 my-4 rounded shadow-sm" style={{ backgroundColor: "#151b2d", border: "1px dashed rgba(255,255,255,0.2)" }}>
                <i className="bi bi-box-seam display-1 text-secondary mb-3 d-block"></i>
                <h5 className="fw-bold text-white-50">RẤT TIẾC, KHÔNG CÓ SẢN PHẨM PHÙ HỢP</h5>
                <p className="text-muted small">Vui lòng nới rộng khoảng giá hoặc kiểm tra lại từ khóa tìm kiếm của bạn.</p>
            </div>
        );
    }

    // 3. Nếu dữ liệu hợp lệ và có sản phẩm, trả lại ruột lưới
    return children;
}

export default LoadingOrEmpty;
