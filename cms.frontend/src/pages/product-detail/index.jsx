import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import productService from '../../services/productService';
import { AppContext } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleAddToCart } = useContext(AppContext);
    
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // States for custom UI
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState("");
    const [activeTab, setActiveTab] = useState("specs");

    // Thumbnails giả lập (Vì CSDL chỉ có 1 ảnh)
    const mockThumbnails = [
        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=500&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=500&auto=format&fit=crop"
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await productService.getProductById(id);
                setProduct(data);
                setMainImage(data.imageUrl || "https://via.placeholder.com/500x500");
                
                // Lấy tất cả sản phẩm để filter related products
                const allProductsResponse = await productService.getAllProducts();
                const allProducts = allProductsResponse.data || allProductsResponse;
                setRelatedProducts(allProducts.filter(p => p.id !== parseInt(id)).slice(0, 4));
            } catch (error) {
                console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const formatVND = (number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
    };

    const handleQuantityChange = (change) => {
        const newQty = quantity + change;
        if (newQty >= 1) {
            setQuantity(newQty);
        }
    };

    const handleAddToCartSubmit = () => {
        if (quantity > product.stockQuantity) {
            alert(`⛔ LỖI NGHIỆP VỤ KHO: Vượt quá số lượng hiện có (${product.stockQuantity} chiếc). Vui lòng điều chỉnh lại!`);
            return;
        }
        handleAddToCart(product, quantity);
        alert(`🎉 THÀNH CÔNG: Đã thêm ${quantity} chiếc "${product.name}" vào giỏ hàng!`);
    };

    const handleBuyNow = () => {
        if (quantity > product.stockQuantity) {
            alert(`⛔ LỖI NGHIỆP VỤ KHO: Vượt quá số lượng hiện có (${product.stockQuantity} chiếc).`);
            return;
        }
        handleAddToCart(product, quantity);
        navigate('/checkout'); // Giả sử có trang thanh toán
    };

    if (loading) return (
        <div className="container py-5 text-center text-white" style={{ minHeight: "60vh" }}>
            <div className="spinner-border text-info" style={{ width: '3rem', height: '3rem' }} role="status"></div>
            <p className="mt-3 font-monospace text-neon-cyan">LOADING GEAR SYSTEM...</p>
        </div>
    );

    if (!product) return (
        <div className="container py-5 text-center text-white">
            <h2 className="text-danger fw-bold">Không tìm thấy sản phẩm này trên hệ thống G-ZONE.</h2>
            <button className="btn btn-outline-info mt-3 rounded-pill px-4" onClick={() => navigate('/shop')}>Quay lại cửa hàng</button>
        </div>
    );

    const originalPrice = product.price * 1.25; // Giả lập giá gốc cao hơn 25%

    return (
        <div className="container py-5 fade-in">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/" className="text-white-50 text-decoration-none">Trang chủ</Link></li>
                    <li className="breadcrumb-item"><Link to="/shop" className="text-white-50 text-decoration-none">Sản phẩm</Link></li>
                    <li className="breadcrumb-item active text-neon-cyan" aria-current="page">{product.name}</li>
                </ol>
            </nav>

            {/* PHẦN TRÊN: CHI TIẾT SẢN PHẨM */}
            <div className="premium-product-container p-4 p-md-5 mb-5">
                <div className="row g-5">
                    {/* KHỐI TRÁI: GALLERY ẢNH */}
                    <div className="col-lg-5">
                        <div className="product-gallery-main mb-3 p-4">
                            <img src={mainImage} alt={product.name} />
                        </div>
                        <div className="d-flex justify-content-between gap-2">
                            {/* Nút thumbnail gốc */}
                            <div 
                                className={`gallery-thumbnail ${mainImage === product.imageUrl ? 'active' : ''}`}
                                onClick={() => setMainImage(product.imageUrl)}
                            >
                                <img src={product.imageUrl || "https://via.placeholder.com/500x500"} alt="Thumb" />
                            </div>
                            {/* 4 thumbnail mock */}
                            {mockThumbnails.map((thumb, idx) => (
                                <div 
                                    key={idx}
                                    className={`gallery-thumbnail ${mainImage === thumb ? 'active' : ''}`}
                                    onClick={() => setMainImage(thumb)}
                                >
                                    <img src={thumb} alt={`Thumb ${idx}`} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* KHỐI PHẢI: THÔNG TIN VÀ CHUỖI NÚT MUA */}
                    <div className="col-lg-7 text-white">
                        <div className="d-flex align-items-center gap-2 mb-2">
                            <span className="badge px-3 py-2 text-uppercase fw-bold" style={{ backgroundColor: "rgba(139, 92, 246, 0.2)", color: "#8B5CF6", border: "1px solid rgba(139, 92, 246, 0.5)" }}>
                                {product.categoryName || "G-ZONE Gaming"}
                            </span>
                            <span className="badge px-3 py-2 text-uppercase fw-bold bg-dark text-white-50 border border-secondary">
                                Chính hãng
                            </span>
                        </div>
                        
                        <h1 className="fw-bold mb-3 lh-sm" style={{ fontSize: "32px" }}>{product.name}</h1>
                        
                        <div className="d-flex align-items-center gap-3 mb-4">
                            <div className="text-warning small">
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-fill"></i>
                                <i className="bi bi-star-half"></i>
                                <span className="text-white-50 ms-2">(128 đánh giá)</span>
                            </div>
                            <span className="text-white-50">|</span>
                            {product.stockQuantity > 10 ? (
                                <span className="text-success fw-bold"><i className="bi bi-check-circle-fill me-1"></i>Còn hàng</span>
                            ) : product.stockQuantity > 0 ? (
                                <span className="text-warning fw-bold"><i className="bi bi-fire me-1"></i>Chỉ còn {product.stockQuantity} sản phẩm</span>
                            ) : (
                                <span className="text-danger fw-bold"><i className="bi bi-x-circle-fill me-1"></i>Hết hàng</span>
                            )}
                        </div>

                        {/* Giá sản phẩm siêu bự */}
                        <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <div className="d-flex align-items-end gap-3 mb-2">
                                <h2 className="premium-price-text">{formatVND(product.price)}</h2>
                                <span className="text-white-50 text-decoration-line-through fs-5 mb-1">{formatVND(originalPrice)}</span>
                            </div>
                            <div className="text-neon-cyan fw-bold small">Tiết kiệm 20% so với giá thị trường</div>
                        </div>

                        {/* Chính sách bán hàng 4 ô */}
                        <div className="row g-3 mb-4">
                            <div className="col-sm-6">
                                <div className="policy-card">
                                    <i className="bi bi-truck fs-4 text-neon-cyan"></i>
                                    <div>
                                        <div className="fw-bold text-white fs-6">Giao hàng miễn phí</div>
                                        <div className="small text-white-50">Toàn quốc cho đơn từ 1tr</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="policy-card">
                                    <i className="bi bi-shield-check fs-4 text-neon-purple"></i>
                                    <div>
                                        <div className="fw-bold text-white fs-6">Bảo hành chính hãng</div>
                                        <div className="small text-white-50">Lên đến 24 tháng</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="policy-card">
                                    <i className="bi bi-arrow-repeat fs-4 text-warning"></i>
                                    <div>
                                        <div className="fw-bold text-white fs-6">Đổi trả dễ dàng</div>
                                        <div className="small text-white-50">1 đổi 1 trong 30 ngày</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6">
                                <div className="policy-card">
                                    <i className="bi bi-credit-card fs-4 text-success"></i>
                                    <div>
                                        <div className="fw-bold text-white fs-6">Thanh toán linh hoạt</div>
                                        <div className="small text-white-50">Hỗ trợ trả góp 0%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr className="border-secondary opacity-25 mb-4" />

                        {/* Khu vực Số lượng & Action */}
                        <div className="d-flex align-items-center gap-4 mb-4">
                            <div className="d-flex align-items-center gap-2">
                                <span className="fw-bold text-white-50 me-2">Số lượng:</span>
                                <button className="qty-btn" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                                    <i className="bi bi-dash"></i>
                                </button>
                                <span className="fw-bold text-white fs-5" style={{ width: "30px", textAlign: "center" }}>{quantity}</span>
                                <button className="qty-btn" onClick={() => handleQuantityChange(1)}>
                                    <i className="bi bi-plus"></i>
                                </button>
                            </div>
                        </div>

                        <div className="row g-3 mb-4">
                            <div className="col-md-6">
                                <button 
                                    className="btn btn-premium-cyan w-100 py-3"
                                    disabled={product.stockQuantity <= 0}
                                    onClick={handleAddToCartSubmit}
                                >
                                    <i className="bi bi-cart-plus me-2"></i>THÊM VÀO GIỎ
                                </button>
                            </div>
                            <div className="col-md-6">
                                <button 
                                    className="btn btn-buy-now w-100 py-3"
                                    disabled={product.stockQuantity <= 0}
                                    onClick={handleBuyNow}
                                >
                                    MUA NGAY
                                </button>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="d-flex align-items-center gap-3">
                            <span className="text-white-50 small">Thanh toán an toàn qua:</span>
                            <div className="payment-methods d-flex gap-2">
                                <img src="https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png" alt="MoMo" />
                                <img src="https://vnpay.vn/s1/statics.vnpay.vn/2023/6/0oxhzjmxbksr1686814746087.png" alt="VNPay" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Paypal_2014_logo.png/1200px-Paypal_2014_logo.png" alt="PayPal" />
                                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PHẦN DƯỚI: TABS THÔNG TIN & ĐÁNH GIÁ */}
            <div className="premium-product-container p-0 mb-5">
                <div className="d-flex border-bottom border-secondary border-opacity-25 bg-dark">
                    <button 
                        className={`tab-premium flex-grow-1 ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        THÔNG TIN SẢN PHẨM
                    </button>
                    <button 
                        className={`tab-premium flex-grow-1 ${activeTab === 'specs' ? 'active' : ''}`}
                        onClick={() => setActiveTab('specs')}
                    >
                        THÔNG SỐ KỸ THUẬT
                    </button>
                    <button 
                        className={`tab-premium flex-grow-1 ${activeTab === 'reviews' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        ĐÁNH GIÁ (128)
                    </button>
                </div>

                <div className="p-4 p-md-5 text-white">
                    {activeTab === 'info' && (
                        <div className="fade-in text-light" style={{ lineHeight: "1.8", fontSize: "16px" }}>
                            <h4 className="fw-bold mb-4 text-neon-cyan">Đặc điểm nổi bật của {product.name}</h4>
                            <p>{product.description || "Chưa có mô tả chi tiết cho sản phẩm này. Hãy liên hệ hotline để được tư vấn thêm."}</p>
                            <p>Sản phẩm được tối ưu hóa cho trải nghiệm Gaming và làm việc hiệu suất cao. Hệ thống tản nhiệt tiên tiến giúp duy trì nhiệt độ lý tưởng trong những trận chiến căng thẳng nhất.</p>
                            <p>Thiết kế đậm chất viễn tưởng với hệ thống LED RGB đồng bộ (Aura Sync / Mystic Light), mang lại không gian làm việc cực kỳ đẳng cấp.</p>
                        </div>
                    )}

                    {activeTab === 'specs' && (
                        <div className="fade-in">
                            <h4 className="fw-bold mb-4 text-neon-cyan">Cấu Hình Chi Tiết</h4>
                            <table className="table specs-table text-white mb-0 w-100">
                                <tbody>
                                    <tr>
                                        <td>Vi xử lý (CPU)</td>
                                        <td>Intel Core i9-14900HX hoặc AMD Ryzen 9 7945HX</td>
                                    </tr>
                                    <tr>
                                        <td>Card đồ họa (GPU)</td>
                                        <td>NVIDIA GeForce RTX 4080 / 4090 12GB GDDR6</td>
                                    </tr>
                                    <tr>
                                        <td>Bộ nhớ RAM</td>
                                        <td>32 GB / 64 GB DDR5 5600MHz</td>
                                    </tr>
                                    <tr>
                                        <td>Lưu trữ (SSD)</td>
                                        <td>1 TB / 2 TB PCIe 4.0 NVMe M.2 SSD</td>
                                    </tr>
                                    <tr>
                                        <td>Màn hình hiển thị</td>
                                        <td>18.0-inch, QHD+ (2560 x 1600) IPS, Tần số quét 240Hz, DCI-P3 100%</td>
                                    </tr>
                                    <tr>
                                        <td>Kết nối & Cổng</td>
                                        <td>Wi-Fi 7, Bluetooth 5.4, 2x Thunderbolt 4, HDMI 2.1</td>
                                    </tr>
                                    <tr>
                                        <td>Dung lượng Pin</td>
                                        <td>90Whr, Sạc nhanh Type-C 100W</td>
                                    </tr>
                                    <tr>
                                        <td>Hệ điều hành</td>
                                        <td>Windows 11 Home / Pro bản quyền</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div className="fade-in row">
                            <div className="col-md-4 text-center border-end border-secondary border-opacity-25 mb-4 mb-md-0">
                                <h1 className="display-1 fw-bold text-neon-cyan mb-0">4.8</h1>
                                <div className="text-warning fs-4 mb-2">
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-fill"></i>
                                    <i className="bi bi-star-half"></i>
                                </div>
                                <p className="text-white-50">Dựa trên 128 đánh giá</p>
                                <button className="btn btn-outline-info rounded-pill px-4 mt-2">Viết đánh giá</button>
                            </div>
                            <div className="col-md-8 ps-md-5">
                                {/* MOCK REVIEWS */}
                                <div className="mb-4 pb-4 border-bottom border-secondary border-opacity-25">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "40px", height: "40px" }}>A</div>
                                        <div>
                                            <div className="fw-bold">Nguyễn Văn A</div>
                                            <div className="text-warning small">
                                                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-0 text-light opacity-75">"Sản phẩm đẹp tuyệt vời, build quality cực kỳ chắc chắn. Màn hình 240Hz chơi FPS không có gì để chê. Giao hàng cực nhanh chỉ trong 2 tiếng tại nội thành."</p>
                                </div>
                                <div className="mb-0">
                                    <div className="d-flex align-items-center gap-3 mb-2">
                                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center fw-bold" style={{ width: "40px", height: "40px" }}>B</div>
                                        <div>
                                            <div className="fw-bold">Trần Văn B</div>
                                            <div className="text-warning small">
                                                <i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star"></i>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mb-0 text-light opacity-75">"Máy mạnh, mát mẻ khi chơi game nặng. Đóng gói rất cẩn thận, nhân viên G-ZONE tư vấn siêu nhiệt tình. Trừ 1 sao vì cục sạc hơi to và nặng."</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* SẢN PHẨM LIÊN QUAN */}
            {relatedProducts.length > 0 && (
                <div className="mb-5">
                    <div className="d-flex align-items-center mb-4">
                        <h3 className="fw-black text-white m-0" style={{ fontFamily: "Orbitron, sans-serif" }}>
                            SẢN PHẨM LIÊN QUAN
                        </h3>
                        <div className="ms-4 flex-grow-1" style={{ height: "1px", background: "linear-gradient(90deg, rgba(6, 182, 212, 0.5), transparent)" }}></div>
                    </div>
                    <div className="row g-4">
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} item={p} isHot={false} onAddToCart={handleAddToCart} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
