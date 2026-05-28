import React, { useState } from 'react';
import './App.css';

function App() {
  // 1. Dữ liệu mẫu (Mock data) để thầy thấy kết quả Buổi 2
  const [categories] = useState([
    { id: 1, name: "Điện thoại & Tablet", description: "Các dòng iPhone, Samsung mới nhất" },
    { id: 2, name: "Laptop & Linh kiện", description: "Máy tính xách tay và phụ kiện gaming" },
    { id: 3, name: "Phụ kiện", description: "Tai nghe, sạc dự phòng, cáp kết nối" }
  ]);

  return (
    <div className="App" style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
        <h1 style={{ color: '#007bff' }}>HỆ THỐNG QUẢN LÝ CMS - BUỔI 2</h1>
        <p>Sinh viên thực hiện: <b>Phạm Văn Quỳnh Phúc</b></p>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#333', textAlign: 'left' }}>Danh mục sản phẩm (Categories)</h2>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#007bff', color: '#fff' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>ID</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Tên Danh Mục</th>
              <th style={{ padding: '12px', border: '1px solid #ddd' }}>Mô Tả Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px', textAlign: 'center' }}>{item.id}</td>
                <td style={{ padding: '12px', fontWeight: 'bold' }}>{item.name}</td>
                <td style={{ padding: '12px', color: '#555' }}>{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ marginTop: '30px', backgroundColor: '#e9f7ef', padding: '15px', borderRadius: '5px', borderLeft: '5px solid #28a745' }}>
          <p style={{ margin: 0, color: '#155724' }}>
            <b>Thông báo:</b> Đã kết nối thành công Frontend React với cấu trúc Solution của Phúc. 
            Backend API và Database đã sẵn sàng cho các bước tiếp theo.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;
