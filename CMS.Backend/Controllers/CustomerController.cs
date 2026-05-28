using CMS.Data;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        // Inject DbContext
        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách khách hàng
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();

            return View(customers);
        }
    }
}