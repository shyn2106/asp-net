using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }

        // --- CREATE ---
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(CMS.Data.Entities.CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // --- EDIT ---
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var data = _context.CategoriesProducts.Find(id);
            if (data == null) return NotFound();
            return View(data);
        }

        [HttpPost]
        public IActionResult Edit(CMS.Data.Entities.CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(model);
        }

        // --- DELETE ---
        public IActionResult Delete(int id)
        {
            var data = _context.CategoriesProducts.Find(id);
            if (data != null)
            {
                _context.CategoriesProducts.Remove(data);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
    }
}