using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách chi tiết đơn hàng
        public IActionResult Index()
        {
            var orderDetails = _context.OrderDetails
                .Include(od => od.Product)
                .Include(od => od.Order)
                .ThenInclude(o => o.Customer)
                .ToList();

            return View(orderDetails);
        }

        // Xem chi tiết một dòng OrderDetail
        public IActionResult Details(int id)
        {
            var detail = _context.OrderDetails
                .Include(od => od.Product)
                .Include(od => od.Order)
                .ThenInclude(o => o.Customer)
                .FirstOrDefault(od => od.Id == id);

            if (detail == null)
            {
                return NotFound();
            }

            return View(detail);
        }

        // Xóa một chi tiết đơn hàng
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var orderDetail = _context.OrderDetails
                .Include(od => od.Product)
                .Include(od => od.Order)
                .FirstOrDefault(od => od.Id == id);

            if (orderDetail != null)
            {
                var order = orderDetail.Order;
                var product = orderDetail.Product;
                
                decimal totalRefund = orderDetail.Quantity * orderDetail.UnitPrice;
                var lineTotal = orderDetail.Quantity * orderDetail.UnitPrice;
                var productName = "Sản phẩm";

                if (product != null)
                {
                    // Hoàn lại số lượng kho
                    product.StockQuantity += orderDetail.Quantity;
                    productName = product.Name;
                }

                _context.OrderDetails.Remove(orderDetail);
                
                if (order != null)
                {
                    if (order.PaymentMethod == 1) // Online
                    {
                        order.RefundAmount += totalRefund;
                        order.RefundStatus = 1; // Đang hoàn tiền
                    }

                    _context.SaveChanges();

                    var remainingTotal = _context.OrderDetails
                        .Where(od => od.OrderId == order.Id)
                        .Sum(od => od.Quantity * od.UnitPrice);

                    string message = $"Có sản phẩm bị loại bỏ khỏi đơn hàng #{order.Id} do hết hàng/hư hỏng: [{productName} - Số lượng: {orderDetail.Quantity} - Đơn giá: {orderDetail.UnitPrice:N0} ₫ - Thành tiền: {lineTotal:N0} ₫]. Tổng tiền mới: {remainingTotal:N0} ₫.";
                    
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
                }
                else
                {
                    _context.SaveChanges();
                }
            }
            return RedirectToAction("Index");
        }
    }
}