using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;
using System;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NotificationsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomer(int customerId)
        {
            var notifications = _context.Notifications
                .Where(n => n.CustomerId == customerId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new
                {
                    n.Id,
                    n.Message,
                    n.CreatedAt,
                    n.IsRead
                })
                .ToList();
            return Ok(notifications);
        }

        [HttpPost("{id}/read")]
        public IActionResult MarkAsRead(int id)
        {
            var notification = _context.Notifications.Find(id);
            if (notification != null)
            {
                notification.IsRead = true;
                _context.SaveChanges();
            }
            return Ok();
        }
    }
}
