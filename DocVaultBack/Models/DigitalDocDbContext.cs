using Microsoft.EntityFrameworkCore;

namespace DigitalDoc.Models
{
    public class DigitalDocDbContext : DbContext
    {
        public DigitalDocDbContext(DbContextOptions<DigitalDocDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Folder> Folders { get; set; }
    } 
}