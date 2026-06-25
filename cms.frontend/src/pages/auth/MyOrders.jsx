import React from 'react';
import { Link } from 'react-router-dom';

function MyOrders() {
 
    return (
        <div className="my-orders-page flex-grow-1 d-flex flex-column">
            <div className="container my-4 flex-grow-1">
                <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '15px' }}>
                    {/* Tiêu đề bảng */}
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                        <h4 className="font-weight-bold m-0" style={{ color: '#005088' }}>
                            <i className="fas fa-history mr-2 text-info"></i>Lịch Sử Mua Hàng
                        </h4>
                        <span className="text-muted small">Tài khoản: <strong>họ tên khách hàng ở đây</strong></span>
                    </div>
                    <div>
                        <h5 className="text-muted small">Đơn hàng 1</h5>
                        <h5 className="text-muted small">Đơn hàng 2</h5>
                        <h5 className="text-muted small">Đơn hàng 3</h5>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default MyOrders;
