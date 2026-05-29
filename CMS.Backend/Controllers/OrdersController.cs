using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL ORDERS
        // api/orders
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,

                    CustomerName = o.Customer.FullName
                })
                .ToList();

            return Ok(orders);
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
        // CREATE ORDER
        // =========================
        [HttpPost]
        public IActionResult Create([FromBody] Order model)
        {
            model.OrderDate = DateTime.Now;

            _context.Orders.Add(model);

            _context.SaveChanges();

            return Ok(new
            {
                message = "Tạo đơn hàng thành công"
            });
        }

        // =========================
        // UPDATE ORDER
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Order model)
        {
            var order = _context.Orders.Find(id);

            if (order == null)
            {
                return NotFound(new
                {
                    message = "Không tìm thấy đơn hàng"
                });
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