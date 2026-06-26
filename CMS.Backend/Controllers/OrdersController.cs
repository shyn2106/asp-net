using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using CMS.Backend.Services;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IEmailService _emailService;

        public OrdersController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        // =========================
        // GET ALL ORDERS
        // api/orders
        // =========================
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword,
            [FromQuery] int? status,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Orders.Include(o => o.Customer).AsQueryable();

            if (status.HasValue)
            {
                query = query.Where(o => o.Status == status.Value);
            }

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(o => (o.Notes != null && o.Notes.Contains(keyword)) || 
                                         (o.Customer != null && o.Customer.FullName.Contains(keyword)));
            }

            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query.OrderByDescending(o => o.OrderDate)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
                                   .Select(o => new
                                   {
                                       o.Id,
                                       o.OrderDate,
                                       o.Status,
                                       o.Notes,
                                       CustomerName = o.Customer.FullName
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

        // =========================
        // GET ORDER BY ID
        // api/orders/1
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Where(o => o.Id == id)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,

                    Customer = new
                    {
                        o.Customer.Id,
                        o.Customer.FullName,
                        o.Customer.Email,
                        o.Customer.Phone
                    }
                })
                .FirstOrDefault();

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng"
                });
            }

            return Ok(order);
        }

        // =========================
        // GET ORDERS BY CUSTOMER
        // api/orders/customer/1
        // =========================
        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomerId(int customerId)
        {
            var orders = _context.Orders
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.OrderDate)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    o.PaymentMethod,
                    o.RefundStatus,
                    o.RefundAmount,
                    OrderDetails = o.OrderDetails.Select(od => new
                    {
                        od.Id,
                        od.ProductId,
                        od.Quantity,
                        od.UnitPrice,
                        ProductName = od.Product.Name,
                        ProductImage = od.Product.ImageUrl
                    }).ToList()
                })
                .ToList();

            return Ok(orders);
        }

        // =========================
        // CREATE ORDER
        // =========================
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Order model)
        {
            model.OrderDate = DateTime.Now;

            _context.Orders.Add(model);
            await _context.SaveChangesAsync();

            // Gửi email cho khách hàng
            var customer = await _context.Customers.FindAsync(model.CustomerId);
            if (customer != null && !string.IsNullOrEmpty(customer.Email))
            {
                string subject = $"Xác nhận đơn hàng #{model.Id} từ Cửa Hàng Của Bạn";
                
                // Build product details
                var productLines = "";
                decimal total = 0;
                if (model.OrderDetails != null)
                {
                    foreach(var detail in model.OrderDetails)
                    {
                        var product = await _context.Products.FindAsync(detail.ProductId);
                        var productName = product?.Name ?? "Sản phẩm không xác định";
                        var lineTotal = detail.Quantity * detail.UnitPrice;
                        total += lineTotal;
                        productLines += $@"
                        <tr>
                            <td style='border: 1px solid #ddd; padding: 8px;'>{productName}</td>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: center;'>{detail.Quantity}</td>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: right;'>{detail.UnitPrice:N0} đ</td>
                            <td style='border: 1px solid #ddd; padding: 8px; text-align: right;'>{lineTotal:N0} đ</td>
                        </tr>";
                    }
                }

                string body = $@"
                    <h2>Cảm ơn bạn đã đặt hàng!</h2>
                    <p>Chào <strong>{customer.FullName}</strong>,</p>
                    <p>Đơn hàng <strong>#{model.Id}</strong> của bạn đã được tạo thành công vào lúc {model.OrderDate:dd/MM/yyyy HH:mm}.</p>
                    <p>Trạng thái thanh toán: {(model.PaymentMethod == 1 ? "Thanh toán Online" : "Thanh toán khi nhận hàng (COD)")}</p>
                    
                    <table style='border-collapse: collapse; width: 100%; margin-top: 20px; margin-bottom: 20px;'>
                        <thead>
                            <tr style='background-color: #f2f2f2;'>
                                <th style='border: 1px solid #ddd; padding: 8px; text-align: left;'>Sản phẩm</th>
                                <th style='border: 1px solid #ddd; padding: 8px; text-align: center;'>Số lượng</th>
                                <th style='border: 1px solid #ddd; padding: 8px; text-align: right;'>Đơn giá</th>
                                <th style='border: 1px solid #ddd; padding: 8px; text-align: right;'>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productLines}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan='3' style='border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;'>Tổng cộng:</td>
                                <td style='border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold; color: red;'>{total:N0} đ</td>
                            </tr>
                        </tfoot>
                    </table>

                    <p>Chúng tôi sẽ sớm xử lý và giao hàng cho bạn.</p>
                    <br>
                    <p>Trân trọng,<br>Đội ngũ Cửa Hàng Của Bạn</p>
                ";

                // Chạy ẩn việc gửi email để không làm chậm API
                _ = _emailService.SendEmailAsync(customer.Email, subject, body, isHtml: true);
            }

            return Ok(new
            {
                message = "Tạo đơn hàng thành công",
                orderId = model.Id
            });
        }

        // =========================
        // UPDATE ORDER
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Order model)
        {
            var order = _context.Orders.Include(o => o.OrderDetails).FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng"
                });
            }

            // Xử lý hoàn lại/trừ đi số lượng khi trạng thái đơn hàng bị Hủy
            if (model.Status == 3 && order.Status != 3)
            {
                if (order.OrderDetails != null)
                {
                    foreach (var detail in order.OrderDetails)
                    {
                        var product = _context.Products.Find(detail.ProductId);
                        if (product != null)
                        {
                            product.StockQuantity += detail.Quantity;
                        }
                    }
                }
            }
            else if (order.Status == 3 && model.Status != 3)
            {
                if (order.OrderDetails != null)
                {
                    foreach (var detail in order.OrderDetails)
                    {
                        var product = _context.Products.Find(detail.ProductId);
                        if (product != null)
                        {
                            product.StockQuantity -= detail.Quantity;
                        }
                    }
                }
            }

            order.Status = model.Status;
            order.Notes = model.Notes;
            order.CustomerId = model.CustomerId;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật đơn hàng thành công"
            });
        }

        // =========================
        // DELETE ORDER
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng"
                });
            }

            _context.Orders.Remove(order);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa đơn hàng thành công"
            });
        }
    }
}