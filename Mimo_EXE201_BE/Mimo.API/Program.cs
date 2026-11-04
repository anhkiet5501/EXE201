using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Diagnostics.HealthChecks;
using Microsoft.OpenApi.Models;
using Mimo.API.Middlewares;
using Mimo.Application;
using Mimo.Application.Filters;
using Mimo.Infrastructure;
using Mimo.Infrastructure.Database;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container with global ValidationFilter
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationFilter>();
});

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

// Configure Forwarded Headers for Cloud SSL Termination (Render, Fly.io, Traefik, Cloudflare)
builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

// Register Clean Architecture layers
builder.Services.AddApplicationServices();
builder.Services.AddInfrastructureServices(builder.Configuration);

// ASP.NET Core Health Checks (Database & System)
builder.Services.AddHealthChecks()
    .AddCheck<DatabaseHealthCheck>("database");

// CORS configuration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? new[] { "http://localhost:5173", "http://localhost:3000", "http://localhost:4173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("MimoCorsPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });

    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Swagger / OpenAPI with JWT Bearer support
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "MIMO Education Platform API", 
        Version = "v1",
        Description = "Hệ sinh thái EdTech giáo dục kỹ năng sinh tồn và phòng chống bắt nạt học đường MIMO."
    });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập JWT Access Token vào ô bên dưới (KHÔNG cần gõ 'Bearer'). Swagger sẽ tự thêm tiền tố cho bạn.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

var app = builder.Build();

// Forwarded Headers must be the very first middleware
app.UseForwardedHeaders();

// Global Exception Handling Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();

// Dynamic Swagger: Bật trên Development HOẶC khi có biến môi trường ENABLE_SWAGGER=true (cho Cloud Staging / Demo)
var enableSwagger = app.Environment.IsDevelopment()
    || builder.Configuration.GetValue<bool>("EnableSwagger", false)
    || string.Equals(Environment.GetEnvironmentVariable("ENABLE_SWAGGER"), "true", StringComparison.OrdinalIgnoreCase);

if (enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MIMO API v1");
        c.RoutePrefix = "swagger";
    });
}

// Dynamic Migration & Seeding: Chạy khi là Development HOẶC có cờ APPLY_MIGRATIONS=true
var applyMigrations = app.Environment.IsDevelopment()
    || builder.Configuration.GetValue<bool>("ApplyMigrations", false)
    || string.Equals(Environment.GetEnvironmentVariable("APPLY_MIGRATIONS"), "true", StringComparison.OrdinalIgnoreCase);

if (applyMigrations)
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MimoDbContext>();
        await db.Database.MigrateAsync();

        var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
        await seeder.SeedAsync();
        app.Logger.LogInformation("Tự động Migration và Seeding 24 kịch bản học liệu chuẩn hóa thành công.");
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Chưa thể kết nối PostgreSQL để chạy Migrate/Seed: {Message}", ex.Message);
    }
}

app.UseCors(app.Environment.IsDevelopment() ? "AllowAll" : "MimoCorsPolicy");

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseAuthentication();
app.UseAuthorization();

// Root metadata endpoint
app.MapGet("/", () => Results.Ok(new 
{ 
    status = "Healthy", 
    service = "MIMO Education Platform API", 
    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production",
    docs = enableSwagger ? "/swagger" : "Disabled in current environment",
    health = "/health",
    timestamp = DateTime.UtcNow 
}));

// RFC standard Health Check endpoint (/health) for Cloud Liveness / Readiness probes
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        var response = new
        {
            status = report.Status.ToString(),
            totalDurationMs = Math.Round(report.TotalDuration.TotalMilliseconds, 2),
            checks = report.Entries.Select(e => new
            {
                component = e.Key,
                status = e.Value.Status.ToString(),
                description = e.Value.Description,
                durationMs = Math.Round(e.Value.Duration.TotalMilliseconds, 2),
                error = e.Value.Exception?.Message
            }),
            timestamp = DateTime.UtcNow
        };
        await context.Response.WriteAsJsonAsync(response);
    }
});

app.MapControllers();

app.Run();
