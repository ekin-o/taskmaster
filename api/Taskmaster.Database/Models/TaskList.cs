namespace Taskmaster.Database.Models
{
   public class TaskList
   {
      public int Id { get; set; }
      public string Name { get; set; }
      public bool Starred { get; set; }
      public bool Deleted { get; set; }
      public DateTime CreateTimestamp { get; set; }
      public DateTime? ModifyTimestamp { get; set; }
      public List<TaskItem> Tasks { get; set; }
      public int OwnerId { get; set; }

      public TaskList() {
         Name = string.Empty;
         Tasks = new List<TaskItem>();
      }
   }
}
