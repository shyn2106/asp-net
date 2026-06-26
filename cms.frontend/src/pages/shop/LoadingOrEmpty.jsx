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
            <div className="text-center py-5 my-4 rounded shadow-sm fade-in" style={{ backgroundColor: "#151b2d", border: "1px dashed rgba(6, 182, 212, 0.3)" }}>
                <img 
                    src="https://cdn-icons-png.flaticon.com/512/6134/6134065.png" 
                    alt="Empty Search" 
                    className="mb-4"
                    style={{ width: "120px", filter: "drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))" }}
                />
                <h5 className="fw-bold text-white mb-2" style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1.2rem', letterSpacing: '0.5px' }}>
                    Không tìm thấy sản phẩm nào phù hợp với tiêu chí của bạn
                </h5>
                <p className="text-muted small">Vui lòng nới rộng khoảng giá hoặc kiểm tra lại từ khóa tìm kiếm của bạn.</p>
            </div>
        );
    }

    // 3. Nếu dữ liệu hợp lệ và có sản phẩm, trả lại ruột lưới
    return children;
}

export default LoadingOrEmpty;
