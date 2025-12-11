using Homecare.Model;
using Homecare.Repository;
using Homecare.Services;
using Microsoft.EntityFrameworkCore;
using Hangfire;
using Hangfire.SqlServer;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddScoped<IUnitOfWork,UnitOfWork>();
builder.Services.AddScoped<IHangFireService, HangFireService>();
builder.Services.AddScoped<IImageServices,ImageServices>();
builder.Services.AddScoped<IPDFService,PDFService>();
builder.Services.AddHangfire(configuration => configuration
        .SetDataCompatibilityLevel(CompatibilityLevel.Version_180)
        .UseSimpleAssemblyNameTypeSerializer()
        .UseRecommendedSerializerSettings()
        .UseSqlServerStorage(builder.Configuration.GetConnectionString("localconnection")));

//// Add the processing server as IHostedService
builder.Services.AddHangfireServer();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("localconnection"))
);



builder.Services.AddCors(options =>
{
    options.AddPolicy("policy1", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .AllowAnyOrigin();
    });
});

var app = builder.Build();

 
app.UseSwagger();
app.UseSwaggerUI();


app.UseHttpsRedirection();
app.UseCors("policy1");
app.UseAuthorization();
app.UseHangfireDashboard("/hangfireDashboard");
app.MapControllers();
RecurringJob.AddOrUpdate<IHangFireService>(
    job => job.CheckMedicaitions(),
    Cron.Minutely
);
app.Run();
