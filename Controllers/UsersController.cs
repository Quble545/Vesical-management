using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VesicleManagementSystem.Persistance;
using VesicleManagementSystem.Model;
using Microsoft.AspNetCore.Authorization;

namespace VesicleManagementSystem.Controllers
{
    [Authorize]
    [Route("/api/users")]
    public class UsersController : Controller
    {
        private VesicleDbContext _context { get; set; }

        public UsersController(VesicleDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Users.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context.Users.SingleOrDefaultAsync(b => b.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] User user)
        {
            var userDb = await _context.Users.SingleOrDefaultAsync(u => u.Username == user.Username);

            if (userDb == null)
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();

                return Ok(user);
            }

            return BadRequest("username already exist!.");
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] User user)
        {
            var userDb = await _context.Users.SingleOrDefaultAsync(b => b.Id == Id);

            if (userDb != null)
            {
                userDb.Username = user.Username;
                userDb.Name = user.Name;
                userDb.Password = user.Password;

                await _context.SaveChangesAsync();
            }

            return Ok(userDb);
        }

        [HttpDelete("{id}")]
        public void delete(int Id)
        {
            var user = _context.Users.Find(Id);

            _context.Remove(user);
            _context.SaveChanges();
        }
    }
}