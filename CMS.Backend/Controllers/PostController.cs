using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize] // Bắt buộc đăng nhập
    public class PostController : Controller
    {
        private readonly ApplicationDbContext _context;

        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH BÀI VIẾT
        // =========================
        public IActionResult Index()
        {
            var posts = _context.Posts
                .Include(p => p.Category)
                .OrderByDescending(p => p.CreatedDate)
                .ToList();

            return View(posts);
        }

        // =========================
        // CHI TIẾT
        // =========================
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

        // =========================
        // CREATE GET
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList =
                new SelectList(_context.Categories, "Id", "Name");

            return View();
        }

        // =========================
        // CREATE POST
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            // Upload ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }

            _context.Posts.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // DELETE
        // =========================
        [Authorize(Roles = "Admin")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                _context.Posts.Remove(post);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        // =========================
        // EDIT GET
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);

            if (post == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList =
                new SelectList(
                    _context.Categories,
                    "Id",
                    "Name",
                    post.CategoryId
                );

            return View(post);
        }

        // =========================
        // EDIT POST
        // =========================
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // giữ ảnh cũ
                var oldPost = _context.Posts
                    .AsNoTracking()
                    .FirstOrDefault(p => p.Id == model.Id);

                if (oldPost != null)
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }

            _context.Posts.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // =========================
        // UPLOAD IMAGE FOR CKEDITOR
        // =========================
        [HttpPost]
        public IActionResult UploadImageEditor(IFormFile upload)
        {
            if (upload != null && upload.Length > 0)
            {
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(upload.FileName);

                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    upload.CopyTo(stream);
                }

                // CKEditor 5 requires this JSON response format
                return Json(new
                {
                    uploaded = 1,
                    fileName = fileName,
                    url = "/uploads/" + fileName
                });
            }

            return Json(new
            {
                uploaded = 0,
                error = new { message = "Không thể tải ảnh lên." }
            });
        }
    }
}