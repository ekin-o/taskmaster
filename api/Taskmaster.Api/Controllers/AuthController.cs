using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Taskmaster.Api.Source;
using Taskmaster.Database;
using Taskmaster.Database.Models;

namespace Taskmaster.Api.Controllers
{
   [ApiController]
   [Route("api/v1/auth")]
   public class AuthController : ControllerBase
   {
      private readonly DatabaseContext _dbContext;
      private readonly ILogger<AuthController> _logger;

      public AuthController(ILogger<AuthController> logger, DatabaseContext dbcontext)
      {
         _dbContext = dbcontext ?? throw new ArgumentNullException(nameof(dbcontext));
         _logger = logger ?? throw new ArgumentNullException(nameof(logger));
      }


      [HttpPost("login")]
      public async Task<ActionResult> Login([FromBody] Models.AuthForm request)
      {
         if(string.IsNullOrWhiteSpace(request.UserName) || string.IsNullOrWhiteSpace(request.Password)){
            return BadRequest();
         }
         var auth = _dbContext.Authentication.Include(x => x.User).FirstOrDefault(x => x.User.Email == request.UserName);
         if (auth == null || auth.User == null)
         {
            return NotFound();
         }
         StringBuilder Sb = new StringBuilder();
         string saltedHash = "";
         using (var hash = SHA256.Create())
         {
            Encoding enc = Encoding.UTF8;
            byte[] result = hash.ComputeHash(enc.GetBytes($"{request.Password}{auth.Salt}"));
            saltedHash = Convert.ToBase64String(result);
         }
         if (saltedHash == auth.Hash)
         {
            var userClaims = new List<Claim>() {
            new Claim(ClaimTypes.Email, auth.User.Email),
            new Claim(ClaimTypes.Name,  auth.User.FirstName),
            new Claim(ClaimTypes.Surname,  auth.User.LastName),
            new Claim(ClaimTypes.NameIdentifier,  auth.User.Id.ToString()),
            };
            var identity = new ClaimsIdentity(userClaims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
               IsPersistent = true,
               ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30) 
            };

            await HttpContext.SignInAsync(new ClaimsPrincipal(identity), authProperties);
            return Ok(auth.User);
         }
         return Unauthorized();
      }

      [HttpPost("logout")]
      [Authorize]
      public async Task<ActionResult> Lougout()
      {
         await HttpContext.SignOutAsync();
         return Ok();
      }

      [HttpGet("active")]
      [Authorize]
      public ActionResult IsActive()
      {
         var user = _dbContext.Users.FirstOrDefault(x => x.Email == User.Email());
         return Ok(user);
      }
   }
}
