import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import orderService from '../../services/orderService';
import axiosClient from '../../api/axiosClient';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [customerName, setCustomerName] = useState("");

    useEffect(() => {
        // Read auth data from localStorage
        const authDataStr = localStorage.getItem('customer');
        if (authDataStr) {
            const authData = JSON.parse(authDataStr);
            setCustomerName(authData.fullName);
            
            // Fetch orders for this customer
            orderService.getOrdersByCustomer(authData.id)
                .then(data => {
                    setOrders(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Error fetching orders:", error);
                    setLoading(false);
                });

            // Fetch notifications
            axiosClient.get(`/notifications/customer/${authData.id}`)
                .then(data => setNotifications(data))
                .catch(err => console.error(err));
        } else {
            setLoading(false);
        }
    }, []);

    const getStatusInfo = (status) => {
        switch(status) {
            case 0: return { text: "Chờ duyệt", color: "text-warning", bg: "bg-warning", icon: "fa-hourglass-half" };
            case 1: return { text: "Đang giao", color: "text-info", bg: "bg-info", icon: "fa-truck" };
            case 2: return { text: "Đã hoàn thành", color: "text-success", bg: "bg-success", icon: "fa-check-circle" };
            case 3: return { text: "Đã hủy", color: "text-danger", bg: "bg-danger", icon: "fa-times-circle" };
            default: return { text: "Không xác định", color: "text-secondary", bg: "bg-secondary", icon: "fa-question-circle" };
        }
    };

    return (
        <div className="my-orders-page flex-grow-1 d-flex flex-column bg-light" style={{ minHeight: "80vh" }}>
            <div className="container my-5 flex-grow-1">
                <div className="card shadow border-0 p-4" style={{ borderRadius: '15px' }}>
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                        <h3 className="font-weight-bold m-0" style={{ color: '#005088' }}>
                            <i className="fas fa-history mr-2 text-info"></i> Lịch Sử Mua Hàng
                        </h3>
                        <span className="text-muted">
                            Tài khoản: <strong className="text-dark">{customerName || "Khách hàng"}</strong>
                        </span>
                    </div>

                    {/* Notifications */}
                    {notifications.length > 0 && (
                        <div className="mb-4">
                            <h6 className="font-weight-bold text-dark mb-3"><i className="fas fa-bell text-warning"></i> Thông báo gần đây</h6>
                            <div className="list-group">
                                {notifications.map(notif => (
                                    <div key={notif.id} className="list-group-item list-group-item-action list-group-item-warning border-warning rounded mb-2">
                                        <div className="d-flex w-100 justify-content-between">
                                            <p className="mb-1 fw-bold text-dark">{notif.message}</p>
                                            <small className="text-muted">{new Date(notif.createdAt).toLocaleString('vi-VN')}</small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border text-info" role="status">
                                <span className="sr-only">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Đang tải lịch sử đơn hàng...</p>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-5">
                            <i className="fas fa-box-open fa-4x text-muted mb-3 opacity-50"></i>
                            <h5 className="text-muted">Bạn chưa có đơn hàng nào</h5>
                            <Link to="/shop" className="btn btn-info mt-3 rounded-pill px-4">
                                Khám phá sản phẩm ngay
                            </Link>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map(order => {
                                const statusInfo = getStatusInfo(order.status);
                                const orderTotal = order.orderDetails.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
                                
                                return (
                                    <div key={order.id} className="card mb-4 border border-light shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                        {/* Order Header */}
                                        <div className="card-header bg-white border-bottom d-flex justify-content-between align-items-center p-3">
                                            <div>
                                                <h6 className="mb-0 font-weight-bold text-dark">
                                                    ĐƠN HÀNG <span className="text-info">#{order.id}</span>
                                                </h6>
                                                <small className="text-muted">
                                                    <i className="far fa-clock mr-1"></i> 
                                                    {new Date(order.orderDate).toLocaleString('vi-VN')}
                                                </small>
                                            </div>
                                            <div className="text-right">
                                                <span className={`badge ${statusInfo.bg} text-white px-3 py-2 rounded-pill`} style={{ fontSize: '13px' }}>
                                                    <i className={`fas ${statusInfo.icon} mr-1`}></i> {statusInfo.text}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        {/* Order Items */}
                                        <div className="card-body p-0">
                                            <div className="table-responsive">
                                                <table className="table table-hover mb-0">
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th className="border-0 pl-4">Sản phẩm</th>
                                                            <th className="border-0 text-center">Đơn giá</th>
                                                            <th className="border-0 text-center">Số lượng</th>
                                                            <th className="border-0 text-right pr-4">Thành tiền</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.orderDetails.map(item => (
                                                            <tr key={item.id}>
                                                                <td className="pl-4 align-middle">
                                                                    <div className="d-flex align-items-center">
                                                                        <img 
                                                                            src={item.productImage || "https://via.placeholder.com/50"} 
                                                                            alt={item.productName} 
                                                                            className="rounded shadow-sm"
                                                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                                                        />
                                                                        <span className="ml-3 font-weight-bold text-dark">{item.productName}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="text-center align-middle text-muted">
                                                                    {item.unitPrice.toLocaleString('vi-VN')} ₫
                                                                </td>
                                                                <td className="text-center align-middle font-weight-bold">
                                                                    x{item.quantity}
                                                                </td>
                                                                <td className="text-right align-middle font-weight-bold text-dark pr-4">
                                                                    {(item.quantity * item.unitPrice).toLocaleString('vi-VN')} ₫
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        {order.orderDetails.length === 0 && (
                                                            <tr>
                                                                <td colSpan="4" className="text-center py-3 text-muted">
                                                                    Không có sản phẩm nào trong đơn hàng này (Có thể đã bị xóa)
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {/* Order Footer */}
                                        <div className="card-footer bg-white border-top p-3">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <div>
                                                    <span className="text-muted mr-2">Phương thức thanh toán:</span>
                                                    {order.paymentMethod === 1 ? (
                                                        <span className="badge badge-success px-2 py-1"><i className="fas fa-credit-card mr-1"></i> Thanh toán Online</span>
                                                    ) : (
                                                        <span className="badge badge-secondary px-2 py-1"><i className="fas fa-money-bill-wave mr-1"></i> COD (Tiền mặt)</span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-muted mr-2">Tổng số tiền:</span>
                                                    <h5 className="d-inline font-weight-bold" style={{ color: '#d32f2f' }}>
                                                        {orderTotal.toLocaleString('vi-VN')} ₫
                                                    </h5>
                                                </div>
                                            </div>
                                            {order.refundStatus > 0 && (
                                                <div className="d-flex justify-content-end mt-2">
                                                    <div className={`p-2 rounded border ${order.refundStatus === 1 ? 'border-warning bg-warning text-warning' : 'border-success bg-success text-success'}`} style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                                                        <i className={order.refundStatus === 1 ? 'fas fa-undo-alt mr-1' : 'fas fa-check-circle mr-1'}></i> 
                                                        <strong>{order.refundStatus === 1 ? 'Đang hoàn tiền' : 'Đã hoàn tiền'}: </strong> 
                                                        {order.refundAmount.toLocaleString('vi-VN')} ₫
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyOrders;
