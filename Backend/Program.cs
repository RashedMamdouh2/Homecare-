using System.Net;
using Hangfire;
using Hangfire.Logging;
using Hangfire.SqlServer;
using Homecare.Model;
using Homecare.Options;
using Homecare.Repository;
using Homecare.Repository.Interfaces;
using Homecare.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;

var builder = WebApplication.CreateBuilder(args);



Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File("logs/api_log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();






builder.Services.AddControllers(options=> {

    options.ReturnHttpNotAcceptable = true;
   
}).AddXmlSerializerFormatters();
builder.Services.AddScoped<IUnitOfWork,UnitOfWork>();
builder.Services.AddScoped<HangFireService>();
builder.Services.AddScoped<IMessagingService, TwilioMessagingService>();
builder.Services.AddScoped<ImageServices>();
builder.Services.AddScoped<IPDFService,QuestPDFService>();
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(setup =>
{

    
}).AddEntityFrameworkStores<ApplicationDbContext>().AddDefaultTokenProviders();



builder.Services.AddOptions<StripeOptions>().Bind(builder.Configuration.GetSection("Stripe"));



builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("stableDb"))
);
builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(builder.Configuration.GetConnectionString("localconnection")));

//// Add the processing server as IHostedService
builder.Services.AddHangfireServer();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter JWT like: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});




builder.Services.AddCors(options =>
{
    options.AddPolicy("policy1", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin();
    });
});
builder.Services.AddAuthentication(options => {

    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;


}).AddJwtBearer(options => {

    options.TokenValidationParameters.ValidateAudience = true;
    options.TokenValidationParameters.ValidateIssuer = true;
    options.TokenValidationParameters.ValidateLifetime = true;
    options.TokenValidationParameters.ValidateIssuerSigningKey = true;


    options.TokenValidationParameters.ValidIssuer = builder.Configuration["JWT:issuer"];
    options.TokenValidationParameters.ValidAudience = builder.Configuration["JWT:audience"];
    options.TokenValidationParameters.IssuerSigningKey =
    new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:key"]));
    options.TokenValidationParameters.ClockSkew = TimeSpan.Zero;
});
var app = builder.Build();
app.UseSerilogRequestLogging(); // Logs basic request info

app.UseSwagger();
app.UseSwaggerUI();
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseCors("policy1");
app.UseAuthentication();
app.UseAuthorization();
app.UseHangfireDashboard("/hangfireDashboard",new DashboardOptions
{
    Authorization = new [] {
        new HangfireAuthorizationFilter()
    }

});
app.MapControllers();
RecurringJob.AddOrUpdate<HangFireService>(
    job => job.CheckMedicaitions(),
    Cron.Minutely
);
app.Run();
public class TrackActionTimeFilter : IAsyncActionFilter
{
    public Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        throw new NotImplementedException();
    }
}
public class TrackActionTimeFilterV2 :  IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        //before logic

        var start = DateTime.UtcNow;
        context.HttpContext.Items.Add("start", start);
    }
    public void OnActionExecuted(ActionExecutedContext context)
    {
        //after excecution
        var end = DateTime.UtcNow;
        var start = (DateTime)context.HttpContext.Items["start"]!;
        var elapsedTime = end.Millisecond - start.Millisecond;
        context.HttpContext.Response.Headers["X-Elapsed-Time"]= elapsedTime.ToString();

    }

    

}
public class TrackActionTimeFilterV3 : ActionFilterAttribute
{
    public override Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        return base.OnActionExecutionAsync(context, next);
    }

}
