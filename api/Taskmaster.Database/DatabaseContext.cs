using Taskmaster.Database.Models;
using Microsoft.EntityFrameworkCore;

namespace Taskmaster.Database
{
   public class DatabaseContext : DbContext
   {
      public DbSet<TaskList> Lists { get; set; }
      public DbSet<TaskItem> Tasks { get; set; }
      public DbSet<User> Users { get; set; }
      public DbSet<Authentication> Authentication { get; set; }

      public DatabaseContext(DbContextOptions<DatabaseContext> options)
       : base(options) { }
   }
}
