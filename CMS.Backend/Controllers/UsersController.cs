using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UsersController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/users
        [HttpGet]
        public async Task<IActionResult> GetAll(
            [FromQuery] string? keyword,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Users.AsQueryable();

            if (!string.IsNullOrEmpty(keyword))
            {
                query = query.Where(u => u.FullName.Contains(keyword) || u.Username.Contains(keyword));
            }

            int totalItems = await query.CountAsync();
            int totalPages = (int)Math.Ceiling(totalItems / (double)pageSize);

            var items = await query.OrderByDescending(u => u.Id)
                                   .Skip((page - 1) * pageSize)
                                   .Take(pageSize)
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

        // GET: api/users/1
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        // POST: api/users
        [HttpPost]
        public IActionResult Create(User model)
        {
            var checkExist = _context.Users
                .Any(x => x.Username == model.Username);

            if (checkExist)
            {
                return BadRequest(new
                {
                    message = "Tên đăng nhập đã tồn tại"
                });
            }

            model.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);
            _context.Users.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Thêm user thành công",
                id = model.Id
            });
        }

        // PUT: api/users/1
        [HttpPut("{id}")]
        public IActionResult Update(int id, User model)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound();

            user.FullName = model.FullName;
            user.Username = model.Username;
            if (!string.IsNullOrEmpty(model.PasswordHash) && !model.PasswordHash.StartsWith("$2"))
            {
                user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.PasswordHash);
            }
            else if (!string.IsNullOrEmpty(model.PasswordHash))
            {
                user.PasswordHash = model.PasswordHash;
            }
            user.Role = model.Role;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Cập nhật thành công"
            });
        }

        // DELETE: api/users/1
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);

            if (user == null)
                return NotFound();

            _context.Users.Remove(user);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Xóa thành công"
            });
        }
    }
}