using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

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

        public class ForgotPasswordRequest
        {
            public string Email { get; set; }
        }

        public class ChangePasswordRequest
        {
            public int CustomerId { get; set; }
            public string OldPassword { get; set; }
            public string NewPassword { get; set; }
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

            var customers = _context.Customers
                .Where(c => c.Email.ToLower() == model.Email.ToLower())
                .ToList();

            if (!customers.Any())
            {
                return Unauthorized(new { message = "Email hoặc Mật khẩu không chính xác." });
            }

            foreach (var customer in customers)
            {
                bool isValid = false;
                if (!string.IsNullOrEmpty(customer.Password) && customer.Password.StartsWith("$2"))
                {
                    isValid = BCrypt.Net.BCrypt.Verify(model.Password, customer.Password);
                }
                else
                {
                    isValid = (customer.Password == model.Password);
                    if (isValid)
                    {
                        customer.Password = BCrypt.Net.BCrypt.HashPassword(model.Password);
                        _context.SaveChanges();
                    }
                }

                if (isValid)
                {
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
            }

            return Unauthorized(new { message = "Email hoặc Mật khẩu không chính xác." });
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

            // Tạo mới (Mã hoá mật khẩu)
            var newCustomer = new Customer
            {
                FullName = model.FullName,
                Email = model.Email,
                Phone = model.Phone,
                Address = model.Address,
                Password = BCrypt.Net.BCrypt.HashPassword(model.Password)
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

        // =========================
        // FORGOT PASSWORD
        // =========================
        [HttpPost("ForgotPassword")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest model)
        {
            if (string.IsNullOrEmpty(model.Email))
            {
                return BadRequest(new { message = "Vui lòng nhập Email." });
            }

            var customer = _context.Customers.FirstOrDefault(c => c.Email.ToLower() == model.Email.ToLower());
            if (customer == null)
            {
                return BadRequest(new { message = "Không tìm thấy tài khoản với Email này." });
            }

            // Tạo mật khẩu ngẫu nhiên mới (8 ký tự)
            string newPassword = "GZ_" + Guid.NewGuid().ToString().Substring(0, 6).ToUpper();

            // Cập nhật Database
            customer.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
            _context.SaveChanges();

            // Cấu hình gửi mail qua SMTP của Gmail
            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("phucp8110@gmail.com", "vpzo zztn xvqy azxb"), // <-- Sinh viên thay bằng Email & App Password thật
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("duan.gzone@gmail.com", "G-ZONE Tech"),
                    Subject = "Khôi phục mật khẩu tài khoản G-ZONE",
                    Body = $@"
                        <div style='font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; border-radius: 10px;'>
                            <h2 style='color: #06b6d4;'>Xin chào {customer.FullName},</h2>
                            <p>Hệ thống đã nhận được yêu cầu khôi phục mật khẩu từ bạn.</p>
                            <p>Mật khẩu mới của bạn là: <strong style='color: #FF3B5C; font-size: 18px;'>{newPassword}</strong></p>
                            <p>Vui lòng đăng nhập bằng mật khẩu này và đổi lại mật khẩu mới để đảm bảo an toàn.</p>
                            <hr/>
                            <p style='color: #777; font-size: 12px;'>Đây là email tự động từ hệ thống G-ZONE, vui lòng không trả lời.</p>
                        </div>
                    ",
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(customer.Email);
                await smtpClient.SendMailAsync(mailMessage);

                return Ok(new { message = "Mật khẩu mới đã được gửi đến Email của bạn. Vui lòng kiểm tra hộp thư." });
            }
            catch (Exception ex)
            {
                // Nếu lỗi do sai thông tin đăng nhập SMTP, log lại và báo lỗi thân thiện.
                Console.WriteLine($"[SMTP ERROR] {ex.Message}");
                return Ok(new { 
                    message = "Đã đổi mật khẩu thành công nhưng quá trình gửi Email thất bại (Do chưa cấu hình SMTP).", 
                    temporaryPassword = newPassword // Trả về cho mục đích debug/đồ án khi chưa có mail thật
                });
            }
        }
        // =========================
        // CHANGE PASSWORD
        // =========================
        [HttpPost("ChangePassword")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequest model)
        {
            if (model.CustomerId <= 0 || string.IsNullOrEmpty(model.OldPassword) || string.IsNullOrEmpty(model.NewPassword))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin." });
            }

            var customer = _context.Customers.FirstOrDefault(c => c.Id == model.CustomerId);
            if (customer == null)
            {
                return NotFound(new { message = "Không tìm thấy khách hàng." });
            }

            // Verify old password
            bool isValid = false;
            if (!string.IsNullOrEmpty(customer.Password) && customer.Password.StartsWith("$2"))
            {
                isValid = BCrypt.Net.BCrypt.Verify(model.OldPassword, customer.Password);
            }
            else
            {
                isValid = (customer.Password == model.OldPassword);
            }

            if (!isValid)
            {
                return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
            }

            // Update new password
            customer.Password = BCrypt.Net.BCrypt.HashPassword(model.NewPassword);
            _context.SaveChanges();

            return Ok(new { message = "Đổi mật khẩu thành công!" });
        }
    }
}
