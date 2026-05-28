using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách người dùng
        public IActionResult Index()
        {
            // Lấy dữ liệu thật từ database
            var userList = _context.Users.ToList();

            return View(userList);
        }
    }
}