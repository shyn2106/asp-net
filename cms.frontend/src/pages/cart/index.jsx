import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const Cart = () => {
    const { cart, handleUpdateQuantity, handleRemoveFromCart, cartTotal } = useContext(AppContext);
    const navigate = useNavigate();

    return (
        <div className="container py-5 text-white">
            <h2 className="fw-bold mb-4"><i className="bi bi-cart3 me-2 text-info"></i>Giỏ hàng của bạn</h2>
            
            {cart.length === 0 ? (
                <div className="text-center py-5 bg-dark rounded-4 shadow-lg">
                    <i className="bi bi-cart-x display-1 text-white-50 mb-3 d-block"></i>
                    <h4>Giỏ hàng đang trống</h4>
                    <p className="text-white-50">Hãy khám phá các sản phẩm công nghệ đỉnh cao ngay!</p>
                    <button className="btn btn-cyber mt-3 px-4 rounded-pill" onClick={() => navigate('/shop')}>
                        Tiếp tục mua sắm
                    </button>
                </div>
            ) : (
                <div className="row g-4">
                    <div className="col-lg-8">
                        <div className="card border-0 shadow-lg bg-dark rounded-4 p-4">
                            {cart.map((item) => (
                                <div className="row align-items-center border-bottom border-secondary border-opacity-25 py-3" key={item.id}>
                                    <div className="col-3 col-md-2">
                                        <img src={item.imageUrl || "https://via.placeholder.com/150"} alt={item.name} className="img-fluid rounded" />
                                    </div>
                                    <div className="col-9 col-md-4 mb-3 mb-md-0">
                                        <h6 className="fw-bold mb-1">{item.name}</h6>
                                        <span className="text-info fw-bold">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price)}</span>
                                    </div>
                                    <div className="col-6 col-md-4">
                                        <div className="input-group input-group-sm w-75 mx-auto mx-md-0">
                                            <button className="btn btn-outline-secondary text-white" onClick={() => handleUpdateQuantity(item.id, -1)}>-</button>
                                            <input type="text" className="form-control bg-transparent text-white text-center border-secondary" value={item.quantity} readOnly />
                                            <button className="btn btn-outline-secondary text-white" onClick={() => handleUpdateQuantity(item.id, 1)}>+</button>
                                        </div>
                                    </div>
                                    <div className="col-6 col-md-2 text-end text-md-center">
                                        <button className="btn btn-sm btn-outline-danger rounded-circle" onClick={() => handleRemoveFromCart(item.id)}>
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="col-lg-4">
                        <div className="card border-0 shadow-lg bg-dark rounded-4 p-4">
                            <h5 className="fw-bold mb-4">Tóm tắt đơn hàng</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span className="text-white-50">Tạm tính:</span>
                                <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(cartTotal)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom border-secondary border-opacity-25">
                                <span className="text-white-50">Phí giao hàng:</span>
                                <span className="text-success">Miễn phí</span>
                            </div>
                            <div className="d-flex justify-content-between mb-4">
                                <span className="fw-bold fs-5">Tổng cộng:</span>
                                <span className="fw-bold text-neon-cyan fs-5">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(cartTotal)}</span>
                            </div>
                            <button className="btn w-100 rounded-pill fw-bold text-dark py-3" style={{ background: "linear-gradient(90deg, #06b6d4, #a855f7)" }} onClick={() => navigate('/checkout')}>
                                TIẾN HÀNH THANH TOÁN
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
