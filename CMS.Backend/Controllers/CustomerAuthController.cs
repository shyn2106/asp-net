using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerAuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CustomerAuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        // =========================
        // LOGIN
        // =========================
        [HttpPost("Login")]
        public IActionResult Login([FromBody] LoginRequest model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ Email và Mật khẩu." });
            }

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email.ToLower() == model.Email.ToLower() && c.Password == model.Password);

            if (customer == null)
            {
                return Unauthorized(new { message = "Email hoặc Mật khẩu không chính xác." });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                customer = new 
                {
                    id = customer.Id,
                    fullName = customer.FullName,
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                }
            });
        }

        // =========================
        // REGISTER
        // =========================
        [HttpPost("Register")]
        public IActionResult Register([FromBody] Customer model)
        {
            if (string.IsNullOrEmpty(model.Email) || string.IsNullOrEmpty(model.Password) || string.IsNullOrEmpty(model.FullName))
            {
                return BadRequest(new { message = "Vui lòng điền đủ thông tin Tên, Email và Mật khẩu." });
            }

            // Kiểm tra email đã tồn tại
            var existingCustomer = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == model.Email.ToLower());
            if (existingCustomer != null)
            {
                return BadRequest(new { message = "Email này đã được đăng ký. Vui lòng sử dụng email khác hoặc đăng nhập." });
            }

            // Tạo mới (mật khẩu lưu thô theo yêu cầu)
            var newCustomer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                Address = model.Address,
                Password = model.Password
            };

            _context.Customers.Add(newCustomer);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Đăng ký thành công",
                customer = new
                {
                    id = newCustomer.Id,
                    fullName = newCustomer.FullName,
                    email = newCustomer.Email,
                    phone = newCustomer.Phone,
                    address = newCustomer.Address
                }
            });
        }
    }
}
