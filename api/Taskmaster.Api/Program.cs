using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Taskmaster.Database;

var builder = WebApplication.CreateBuilder(args);
var appUrl = builder.Configuration.GetValue<string>("AppUrl") ?? throw new ArgumentNullException("App Url configuration is missing");
var dbPath = builder.Configuration.GetValue<string>("DatabasePath");
if (string.IsNullOrWhiteSpace(dbPath))
   dbPath = Path.Join(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "TaskmasterDB.db");

builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
   options.AddPolicy(name: "frontend",
                     builder =>
                     {
                        builder.WithOrigins(appUrl)
                                .AllowAnyHeader()
                                .AllowAnyMethod()
                                .AllowCredentials();
                     });
});
builder.Services.AddDbContext<DatabaseContext>(options =>
    options.UseSqlite(Utils.GetConnectionString(dbPath)));

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                  .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);

var app = builder.Build();
app.UseCors("frontend");
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

Utils.CreateTables(dbPath, false);
//Utils.PopulateTestingData(dbPath);

app.Run();