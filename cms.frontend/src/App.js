import React, { useState, useEffect, useMemo } from "react";
import CategoryProductList from "./components/CategoryProductList";
import ProductList from "./components/ProductList";
import PostList from "./components/PostList";
import ProductDetailModal from "./components/ProductDetailModal";
import PostDetailModal from "./components/PostDetailModal";
import HomeSections from "./components/HomeSections";
import customerService from "./services/customerService";
import customerAuthService from "./services/customerAuthService";
import orderService from "./services/orderService";
import "./App.css";

function App() {
    // Navigation / Tab state
    const [currentTab, setCurrentTab] = useState("home"); // "home", "store", "news", "admin"

    // Filter states
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [priceRange, setPriceRange] = useState(90000000); // 90M VND default limit

    // Shopping Cart State
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem("gzone_cart");
        return savedCart ? JSON.parse(savedCart) : [];
    });

    // Modal product state
    const [detailProduct, setDetailProduct] = useState(null);
    const [detailPost, setDetailPost] = useState(null);

    // Active order placing states
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [checkoutForm, setCheckoutForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        notes: ""
    });
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState(null);

    // Admin state
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [adminLoading, setAdminLoading] = useState(false);
    const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);

    // Auth state
    const [loggedInCustomer, setLoggedInCustomer] = useState(() => {
        const saved = localStorage.getItem("gzone_customer");
        return saved ? JSON.parse(saved) : null;
    });
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authTab, setAuthTab] = useState("login");
    const [authForm, setAuthForm] = useState({
        fullName: "", email: "", phone: "", address: "", password: ""
    });
    const [authLoading, setAuthLoading] = useState(false);

    // Save cart state
    useEffect(() => {
        localStorage.setItem("gzone_cart", JSON.stringify(cart));
    }, [cart]);

    // Load admin orders if admin tab is active
    useEffect(() => {
        if (currentTab === "admin") {
            fetchAdminData();
        }
    }, [currentTab]);

    const fetchAdminData = async () => {
        setAdminLoading(true);
        try {
            const ordersData = await orderService.getAllOrders();
            const detailsData = await orderService.getAllOrderDetails();
            setOrders(ordersData);
            setOrderDetails(detailsData);
        } catch (error) {
            console.error("Lỗi tải thông tin quản trị:", error);
        } finally {
            setAdminLoading(false);
        }
    };

    // Auth Handlers
    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            if (authTab === "login") {
                const res = await customerAuthService.login(authForm.email, authForm.password);
                console.log("Login Response:", res);
                setLoggedInCustomer(res.customer);
                localStorage.setItem("gzone_customer", JSON.stringify(res.customer));
                setShowAuthModal(false);
                alert(res.message || "Đăng nhập thành công!");
            } else {
                const res = await customerAuthService.register(authForm);
                console.log("Register Response:", res);
                setLoggedInCustomer(res.customer);
                localStorage.setItem("gzone_customer", JSON.stringify(res.customer));
                setShowAuthModal(false);
                alert(res.message || "Đăng ký thành công!");
            }
        } catch (error) {
            console.error("Lỗi xác thực:", error);
            const msg = error.response?.data?.message || "Đã xảy ra lỗi. Vui lòng thử lại.";
            alert(msg);
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        setLoggedInCustomer(null);
        localStorage.removeItem("gzone_customer");
        if (currentTab === "admin") {
            setCurrentTab("home");
        }
    };

    // Calculate cart sum
    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

    // Cart Handlers
    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const existingIndex = prevCart.findIndex(item => item.id === product.id);
            if (existingIndex > -1) {
                const updated = [...prevCart];
                updated[existingIndex].quantity += 1;
                return updated;
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const handleUpdateQuantity = (productId, change) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === productId) {
                    const newQty = item.quantity + change;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const handleRemoveFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    // Checkout Submit Flow
    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setCheckoutLoading(true);
        try {
            // Step 1: Check if customer exists by email, else create new one
            let customerId;

            if (loggedInCustomer) {
                customerId = loggedInCustomer.id;
            } else {
                const allCustomers = await customerService.getAllCustomers();
                let customer = allCustomers.find(c => c.email.toLowerCase() === checkoutForm.email.toLowerCase());

                if (customer) {
                    customerId = customer.id;
                } else {
                    // Create customer
                    const newCustData = {
                        FullName: checkoutForm.fullName,
                        Email: checkoutForm.email,
                        Phone: checkoutForm.phone,
                        Address: checkoutForm.address,
                        Password: "Customer123@" // placeholder pass
                    };
                    await customerService.createCustomer(newCustData);

                    // Fetch again to grab the ID of the customer just created
                    const updatedCustomers = await customerService.getAllCustomers();
                    const freshCustomer = updatedCustomers.find(c => c.email.toLowerCase() === checkoutForm.email.toLowerCase());
                    customerId = freshCustomer ? freshCustomer.id : updatedCustomers[updatedCustomers.length - 1].id;
                }
            }

            // Step 2: Create Order
            const newOrderData = {
                CustomerId: customerId,
                Status: 0, // 0: Pending/Chờ duyệt
                Notes: checkoutForm.notes || "Đặt hàng từ G-ZONE Web"
            };
            await orderService.createOrder(newOrderData);

            // Step 3: Find the OrderId. Since create order doesn't return ID directly,
            // we retrieve all orders for this customer and pick the latest one (descending ID).
            const allOrders = await orderService.getAllOrders();
            const customerOrders = allOrders
                .filter(o => o.customerId === customerId || o.customerName === checkoutForm.fullName)
                .sort((a, b) => b.id - a.id);

            const newOrderId = customerOrders.length > 0 ? customerOrders[0].id : allOrders[allOrders.length - 1].id;

            // Step 4: Write OrderDetails sequentially
            for (const item of cart) {
                const detailRecord = {
                    OrderId: newOrderId,
                    ProductId: item.id,
                    Quantity: item.quantity,
                    UnitPrice: item.price
                };
                await orderService.createOrderDetail(detailRecord);
            }

            // Success cleanup
            setPlacedOrderId(newOrderId);
            setOrderSuccess(true);
            setCart([]);
            setCheckoutForm({
                fullName: "",
                email: "",
                phone: "",
                address: "",
                notes: ""
            });
        } catch (error) {
            console.error("Giao dịch đặt hàng thất bại:", error);
            alert("Lỗi kết nối API. Vui lòng kiểm tra lại URL backend hoặc trạng thái SQL Server!");
        } finally {
            setCheckoutLoading(false);
        }
    };

    // Admin: Update Status Handler
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        try {
            await orderService.updateOrder(orderId, {
                CustomerId: order.customerId || 1, // Default fallback if missing
                Status: parseInt(newStatus),
                Notes: order.notes
            });
            fetchAdminData(); // Refresh list
            alert(`Cập nhật trạng thái Đơn hàng #${orderId} thành công!`);
        } catch (error) {
            console.error("Lỗi cập nhật đơn hàng:", error);
        }
    };

    // Admin: Delete Order Handler
    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa đơn hàng #${orderId} không?`)) return;

        try {
            await orderService.deleteOrder(orderId);
            fetchAdminData();
            setSelectedAdminOrder(null);
            alert("Xóa đơn hàng thành công!");
        } catch (error) {
            console.error("Lỗi xóa đơn hàng:", error);
        }
    };

    return (
        <div className="bg-dark min-vh-100 text-white">

            {/* GLASS NAVBAR */}
            <nav className="navbar navbar-expand-lg sticky-top glass-header py-3">
                <div className="container">
                    <a className="navbar-brand fw-extrabold fs-3 d-flex align-items-center text-neon-cyan" href="#home" onClick={() => setCurrentTab("home")}>
                        <span className="me-2 fs-2">⚡</span>
                        G-ZONE
                    </a>

                    <button className="navbar-toggler border-0 text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                        <i className="bi bi-list fs-2"></i>
                    </button>

                    <div className="collapse navbar-collapse" id="navContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-2 ms-4">
                            <li className="nav-item">
                                <button
                                    className={`btn rounded-pill font-monospace px-4 py-2 fw-semibold ${currentTab === "home" ? "btn-cyber" : "text-white"}`}
                                    onClick={() => setCurrentTab("home")}
                                >
                                    <i className="bi bi-house me-1"></i> TRANG CHỦ
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`btn rounded-pill font-monospace px-4 py-2 fw-semibold ${currentTab === "store" ? "btn-cyber" : "text-white"}`}
                                    onClick={() => setCurrentTab("store")}
                                >
                                    <i className="bi bi-shop me-1"></i> SẢN PHẨM
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`btn rounded-pill font-monospace px-4 py-2 fw-semibold ${currentTab === "news" ? "btn-cyber" : "text-white"}`}
                                    onClick={() => setCurrentTab("news")}
                                >
                                    <i className="bi bi-newspaper me-1"></i> REVIEW & TIN TỨC
                                </button>
                            </li>
                            {loggedInCustomer && (
                                <li className="nav-item">
                                    <button
                                        className={`btn rounded-pill font-monospace px-4 py-2 fw-semibold ${currentTab === "admin" ? "btn-cyber" : "text-white"}`}
                                        onClick={() => setCurrentTab("admin")}
                                    >
                                        <i className="bi bi-cpu me-1"></i> MONITOR (ADMIN)
                                    </button>
                                </li>
                            )}
                        </ul>

                        {/* Search & Cart QuickActions */}
                        <div className="d-flex align-items-center gap-3 ms-auto mt-3 mt-lg-0">
                            {currentTab === "store" && (
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        placeholder="Tìm laptop, điện thoại..."
                                        className="form-control rounded-pill glow-border border-0 bg-dark text-white px-4 py-2"
                                        style={{ width: "250px", fontSize: "0.9rem" }}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <i className="bi bi-search position-absolute end-3 top-50 translate-middle-y text-white-50"></i>
                                </div>
                            )}

                            {/* Auth Trigger Button */}
                            {loggedInCustomer ? (
                                <div className="d-flex align-items-center gap-2 text-white font-monospace small">
                                    <i className="bi bi-person-circle text-info fs-5"></i>
                                    <span>Xin chào, <strong className="text-info">{loggedInCustomer.fullName.split(' ').pop()}</strong></span>
                                    <button 
                                        className="btn btn-sm btn-outline-danger ms-2 rounded-pill px-3"
                                        onClick={handleLogout}
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="btn btn-outline-info rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                                    style={{ borderColor: "rgba(168, 85, 247, 0.4)", color: "#a855f7" }}
                                    onClick={() => {
                                        setAuthTab("login");
                                        setShowAuthModal(true);
                                    }}
                                >
                                    <i className="bi bi-person"></i>
                                    <span>ĐĂNG NHẬP</span>
                                </button>
                            )}

                            {/* Cart Trigger Button */}
                            <button
                                className="btn btn-outline-info rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                                style={{ borderColor: "rgba(6, 182, 212, 0.4)", color: "#06b6d4" }}
                                data-bs-toggle="offcanvas"
                                data-bs-target="#cartOffcanvas"
                            >
                                <i className="bi bi-cart3"></i>
                                <span>GIỎ HÀNG</span>
                                {cartCount > 0 && (
                                    <span className="badge bg-danger rounded-circle px-2 py-1" style={{ fontSize: "0.75rem" }}>
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* HERO COMPONENT - DISPLAY ONLY ON HOME */}
            {currentTab === "home" && (
                <div className="container mt-4 mb-5">
                    <div className="row g-4">
                        {/* Cột Trái: Danh Mục (Giống CellphoneS) */}
                        <div className="col-lg-3 d-none d-lg-block">
                            <CategoryProductList
                                selectedCategoryId={selectedCategoryId}
                                onSelectCategory={(id) => {
                                    setSelectedCategoryId(id);
                                    setCurrentTab("store");
                                }}
                            />
                        </div>

                        {/* Cột Phải: Banner Chính */}
                        <div className="col-lg-9">
                            <div id="heroCarousel" className="carousel slide carousel-fade h-100 rounded-5 overflow-hidden shadow-2xl border border-secondary border-opacity-10" data-bs-ride="carousel" data-bs-interval="3000">
                                {/* Indicators */}
                                <div className="carousel-indicators mb-2">
                                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                                    <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                                </div>

                                <div className="carousel-inner h-100">
                                    {/* SLIDE 1 */}
                                    <div className="carousel-item active h-100">
                                        <div
                                            className="p-5 p-md-5 text-white h-100"
                                            style={{ background: "linear-gradient(135deg, #0a0f1d 0%, #151b2d 50%, #251b3d 100%)", minHeight: "360px", display: "flex", alignItems: "center" }}
                                        >
                                            <div className="row align-items-center w-100 m-0">
                                                <div className="col-lg-7 px-0 pe-lg-3">
                                                    <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill font-monospace mb-3">
                                                        🚀 GIẢM SỐC HÈ 2026
                                                    </span>
                                                    <h1 className="display-5 fw-black text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                                                        LAPTOP GAMING & <br /> SMARTPHONE ĐỈNH CAO
                                                    </h1>
                                                    <p className="lead text-white-50 mb-4" style={{ fontSize: "1.05rem" }}>
                                                        Trang bị card RTX 40 Series, màn hình 240Hz, và vi xử lý thế hệ mới.
                                                    </p>
                                                    <div className="d-flex gap-3">
                                                        <button className="btn btn-cyber px-4 py-2.5 rounded-pill" onClick={() => { setSelectedCategoryId(null); setSearchQuery(""); setPriceRange(90000000); setCurrentTab("store"); }}>
                                                            Khám Phá Ngay
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                                                    <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-info bg-opacity-10 blur-3xl" style={{ width: "250px", height: "250px", zIndex: 0 }}></div>
                                                    <img src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=400" alt="ROG Laptop" className="img-fluid rounded-4 shadow-lg position-relative" style={{ maxWidth: "100%", zIndex: 1, border: "2px solid rgba(6, 182, 212, 0.2)" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SLIDE 2 */}
                                    <div className="carousel-item h-100">
                                        <div
                                            className="p-5 p-md-5 text-white h-100"
                                            style={{ background: "linear-gradient(135deg, #1d0a1b 0%, #2d1522 50%, #3d1b25 100%)", minHeight: "360px", display: "flex", alignItems: "center" }}
                                        >
                                            <div className="row align-items-center w-100 m-0">
                                                <div className="col-lg-7 px-0 pe-lg-3">
                                                    <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill font-monospace mb-3">
                                                        🌟 SIÊU PHẨM MỚI
                                                    </span>
                                                    <h1 className="display-5 fw-black text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                                                        GALAXY S25 ULTRA <br /> CAMERA VIỄN VỌNG
                                                    </h1>
                                                    <p className="lead text-white-50 mb-4" style={{ fontSize: "1.05rem" }}>
                                                        Chụp ảnh mặt trăng sắc nét với AI ISP và zoom quang học siêu xa. Đặt gạch ngay hôm nay.
                                                    </p>
                                                    <div className="d-flex gap-3">
                                                        <button className="btn btn-cyber px-4 py-2.5 rounded-pill" style={{ background: "linear-gradient(45deg, #f59e0b, #ef4444)" }} onClick={() => { setSelectedCategoryId(null); setCurrentTab("store"); }}>
                                                            Đặt Trước Mua Ngay
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                                                    <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-warning bg-opacity-10 blur-3xl" style={{ width: "250px", height: "250px", zIndex: 0 }}></div>
                                                    <img src="https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=400" alt="S25 Ultra" className="img-fluid rounded-4 shadow-lg position-relative" style={{ maxWidth: "100%", zIndex: 1, border: "2px solid rgba(245, 158, 11, 0.2)" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* SLIDE 3 */}
                                    <div className="carousel-item h-100">
                                        <div
                                            className="p-5 p-md-5 text-white h-100"
                                            style={{ background: "linear-gradient(135deg, #0a1d1c 0%, #152d2a 50%, #1b3d39 100%)", minHeight: "360px", display: "flex", alignItems: "center" }}
                                        >
                                            <div className="row align-items-center w-100 m-0">
                                                <div className="col-lg-7 px-0 pe-lg-3">
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill font-monospace mb-3">
                                                        🎧 ÂM THANH HI-RES
                                                    </span>
                                                    <h1 className="display-5 fw-black text-white mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
                                                        SONY WH-1000XM5 <br /> CHỐNG ỒN TUYỆT ĐỐI
                                                    </h1>
                                                    <p className="lead text-white-50 mb-4" style={{ fontSize: "1.05rem" }}>
                                                        Trải nghiệm không gian tĩnh lặng để tập trung làm việc và giải trí cực đã.
                                                    </p>
                                                    <div className="d-flex gap-3">
                                                        <button className="btn btn-cyber px-4 py-2.5 rounded-pill" style={{ background: "linear-gradient(45deg, #10b981, #059669)" }} onClick={() => { setSelectedCategoryId(null); setCurrentTab("store"); }}>
                                                            Sắm Ngay Cho Nóng
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="col-lg-5 d-none d-lg-block text-center position-relative">
                                                    <div className="position-absolute top-50 start-50 translate-middle rounded-circle bg-success bg-opacity-10 blur-3xl" style={{ width: "250px", height: "250px", zIndex: 0 }}></div>
                                                    <img src="https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=400" alt="Sony Headphones" className="img-fluid rounded-4 shadow-lg position-relative" style={{ maxWidth: "100%", zIndex: 1, border: "2px solid rgba(16, 185, 129, 0.2)" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Controls */}
                                <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
                                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Previous</span>
                                </button>
                                <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
                                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span className="visually-hidden">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: HOME */}
            {currentTab === "home" && (
                <div className="container pb-5">
                    {/* HOMEPAGE SECTIONS: Buying Criteria, Hottest, Latest, News */}
                    <HomeSections 
                        onViewDetail={(prod) => setDetailProduct(prod)}
                        onAddToCart={handleAddToCart}
                        onViewPost={(post) => setDetailPost(post)}
                    />
                </div>
            )}

            {/* TAB CONTENT: STORE */}
            {currentTab === "store" && (
                <div className="container pb-5">
                    <div className="row g-4" id="all-products">
                        {/* Sidebar Filters */}
                        <div className="col-lg-3">
                            <CategoryProductList
                                selectedCategoryId={selectedCategoryId}
                                onSelectCategory={(id) => setSelectedCategoryId(id)}
                            />

                            {/* Advanced Price Filter */}
                            <div className="card mt-4 shadow-lg border-0 text-white p-4" style={{ backgroundColor: "#151b2d", borderRadius: "18px" }}>
                                <h5 className="fw-bold mb-3"><i className="bi bi-sliders me-2 text-info"></i>Lọc Giá Bán</h5>
                                <div className="mb-3">
                                    <label className="form-label text-white-50 small">Mức giá tối đa:</label>
                                    <div className="d-flex justify-content-between font-monospace text-info fw-bold mb-2">
                                        <span>0 VND</span>
                                        <span>{new Intl.NumberFormat("vi-VN").format(priceRange)} VND</span>
                                    </div>
                                    <input
                                        type="range"
                                        className="form-range"
                                        min="1000000"
                                        max="100000000"
                                        step="1000000"
                                        value={priceRange}
                                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                                    />
                                </div>
                                <button
                                    className="btn btn-sm btn-outline-secondary w-100 rounded-pill text-white mt-1"
                                    onClick={() => setPriceRange(90000000)}
                                >
                                    Khôi phục bộ lọc
                                </button>
                            </div>
                        </div>

                        {/* Product List Grid */}
                        <div className="col-lg-9">
                            <div className="d-flex justify-content-between align-items-center mb-4 p-3 rounded-4" style={{ backgroundColor: "#151b2d" }}>
                                <div>
                                    <h4 className="fw-bold mb-1"><span className="text-neon-cyan">⚡</span> Tất Cả Hàng Hoá</h4>
                                    <p className="text-white-50 small mb-0">Hàng chính hãng fullbox • Trực tiếp từ SQL Server</p>
                                </div>
                                <span className="badge bg-dark px-3 py-2 text-info border border-secondary border-opacity-10">
                                    Tìm kiếm sâu
                                </span>
                            </div>

                            <ProductList
                                selectedCategoryId={selectedCategoryId}
                                searchQuery={searchQuery}
                                priceRange={priceRange}
                                onViewDetail={(prod) => setDetailProduct(prod)}
                                onAddToCart={handleAddToCart}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* TAB CONTENT: NEWS */}
            {currentTab === "news" && (
                <div className="container py-4 pb-5">
                    <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: "#151b2d" }}>
                        <h2 className="fw-bold text-white mb-2"><i className="bi bi-newspaper me-2 text-info"></i>Tin Tức Công Nghệ & Review</h2>
                        <p className="text-white-50 mb-0">Cập nhật tin tức hot nhất về phần cứng, điện thoại, mẹo sử dụng và tin tức từ hãng.</p>
                    </div>
                    <PostList />
                </div>
            )}

            {/* TAB CONTENT: ADMIN PANEL */}
            {currentTab === "admin" && loggedInCustomer && (
                <div className="container py-4 pb-5">
                    <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: "#151b2d" }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h2 className="fw-bold text-white mb-2">
                                    <i className="bi bi-cpu me-2 text-info"></i>
                                    Trình Giám Sát Đơn Hàng (Admin Monitor)
                                </h2>
                                <p className="text-white-50 mb-0">Hệ thống theo dõi các giao dịch thời gian thực trong Database SQL Server của dự án.</p>
                            </div>
                            <button className="btn btn-cyber rounded-pill px-4" onClick={fetchAdminData}>
                                <i className="bi bi-arrow-clockwise me-1"></i> Làm mới
                            </button>
                        </div>
                    </div>

                    {adminLoading ? (
                        <div className="text-center p-5">
                            <div className="spinner-border text-info" role="status"></div>
                            <p className="mt-3 font-monospace text-info">READING TRANSACTIONS FROM DATABASE...</p>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {/* Orders Table */}
                            <div className="col-lg-8">
                                <div className="card shadow-lg border-0 text-white p-4" style={{ backgroundColor: "#151b2d", borderRadius: "18px" }}>
                                    <h5 className="fw-bold mb-4">Danh Sách Đơn Hàng Hiện Có</h5>

                                    {orders.length === 0 ? (
                                        <p className="text-white-50 font-monospace text-center py-4">Chưa có giao dịch nào được ghi nhận.</p>
                                    ) : (
                                        <div className="table-responsive">
                                            <table className="table table-dark table-hover table-borderless align-middle mb-0">
                                                <thead>
                                                    <tr className="border-bottom border-secondary border-opacity-25 text-white-50 font-monospace" style={{ fontSize: "0.85rem" }}>
                                                        <th>MÃ ĐH</th>
                                                        <th>KHÁCH HÀNG</th>
                                                        <th>NGÀY ĐẶT</th>
                                                        <th>TRẠNG THÁI</th>
                                                        <th>TỔNG TIỀN</th>
                                                        <th className="text-end">HÀNH ĐỘNG</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {orders.map((order) => {
                                                        // Calculate total order value from orderDetails
                                                        const matchedDetails = orderDetails.filter(d => d.orderId === order.id);
                                                        const total = matchedDetails.reduce((sum, d) => sum + (d.quantity * d.unitPrice), 0);

                                                        // Get status badge
                                                        const getStatusBadge = (status) => {
                                                            if (status === 0) return <span className="badge bg-warning text-dark px-2.5 py-1.5 rounded-3">Chờ duyệt</span>;
                                                            if (status === 1) return <span className="badge bg-info text-dark px-2.5 py-1.5 rounded-3">Đang giao</span>;
                                                            return <span className="badge bg-success px-2.5 py-1.5 rounded-3">Đã hoàn thành</span>;
                                                        };

                                                        return (
                                                            <tr key={order.id} className="border-bottom border-secondary border-opacity-10" style={{ cursor: "pointer" }} onClick={() => setSelectedAdminOrder(order)}>
                                                                <td className="font-monospace text-info">#{order.id}</td>
                                                                <td className="fw-semibold">{order.customerName || `Customer ID: ${order.customerId}`}</td>
                                                                <td className="small text-white-50">{new Date(order.orderDate).toLocaleDateString("vi-VN")}</td>
                                                                <td>{getStatusBadge(order.status)}</td>
                                                                <td className="fw-bold text-success">
                                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
                                                                </td>
                                                                <td className="text-end" onClick={(e) => e.stopPropagation()}>
                                                                    <div className="dropdown d-inline-block">
                                                                        <button className="btn btn-sm btn-outline-info dropdown-toggle rounded-pill" type="button" data-bs-toggle="dropdown">
                                                                            Trạng thái
                                                                        </button>
                                                                        <ul className="dropdown-menu dropdown-menu-dark bg-dark">
                                                                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order.id, 0)}>Chờ duyệt</button></li>
                                                                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order.id, 1)}>Đang giao</button></li>
                                                                            <li><button className="dropdown-item" onClick={() => handleUpdateOrderStatus(order.id, 2)}>Đã xong</button></li>
                                                                        </ul>
                                                                    </div>
                                                                    <button className="btn btn-sm btn-outline-danger rounded-circle ms-2" onClick={() => handleDeleteOrder(order.id)}>
                                                                        <i className="bi bi-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Details Panel */}
                            <div className="col-lg-4">
                                <div className="card shadow-lg border-0 text-white p-4" style={{ backgroundColor: "#151b2d", borderRadius: "18px", minHeight: "300px" }}>
                                    <h5 className="fw-bold mb-3">Thông Tin Chi Tiết</h5>

                                    {selectedAdminOrder ? (
                                        <div>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6 className="text-info font-monospace mb-0">Đơn hàng #{selectedAdminOrder.id}</h6>
                                                <button className="btn btn-sm btn-link text-white-50 p-0" onClick={() => setSelectedAdminOrder(null)}>Đóng</button>
                                            </div>
                                            <hr className="border-secondary border-opacity-25" />

                                            <div className="mb-3">
                                                <label className="text-white-50 small d-block">Tên khách hàng:</label>
                                                <span className="fw-bold text-white">{selectedAdminOrder.customerName || `ID: ${selectedAdminOrder.customerId}`}</span>
                                            </div>

                                            <div className="mb-3">
                                                <label className="text-white-50 small d-block">Ghi chú đơn hàng:</label>
                                                <span className="text-light small">{selectedAdminOrder.notes || "Không có"}</span>
                                            </div>

                                            <h6 className="fw-semibold text-info mt-4 mb-2"><i className="bi bi-basket me-2"></i>Sản phẩm đã mua</h6>
                                            <div className="list-group list-group-flush bg-transparent">
                                                {orderDetails.filter(d => d.orderId === selectedAdminOrder.id).map(item => (
                                                    <div className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 px-0 py-2 d-flex justify-content-between align-items-center" key={item.id}>
                                                        <div>
                                                            <div className="small fw-bold">{item.productName}</div>
                                                            <div className="text-white-50 small font-monospace">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.unitPrice)} x {item.quantity}</div>
                                                        </div>
                                                        <span className="badge bg-info bg-opacity-25 text-info font-monospace">
                                                            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.unitPrice * item.quantity)}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-5">
                                            <i className="bi bi-file-earmark-text display-4 text-white-50 mb-3 d-block"></i>
                                            <p className="text-white-50 small">Hãy chọn một đơn hàng từ bảng để xem thông tin chi tiết.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* SHOPPING CART OFFCANVAS */}
            <div className="offcanvas offcanvas-end text-white" style={{ backgroundColor: "#151b2d", width: "420px" }} tabIndex="-1" id="cartOffcanvas" aria-labelledby="cartOffcanvasLabel">
                <div className="offcanvas-header border-bottom border-secondary border-opacity-25">
                    <h5 className="offcanvas-title fw-bold" id="cartOffcanvasLabel"><i className="bi bi-cart3 me-2 text-info"></i>Giỏ Hàng Của Bạn</h5>
                    <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>

                <div className="offcanvas-body d-flex flex-column justify-content-between">
                    {cart.length === 0 ? (
                        <div className="text-center my-auto">
                            <i className="bi bi-cart-x display-1 text-white-50 mb-4 d-block"></i>
                            <h5 className="fw-semibold">Giỏ hàng đang trống</h5>
                            <p className="text-white-50 small">Hãy chọn những chiếc smartphone hay gaming laptop đỉnh nhất và thêm vào giỏ hàng nhé!</p>
                        </div>
                    ) : (
                        <div className="overflow-y-auto pe-1" style={{ maxHeight: "75vh" }}>
                            {cart.map((item) => (
                                <div className="card bg-dark border-0 p-3 mb-3" style={{ borderRadius: "14px" }} key={item.id}>
                                    <div className="d-flex gap-3 align-items-center">
                                        <img
                                            src={item.imageUrl || "https://via.placeholder.com/100"}
                                            alt={item.name}
                                            className="rounded-3"
                                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1 text-white text-truncate-2" style={{ fontSize: "0.9rem" }}>{item.name}</h6>
                                            <div className="text-info fw-bold font-monospace small mb-2">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}
                                            </div>

                                            {/* Quantity adjustment & Remove */}
                                            <div className="d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-2">
                                                    <button className="btn btn-sm btn-outline-secondary py-0 px-2 rounded-2 text-white border-secondary" onClick={() => handleUpdateQuantity(item.id, -1)}>-</button>
                                                    <span className="font-monospace small fw-bold">{item.quantity}</span>
                                                    <button className="btn btn-sm btn-outline-secondary py-0 px-2 rounded-2 text-white border-secondary" onClick={() => handleUpdateQuantity(item.id, 1)}>+</button>
                                                </div>
                                                <button className="btn btn-sm btn-outline-danger border-0 p-1" onClick={() => handleRemoveFromCart(item.id)}>
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {cart.length > 0 && (
                        <div className="border-top border-secondary border-opacity-25 pt-4 mt-auto">
                            <div className="d-flex justify-content-between align-items-center mb-3 px-1">
                                <span className="text-white-50">Tổng cộng:</span>
                                <span className="fs-4 fw-extrabold text-success font-monospace">
                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(cartTotal)}
                                </span>
                            </div>
                            <button
                                className="btn btn-cyber w-100 py-3 rounded-pill fs-6 font-monospace"
                                data-bs-dismiss="offcanvas"
                                onClick={() => {
                                    setOrderSuccess(false);
                                    if(loggedInCustomer) {
                                        setCheckoutForm({
                                            fullName: loggedInCustomer.fullName || "",
                                            email: loggedInCustomer.email || "",
                                            phone: loggedInCustomer.phone || "",
                                            address: loggedInCustomer.address || "",
                                            notes: ""
                                        });
                                    }
                                    setShowCheckoutModal(true);
                                }}
                            >
                                <i className="bi bi-credit-card-fill me-2"></i> TIẾN HÀNH ĐẶT HÀNG
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* CHECKOUT MODAL OVERLAY */}
            {showCheckoutModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(10, 15, 29, 0.85)", backdropFilter: "blur(8px)", zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-md">
                        <div className="modal-content border-0 shadow-lg text-white" style={{ backgroundColor: "#151b2d", borderRadius: "20px" }}>

                            <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center p-4">
                                <h5 className="modal-title fw-bold"><i className="bi bi-credit-card-2-front me-2 text-info"></i>Thông Tin Đặt Hàng</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowCheckoutModal(false)}></button>
                            </div>

                            <div className="modal-body p-4">
                                {orderSuccess ? (
                                    <div className="text-center py-4 text-white">
                                        <i className="bi bi-patch-check-fill display-2 text-success mb-3 d-block"></i>
                                        <h4 className="fw-bold text-success">ĐẶT HÀNG THÀNH CÔNG!</h4>
                                        <p className="text-white-50 small">Cảm ơn bạn đã mua hàng. Đơn hàng <strong className="text-info">#{placedOrderId}</strong> đã được đồng bộ vào hệ thống database SQL Server.</p>
                                        <button className="btn btn-cyber px-4 rounded-pill mt-3" onClick={() => setShowCheckoutModal(false)}>
                                            Tiếp tục mua sắm
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleCheckoutSubmit}>
                                        <div className="mb-3">
                                            <label className="form-label text-white-50 small">Họ và tên *</label>
                                            <input
                                                type="text"
                                                className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                required
                                                value={checkoutForm.fullName}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label text-white-50 small">Email (dùng để tìm kiếm/tạo mới tài khoản) *</label>
                                            <input
                                                type="email"
                                                className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                required
                                                value={checkoutForm.email}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                                            />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-white-50 small">Số điện thoại *</label>
                                                <input
                                                    type="tel"
                                                    className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                    required
                                                    value={checkoutForm.phone}
                                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label text-white-50 small">Địa chỉ nhận hàng *</label>
                                                <input
                                                    type="text"
                                                    className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                    required
                                                    value={checkoutForm.address}
                                                    onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-4">
                                            <label className="form-label text-white-50 small">Ghi chú giao hàng</label>
                                            <textarea
                                                className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                rows="2"
                                                value={checkoutForm.notes}
                                                onChange={(e) => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <hr className="border-secondary border-opacity-25 mb-4" />

                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                            <span className="text-white-50">Tổng thanh toán:</span>
                                            <span className="fs-4 fw-extrabold text-success font-monospace">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(cartTotal)}
                                            </span>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-cyber w-100 py-3 rounded-pill fw-bold text-dark font-monospace"
                                            disabled={checkoutLoading}
                                        >
                                            {checkoutLoading ? (
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                            ) : null}
                                            <i className="bi bi-wallet2 me-2"></i> XÁC NHẬN MUA NGAY
                                        </button>
                                    </form>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* AUTH MODAL OVERLAY */}
            {showAuthModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(10, 15, 29, 0.85)", backdropFilter: "blur(8px)", zIndex: 1060 }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content border-0 shadow-lg text-white" style={{ backgroundColor: "#151b2d", borderRadius: "20px" }}>

                            <div className="modal-header border-0 pb-0 d-flex justify-content-between align-items-center p-4">
                                <div className="d-flex w-100 gap-3 border-bottom border-secondary border-opacity-25 pb-2">
                                    <span 
                                        className={`fw-bold cursor-pointer pb-2 ${authTab === "login" ? "text-info border-bottom border-info border-2" : "text-white-50"}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setAuthTab("login")}
                                    >
                                        Đăng Nhập
                                    </span>
                                    <span 
                                        className={`fw-bold cursor-pointer pb-2 ${authTab === "register" ? "text-info border-bottom border-info border-2" : "text-white-50"}`}
                                        style={{ cursor: "pointer" }}
                                        onClick={() => setAuthTab("register")}
                                    >
                                        Đăng Ký
                                    </span>
                                </div>
                                <button type="button" className="btn-close btn-close-white position-absolute top-0 end-0 m-3" onClick={() => setShowAuthModal(false)}></button>
                            </div>

                            <div className="modal-body p-4 pt-3">
                                <form onSubmit={handleAuthSubmit}>
                                    {authTab === "register" && (
                                        <>
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Họ và tên"
                                                    className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                    required
                                                    value={authForm.fullName}
                                                    onChange={(e) => setAuthForm({ ...authForm, fullName: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="tel"
                                                    placeholder="Số điện thoại"
                                                    className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                    required
                                                    value={authForm.phone}
                                                    onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <input
                                                    type="text"
                                                    placeholder="Địa chỉ"
                                                    className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                                    required
                                                    value={authForm.address}
                                                    onChange={(e) => setAuthForm({ ...authForm, address: e.target.value })}
                                                />
                                            </div>
                                        </>
                                    )}
                                    
                                    <div className="mb-3">
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                            required
                                            value={authForm.email}
                                            onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <input
                                            type="password"
                                            placeholder="Mật khẩu"
                                            className="form-control bg-dark border-0 text-white rounded-3 py-2 glow-border"
                                            required
                                            value={authForm.password}
                                            onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-cyber w-100 py-2 rounded-pill fw-bold text-dark font-monospace mb-2"
                                        disabled={authLoading}
                                    >
                                        {authLoading ? (
                                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                        ) : null}
                                        {authTab === "login" ? "XÁC NHẬN ĐĂNG NHẬP" : "TẠO TÀI KHOẢN"}
                                    </button>
                                </form>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {/* PRODUCT DETAILS MODAL OVERLAY */}
            {detailProduct && (
                <ProductDetailModal
                    product={detailProduct}
                    onClose={() => setDetailProduct(null)}
                    onAddToCart={handleAddToCart}
                />
            )}

            {/* FOOTER */}
            <footer
                className="pt-5 pb-3 mt-5 position-relative"
                style={{
                    background: "linear-gradient(180deg, #0a0f1d 0%, #050816 100%)",
                    borderTop: "1px solid rgba(0, 212, 255, 0.4)",
                    boxShadow: "0 -10px 20px rgba(0, 212, 255, 0.1)",
                    color: "#FFFFFF"
                }}
            >
                <style>
                    {`
                        /* CSS Classes cho Cyberpunk Footer */
                        .cyber-footer-logo {
                            color: #00D4FF;
                            text-shadow: 0 0 10px rgba(0, 212, 255, 0.6);
                            font-weight: 800;
                            letter-spacing: 1px;
                            transition: all 0.3s ease;
                        }
                        .cyber-footer-logo:hover {
                            text-shadow: 0 0 15px rgba(0, 212, 255, 0.9), 0 0 25px rgba(0, 212, 255, 0.4);
                        }
                        .cyber-footer-title {
                            color: #A855F7;
                            font-weight: 700;
                            margin-bottom: 1.5rem;
                            text-transform: uppercase;
                            letter-spacing: 1.5px;
                        }
                        .cyber-footer-text {
                            color: #CBD5E1;
                            line-height: 1.8;
                            font-size: 0.95rem;
                        }
                        .cyber-footer-icon {
                            color: #00D4FF;
                            margin-right: 12px;
                            font-size: 1.15rem;
                            filter: drop-shadow(0 0 5px rgba(0, 212, 255, 0.4));
                        }
                        .cyber-social-btn {
                            display: inline-flex;
                            align-items: center;
                            justify-content: center;
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            background: rgba(255, 255, 255, 0.05);
                            color: #CBD5E1;
                            font-size: 1.2rem;
                            transition: all 0.3s ease;
                            text-decoration: none;
                            border: 1px solid transparent;
                        }
                        .cyber-social-btn:hover {
                            background: rgba(0, 212, 255, 0.1);
                            color: #00D4FF;
                            border-color: rgba(0, 212, 255, 0.5);
                            box-shadow: 0 0 12px rgba(0, 212, 255, 0.5);
                            transform: translateY(-3px);
                        }
                        .cyber-footer-link {
                            color: #CBD5E1;
                            text-decoration: none;
                            transition: all 0.3s ease;
                        }
                        .cyber-footer-link:hover {
                            color: #00D4FF;
                            text-shadow: 0 0 8px rgba(0, 212, 255, 0.6);
                        }
                        .cyber-divider {
                            border-color: rgba(168, 85, 247, 0.4);
                        }
                    `}
                </style>

                <div className="container">
                    <div className="row g-4 mb-4">

                        {/* Cột 1: G-ZONE STORE */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <h4 className="cyber-footer-logo mb-3 d-flex align-items-center">
                                <i className="bi bi-lightning-charge-fill me-2 fs-3"></i>
                                G-ZONE STORE
                            </h4>
                            <p className="cyber-footer-text mb-4">
                                Chuyên cung cấp Laptop Gaming, Smartphone, PC Gaming và phụ kiện công nghệ chính hãng với chất lượng cao và giá tốt.
                            </p>
                            <div className="d-flex gap-3">
                                <a href="#fb" className="cyber-social-btn"><i className="bi bi-facebook"></i></a>
                                <a href="#ig" className="cyber-social-btn"><i className="bi bi-instagram"></i></a>
                                <a href="#yt" className="cyber-social-btn"><i className="bi bi-youtube"></i></a>
                                <a href="#tt" className="cyber-social-btn"><i className="bi bi-tiktok"></i></a>
                            </div>
                        </div>

                        {/* Cột 2: Thông Tin Liên Hệ */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <h5 className="cyber-footer-title">Thông Tin Liên Hệ</h5>
                            <ul className="list-unstyled cyber-footer-text d-flex flex-column gap-3">
                                <li className="d-flex align-items-start">
                                    <i className="bi bi-geo-alt-fill cyber-footer-icon mt-1"></i>
                                    <span>TP. Hồ Chí Minh, Việt Nam</span>
                                </li>
                                <li className="d-flex align-items-center">
                                    <i className="bi bi-telephone-fill cyber-footer-icon"></i>
                                    <span>09032722106</span>
                                </li>
                                <li className="d-flex align-items-center">
                                    <i className="bi bi-envelope-fill cyber-footer-icon"></i>
                                    <a href="mailto:support@gzone.vn" className="cyber-footer-link">phucp8110@gmail.com</a>
                                </li>
                                <li className="d-flex align-items-center">
                                    <i className="bi bi-clock-fill cyber-footer-icon"></i>
                                    <span>08:00 - 22:00 (T2 - CN)</span>
                                </li>
                            </ul>
                        </div>

                        {/* Cột 3: Sinh Viên Thực Hiện */}
                        <div className="col-12 col-md-6 col-lg-4">
                            <h5 className="cyber-footer-title">Sinh Viên Thực Hiện</h5>
                            <ul className="list-unstyled cyber-footer-text d-flex flex-column gap-2">
                                <li><strong className="text-white me-2">Họ tên:</strong> Phạm Văn Quỳnh Phúc</li>
                                <li><strong className="text-white me-2">MSSV:</strong> 2123110202</li>
                                <li><strong className="text-white me-2">Lớp:</strong> CCQ2311F</li>
                                <li>
                                    <strong className="text-white me-2">Môn học:</strong>
                                    <span style={{ color: "#00D4FF", fontWeight: "500" }}>Chuyên Đề ASP.NET</span>
                                </li>
                            </ul>
                        </div>

                    </div>

                    {/* Footer Bottom */}
                    <hr className="cyber-divider my-4" />
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center cyber-footer-text small">
                        <span className="mb-2 mb-md-0">© 2026 G-ZONE Gaming Store. All rights reserved.</span>
                        <span style={{ color: "#A855F7", fontWeight: "600", letterSpacing: "1px", textShadow: "0 0 5px rgba(168, 85, 247, 0.4)" }}>
                            Powered by React + ASP.NET Core
                        </span>
                    </div>
                </div>
            </footer>

            {/* POST DETAIL MODAL */}
            {detailPost && (
                <PostDetailModal post={detailPost} onClose={() => setDetailPost(null)} />
            )}

        </div>
    );
}

export default App;