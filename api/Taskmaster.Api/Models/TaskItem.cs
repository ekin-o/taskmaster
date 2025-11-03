namespace Taskmaster.Api.Models
{
   public class TaskItem
   {
      public int Id { get; set; }
      public string Name { get; set; }
      public bool Done { get; set; }
      public bool Deleted { get; set; }
      public DateTime CreationTimestamp { get; set; }
      public DateTime? ModifyTimestamp { get; set; }
      public int ListId { get; set; }
      public bool Starred { get; set; }
      public DateTime? DueDate { get; set; }

      public TaskItem() 
      {
         Name = string.Empty;
      }
      public TaskItem(Database.Models.TaskItem task) 
      {
         Id = task.Id;
         Name = task.Name;
         Done = task.Done;
         Deleted = task.Deleted;
         ListId = task.ListId;
         Starred = task.Starred;
         DueDate = task.DueDate;
      }
   }
   public class NewTaskRequest
   {
      public required string Name { get; set; }
   }

   public class EdiTaskRequest
   {
      public required string Name { get; set; }
      public bool Starred { get; set; }
      public bool Done { get; set; }
      public DateTime? DueDate { get; set; }
   }
}
