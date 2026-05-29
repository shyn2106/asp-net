using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= INDEX =================

        // Danh sách người dùng
        public IActionResult Index()
        {
            var userList = _context.Users.ToList();

            return View(userList);
        }

        // ================= CREATE =================

        // GET: Hiển thị form thêm mới
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Lưu user mới
        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra username đã tồn tại chưa
            var checkExist = _context.Users
                .Any(u => u.Username == model.Username);

            if (checkExist)
            {
                ModelState.AddModelError(
                    "Username",
                    "Tên đăng nhập đã tồn tại!"
                );

                return View(model);
            }

            // Lưu xuống database
            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= EDIT =================

        // GET: Hiển thị form sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
            {
                return NotFound();
            }

            return View(user);
        }

        // POST: Cập nhật dữ liệu
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            // Lấy user cũ
            var existingUser = _context.Users
                .AsNoTracking()
                .FirstOrDefault(u => u.Id == model.Id);

            if (existingUser == null)
            {
                return NotFound();
            }

            // Nếu có nhập mật khẩu mới
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword;
            }
            else
            {
                // Giữ mật khẩu cũ
                model.PasswordHash = existingUser.PasswordHash;
            }

            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= DELETE =================

        [HttpGet]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);

            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}