using CMS.Data;
using Microsoft.AspNetCore.Mvc;

using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

using System.Security.Claims;

namespace CMS.Backend.Controllers
{
    public class AccountController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AccountController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // LOGIN GET
        // =========================
        [HttpGet]
        public IActionResult Login()
        {
            return View();
        }

        // =========================
        // LOGIN POST
        // =========================
        [HttpPost]
        public async Task<IActionResult> Login(string username, string password)
        {
            // Kiểm tra tài khoản
            var users = _context.Users
                .Where(u => u.Username == username)
                .ToList();

            foreach (var user in users)
            {
                bool isValid = false;
                if (!string.IsNullOrEmpty(user.PasswordHash) && user.PasswordHash.StartsWith("$2"))
                {
                    isValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
                }
                else
                {
                    isValid = (user.PasswordHash == password);
                    if (isValid)
                    {
                        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);
                        _context.SaveChanges();
                    }
                }

                if (isValid)
                {
                    // Tạo Claims
                    var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.Username),
                        new Claim(ClaimTypes.Role, user.Role),
                        new Claim("FullName", user.FullName)
                    };

                    // Identity
                    var claimsIdentity = new ClaimsIdentity(
                        claims,
                        CookieAuthenticationDefaults.AuthenticationScheme
                    );

                    // Login
                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity)
                    );

                    return RedirectToAction("Index", "Home");
                }
            }

            ViewBag.Error = "Sai tài khoản hoặc mật khẩu!";
            return View();
        }

        // =========================
        // LOGOUT
        // =========================
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            //return RedirectToAction("Login");
            // Quay về Home
            return RedirectToAction("Index", "Home");
        }

        // =========================
        // ACCESS DENIED
        // =========================
        [HttpGet]
        public IActionResult AccessDenied()
        {
            return View();
        }
    }
}