namespace Taskmaster.Database.Models
{
   public class TaskItem
   {
      public int Id { get; set; }
      public string Name { get; set; }
      public bool Done { get; set; }
      public bool Deleted { get; set; }
      public bool Starred { get; set; }
      public DateTime? DueDate { get; set; }
      public DateTime CreateTimestamp { get; set; }
      public DateTime? ModifyTimestamp { get; set; }
      public int ListId { get; set; }
      public TaskList List { get; set; }

      public TaskItem() {
         Name = string.Empty;
         List = new TaskList();
      }
   }
}
