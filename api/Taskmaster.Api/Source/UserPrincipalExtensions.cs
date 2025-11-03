using System.Security.Claims;

namespace Taskmaster.Api.Source
{
   public static class ClaimsPrincipalExtensions
   {
      public static int Id(this ClaimsPrincipal user)
      {
         int id = -1;
         if (user == null)
         {
            return id;
         }
         var idClaim = user.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier);
         if (idClaim == null)
         {
            return id;
         }
         return int.TryParse(idClaim.Value, out id) ? id : id;
      }
      public static string Email(this ClaimsPrincipal user)
      {
         if (user == null)
         {
            return "";
         }
         var idClaim = user.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Email);
         if (idClaim == null)
         {
            return "";
         }
         return idClaim.Value;
      }
   }
}
