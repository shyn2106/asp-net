using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize]
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH CATEGORY
        // =========================
        public IActionResult Index()
        {
            // Lấy dữ liệu thật từ SQL Server
            var list = _context.Categories.ToList();

            return View(list);
        }

        // =========================
        // GET: Category/Create
        // Hiển thị form nhập
        // =========================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // =========================
        // POST: Category/Create
        // Lưu dữ liệu vào SQL Server
        // =========================
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // Kiểm tra dữ liệu hợp lệ
            if (ModelState.IsValid)
            {
                // Đưa dữ liệu vào EF
                _context.Categories.Add(model);

                // Lưu xuống SQL Server
                _context.SaveChanges();

                // Quay về danh sách
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // =========================
        // DELETE CATEGORY
        // =========================
        [HttpGet]
        public IActionResult Delete(int id)
        {
            // Tìm category theo id
            var category = _context.Categories
                .FirstOrDefault(c => c.Id == id);

            // Nếu không tồn tại
            if (category == null)
            {
                return NotFound();
            }

            // Xóa dữ liệu
            _context.Categories.Remove(category);

            // Lưu xuống SQL Server
            _context.SaveChanges();

            // Quay về danh sách
            return RedirectToAction("Index");
        }

        // =========================
        // GET EDIT
        // Hiển thị dữ liệu cũ lên Form
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm category theo id
            var category = _context.Categories.Find(id);

            // Nếu không tồn tại
            if (category == null)
            {
                return NotFound();
            }

            // Đẩy dữ liệu sang View
            return View(category);
        }

        // =========================
        // POST EDIT
        // Cập nhật dữ liệu mới
        // =========================
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            // Kiểm tra dữ liệu
            if (ModelState.IsValid)
            {
                // Update dữ liệu
                _context.Categories.Update(model);

                // Lưu xuống SQL Server
                _context.SaveChanges();

                // Quay về danh sách
                return RedirectToAction("Index");
            }

            return View(model);
        }
    }
}