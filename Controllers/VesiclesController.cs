using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VesicleManagementSystem.Model;
using VesicleManagementSystem.Persistance;

namespace VesicleManagementSystem.Controllers
{
    [Authorize]
    [Route("/api/vesicles")]
    public class VesiclesController : Controller
    {
        public VesicleDbContext _context { get; set; }
        public VesiclesController(VesicleDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Vesicles.Include(v => v.Owner).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context.Vesicles.Include(v => v.Owner).SingleOrDefaultAsync(o => o.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Vesicle vesicle)
        {
            if (ModelState.IsValid)
            {
                vesicle.Date = DateTime.Now;
                await _context.Vesicles.AddAsync(vesicle);
                await _context.SaveChangesAsync();
                vesicle.Owner = await _context.Owners.FirstAsync(o => o.Id == vesicle.OwnerId);


                return Ok(vesicle);
            }

            return BadRequest(vesicle);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Vesicle vesicle)
        {
            if (ModelState.IsValid)
            {
                var vesicleDb = await _context.Vesicles.FirstAsync(v => v.Id == Id);

                if (vesicleDb != null)
                {
                    vesicleDb.OwnerId = vesicle.OwnerId;
                    vesicleDb.PlateNo = vesicle.PlateNo;
                    vesicleDb.Hp = vesicle.Hp;
                    vesicleDb.Type = vesicle.Type;
                    vesicleDb.Date = DateTime.Now;
                    vesicleDb.Owner = await _context.Owners.FirstAsync(o => o.Id == vesicle.OwnerId);

                    await _context.SaveChangesAsync();
                }

                return Ok(vesicleDb);
            }

            return BadRequest(vesicle);
        }

        [HttpDelete("{id}")]
        public void delete(int Id)
        {
            var vesicle = _context.Vesicles.Find(Id);

            _context.Remove(vesicle);
            _context.SaveChangesAsync();
        }

    }
}