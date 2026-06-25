import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import orderService from '../../services/orderService';
import { Navigate } from 'react-router-dom';

const Admin = () => {
    const { loggedInCustomer } = useContext(AppContext);
    
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [adminLoading, setAdminLoading] = useState(false);
    const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);

    useEffect(() => {
        if (loggedInCustomer) {
            fetchAdminData();
        }
    }, [loggedInCustomer]);

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

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;

        try {
            await orderService.updateOrder(orderId, {
                CustomerId: order.customerId || 1,
                Status: parseInt(newStatus),
                Notes: order.notes
            });
            fetchAdminData();
            alert(`Cập nhật trạng thái Đơn hàng #${orderId} thành công!`);
        } catch (error) {
            console.error("Lỗi cập nhật đơn hàng:", error);
        }
    };

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

    if (!loggedInCustomer) {
        return <Navigate to="/" />;
    }

    if (loggedInCustomer.role !== 'admin') {
        return (
            <div className="container py-5 text-center" style={{ minHeight: '60vh' }}>
                <div className="alert alert-danger my-5 p-4 d-inline-block shadow-lg border-0" style={{ borderRadius: '15px', backgroundColor: '#1A2235' }}>
                    <h4 className="fw-bold text-danger mb-3">⛔ QUYỀN TRUY CẬP BỊ TỪ CHỐI</h4>
                    <p className="text-white-50">Khu vực này dành riêng cho Quản trị viên hệ thống.</p>
                    <p className="text-white-50 small mb-4">Tài khoản khách hàng không được phép xem các thông tin này.</p>
                    <button onClick={() => window.history.back()} className="btn btn-outline-danger btn-sm px-4 rounded-pill">
                        Quay lại trang trước
                    </button>
                </div>
            </div>
        );
    }

    return (
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
                                                const matchedDetails = orderDetails.filter(d => d.orderId === order.id);
                                                const total = matchedDetails.reduce((sum, d) => sum + (d.quantity * d.unitPrice), 0);

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
    );
};

export default Admin;
