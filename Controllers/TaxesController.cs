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
    [Route("/api/Taxes")]
    public class TaxesController : Controller
    {
        public VesicleDbContext _context { get; set; }
        public TaxesController(VesicleDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult> getAll()
        {
            return Ok(await _context.Taxes.Include(t => t.Vesicle).Include(t => t.Vesicle.Owner).ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult> getById(int Id)
        {
            return Ok(await _context.Taxes.Include(v => v.Vesicle).SingleOrDefaultAsync(o => o.Id == Id));
        }

        [HttpPost]
        public async Task<ActionResult> post([FromBody] Tax tax)
        {
            if (ModelState.IsValid)
            {
                tax.Date = DateTime.Now;
                await _context.Taxes.AddAsync(tax);
                await _context.SaveChangesAsync();

                return Ok(tax);
            }

            return BadRequest(tax);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> put(int Id, [FromBody] Tax tax)
        {
            if (ModelState.IsValid)
            {
                var taxDb = _context.Taxes.Find(Id);

                if (taxDb != null)
                {
                    taxDb.Amount = tax.Amount;
                    taxDb.Area = tax.Area;
                    taxDb.BookNo = tax.BookNo;
                    taxDb.VesicleId = tax.VesicleId;
                    taxDb.Date = DateTime.Now;

                    await _context.SaveChangesAsync();
                }

                return Ok(taxDb);
            }

            return BadRequest(tax);
        }

        [HttpDelete("{id}")]
        public void delete(int Id)
        {
            var tax = _context.Taxes.Find(Id);

            _context.Remove(tax);
            _context.SaveChangesAsync();
        }
    }
}