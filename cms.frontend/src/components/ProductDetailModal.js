import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

function ProductDetailModal({ product, onClose, onAddToCart }) {
    const { cart } = useContext(AppContext);
    const [quantity, setQuantity] = useState(1);

    if (!product) return null;

    // Helper to generate tech specs based on product name
    const getSpecs = (name = "") => {
        const lowerName = name.toLowerCase();
        if (
            lowerName.includes("laptop") || 
            lowerName.includes("rog") || 
            lowerName.includes("msi") || 
            lowerName.includes("rtx") || 
            lowerName.includes("asus") || 
            lowerName.includes("acer") || 
            lowerName.includes("gaming")
        ) {
            return {
                type: "Laptop Gaming",
                details: [
                    { label: "Vi xử lý (CPU)", value: "Intel® Core™ i9-14900HX hoặc AMD Ryzen™ 9 7945HX" },
                    { label: "Card đồ họa (GPU)", value: "NVIDIA® GeForce RTX™ 4080 / 4090 12GB GDDR6" },
                    { label: "Bộ nhớ RAM", value: "32 GB DDR5 5600MHz (Hỗ trợ nâng cấp tối đa 64GB)" },
                    { label: "Ổ cứng (SSD)", value: "1 TB PCIe® 4.0 NVMe™ M.2 SSD" },
                    { label: "Màn hình", value: "18.0-inch, QHD+ (2560 x 1600) IPS 240Hz, 3ms, G-Sync" },
                    { label: "Tản nhiệt", value: "Hệ thống tản nhiệt 3 quạt với keo tản nhiệt kim loại lỏng" },
                    { label: "Bàn phím", value: "RGB Per-key từng phím Aura Sync" },
                ]
            };
        } else {
            return {
                type: "Smartphone Gaming / Flagship",
                details: [
                    { label: "Màn hình", value: "6.8-inch Dynamic AMOLED 2X / Super Retina XDR 120Hz" },
                    { label: "Bộ vi xử lý (Chipset)", value: "Snapdragon 8 Gen 3 (4nm) hoặc Apple A17 Pro (3nm)" },
                    { label: "Dung lượng RAM", value: "12 GB / 16 GB LPDDR5X" },
                    { label: "Bộ nhớ trong (ROM)", value: "256 GB / 512 GB UFS 4.0" },
                    { label: "Camera sau", value: "Chính 200 MP & Phụ 50 MP, 12 MP, Zoom quang học 5x" },
                    { label: "Dung lượng pin", value: "5,000 mAh, Sạc siêu nhanh 45W / Sạc không dây" },
                    { label: "Tính năng nổi bật", value: "Kháng nước chống bụi IP68, Khung Titanium siêu bền" },
                ]
            };
        }
    };

    const specs = getSpecs(product.name);

    return (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(10, 15, 29, 0.85)", backdropFilter: "blur(8px)" }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content border-0 shadow-lg text-white" style={{ backgroundColor: "#151b2d", borderRadius: "20px" }}>
                    
                    {/* MODAL HEADER */}
                    <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center p-4">
                        <span className="badge px-3 py-2 text-uppercase font-monospace" style={{ background: "linear-gradient(135deg, #06b6d4, #a855f7)", letterSpacing: "1px" }}>
                            {specs.type}
                        </span>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose} aria-label="Close"></button>
                    </div>

                    {/* MODAL BODY */}
                    <div className="modal-body p-4">
                        <div className="row">
                            
                            {/* Product Image */}
                            <div className="col-md-5 text-center mb-4 mb-md-0">
                                <div className="p-3 bg-dark bg-opacity-50 rounded-4 d-flex align-items-center justify-content-center" style={{ minHeight: "280px" }}>
                                    <img 
                                        src={product.imageUrl || "https://via.placeholder.com/400x400"} 
                                        className="img-fluid rounded-3" 
                                        alt={product.name} 
                                        style={{ maxHeight: "250px", objectFit: "contain", filter: "drop-shadow(0px 10px 20px rgba(6, 182, 212, 0.3))" }}
                                    />
                                </div>
                                
                                <div className="mt-4 text-start">
                                    <h4 className="fw-bold text-info mb-1">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
                                    </h4>
                                    <p className="text-muted small mb-3">
                                        Trạng thái kho: {product.stockQuantity > 0 ? (
                                            <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Còn hàng ({product.stockQuantity})</span>
                                        ) : (
                                            <span className="text-danger fw-bold"><i className="bi bi-x-circle-fill me-1"></i>Hết hàng</span>
                                        )}
                                    </p>

                                    {/* CHỌN SỐ LƯỢNG */}
                                    {product.stockQuantity > 0 && (
                                        <div className="d-flex align-items-center justify-content-start bg-dark bg-opacity-25 p-2 rounded-3 border border-secondary border-opacity-25" style={{ width: "fit-content" }}>
                                            <span className="me-3 small text-white-50 fw-semibold">Số lượng:</span>
                                            <div className="btn-group btn-group-sm" role="group">
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-info" 
                                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <span className="btn border-info text-white" style={{ minWidth: "40px", cursor: "default" }}>{quantity}</span>
                                                <button 
                                                    type="button" 
                                                    className="btn btn-outline-info" 
                                                    onClick={() => setQuantity(q => q + 1)}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Details & Specs */}
                            <div className="col-md-7">
                                <h3 className="fw-bold text-white mb-2">{product.name}</h3>
                                <p className="text-light opacity-75 small mb-4">{product.description || "Chưa có mô tả chi tiết cho sản phẩm này. Liên hệ hỗ trợ để biết thêm chi tiết."}</p>

                                <h6 className="fw-bold text-uppercase font-monospace text-secondary mb-3" style={{ letterSpacing: "1px" }}>
                                    <i className="bi bi-cpu me-2 text-info"></i>Thông số kỹ thuật
                                </h6>
                                <div className="table-responsive">
                                    <table className="table table-sm table-dark table-borderless bg-transparent mb-0">
                                        <tbody>
                                            {specs.details.map((spec, index) => (
                                                <tr key={index} className="border-bottom border-secondary border-opacity-25">
                                                    <td className="ps-0 py-2 text-muted fw-semibold small" style={{ width: "35%" }}>{spec.label}</td>
                                                    <td className="pe-0 py-2 text-light small">{spec.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                        </div>

                        {/* MOCK REVIEWS & HIGHLIGHTS */}
                        <div className="mt-4 p-3 rounded-4 bg-dark bg-opacity-25 border border-secondary border-opacity-10">
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="small text-muted"><i className="bi bi-shield-check me-1 text-success"></i>Bảo hành chính hãng 12-24 tháng</span>
                                <span className="small text-warning">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i> (5.0)
                                </span>
                            </div>
                            <p className="small mb-0 text-muted italic">"Sản phẩm cực đỉnh, hiệu năng cao, chiến game mượt mà và màn hình siêu đẹp. Đáng tiền mua!" - <strong>Khách hàng đánh giá</strong></p>
                        </div>
                    </div>

                    {/* MODAL FOOTER */}
                    <div className="modal-footer border-0 p-4 pt-0">
                        <button type="button" className="btn btn-outline-secondary px-4 rounded-pill fw-semibold text-white border-secondary" onClick={onClose}>
                            Đóng
                        </button>
                        <button 
                            type="button" 
                            className="btn px-4 rounded-pill fw-bold text-dark" 
                            style={{ 
                                background: "linear-gradient(90deg, #06b6d4, #a855f7)", 
                                border: "none",
                                cursor: product.stockQuantity > 0 ? "pointer" : "not-allowed",
                                opacity: product.stockQuantity > 0 ? 1 : 0.6
                            }}
                            disabled={product.stockQuantity <= 0}
                            onClick={() => {
                                const cartItem = cart.find(item => item.id === product.id);
                                const currentQtyInCart = cartItem ? cartItem.quantity : 0;
                                
                                if (currentQtyInCart + quantity > product.stockQuantity) {
                                    alert("Số lượng sản phẩm trong kho không đủ!");
                                    return;
                                }

                                onAddToCart(product, quantity);
                                onClose();
                            }}
                        >
                            <i className="bi bi-cart-plus-fill me-2"></i>Thêm vào giỏ hàng
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;
