import React from 'react';

function ShopHeader({ total, keyword, onSearchChange }) {
    return (
        <div className="card p-3 mb-4 shadow-sm border-0" style={{ backgroundColor: '#151b2d', borderRadius: '18px', border: "1px solid rgba(6, 182, 212, 0.2)" }}>
            <div className="row align-items-center">
                {/* Hiển thị số đếm kết quả động */}
                <div className="col-md-5">
                    <span className="fw-bold text-white-50">
                        Tìm thấy <span className="text-neon-cyan fs-5">{total}</span> sản phẩm
                    </span>
                </div>
                {/* Ô nhập liệu tìm kiếm theo từ khóa */}
                <div className="col-md-7">
                    <div className="position-relative d-flex align-items-center">
                        <input
                            type="text"
                            className="form-control rounded-pill border-0 text-white glow-border ps-4 pe-5 py-2"
                            placeholder="Gõ từ khóa tìm laptop, điện thoại..."
                            value={keyword}
                            onChange={(e) => onSearchChange({ keyword: e.target.value })}
                            style={{ backgroundColor: "#0a0f1d" }}
                        />
                        <i className="bi bi-search position-absolute text-white-50" style={{ right: "15px" }}></i>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopHeader;
