using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách bài viết
        public IActionResult Index(int? id)
        {
            // Query gốc
            var query = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .AsQueryable();

            // Nếu có id thì lọc theo Category
            if (id.HasValue)
            {
                query = query.Where(p => p.CategoryId == id.Value);
            }

            // Lấy dữ liệu
            var posts = query.ToList();

            return View(posts);
        }

        // Chi tiết bài viết
        public IActionResult Details(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }
    }
}