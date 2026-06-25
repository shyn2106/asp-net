
using CMS.Data;
using CMS.Data.Entities; // Thay thế bằng Namespace chứa Class OrderDetail của bạn
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. READ ALL (Lấy toàn bộ - Code của bạn)
        // ==========================================
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.OrderDetails
                .Include(x => x.Product)
                .Include(x => x.Order)
                .Select(x => new
                {
                    x.Id,
                    x.Quantity,
                    x.UnitPrice,
                    ProductName = x.Product.Name,
                    x.OrderId
                })
                .ToList();

            return Ok(data);
        }

        // ==========================================
        // 2. READ BY ID (Lấy chi tiết theo ID)
        // ==========================================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var item = _context.OrderDetails
                .Include(x => x.Product)
                .Where(x => x.Id == id)
                .Select(x => new
                {
                    x.Id,
                    x.Quantity,
                    x.UnitPrice,
                    ProductName = x.Product.Name,
                    x.OrderId,
                    x.ProductId
                })
                .FirstOrDefault();

            if (item == null)
            {
                return NotFound(new { message = $"Không tìm thấy chi tiết đơn hàng có ID {id}" });
            }

            return Ok(item);
        }

        // ==========================================
        // 3. CREATE (Thêm mới sản phẩm vào đơn hàng)
        // ==========================================
        [HttpPost]
        public IActionResult Create([FromBody] OrderDetail model)
        {
            if (model == null) return BadRequest(new { message = "Dữ liệu gửi lên không hợp lệ." });
            if (model.Quantity <= 0) return BadRequest(new { message = "Số lượng phải lớn hơn 0." });

            var product = _context.Products.Find(model.ProductId);
            if (product == null) return NotFound(new { message = "Sản phẩm không tồn tại." });

            if (product.StockQuantity < model.Quantity)
            {
                return BadRequest(new { message = $"Sản phẩm {product.Name} không đủ số lượng trong kho." });
            }

            product.StockQuantity -= model.Quantity;

            // Tránh lỗi EF Core hiểu lầm tạo mới Object liên quan
            model.Order = null;
            model.Product = null;

            _context.OrderDetails.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm sản phẩm vào đơn hàng thành công!",
                id = model.Id
            });
        }

        // ==========================================
        // 4. UPDATE (Cập nhật số lượng hoặc giá)
        // ==========================================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] OrderDetail model)
        {
            var existingItem = _context.OrderDetails.Find(id);
            if (existingItem == null)
            {
                return NotFound(new { message = $"Không tìm thấy dữ liệu để cập nhật." });
            }

            if (model.Quantity <= 0) return BadRequest(new { message = "Số lượng phải lớn hơn 0." });

            // Cập nhật các trường cần thiết
            existingItem.Quantity = model.Quantity;
            existingItem.UnitPrice = model.UnitPrice;
            existingItem.ProductId = model.ProductId; // Nếu muốn đổi sản phẩm khác

            _context.SaveChanges();

            return Ok(new { message = "Cập nhật chi tiết đơn hàng thành công!" });
        }

        // ==========================================
        // 5. DELETE (Xóa sản phẩm khỏi đơn hàng)
        // ==========================================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.OrderDetails.Find(id);
            if (item == null)
            {
                return NotFound(new { message = "Không tìm thấy dữ liệu để xóa." });
            }

            _context.OrderDetails.Remove(item);
            _context.SaveChanges();

            return Ok(new { message = "Đã xóa sản phẩm khỏi đơn hàng thành công!" });
        }
    }
}