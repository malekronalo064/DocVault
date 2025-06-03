using Microsoft.EntityFrameworkCore;

namespace DocVault.Models
{
    public class DocVaultDbContext : DbContext
    {
        public DocVaultDbContext(DbContextOptions<DocVaultDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Document> Documents { get; set; }
        public DbSet<Folder> Folders { get; set; }
    } 
}