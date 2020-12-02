using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VesicleManagementSystem.Model;
using VesicleManagementSystem.Persistance;

namespace VesicleManagementSystem.Controllers
{
    [Authorize]
    [Route("/api/owners")]
    public class OwnersController : Controller
    {
        public VesicleDbContext _context { get; set; }
        public OwnersController(VesicleDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Owners.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context.Owners.SingleOrDefaultAsync(o => o.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Owner owner)
        {
            if (ModelState.IsValid)
            {
                await _context.Owners.AddAsync(owner);
                await _context.SaveChangesAsync();

                return Ok(owner);
            }

            return BadRequest(owner);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Owner owner)
        {
            if (ModelState.IsValid)
            {
                var ownerDb = _context.Owners.Find(Id);

                if (ownerDb != null)
                {
                    // ownerDb.Image = owner.Image;
                    ownerDb.Name = owner.Name;
                    ownerDb.Phone = owner.Phone;

                    await _context.SaveChangesAsync();
                }

                return Ok(ownerDb);
            }

            return BadRequest(owner);
        }

        [HttpDelete("{id}")]
        public void delete(int Id)
        {
            var owner = _context.Owners.Find(Id);

            _context.Remove(owner);
            _context.SaveChangesAsync();
        }
    }
}