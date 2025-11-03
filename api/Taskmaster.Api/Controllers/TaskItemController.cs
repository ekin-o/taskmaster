using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using Taskmaster.Api.Models;
using Taskmaster.Api.Source;
using Taskmaster.Database;

namespace Taskmaster.Api.Controllers
{
   [ApiController]
   [Route("api/v1/lists/{listId}/tasks")]
   [Authorize]
   public class TaskItemController : ControllerBase
   {
      private readonly DatabaseContext _dbContext;
      private readonly ILogger<TaskItemController> _logger;

      public TaskItemController(DatabaseContext dbcontext, ILogger<TaskItemController> logger)
      {
         _dbContext = dbcontext ?? throw new ArgumentNullException(nameof(dbcontext));
         _logger = logger ?? throw new ArgumentNullException(nameof(logger));
      }

      [HttpGet]
      [ProducesResponseType(200)]
      [ProducesResponseType(404)]
      public ActionResult<IEnumerable<TaskItem>> ListAll(int listId)
      {
         if (listId < 1)
         {
            return NotFound();
         }
         var list = _dbContext.Lists.Include(x => x.Tasks).FirstOrDefault(x => x.Id == listId && x.OwnerId == User.Id());
         if (list == null)
         {
            return NotFound();
         }
         return Ok(list.Tasks.Where(x => !x.Deleted)
         .OrderBy(x => x.Done).ThenByDescending(x => x.Starred).ThenByDescending(x => x.CreateTimestamp)
         .Select(x => new Models.TaskItem(x)));
      }

      [HttpPost]
      [ProducesResponseType(200)]
      [ProducesResponseType(400)]
      public ActionResult<Models.TaskItem> AddTask(int listId, [FromBody] NewTaskRequest request)
      {
         if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest();
         var list = _dbContext.Lists.FirstOrDefault(x => x.Id == listId && x.OwnerId == User.Id());
         if (list == null)
            return BadRequest();
         var newTask = new Database.Models.TaskItem() { Name = request.Name, ListId = listId, List = list };
         try{
            _dbContext.Tasks.Add(newTask);
            _dbContext.SaveChanges();
         }
         catch (Exception ex)
         {
            _logger.LogError($"Error adding task to list {listId}. User {User.Id()}. Exception: {ex.Message}");
            return BadRequest();
         }

         return Ok(new Models.TaskItem(newTask));
      }

      [HttpPut("{id}")]
      [ProducesResponseType(200)]
      [ProducesResponseType(400)]
      [ProducesResponseType(404)]
      public ActionResult EditTask(int listId, int id, [FromBody] EdiTaskRequest request)
      {
         var task = _dbContext.Tasks.Include(x => x.List).FirstOrDefault(x => x.ListId == listId && x.Id == id && x.List.OwnerId == User.Id());
         if (task == null)
         {
            return NotFound();
         }
         task.Name = request.Name;
         task.Done = request.Done;
         task.Starred = request.Starred;
         task.DueDate = request.DueDate;
         task.ModifyTimestamp = DateTime.UtcNow;
         try{
            _dbContext.Tasks.Update(task);
            _dbContext.SaveChanges();
         }
         catch (Exception ex)
         {
            _logger.LogError($"Error updating task {task.Id}. User {User.Id()}. Exception: {ex.Message}");
            return BadRequest();
         }

         return Ok();
      }

      [HttpDelete("{id}")]
      [ProducesResponseType(200)]
      [ProducesResponseType(400)]
      [ProducesResponseType(404)]
      public ActionResult Delete(int listId, int id)
      {
         var task = _dbContext.Tasks.Include(x => x.List).FirstOrDefault(x => x.ListId == listId && x.Id == id && x.List.OwnerId == User.Id());
         if (task == null)
         {
            return NotFound();
         }

         task.Deleted = true;
         task.ModifyTimestamp = DateTime.UtcNow;
         try
         {
            _dbContext.Tasks.Update(task);
            _dbContext.SaveChanges();
         }
         catch (Exception ex)
         {
            _logger.LogError($"Error deleting task {task.Id}. User {User.Id()}. Exception: {ex.Message}");
            return BadRequest();
         }
         return Ok();
      }
   }
}
