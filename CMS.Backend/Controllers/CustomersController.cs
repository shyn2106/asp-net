using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // api/customers
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var customers = _context.Customers.ToList();

            return Ok(customers);
        }

        // =========================
        // GET BY ID
        // api/customers/1
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy khách hàng"
                });
            }

            return Ok(customer);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public IActionResult Create([FromBody] Customer model)
        {
            _context.Customers.Add(model);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm khách hàng thành công"
            });
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Customer model)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy khách hàng"
                });
            }

            customer.FullName = model.FullName;
            customer.Email = model.Email;
            customer.Phone = model.Phone;
            customer.Address = model.Address;
            customer.Password = model.Password;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công"
            });
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var customer = _context.Customers.Find(id);

            if (customer == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy khách hàng"
                });
            }

            _context.Customers.Remove(customer);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }

        /// <summary>
        /// API Endpoint 1: POST api/Customers/register
        /// Tiếp nhận gói tin từ Form Đăng ký (Register.jsx)
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] CustomerRegisterDto model)
        {
            // Kiểm tra tính hợp lệ dữ liệu đầu vào tối giản
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.FullName))
            {
                return BadRequest(new { message = "Vui lòng điền đầy đủ các thông tin bắt buộc!" });
            }

            try
            {
                // Kiểm tra trùng lặp tài khoản Email (chuyển về chữ thường để so khớp chính xác)
                var isEmailExist = _context.Customers
                    .Any(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower());
                
                if (isEmailExist)
                {
                    return BadRequest(new { message = "Email này đã được đăng ký trên hệ thống ThaiCMS!" });
                }

                // KHỞI TẠO THỰC THỂ KHỚP 100% CẤU TRÚC ĐƠN GIẢN CỦA THẦY
                var newCustomer = new Customer
                {
                    FullName = model.FullName,
                    Email = model.Email.Trim(),
                    Phone = model.Phone,
                    Address = model.Address,
                    Password = model.Password // Lưu mật khẩu thô theo đúng yêu cầu tối giản
                };

                // Lưu thực thể xuống SQL Server
                _context.Customers.Add(newCustomer);
                _context.SaveChanges();

                return StatusCode(201, new { message = "Tạo tài khoản khách hàng thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống khi đăng ký: {ex.Message}");
            }
        }

        /// <summary>
        /// API Endpoint 2: POST api/Customers/login
        /// Xác thực thông tin từ Form Đăng nhập (Login.jsx)
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] CustomerLoginDto model)
        {
            if (model == null || string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Tài khoản và mật khẩu không được để trống!" });
            }

            try
            {
                // 1. KIỂM TRA TÀI KHOẢN TRONG BẢNG QUẢN TRỊ VIÊN (USERS) TRƯỚC
                var adminUser = _context.Users
                    .FirstOrDefault(u => u.Username.Trim().ToLower() == model.Email.Trim().ToLower() && u.PasswordHash == model.Password);

                if (adminUser != null)
                {
                    // Trả về phiên làm việc của Admin
                    return Ok(new
                    {
                        id = adminUser.Id,
                        fullName = adminUser.FullName,
                        email = adminUser.Username,
                        role = "admin" // Cấp quyền Admin
                    });
                }

                // 2. NẾU KHÔNG PHẢI ADMIN, KIỂM TRA TRONG BẢNG KHÁCH HÀNG (CUSTOMERS)
                var customer = _context.Customers
                    .FirstOrDefault(c => c.Email.Trim().ToLower() == model.Email.Trim().ToLower() && c.Password == model.Password);

                // Nếu không tìm thấy bản ghi nào khớp -> Từ chối xác thực
                if (customer == null)
                {
                    return Unauthorized(new { message = "Tài khoản hoặc mật khẩu không chính xác!" });
                }

                // Xác thực thành công -> Đóng gói dữ liệu sạch trả về cho FrontEnd lưu LocalStorage
                var customerSessionData = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    role = "customer" // Cấp quyền Khách hàng bình thường
                };

                return Ok(customerSessionData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống khi xác thực: {ex.Message}");
            }
        }

        // =========================
        // GET CUSTOMER STATS
        // api/customers/{id}/stats
        // =========================
        [HttpGet("{id}/stats")]
        public IActionResult GetCustomerStats(int id)
        {
            try
            {
                var totalOrders = _context.Orders.Count(o => o.CustomerId == id);
                
                var purchasedProducts = _context.OrderDetails
                    .Include(od => od.Order)
                    .Where(od => od.Order.CustomerId == id)
                    .Sum(od => (int?)od.Quantity) ?? 0;

                return Ok(new
                {
                    totalOrders = totalOrders,
                    favorites = 0, // Mock do chưa có bảng Favorites
                    rewardPoints = totalOrders * 50, // Mock điểm thưởng
                    purchasedProducts = purchasedProducts
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy thống kê khách hàng" });
            }
        }
        // =========================
        // UPDATE CUSTOMER PROFILE
        // api/customers/{id}/profile
        // =========================
        [HttpPut("{id}/profile")]
        public IActionResult UpdateProfile(int id, [FromBody] CustomerProfileUpdateDto model)
        {
            var customer = _context.Customers.Find(id);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng" });
            }

            // Chỉ cập nhật các thông tin không nhạy cảm
            if (!string.IsNullOrEmpty(model.FullName)) customer.FullName = model.FullName;
            customer.Phone = model.Phone;
            customer.Address = model.Address;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật hồ sơ thành công",
                customer = new
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address,
                    role = "customer"
                }
            });
        }
    }

    // ────────────────────────────────────────────────────────
    // ĐỊNH NGHĨA CÁC ĐỐI TƯỢNG VẬN CHUYỂN DỮ LIỆU ĐẦU VÀO (DTO)
    // ────────────────────────────────────────────────────────
    public class CustomerRegisterDto
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }
    }

    public class CustomerLoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class CustomerProfileUpdateDto
    {
        public string FullName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}