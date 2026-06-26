using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách đơn hàng
        public IActionResult Index()
        {
            var orders = _context.Orders.OrderByDescending(o => o.OrderDate).ToList();

            return View(orders);
        }

        // Xem chi tiết đơn hàng
        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails!)
                .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == id);

            if (order == null)
            {
                return NotFound();
            }

            return View(order);
        }

        // Thay đổi trạng thái đơn hàng
        [HttpPost]
        public IActionResult UpdateStatus(int id, int status)
        {
            var order = _context.Orders.Include(o => o.OrderDetails).FirstOrDefault(o => o.Id == id);
            if (order != null)
            {
                // Nếu đổi sang trạng thái Hủy (3) và trạng thái cũ khác Hủy
                if (status == 3 && order.Status != 3)
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
                // (Tùy chọn) Nếu đang từ Hủy (3) đổi về trạng thái khác, trừ lại kho
                else if (order.Status == 3 && status != 3)
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

                order.Status = status;
                _context.SaveChanges();
            }
            return RedirectToAction("Details", new { id = id });
        }

        // Xóa đơn hàng
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }

        // Đánh dấu sản phẩm bị hư / không khả dụng
        [HttpPost]
        public IActionResult UpdateDefectiveItems(int orderId, List<int> defectiveItemIds)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(od => od.Product)
                .FirstOrDefault(o => o.Id == orderId);

            if (order == null)
            {
                return NotFound();
            }

            if (defectiveItemIds != null && defectiveItemIds.Any())
            {
                decimal totalRefund = 0;
                var deletedProductNames = new List<string>();

                foreach (var detailId in defectiveItemIds)
                {
                    var detail = order.OrderDetails?.FirstOrDefault(d => d.Id == detailId);
                    if (detail != null)
                    {
                        var product = detail.Product;
                        if (product != null)
                        {
                            // Hoàn lại số lượng kho
                            product.StockQuantity += detail.Quantity;
                            var lineTotal = detail.Quantity * detail.UnitPrice;
                            deletedProductNames.Add($"[{product.Name} - Số lượng: {detail.Quantity} - Đơn giá: {detail.UnitPrice:N0} ₫ - Thành tiền: {lineTotal:N0} ₫]");
                        }

                        totalRefund += detail.Quantity * detail.UnitPrice;
                        _context.OrderDetails.Remove(detail);
                    }
                }

                // Xử lý tiền tệ
                if (order.PaymentMethod == 1) // Online
                {
                    order.RefundAmount += totalRefund;
                    order.RefundStatus = 1; // Đang hoàn tiền
                }

                _context.SaveChanges();

                // Tính tổng tiền mới của đơn hàng
                var remainingTotal = _context.OrderDetails
                    .Where(od => od.OrderId == order.Id)
                    .Sum(od => od.Quantity * od.UnitPrice);

                // Ghi nhận vào bảng Notification cho khách hàng
                string message = $"Có sản phẩm bị loại bỏ khỏi đơn hàng #{order.Id} do hết hàng/hư hỏng: {string.Join(", ", deletedProductNames)}. Tổng tiền mới: {remainingTotal:N0} ₫.";
                if (order.PaymentMethod == 1)
                {
                    message += $" Số tiền {totalRefund:N0} ₫ đang được hoàn lại vào tài khoản thanh toán của bạn.";
                }
                else
                {
                    message += $" Số tiền bạn cần thanh toán (COD) khi nhận hàng đã được cập nhật lại.";
                }

                var notification = new CMS.Data.Entities.Notification
                {
                    CustomerId = order.CustomerId,
                    Message = message,
                    CreatedAt = DateTime.Now,
                    IsRead = false
                };
                _context.Notifications.Add(notification);
                _context.SaveChanges();

                TempData["SuccessMessage"] = "Đã đánh dấu lỗi thành công và thông báo cho khách: " + message;
            }

            return RedirectToAction("Details", new { id = orderId });
        }

        // Xóa riêng một sản phẩm khỏi đơn hàng
        [HttpPost]
        public IActionResult RemoveItem(int orderId, int productId)
        {
            var orderDetail = _context.OrderDetails.FirstOrDefault(od => od.OrderId == orderId && od.ProductId == productId);
            if (orderDetail != null)
            {
                var product = _context.Products.Find(productId);
                if (product != null)
                {
                    // Hoàn lại số lượng kho
                    product.StockQuantity += orderDetail.Quantity;
                }

                _context.OrderDetails.Remove(orderDetail);
                _context.SaveChanges();
            }
            return RedirectToAction("Details", new { id = orderId });
        }
    }
}