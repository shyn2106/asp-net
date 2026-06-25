import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import customerService from '../../services/customerService';
import orderService from '../../services/orderService';

const Checkout = () => {
    const { cart, cartTotal, loggedInCustomer, setCart } = useContext(AppContext);
    const navigate = useNavigate();

    const [checkoutForm, setCheckoutForm] = useState({
        fullName: loggedInCustomer ? loggedInCustomer.fullName : "",
        email: loggedInCustomer ? loggedInCustomer.email : "",
        phone: loggedInCustomer ? loggedInCustomer.phone : "",
        address: loggedInCustomer ? loggedInCustomer.address : "",
        notes: ""
    });
    
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [placedOrderId, setPlacedOrderId] = useState(null);

    const handleCheckoutSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        setCheckoutLoading(true);
        try {
            let customerId;

            if (loggedInCustomer) {
                customerId = loggedInCustomer.id;
            } else {
                const allCustomers = await customerService.getAllCustomers();
                let customer = allCustomers.find(c => c.email.toLowerCase() === checkoutForm.email.toLowerCase());

                if (customer) {
                    customerId = customer.id;
                } else {
                    const newCustData = {
                        FullName: checkoutForm.fullName,
                        Email: checkoutForm.email,
                        Phone: checkoutForm.phone,
                        Address: checkoutForm.address,
                        Password: "Customer123@"
                    };
                    await customerService.createCustomer(newCustData);

                    const updatedCustomers = await customerService.getAllCustomers();
                    const freshCustomer = updatedCustomers.find(c => c.email.toLowerCase() === checkoutForm.email.toLowerCase());
                    customerId = freshCustomer ? freshCustomer.id : updatedCustomers[updatedCustomers.length - 1].id;
                }
            }

            const newOrderData = {
                CustomerId: customerId,
                Status: 0,
                Notes: checkoutForm.notes || "Đặt hàng từ G-ZONE Web"
            };
            await orderService.createOrder(newOrderData);

            const allOrders = await orderService.getAllOrders();
            const customerOrders = allOrders
                .filter(o => o.customerId === customerId || o.customerName === checkoutForm.fullName)
                .sort((a, b) => b.id - a.id);

            const newOrderId = customerOrders.length > 0 ? customerOrders[0].id : allOrders[allOrders.length - 1].id;

            for (const item of cart) {
                const detailRecord = {
                    OrderId: newOrderId,
                    ProductId: item.id,
                    Quantity: item.quantity,
                    UnitPrice: item.price
                };
                
                try {
                    await orderService.createOrderDetail(detailRecord);
                } catch (err) {
                    const errorMsg = err.response?.data?.message || `Lỗi khi thanh toán sản phẩm ${item.name}.`;
                    throw new Error(errorMsg);
                }
            }

            setPlacedOrderId(newOrderId);
            setOrderSuccess(true);
            setCart([]);
            setCheckoutForm({
                fullName: "", email: "", phone: "", address: "", notes: ""
            });
        } catch (error) {
            console.error("Giao dịch đặt hàng thất bại:", error);
            alert(error.message || "Lỗi kết nối API. Vui lòng kiểm tra lại URL backend hoặc trạng thái SQL Server!");
        } finally {
            setCheckoutLoading(false);
        }
    };

    if (orderSuccess) {
        return (
            <div className="container py-5 text-center text-white">
                <div className="p-5 bg-dark rounded-4 shadow-lg mx-auto" style={{ maxWidth: "600px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
                    <i className="bi bi-check-circle-fill display-1 text-success mb-3 d-block"></i>
                    <h2 className="fw-bold mb-3">Đặt Hàng Thành Công!</h2>
                    <p className="text-white-50">Cảm ơn bạn đã mua sắm tại G-ZONE.</p>
                    <p className="text-white-50">Mã đơn hàng của bạn là: <strong className="text-info">#{placedOrderId}</strong></p>
                    <button className="btn btn-cyber mt-4 px-4 rounded-pill" onClick={() => navigate('/shop')}>
                        Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="container py-5 text-center text-white">
                <h4 className="mb-4">Giỏ hàng của bạn đang trống</h4>
                <button className="btn btn-outline-info rounded-pill px-4" onClick={() => navigate('/shop')}>Về cửa hàng</button>
            </div>
        );
    }

    return (
        <div className="container py-5 text-white">
            <h2 className="fw-bold mb-4"><i className="bi bi-credit-card-2-front me-2 text-info"></i>Thanh Toán Đơn Hàng</h2>
            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card border-0 shadow-lg bg-dark rounded-4 p-4">
                        <h5 className="fw-bold mb-4">Thông Tin Giao Hàng</h5>
                        <form onSubmit={handleCheckoutSubmit}>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">Họ và Tên</label>
                                <input type="text" className="form-control bg-dark text-white border-secondary" required
                                    value={checkoutForm.fullName} onChange={e => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })} />
                            </div>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-white-50 small">Email</label>
                                    <input type="email" className="form-control bg-dark text-white border-secondary" required
                                        value={checkoutForm.email} onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })} />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label text-white-50 small">Số Điện Thoại</label>
                                    <input type="tel" className="form-control bg-dark text-white border-secondary" required
                                        value={checkoutForm.phone} onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-white-50 small">Địa Chỉ Giao Hàng</label>
                                <input type="text" className="form-control bg-dark text-white border-secondary" required
                                    value={checkoutForm.address} onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })} />
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-white-50 small">Ghi Chú Đơn Hàng (Tùy chọn)</label>
                                <textarea className="form-control bg-dark text-white border-secondary" rows="3"
                                    value={checkoutForm.notes} onChange={e => setCheckoutForm({ ...checkoutForm, notes: e.target.value })}></textarea>
                            </div>
                            
                            <button type="submit" className="btn w-100 rounded-pill fw-bold text-dark py-3" style={{ background: "linear-gradient(90deg, #06b6d4, #a855f7)" }} disabled={checkoutLoading}>
                                {checkoutLoading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-bag-check-fill me-2"></i>}
                                {checkoutLoading ? "ĐANG XỬ LÝ..." : "XÁC NHẬN ĐẶT HÀNG"}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card border-0 shadow-lg bg-dark rounded-4 p-4 sticky-top" style={{ top: "100px" }}>
                        <h5 className="fw-bold mb-4">Đơn Hàng ({cart.length} sản phẩm)</h5>
                        <div className="list-group list-group-flush bg-transparent mb-3">
                            {cart.map(item => (
                                <div className="list-group-item bg-transparent text-white border-bottom border-secondary border-opacity-25 px-0 py-2 d-flex justify-content-between align-items-center" key={item.id}>
                                    <div className="d-flex align-items-center">
                                        <img src={item.imageUrl || "https://via.placeholder.com/50"} alt={item.name} className="rounded me-3" style={{ width: "40px", height: "40px", objectFit: "cover" }} />
                                        <div>
                                            <div className="small fw-bold">{item.name}</div>
                                            <div className="text-white-50 small font-monospace">SL: {item.quantity}</div>
                                        </div>
                                    </div>
                                    <span className="fw-bold text-info small">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.price * item.quantity)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="d-flex justify-content-between mt-3">
                            <span className="fw-bold fs-5">Tổng Thanh Toán:</span>
                            <span className="fw-bold text-neon-cyan fs-4">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(cartTotal)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
