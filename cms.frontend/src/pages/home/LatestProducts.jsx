import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { AppContext } from '../../context/AppContext';

function LatestProducts() {
    const { handleAddToCart } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const data = await productService.getLatestProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm mới nhất:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLatestProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5 mb-5">
                <div className="spinner-border text-success" role="status"></div>
                <p className="text-success mt-3 font-monospace">Đang tải sản phẩm mới...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null; // Không hiển thị nếu không có sản phẩm
    }

    return (
        <section id="latest-products-section" className="mb-5">
            <div className="d-flex align-items-center mb-4">
                <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                    <span className="text-success me-2">🆕</span> SẢN PHẨM MỚI NHẤT
                </h3>
                <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(16, 185, 129, 0.5), transparent)" }}></div>
            </div>
            
            {/* Sử dụng lưới 3 cột (col-md-4) để hiển thị 3 sản phẩm */}
            <div className="row g-4 justify-content-center">
                {products.map(p => (
                    <ProductCard key={p.id} item={p} isHot={false} onAddToCart={handleAddToCart} wrapperClass="col-12 col-md-4 mb-4" />
                ))}
            </div>
        </section>
    );
}

export default LatestProducts;
