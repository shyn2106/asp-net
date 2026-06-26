using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // api/products
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] int? categoryProductId,
            [FromQuery] decimal? minPrice,
            [FromQuery] decimal? maxPrice,
            [FromQuery] string? keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 12)
        {
            try
            {
                var query = _context.Products.Include(p => p.CategoryProduct).Where(p => !p.IsDeleted).AsQueryable();

                if (categoryProductId.HasValue)
                {
                    query = query.Where(p => p.CategoryProductId == categoryProductId.Value);
                }

                if (minPrice.HasValue)
                {
                    query = query.Where(p => p.Price >= minPrice.Value);
                }

                if (maxPrice.HasValue)
                {
                    query = query.Where(p => p.Price <= maxPrice.Value);
                }

                if (!string.IsNullOrEmpty(keyword))
                {
                    query = query.Where(p => p.Name.Contains(keyword.Trim()));
                }

                int totalItems = await query.CountAsync();
                int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

                var result = await query.OrderByDescending(p => p.Id)
                                        .Skip((page - 1) * pageSize)
                                        .Take(pageSize)
                                        .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                }).ToListAsync();

                return Ok(new
                {
                    data = result,
                    page = page,
                    pageSize = pageSize,
                    totalItems = totalItems,
                    totalPages = totalPages
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách sản phẩm", detail = ex.Message });
            }
        }

        // =========================
        // GET LATEST
        // api/products/latest
        // =========================
        [HttpGet("latest")]
        public async Task<IActionResult> GetLatestProducts()
        {
            try
            {
                var latestProducts = await _context.Products
                    .Include(p => p.CategoryProduct)
                    .Where(p => !p.IsDeleted)
                    .OrderByDescending(p => p.Id)
                    .Take(3)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        price = p.Price,
                        stockQuantity = p.StockQuantity,
                        imageUrl = p.ImageUrl,
                        description = p.Description,
                        categoryProductId = p.CategoryProductId,
                        categoryProductName = p.CategoryProduct != null ? p.CategoryProduct.Name : null,
                        isDeleted = p.IsDeleted
                    })
                    .ToListAsync();

                return Ok(latestProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách sản phẩm mới nhất", detail = ex.Message });
            }
        }

        // =========================
        // GET HOT
        // api/products/hot
        // =========================
        [HttpGet("hot")]
        public async Task<IActionResult> GetHotProducts()
        {
            try
            {
                var hotProducts = await _context.Products
                    .Include(p => p.CategoryProduct)
                    .Where(p => !p.IsDeleted)
                    .OrderByDescending(p => _context.OrderDetails
                        .Where(od => od.ProductId == p.Id)
                        .Sum(od => (int?)od.Quantity) ?? 0)
                    .Take(3)
                    .Select(p => new
                    {
                        id = p.Id,
                        name = p.Name,
                        price = p.Price,
                        stockQuantity = p.StockQuantity,
                        imageUrl = p.ImageUrl,
                        description = p.Description,
                        categoryProductId = p.CategoryProductId,
                        categoryProductName = p.CategoryProduct != null ? p.CategoryProduct.Name : null,
                        isDeleted = p.IsDeleted
                    })
                    .ToListAsync();

                return Ok(hotProducts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi khi lấy danh sách sản phẩm hot", detail = ex.Message });
            }
        }

        // =========================
        // GET DETAIL
        // api/products/1
        // =========================
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(int id)
        {
            var product = await _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Id == id && !p.IsDeleted)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Description,
                    p.Price,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                })
                .FirstOrDefaultAsync();

            if (product == null)
            {
                return NotFound(new { message = "Không tìm thấy sản phẩm này trong hệ thống" });
            }

            return Ok(product);
        }

        // =========================
        // CREATE
        // api/products
        // =========================
        [HttpPost]
        public IActionResult Create(Product model)
        {
            _context.Products.Add(model);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm sản phẩm thành công"
            });
        }

        // =========================
        // UPDATE
        // api/products/1
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, Product model)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            product.Name = model.Name;
            product.Description = model.Description;
            product.Price = model.Price;
            product.StockQuantity = model.StockQuantity;
            product.ImageUrl = model.ImageUrl;
            product.CategoryProductId = model.CategoryProductId;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công"
            });
        }

        // =========================
        // DELETE
        // api/products/1
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy sản phẩm"
                });
            }

            _context.Products.Remove(product);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }
    }
}