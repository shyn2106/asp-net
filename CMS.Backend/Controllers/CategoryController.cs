using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

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
            // BƯỚC 1:
            // Đưa dữ liệu vào bộ nhớ EF
            _context.Categories.Add(model);

            // BƯỚC 2:
            // Ghi thật xuống SQL Server
            _context.SaveChanges();

            // Quay về trang danh sách
            return RedirectToAction("Index");
        }
        // =========================
        // DELETE CATEGORY
        // =========================
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

            // BƯỚC 1:
            // Xóa khỏi bộ nhớ EF
            _context.Categories.Remove(category);

            // BƯỚC 2:
            // Ghi thay đổi xuống SQL Server
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
            // Cập nhật dữ liệu trong EF
            _context.Categories.Update(model);

            // Lưu xuống SQL Server
            _context.SaveChanges();

            // Quay về danh sách
            return RedirectToAction("Index");
        }
    }
}