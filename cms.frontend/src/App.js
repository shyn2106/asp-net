import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// 1. IMPORT CÁC COMPONENT TOÀN CỤC (LAYOUT CHUNG)
import Header from './components/Header';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';

// 2. IMPORT CÁC TRANG CHỨC NĂNG (GIAO DIỆN CHÍNH)
import Home from './pages/home/index';
import Shop from './pages/shop/index';                  
import ProductDetail from './pages/product-detail/index'; 
import Blog from './pages/blog/index';                  
import BlogDetail from './pages/blog-detail/index';  
import Cart from './pages/cart/index';                  
import Checkout from './pages/checkout/index';          
import Register from './pages/register/index';
import Login from './pages/login/index';
import Profile from './pages/auth/Profile';
import MyOrders from './pages/auth/MyOrders';
import './App.css';

function App() {
    return (
        <AppProvider>
            <Router>
                <div className="d-flex flex-column min-vh-100 bg-dark text-white">
                    <Header />

                    {/* KHU VỰC NỘI DUNG ĐỘNG */}
                    <main className="flex-grow-1">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/shop" element={<Shop />} />
                            <Route path="/product/:id" element={<ProductDetail />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/:id" element={<BlogDetail />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/my-orders" element={<MyOrders />} />

                            <Route path="*" element={
                                <div className="container text-center py-5 my-5">
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/580/580185.png"
                                        alt="404"
                                        className="mb-4"
                                        style={{ width: '100px', opacity: 0.6 }}
                                    />
                                    <h2 className="fw-bold text-secondary">404 - KHÔNG TÌM THẤY TRANG</h2>
                                    <p className="text-white-50">Đường dẫn bạn truy cập không tồn tại trên hệ thống G-ZONE.</p>
                                    <a href="/" className="btn btn-cyber btn-sm mt-2">Quay lại Trang Chủ</a>
                                </div>
                            } />
                        </Routes>
                    </main>

                    <Footer />
                    <AuthModal />
                </div>
            </Router>
        </AppProvider>
    );
}

export default App;