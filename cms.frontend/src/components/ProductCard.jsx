import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProductCard = ({ item, isHot = false, onAddToCart, wrapperClass = "col-md-6 col-lg-3 mb-4" }) => {
    const navigate = useNavigate();
    const { cart } = useContext(AppContext);

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

    const isLaptop = item.name.toLowerCase().includes("laptop") || item.name.toLowerCase().includes("rog") || item.name.toLowerCase().includes("msi");
    const imageUrl = item.imageUrl && !item.imageUrl.includes("placeholder") ? item.imageUrl : getTechImage(item.name);
    const originalPrice = item.price * 1.15;

    return (
        <div className={wrapperClass}>
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
                                onClick={() => navigate(`/product/${item.id}`)}
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
                                onClick={() => {
                                    const cartItem = cart.find(i => i.id === item.id);
                                    const currentQtyInCart = cartItem ? cartItem.quantity : 0;
                                    
                                    if (currentQtyInCart + 1 > item.stockQuantity) {
                                        alert("Số lượng sản phẩm trong kho không đủ!");
                                        return;
                                    }
                                    onAddToCart(item);
                                }}
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

export default ProductCard;
