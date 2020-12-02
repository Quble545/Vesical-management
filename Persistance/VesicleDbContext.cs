using Microsoft.EntityFrameworkCore;
using VesicleManagementSystem.Model;

namespace VesicleManagementSystem.Persistance
{
    public class VesicleDbContext : DbContext
    {
        public DbSet<Owner> Owners { get; set; }
        public DbSet<Vesicle> Vesicles { get; set; }
        public DbSet<Tax> Taxes { get; set; }
        public DbSet<User> Users { get; set; }
        public VesicleDbContext(DbContextOptions<VesicleDbContext> options)
            : base(options)
        {

        }
    }
}