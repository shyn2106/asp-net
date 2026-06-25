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
    }
}