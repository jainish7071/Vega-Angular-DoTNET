using AutoMapper;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using vega.Mapping;
using vega.Persistence;
using vega.Core;
using vega.Core.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        }).AddJwtBearer(options =>
        {
            options.Authority = "https://dev-3l7h2pcr.us.auth0.com/";
            options.Audience = "https://api.vega.com";
        });
builder.Services.Configure<PhotoSettings>(builder.Configuration.GetSection("PhotoSettings"));
IMapper mapper = new MapperConfiguration(mc => mc.AddProfile(new MappingProfile())).CreateMapper();
builder.Services.AddSingleton(mapper);
builder.Services.AddScoped<IVehicleRepository, VehicleRepository>();
builder.Services.AddScoped<IPhotoRepository, PhotoRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddTransient<IPhotoService, PhotoService>();
builder.Services.AddTransient<IPhotoStorage, FileSystemPhotoStorage>();

builder.Services.AddControllersWithViews();
// builder.Services.AddTransient<MySqlConnection>(_ => new MySqlConnection(builder.Configuration.GetConnectionString("Default")));
builder.Services.AddDbContext<VegaDbContext>(optionsAction =>
{
    optionsAction.UseSqlServer(builder.Configuration["ConnectionsStrings:Default"]);
});
// builder.Services.AddAuthentication(options=>{
//     options.AddScheme(Policies.RequireAdminRole,schema=> schema.RequireClaim("https://vega.com/roles","Admin"))
// })


var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


// eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ii1hX3NzdUJwdWFPRjh0ZW5GTmc3ayJ9.eyJpc3MiOiJodHRwczovL2Rldi0zbDdoMnBjci51cy5hdXRoMC5jb20vIiwic3ViIjoiT3JoRUNYMFdIeGZ6VHVlaVBQdzlaTFV2S2lnUzNPQTZAY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vYXBpLnZlZ2EuY29tIiwiaWF0IjoxNjQ0NDE1Mzg5LCJleHAiOjE2NDQ1MDE3ODksImF6cCI6Ik9yaEVDWDBXSHhmelR1ZWlQUHc5WkxVdktpZ1MzT0E2IiwiZ3R5IjoiY2xpZW50LWNyZWRlbnRpYWxzIn0.qsGK67aoLxtuLAH66L_VHwt9kBkDfT1-8PnVrIHAAkcPt4R7XUhpZAK6AdBGkMMN-Hi1t59onsRpazZ5Y0R7vPAFx8f4qN1kIxXcQueoz9mp5FuqdNjU0BbC5xEtzB9TbUQriKCP0Bzb6uyoP_p4zwLr8-YWKJcoY6GTJLKdhqCyk6kY9zz2DbZVnMLxmuXMVrgX3vY0fQVGWnz-SavcJGI11RLHASXKLTncVRaka7HjU_Bxmpu7fK7Tyh8ksaWqrb2MiVVwf8fxEDrgqiCBaib0QWzji6WwfpKWv4ksaIdYrEBMv_4dWpL_uTJzV0Y3GRtrL0TYva0fqPMmnKNbIA

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;

app.Run();
