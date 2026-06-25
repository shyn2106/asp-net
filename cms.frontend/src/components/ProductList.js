import React, { useEffect, useState } from "react";
import productService from "../services/productService";

const ProductList = ({ selectedCategoryId, searchQuery, priceRange, onViewDetail, onAddToCart }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data.data || data); // handle new pagination structure
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper to supply premium Unsplash images matching tech items if real image is missing
    const getTechImage = (name = "") => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("laptop") || lowerName.includes("rog") || lowerName.includes("msi") || lowerName.includes("asus") || lowerName.includes("gaming")) {
            if (lowerName.includes("rog") || lowerName.includes("strix")) {
                return "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=500&auto=format&fit=crop";
            }
            return "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=500&auto=format&fit=crop";
        } else {
            if (lowerName.includes("iphone") || lowerName.includes("apple")) {
                return "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=500&auto=format&fit=crop";
            }
            if (lowerName.includes("samsung") || lowerName.includes("galaxy")) {
                return "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=500&auto=format&fit=crop";
            }
            return "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop";
        }
    };

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center p-5 text-white">
                <div className="spinner-border text-info mb-3" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="font-monospace text-info">LOADING GEAR SYSTEM...</p>
            </div>
        );
    }

    // Filter products reactively
    const filteredProducts = products.filter((item) => {
        // Category Filter
        if (selectedCategoryId && item.categoryProductId !== selectedCategoryId) {
            return false;
        }

        // Search Query Filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const nameMatch = item.name && item.name.toLowerCase().includes(query);
            const descMatch = item.description && item.description.toLowerCase().includes(query);
            if (!nameMatch && !descMatch) {
                return false;
            }
        }

        // Price Filter
        if (priceRange && item.price > priceRange) {
            return false;
        }

        return true;
    });

    if (filteredProducts.length === 0) {
        return (
            <div className="text-center p-5 rounded-4 bg-dark bg-opacity-25 border border-secondary border-opacity-10 text-white">
                <i className="bi bi-cpu-fill display-3 text-secondary mb-3"></i>
                <h5 className="fw-bold">Không tìm thấy sản phẩm phù hợp</h5>
                <p className="text-muted small">Hãy thử tìm kiếm với từ khóa khác hoặc điều chỉnh bộ lọc giá.</p>
            </div>
        );
    }

    return (
        <div className="row g-4">
            {filteredProducts.map((item) => {
                const isLaptop = item.name.toLowerCase().includes("laptop") || item.name.toLowerCase().includes("rog") || item.name.toLowerCase().includes("msi");
                const imageUrl = item.imageUrl && !item.imageUrl.includes("placeholder") ? item.imageUrl : getTechImage(item.name);
                
                // Simulate an original price for standard retail discount look
                const originalPrice = item.price * 1.15;

                return (
                    <div className="col-md-6 col-lg-4" key={item.id}>
                        <div 
                            className="card h-100 border-0 shadow-lg text-white card-hover-effect" 
                            style={{ 
                                backgroundColor: "#151b2d", 
                                borderRadius: "18px", 
                                overflow: "hidden",
                                transition: "all 0.3s ease-in-out" 
                            }}
                        >
                            {/* Card Image and Badges */}
                            <div className="position-relative overflow-hidden" style={{ height: "200px", background: "#0a0f1d" }}>
                                <img
                                    src={imageUrl}
                                    className="w-100 h-100 object-fit-cover"
                                    alt={item.name}
                                    style={{ transition: "transform 0.5s ease" }}
                                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.08)"}
                                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                                />
                                <span 
                                    className="position-absolute top-3 start-3 badge font-monospace px-2 py-1" 
                                    style={{ 
                                        background: isLaptop ? "linear-gradient(135deg, #a855f7, #ec4899)" : "linear-gradient(135deg, #06b6d4, #3b82f6)",
                                        fontSize: "0.75rem",
                                        borderRadius: "6px"
                                    }}
                                >
                                    {isLaptop ? "LAPTOP GAMING" : "GAMING PHONE"}
                                </span>
                                
                                {item.stockQuantity <= 3 && item.stockQuantity > 0 && (
                                    <span className="position-absolute top-3 end-3 badge bg-danger font-monospace px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                        SẮP HẾT HÀNG
                                    </span>
                                )}
                                {item.stockQuantity === 0 && (
                                    <span className="position-absolute top-3 end-3 badge bg-secondary font-monospace px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                        HẾT HÀNG
                                    </span>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="card-body p-4 d-flex flex-column justify-content-between">
                                <div>
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <small className="text-info font-monospace text-uppercase" style={{ fontSize: "0.7rem", letterSpacing: "1px" }}>
                                            {item.categoryName || "G-Zone Collection"}
                                        </small>
                                        <span className="small text-warning" style={{ fontSize: "0.8rem" }}>
                                            <i className="bi bi-star-fill me-1"></i>5.0
                                        </span>
                                    </div>
                                    <h5 className="fw-bold mb-2 text-white text-truncate-2" title={item.name} style={{ fontSize: "1.05rem", lineHeight: "1.4" }}>
                                        {item.name}
                                    </h5>
                                    <p className="text-muted small text-truncate-3 mb-3" style={{ height: "48px" }}>
                                        {item.description || "Thiết kế hiện đại, cấu hình mạnh mẽ đáp ứng hoàn hảo mọi nhu cầu của bạn."}
                                    </p>
                                </div>

                                <div>
                                    {/* Pricing Block */}
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="text-info fw-extrabold fs-5">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                                            </span>
                                            <span className="text-muted text-decoration-line-through small" style={{ fontSize: "0.8rem" }}>
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(originalPrice)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="d-flex gap-2">
                                        <button 
                                            className="btn btn-outline-info flex-grow-1 rounded-pill btn-sm font-monospace text-uppercase fw-semibold"
                                            style={{ borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4" }}
                                            onClick={() => onViewDetail(item)}
                                        >
                                            Chi tiết
                                        </button>
                                        <button 
                                            className="btn flex-grow-1 rounded-pill btn-sm font-monospace text-uppercase fw-bold text-dark"
                                            style={{ 
                                                background: "linear-gradient(90deg, #06b6d4, #a855f7)", 
                                                border: "none",
                                                opacity: item.stockQuantity > 0 ? 1 : 0.6,
                                                cursor: item.stockQuantity > 0 ? "pointer" : "not-allowed"
                                            }}
                                            disabled={item.stockQuantity <= 0}
                                            onClick={() => onAddToCart(item)}
                                        >
                                            <i className="bi bi-cart-plus-fill me-1"></i> Mua
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductList;