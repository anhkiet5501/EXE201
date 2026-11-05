using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Mimo.Application.Repositories;
using Mimo.Application.Services;
using Mimo.Infrastructure.Core.Cache;
using Mimo.Infrastructure.Core.Crypto;
using Mimo.Infrastructure.Core.JWT;
using Mimo.Infrastructure.Core.Mail;
using Mimo.Infrastructure.Core.Storage;
using Mimo.Infrastructure.Database;
using Mimo.Infrastructure.Repository;
using StackExchange.Redis;

namespace Mimo.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        // Database Context (PostgreSQL)
        var connectionString = configuration.GetConnectionString("DefaultConnection");
        if (!string.IsNullOrEmpty(connectionString))
        {
            services.AddDbContext<MimoDbContext>(options =>
            {
                options.UseNpgsql(connectionString);
                options.ConfigureWarnings(w => w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
            });
        }

        // Repositories
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<ILeaderboardRepository, LeaderboardRepository>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        // Core Infrastructure Services
        services.AddScoped<ICryptoService, CryptoService>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IMailService, MailService>();
        services.AddScoped<IDatabaseSeeder, DatabaseSeeder>();
        services.AddScoped<IGoogleAuthService, Mimo.Infrastructure.Core.Auth.GoogleAuthService>();

        // In-Memory L1 Cache
        services.AddMemoryCache();

        // Redis & Resilient Cache Service
        var redisConn = configuration.GetConnectionString("Redis") 
            ?? configuration["Redis:ConnectionString"] 
            ?? "localhost:6379";

        var enableRedis = !string.IsNullOrWhiteSpace(redisConn) 
            && !redisConn.Equals("none", StringComparison.OrdinalIgnoreCase)
            && !redisConn.Equals("disabled", StringComparison.OrdinalIgnoreCase);

        services.AddSingleton<IConnectionMultiplexer>(_ =>
        {
            if (!enableRedis)
            {
                return null!;
            }

            try
            {
                var options = ConfigurationOptions.Parse(redisConn);
                options.AbortOnConnectFail = false;
                options.ConnectTimeout = 1000;
                options.SyncTimeout = 1000;
                options.AsyncTimeout = 1000;
                return ConnectionMultiplexer.Connect(options);
            }
            catch
            {
                return null!;
            }
        });

        services.AddScoped<ICacheService, CacheService>();

        // Cloud Storage (Supabase)
        services.Configure<SupabaseStorageOptions>(configuration.GetSection(SupabaseStorageOptions.SectionName));
        services.AddHttpClient<IStorageService, SupabaseStorageService>();

        // VNPay Payment Options
        services.Configure<Mimo.Application.Helper.Payment.VnPayOptions>(configuration.GetSection(Mimo.Application.Helper.Payment.VnPayOptions.SectionName));

        // SePay (chuyển khoản VietQR + webhook)
        services.Configure<Mimo.Application.Helper.Payment.SePayOptions>(configuration.GetSection(Mimo.Application.Helper.Payment.SePayOptions.SectionName));

        return services;
    }
}
