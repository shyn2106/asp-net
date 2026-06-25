import React, { useState, useEffect } from "react";
import productService from "../services/productService";
import blogService from "../services/blogService";

const HomeSections = ({ onViewDetail, onAddToCart, onViewPost }) => {
    const [products, setProducts] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const [productRes, postRes] = await Promise.all([
                productService.getAllProducts(),
                blogService.getAllPosts()
            ]);
            setProducts(productRes.data || productRes);
            setPosts(postRes.data || postRes);
        } catch (error) {
            console.error("Lỗi tải dữ liệu cho Home:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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

    if (loading) return null; // let ProductList show the loader

    // Logic: 
    // Mới nhất = 4 item cuối mảng (ID lớn nhất)
    // Hot nhất = 4 item đắt nhất (hoặc xếp hạng)
    const latestProducts = [...products].sort((a, b) => b.id - a.id).slice(0, 4);
    const hotProducts = [...products].sort((a, b) => b.price - a.price).slice(0, 4);

    const renderProductCard = (item, isHot = false) => {
        const isLaptop = item.name.toLowerCase().includes("laptop") || item.name.toLowerCase().includes("rog") || item.name.toLowerCase().includes("msi");
        const imageUrl = item.imageUrl && !item.imageUrl.includes("placeholder") ? item.imageUrl : getTechImage(item.name);
        const originalPrice = item.price * 1.15;

        return (
            <div className="col-md-6 col-lg-3 mb-4" key={item.id}>
                <div 
                    className="card h-100 border-0 shadow-lg text-white card-hover-effect position-relative" 
                    style={{ 
                        backgroundColor: "#151b2d", 
                        borderRadius: "18px", 
                        overflow: "hidden",
                        transition: "all 0.3s ease-in-out",
                        border: isHot ? "1px solid rgba(236, 72, 153, 0.5)" : "1px solid rgba(255,255,255,0.05)",
                        boxShadow: isHot ? "0 0 20px rgba(236, 72, 153, 0.15)" : "none"
                    }}
                >
                    {isHot && (
                        <div className="position-absolute top-0 end-0 p-2" style={{ zIndex: 10 }}>
                            <span className="badge bg-danger rounded-circle d-flex align-items-center justify-content-center glow-border" style={{ width: "40px", height: "40px", fontSize: "1.1rem", border: "2px solid #fff" }}>
                                🔥
                            </span>
                        </div>
                    )}
                    
                    <div className="position-relative overflow-hidden" style={{ height: "180px", background: "#0a0f1d" }}>
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
                            {isLaptop ? "LAPTOP" : "SMARTPHONE"}
                        </span>
                    </div>

                    <div className="card-body p-4 d-flex flex-column justify-content-between">
                        <div>
                            <h5 className="fw-bold mb-2 text-white text-truncate-2" title={item.name} style={{ fontSize: "1rem", lineHeight: "1.4" }}>
                                {item.name}
                            </h5>
                        </div>

                        <div>
                            <div className="mb-3 mt-2">
                                <div className="d-flex align-items-center gap-2">
                                    <span className="text-info fw-extrabold fs-6">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                                    </span>
                                    <span className="text-muted text-decoration-line-through small" style={{ fontSize: "0.75rem" }}>
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(originalPrice)}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button 
                                    className="btn btn-outline-info flex-grow-1 rounded-pill btn-sm font-monospace text-uppercase fw-semibold"
                                    onClick={() => onViewDetail(item)}
                                >
                                    Xem
                                </button>
                                <button 
                                    className="btn flex-grow-1 rounded-pill btn-sm font-monospace text-uppercase fw-bold text-dark"
                                    style={{ 
                                        background: "linear-gradient(90deg, #06b6d4, #a855f7)", 
                                        border: "none",
                                        opacity: item.stockQuantity > 0 ? 1 : 0.6
                                    }}
                                    disabled={item.stockQuantity <= 0}
                                    onClick={() => onAddToCart(item)}
                                >
                                    <i className="bi bi-cart-plus-fill"></i> Mua
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="mb-5">
            {/* TIÊU CHÍ CHỌN MUA */}
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
                            <i className="bi bi-display display-4 text-warning mb-3" style={{ color: "#a855f7" }}></i>
                            <h5 className="fw-bold text-white mb-2">Màn Hình Siêu Nét</h5>
                            <p className="text-white-50 small mb-0">Tần số quét 144Hz - 240Hz, chuẩn màu DCI-P3 cho đồ họa.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-4 rounded-4 h-100 text-center card-hover-effect" style={{ background: "rgba(10, 15, 29, 0.6)", border: "1px solid rgba(236, 72, 153, 0.2)", backdropFilter: "blur(10px)" }}>
                            <i className="bi bi-battery-charging display-4 text-danger mb-3" style={{ color: "#ec4899" }}></i>
                            <h5 className="fw-bold text-white mb-2">Pin Khủng & Sạc Nhanh</h5>
                            <p className="text-white-50 small mb-0">Hoạt động liên tục cả ngày dài với công nghệ sạc siêu tốc.</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="p-4 rounded-4 h-100 text-center card-hover-effect" style={{ background: "rgba(10, 15, 29, 0.6)", border: "1px solid rgba(59, 130, 246, 0.2)", backdropFilter: "blur(10px)" }}>
                            <i className="bi bi-shield-check display-4 text-primary mb-3"></i>
                            <h5 className="fw-bold text-white mb-2">Bảo Hành Chính Hãng</h5>
                            <p className="text-white-50 small mb-0">Cam kết 100% chính hãng, lỗi 1 đổi 1 trong vòng 30 ngày.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SẢN PHẨM HOT NHẤT */}
            <div className="mb-5">
                <div className="d-flex align-items-center mb-4">
                    <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                        <span className="text-danger me-2">🔥</span> SẢN PHẨM HOT NHẤT
                    </h3>
                    <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(236, 72, 153, 0.5), transparent)" }}></div>
                </div>
                <div className="row">
                    {hotProducts.map(p => renderProductCard(p, true))}
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
                    {latestProducts.map(p => renderProductCard(p, false))}
                </div>
            </div>

            {/* TIN TỨC MỚI NHẤT */}
            {posts.length > 0 && (
                <div className="mb-5">
                    <div className="d-flex align-items-center mb-4">
                        <h3 className="fw-black text-white m-0" style={{ fontFamily: "Outfit, sans-serif" }}>
                            <span className="text-warning me-2">📰</span> TIN TỨC CÔNG NGHỆ MỚI
                        </h3>
                        <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(234, 179, 8, 0.5), transparent)" }}></div>
                    </div>
                    <div className="row g-4">
                        {posts.slice(0, 3).map(post => (
                            <div className="col-md-4" key={post.id}>
                                <div 
                                    className="card shadow-lg h-100 border-0 card-hover-effect text-white cursor-pointer"
                                    style={{ backgroundColor: "#151b2d", borderRadius: "18px", overflow: "hidden", cursor: "pointer" }}
                                    onClick={() => onViewPost(post)}
                                >
                                    <img
                                        src={post.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop"}
                                        className="card-img-top"
                                        alt={post.title}
                                        style={{ height: "200px", objectFit: "cover", transition: "transform 0.5s ease" }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1.0)"}
                                    />
                                    <div className="card-body d-flex flex-column p-4">
                                        <div className="mb-2">
                                            <span className="badge bg-dark text-warning border border-warning border-opacity-25 font-monospace">
                                                {post.categoryName || "Tin Công Nghệ"}
                                            </span>
                                        </div>
                                        <h5 className="fw-bold mb-3 text-truncate-2" style={{ lineHeight: "1.4" }}>
                                            {post.title}
                                        </h5>
                                        <div className="mt-auto d-flex justify-content-between align-items-center">
                                            <small className="text-white-50 font-monospace">
                                                <i className="bi bi-clock me-1"></i>
                                                {new Date(post.createdDate).toLocaleDateString("vi-VN")}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            


        </div>
    );
};

export default HomeSections;
