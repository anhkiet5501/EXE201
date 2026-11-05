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

        // Redis & Cache Service
        var redisConn = configuration.GetConnectionString("Redis") 
            ?? configuration["Redis:ConnectionString"] 
            ?? "localhost:6379";

        services.AddSingleton<IConnectionMultiplexer>(_ =>
        {
            var options = ConfigurationOptions.Parse(redisConn);
            options.AbortOnConnectFail = false;
            options.ConnectTimeout = 5000;
            return ConnectionMultiplexer.Connect(options);
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
