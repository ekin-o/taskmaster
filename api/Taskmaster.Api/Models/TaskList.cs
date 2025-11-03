namespace Taskmaster.Api.Models
{
   public class TaskList
   {
      public int Id { get; set; }
      public string Name { get; set; }
      public bool Starred { get; set; }
      public bool Deleted { get; set; }
      public List<TaskItem> Tasks { get; set; }
      public TaskList()
      {
         Name = string.Empty;
         Tasks = new List<TaskItem>();
      }

      public TaskList(Database.Models.TaskList dbList)
      {
         Id = dbList.Id;
         Name = dbList.Name;
         Starred = dbList.Starred;
         Deleted = dbList.Deleted;
         Tasks = new List<TaskItem>();
      }
      public class NewListRequest
      {
         public required string Name { get; set; }
      }

      public class EditListRequest
      {
         public required string Name { get; set; }
         public bool Starred { get; set; }
      }
   }
}
