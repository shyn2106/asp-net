# G-ZONE (PhucCMS) - Hệ thống Thương mại Điện tử và Quản trị Nội dung

Chào mừng bạn đến với mã nguồn của **G-ZONE (PhucCMS)**! Đây là một hệ thống Website thương mại điện tử kết hợp trang Blog tin tức, được xây dựng theo mô hình 3 lớp (3-tier architecture) kết hợp giữa **ASP.NET Core (Backend)** và **ReactJS (Frontend)**. 

Dự án được thiết kế với giao diện mang phong cách Cyberpunk/Neon hiện đại, cung cấp trải nghiệm mua sắm và đọc tin tức mượt mà cho người dùng, đồng thời tích hợp một hệ quản trị (Admin Panel) mạnh mẽ.

---

## 🚀 Các tính năng nổi bật (Features)

### 1. Phía Khách hàng (ReactJS Frontend)
*   **Giao diện Neon Độc đáo:** Giao diện tối màu (Dark mode) kết hợp các dải màu Neon nổi bật, tối ưu hóa trải nghiệm người dùng (UI/UX).
*   **Hệ thống Sản phẩm:** Hiển thị danh sách sản phẩm, lọc theo danh mục, phân trang, xem chi tiết sản phẩm và quản lý số lượng tồn kho (Stock Quantity).
*   **Giỏ hàng (Cart):** Giỏ hàng cập nhật theo thời gian thực (Real-time badge), lưu trữ trạng thái phiên bản mua sắm.
*   **Blog & Tin tức:** Trang xem tin tức công nghệ/review, hỗ trợ hiển thị bài viết được định dạng bằng HTML/CKEditor một cách chuẩn xác, mô tả và phân trang mượt mà.
*   **Xác thực người dùng:** Đăng ký, Đăng nhập, Quản lý Hồ sơ cá nhân (Profile), và chức năng **Đổi mật khẩu / Quên mật khẩu** chuyên nghiệp.
*   **Cấu hình Môi trường:** Tích hợp biến môi trường (`.env`) để linh hoạt thay đổi API Endpoint và Image URL.

### 2. Phía Quản trị (ASP.NET Core MVC & API Backend)
*   **Kiến trúc API First:** Cung cấp toàn bộ RESTful API cho phía Frontend thao tác dữ liệu.
*   **Quản trị MVC tích hợp:** Cung cấp bảng điều khiển Admin bằng ASP.NET Core MVC (Sử dụng Bootstrap) để quản lý Sản phẩm, Danh mục, Bài viết (có tích hợp trình soạn thảo văn bản phong phú CKEditor) và Quản lý người dùng.
*   **Xử lý Tệp (File Uploading):** Xử lý hình ảnh tải lên từ CKEditor và ảnh đại diện của sản phẩm/bài viết, trả về định dạng chuẩn.
*   **Bảo mật:** Mã hóa mật khẩu an toàn với thuật toán BCrypt. Cơ chế phân quyền xác thực đa lớp (Admin/Customer).

---

## 🛠 Tech Stack (Công nghệ sử dụng)

**Backend:**
*   **Framework:** .NET 8.0 SDK (ASP.NET Core Web API & MVC)
*   **ORM:** Entity Framework Core
*   **Database:** SQL Server (LocalDB hoặc Full version)
*   **Bảo mật:** BCrypt.Net (Mã hóa mật khẩu)

**Frontend:**
*   **Library:** React.js (phiên bản v18+)
*   **Routing:** React Router v6
*   **Styling:** Vanilla CSS, Bootstrap 5, Bootstrap Icons
*   **HTTP Client:** Axios (đã cấu hình Interceptor)

---

## 📁 Cấu trúc thư mục dự án

Dự án được chia thành 3 phân vùng (Project) độc lập trong 1 Solution để tối ưu hóa việc mở rộng:

```text
PhucCMS_Solution/
├── CMS.Data/              # 🗄️ Tầng Dữ liệu: Chứa DbContext, Entities, Migrations (Code-first)
├── CMS.Backend/           # ⚙️ Tầng Backend: Chứa API Controllers, MVC Views cho Admin, Xử lý logic
├── cms.frontend/          # 💻 Tầng Frontend: Ứng dụng ReactJS cho Khách hàng
└── PhucCMS_Solution.sln   # 📦 File Solution tổng hợp
```

---

## ⚙️ Hướng dẫn Cài đặt & Khởi chạy (Local Development)

### Yêu cầu hệ thống:
- **.NET SDK 8.0**
- **Node.js** (Phiên bản v16 trở lên, khuyến nghị v18 LTS)
- **SQL Server** (Hoặc SQL Server Express / LocalDB)

### Bước 1: Cấu hình và chạy Backend
1. Mở Terminal / Command Prompt và di chuyển vào thư mục Backend:
   ```bash
   cd CMS.Backend
   ```
2. Mở file `appsettings.json` trong thư mục `CMS.Backend` và kiểm tra lại chuỗi kết nối `DefaultConnection` sao cho trỏ đúng tới SQL Server của bạn.
3. Cập nhật Database bằng công cụ Entity Framework (EF) Core CLI:
   ```bash
   dotnet ef database update --project ../CMS.Data
   ```
4. Khởi động Backend Server:
   ```bash
   dotnet run
   ```
   > **Lưu ý:** Server sẽ chạy ở cổng HTTPS `7226` (Ví dụ: `https://localhost:7226`). Đảm bảo bạn cho phép (Accept) chứng chỉ SSL tự ký của .NET nếu trình duyệt yêu cầu.

### Bước 2: Cấu hình và chạy Frontend (ReactJS)
1. Mở một Terminal mới và di chuyển vào thư mục Frontend:
   ```bash
   cd cms.frontend
   ```
2. Cài đặt các gói thư viện (Dependencies):
   ```bash
   npm install
   ```
3. Khởi tạo cấu hình kết nối Backend: Tạo file `.env` tại thư mục gốc của `cms.frontend` (nếu chưa có) và khai báo:
   ```env
   REACT_APP_API_URL=https://localhost:7226/api
   REACT_APP_IMAGE_BASE_URL=https://localhost:7226
   ```
4. Chạy ứng dụng ReactJS:
   ```bash
   npm start
   ```
   > Ứng dụng sẽ tự động mở trên trình duyệt tại `http://localhost:3000`.

---

## 📝 Thông tin Tác giả
* **Sinh viên:** Phạm Văn Quỳnh Phúc
* **MSSV:** 2123110202
* **Lớp:** CCQ2311F

Cảm ơn bạn đã xem qua dự án! Nếu có bất kỳ câu hỏi hoặc góp ý nào, đừng ngần ngại trao đổi.
