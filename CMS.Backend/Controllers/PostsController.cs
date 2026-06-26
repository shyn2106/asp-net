using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;
using System;
using System.Threading.Tasks;

namespace CMS.Backend.Controllers
{
    // https://localhost:xxxx/api/posts
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. READ ALL - Lấy toàn bộ bài viết (Code của bạn)
        // ==========================================
        [HttpGet]
        public async Task<IActionResult> GetPosts(
            [FromQuery] string? keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Posts.Include(p => p.Category).AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(p => p.Title.Contains(keyword) || 
                                         (p.Content != null && p.Content.Contains(keyword)));
            }

            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query.OrderByDescending(p => p.CreatedDate)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .Select(p => new
                                   {
                                       p.Id,
                                       p.Title,
                                       p.Content,
                                       p.ImageUrl,
                                       p.CreatedDate,
                                       CategoryName = p.Category.Name
                                   })
                                   .ToListAsync();

            return Ok(new
            {
                items,
                totalPages,
                totalItems,
                currentPage = page,
                pageSize
            });
        }

        // ==========================================
        // 2. READ DETAIL - Lấy chi tiết bài viết (Code của bạn)
        // ==========================================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefault();

            if (post == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy bài viết này trong hệ thống"
                });
            }

            return Ok(post);
        }

        // ==========================================
        // 3. READ BY CATEGORY - Lấy bài viết theo danh mục (Code của bạn)
        // ==========================================
        [HttpGet("category/{categoryId}")]
        public IActionResult GetByCategory(int categoryId, [FromQuery] int page = 1, [FromQuery] int pageSize = 6)
        {
            var query = _context.Posts.Where(p => p.CategoryId == categoryId).AsQueryable();

            int totalItems = query.Count();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var posts = query
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content,
                    p.ImageUrl,
                    p.CreatedDate
                })
                .ToList();

            return Ok(new
            {
                data = posts,
                totalItems,
                totalPages,
                page,
                pageSize
            });
        }

        // ==========================================
        // 4. CREATE - Tạo bài viết mới (MỚI)
        // ==========================================
        [HttpPost]
        public IActionResult Create([FromBody] Post model)
        {
            if (model == null) return BadRequest(new { message = "Dữ liệu không hợp lệ" });

            // Gán ngày tạo tự động bằng giờ hệ thống
            model.CreatedDate = DateTime.Now;
            
            // Ép thuộc tính liên kết bằng null để tránh lỗi EF Core validation vòng
            model.Category = null; 

            _context.Posts.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Tạo bài viết thành công!",
                id = model.Id
            });
        }

        // ==========================================
        // 5. UPDATE - Cập nhật bài viết (MỚI)
        // ==========================================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Post model)
        {
            var existingPost = _context.Posts.Find(id);
            if (existingPost == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết để cập nhật" });
            }

            // Cập nhật các trường dữ liệu
            existingPost.Title = model.Title;
            existingPost.Content = model.Content;
            existingPost.ImageUrl = model.ImageUrl;
            existingPost.CategoryId = model.CategoryId;

            _context.SaveChanges();

            return Ok(new { message = "Cập nhật bài viết thành công!" });
        }

        // ==========================================
        // 6. DELETE - Xóa bài viết (MỚI)
        // ==========================================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null)
            {
                return NotFound(new { message = "Không tìm thấy bài viết để xóa" });
            }

            _context.Posts.Remove(post);
            _context.SaveChanges();

            return Ok(new { message = "Đã xóa bài viết thành công!" });
        }
    }
}
