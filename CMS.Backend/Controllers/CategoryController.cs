//using CMS.Data.Entities;
//using Microsoft.AspNetCore.Mvc;
//using CMS.Data.Entities; // Kết nối tới lớp dữ liệu bạn vừa tạo
//namespace CMS.Backend.Controllers
//{
//    public class CategoryController : Controller
//    {
//        public IActionResult Index()
//        {
//            // Tạo danh sách dữ liệu mẫu trực tiếp trong code
//            var list = new List<Category> {
//            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
//            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
//        };
//            return View(list); // Gửi danh sách này sang giao diện
//        }
//    }

//}

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            // Lấy dữ liệu thật từ SQL Server
            var list = _context.Categories.ToList();

            return View(list);
        }
    }
}
