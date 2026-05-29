using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // api/categoriesproducts
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.CategoriesProducts
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .ToList();

            return Ok(data);
        }

        // =========================
        // GET DETAIL
        // api/categoriesproducts/1
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var item = _context.CategoriesProducts
                .Where(c => c.Id == id)
                .Select(c => new
                {
                    c.Id,
                    c.Name,
                    c.Description
                })
                .FirstOrDefault();

            if (item == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục"
                });
            }

            return Ok(item);
        }

        // =========================
        // CREATE
        // =========================
        [HttpPost]
        public IActionResult Create([FromBody] CategoryProduct model)
        {
            // tránh insert luôn products
            model.Products = null;

            _context.CategoriesProducts.Add(model);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm danh mục thành công"
            });
        }

        // =========================
        // UPDATE
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, CategoryProduct model)
        {
            var item = _context.CategoriesProducts.Find(id);

            if (item == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục"
                });
            }

            item.Name = model.Name;
            item.Description = model.Description;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công"
            });
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.CategoriesProducts.Find(id);

            if (item == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy danh mục"
                });
            }

            _context.CategoriesProducts.Remove(item);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }
    }
}