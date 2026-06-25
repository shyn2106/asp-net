import React, { useState, useEffect } from 'react';
import categoryProductService from '../../services/categoryProductService';

function ShopSidebar({ activeCategory, minPrice, maxPrice, onFilterChange }) {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await categoryProductService.getAllCategoryProducts();
                // response có thể là array hoặc object chứa mảng data
                const data = Array.isArray(response) ? response : response.data || [];
                setCategories(data);
            } catch (error) {
                console.error("Lỗi nạp danh mục sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <div className="card p-4 shadow-lg border-0 mb-4" style={{ borderRadius: '18px', backgroundColor: '#151b2d', border: "1px solid rgba(168, 85, 247, 0.2)" }}>
            <h6 className="fw-bold text-uppercase mb-3" style={{ color: '#06b6d4', letterSpacing: '1px' }}>
                <i className="bi bi-funnel-fill me-2"></i>Danh Mục
            </h6>

            {/* KHỐI DANH SÁCH DANH MỤC ĐỘNG */}
            <div className="list-group list-group-flush mb-4 bg-transparent">
                <button
                    className={`list-group-item list-group-item-action border-0 px-3 py-2 d-flex align-items-center mb-2 ${activeCategory === null ? 'bg-info bg-opacity-25 text-info fw-bold' : 'bg-transparent text-white-50'}`}
                    onClick={() => onFilterChange({ categoryProductId: null })}
                    style={{ borderRadius: '8px', transition: 'all 0.2s', border: activeCategory === null ? "1px solid rgba(6, 182, 212, 0.5)" : "none" }}
                >
                    <i className={`bi bi-chevron-right me-2 small ${activeCategory === null ? 'opacity-100' : 'opacity-0'}`}></i>
                    Tất cả sản phẩm
                </button>

                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border spinner-border-sm text-info" role="status"></div>
                    </div>
                ) : (
                    categories.map(cat => (
                        <button
                            key={cat.id}
                            className={`list-group-item list-group-item-action border-0 px-3 py-2 d-flex align-items-center mb-2 ${activeCategory === cat.id ? 'bg-info bg-opacity-25 text-info fw-bold' : 'bg-transparent text-white-50'}`}
                            onClick={() => onFilterChange({ categoryProductId: cat.id })}
                            style={{ borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', border: activeCategory === cat.id ? "1px solid rgba(6, 182, 212, 0.5)" : "none" }}
                        >
                            <i className={`bi bi-chevron-right me-2 small ${activeCategory === cat.id ? 'opacity-100' : 'opacity-0'}`}></i>
                            {cat.name}
                        </button>
                    ))
                )}
            </div>

            {/* KHỐI LỌC THEO KHOẢNG GIÁ */}
            <h6 className="fw-bold text-uppercase mb-3" style={{ color: '#a855f7', letterSpacing: '1px' }}>
                <i className="bi bi-tags-fill me-2"></i>Khoảng Giá (VND)
            </h6>
            <div className="price-filter-inputs">
                <div className="input-group input-group-sm mb-3">
                    <span className="input-group-text bg-dark border-0 text-white-50">Từ</span>
                    <input
                        type="number"
                        className="form-control bg-dark border-0 text-white glow-border"
                        placeholder="0"
                        value={minPrice}
                        onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                        style={{ outline: 'none', boxShadow: 'none' }}
                    />
                </div>
                <div className="input-group input-group-sm mb-2">
                    <span className="input-group-text bg-dark border-0 text-white-50">Đến</span>
                    <input
                        type="number"
                        className="form-control bg-dark border-0 text-white glow-border"
                        placeholder="99.000.000"
                        value={maxPrice}
                        onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                        style={{ outline: 'none', boxShadow: 'none' }}
                    />
                </div>
            </div>

            {/* Nút reset nhanh cho UX tốt hơn */}
            <button
                className="btn btn-sm w-100 mt-4 rounded-pill font-monospace fw-bold"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)", color: "#fff" }}
                onClick={() => onFilterChange({ categoryProductId: null, minPrice: '', maxPrice: '' })}
            >
                Xóa bộ lọc
            </button>
        </div>
    );
}

export default ShopSidebar;
