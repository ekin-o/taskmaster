using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Taskmaster.Api.Source;
using Taskmaster.Database;
using static Taskmaster.Api.Models.TaskList;

namespace Taskmaster.Api.Controllers
{
   [ApiController]
   [Route("api/v1/lists")]
   [Authorize]
   public class TaskListController : ControllerBase
   {
      private readonly DatabaseContext _dbContext;
      private readonly ILogger<TaskListController> _logger;

      public TaskListController(DatabaseContext dbcontext, ILogger<TaskListController> logger)
      {
         _dbContext = dbcontext ?? throw new ArgumentNullException(nameof(dbcontext));
         _logger = logger ?? throw new ArgumentNullException(nameof(logger));
      }

      [HttpGet]
      [ProducesResponseType(200)]
      public ActionResult<IEnumerable<Models.TaskList>> ListAll()
      {
         var lists = _dbContext.Lists.Where(x => x.OwnerId == User.Id() && !x.Deleted)
         .OrderByDescending(x => x.Starred).ThenByDescending(x => x.CreateTimestamp).Select(x => new Models.TaskList(x));
         
         return Ok(lists);
      }

      [HttpPost]
      [ProducesResponseType(200)]
      [ProducesResponseType(400)]
      public ActionResult<Models.TaskList> Create([FromBody] NewListRequest request)
      {
         if (request == null || string.IsNullOrWhiteSpace(request.Name))
            return BadRequest();

         var newList = new Database.Models.TaskList() { Name = request.Name, OwnerId = User.Id() };
         try{
            _dbContext.Lists.Add(newList);
            _dbContext.SaveChanges();
         } catch (Exception ex) {
            _logger.LogError($"Error creating new list. User {User.Id()}, List name: {request.Name}. Exception: {ex.Message}");
            return BadRequest();
         }

         return Ok(new Models.TaskList(newList));
      }

      [HttpPut("{id}")]
      [ProducesResponseType(200)]
      [ProducesResponseType(400)]
      [ProducesResponseType(404)]
      public ActionResult Edit(int id, [FromBody] EditListRequest request)
      {
         var lst = _dbContext.Lists.FirstOrDefault(x => x.Id == id && x.OwnerId == User.Id());
         if (lst == null)
         {
            return NotFound();
         }
         lst.Name = request.Name;
         lst.Starred = request.Starred;
         lst.ModifyTimestamp = DateTime.UtcNow;

         try
         {
            _dbContext.Lists.Update(lst);
            _dbContext.SaveChanges();
         }
         catch (Exception ex)
         {
            _logger.LogError($"Error updating list {lst.Id}. User {User.Id()}. Exception: {ex.Message}");
            return BadRequest();
         }
         return Ok();
      }

      [HttpDelete("{id}")]
      [ProducesResponseType(200)]
      [ProducesResponseType(400)]
      [ProducesResponseType(404)]
      public ActionResult Delete(int id)
      {
         var list = _dbContext.Lists.FirstOrDefault(x => x.OwnerId == User.Id() && x.Id == id);
         if (list == null)
         {
            return NotFound();
         }

         list.Deleted = true;
         list.ModifyTimestamp = DateTime.UtcNow;
         try
         {
            _dbContext.Lists.Update(list);
            _dbContext.SaveChanges();
         }
         catch (Exception ex)
         {
            _logger.LogError($"Error deleting list {list.Id}. User {User.Id()}. Exception: {ex.Message}");
            return BadRequest();
         }

         return Ok();
      }

   }
}
