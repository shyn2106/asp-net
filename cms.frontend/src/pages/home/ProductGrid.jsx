import React, { useState, useEffect, useContext } from 'react';
import ProductCard from '../../components/ProductCard';
import productService from '../../services/productService';
import { AppContext } from '../../context/AppContext';

function ProductGrid() {
    const { handleAddToCart } = useContext(AppContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await productService.getAllProducts();
                const data = response.data || response;
                setProducts(data);
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-info" role="status"></div>
                <p className="text-info mt-3 font-monospace">Đang tải lưới sản phẩm...</p>
            </div>
        );
    }

    const hotProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 4);
    const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

    return (
        <section id="product-grid-section">
            {/* SẢN PHẨM HOT NHẤT */}
            <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                    <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                        <span className="text-danger me-2">🔥</span> SẢN PHẨM HOT NHẤT
                    </h3>
                    <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(236, 72, 153, 0.5), transparent)" }}></div>
                </div>
                <div className="row">
                    {hotProducts.map(p => (
                        <ProductCard key={p.id} item={p} isHot={true} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </div>

            {/* SẢN PHẨM MỚI NHẤT */}
            <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                    <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                        <span className="text-success me-2">🆕</span> HÀNG MỚI VỀ TRẠM
                    </h3>
                    <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(168, 85, 247, 0.5), transparent)" }}></div>
                </div>
                <div className="row">
                    {latestProducts.map(p => (
                        <ProductCard key={p.id} item={p} isHot={false} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </div>
        </section>
    );
}

export default ProductGrid;
