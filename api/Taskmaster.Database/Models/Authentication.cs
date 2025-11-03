namespace Taskmaster.Database.Models
{
   public class Authentication
   {
      public int Id { get; set; }
      public required string Salt { get; set; }
      public required string Hash { get; set; }
      public int UserId { get; set; }
      public required User User { get; set; }
   }
}
