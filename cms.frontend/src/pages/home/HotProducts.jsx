import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { AppContext } from '../../context/AppContext';

function HotProducts() {
    const { handleAddToCart } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotProducts = async () => {
            try {
                const data = await productService.getHotProducts();
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm hot:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5 mb-5">
                <div className="spinner-border text-danger" role="status"></div>
                <p className="text-danger mt-3 font-monospace">Đang tải sản phẩm hot...</p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return null; // Không hiển thị nếu không có sản phẩm
    }

    return (
        <section id="hot-products-section" className="mb-5">
            <div className="d-flex align-items-center mb-4">
                <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                    <span className="text-danger me-2">🔥</span> SẢN PHẨM HOT NHẤT
                </h3>
                <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(236, 72, 153, 0.5), transparent)" }}></div>
            </div>
            
            {/* Lưới 3 cột */}
            <div className="row g-4 justify-content-center">
                {products.map(p => (
                    <ProductCard key={p.id} item={p} isHot={true} onAddToCart={handleAddToCart} wrapperClass="col-12 col-md-4 mb-4" />
                ))}
            </div>
        </section>
    );
}

export default HotProducts;
