using System;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Mimo.Application.Services;
using StackExchange.Redis;

namespace Mimo.Infrastructure.Core.Cache;

public class CacheService : ICacheService
{
    private readonly IConnectionMultiplexer? _multiplexer;
    private readonly IMemoryCache _memoryCache;
    private readonly ILogger<CacheService> _logger;
    private readonly string _redisKey = "mimo";

    public CacheService(
        IMemoryCache memoryCache,
        ILogger<CacheService> logger,
        IConnectionMultiplexer? multiplexer = null)
    {
        _memoryCache = memoryCache;
        _logger = logger;
        _multiplexer = multiplexer;
    }

    public bool IsConnected => _multiplexer != null && _multiplexer.IsConnected;

    public async Task<T?> Get<T>(string key)
    {
        var fullKey = $"{_redisKey}:{key}";

        // 1. Nếu có Redis online, ưu tiên đọc từ Redis
        if (IsConnected)
        {
            try
            {
                var db = _multiplexer!.GetDatabase();
                var value = await db.StringGetAsync(fullKey);
                if (!value.IsNullOrEmpty)
                {
                    var deserialized = JsonSerializer.Deserialize<T>((string)value!);
                    if (deserialized != null)
                    {
                        _memoryCache.Set(fullKey, deserialized, TimeSpan.FromMinutes(5));
                    }
                    return deserialized;
                }
                return default;
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể đọc từ Redis, chuyển sang MemoryCache: {Message}", ex.Message);
            }
        }

        // 2. Fallback sang In-Memory Cache (tốc độ < 1ms)
        if (_memoryCache.TryGetValue(fullKey, out T? memoryValue))
        {
            return memoryValue;
        }

        return default;
    }

    public Task Set<T>(string key, T value)
    {
        return Set(key, value, TimeSpan.FromMinutes(30));
    }

    public async Task Set<T>(string key, T value, TimeSpan expiration)
    {
        var fullKey = $"{_redisKey}:{key}";

        // Luôn lưu In-Memory Cache trước
        _memoryCache.Set(fullKey, value, expiration);

        if (IsConnected)
        {
            try
            {
                var db = _multiplexer!.GetDatabase();
                await db.StringSetAsync(fullKey, JsonSerializer.Serialize(value), expiration);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể ghi vào Redis: {Message}", ex.Message);
            }
        }
    }

    public async Task<bool> Update<T>(string key, T value)
    {
        var fullKey = $"{_redisKey}:{key}";
        _memoryCache.Set(fullKey, value);

        if (IsConnected)
        {
            try
            {
                var db = _multiplexer!.GetDatabase();
                TimeSpan? ttl = await db.KeyTimeToLiveAsync(fullKey);
                return await db.StringSetAsync(fullKey, JsonSerializer.Serialize(value), ttl);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể cập nhật Redis: {Message}", ex.Message);
            }
        }

        return true;
    }

    public async Task Remove(string key)
    {
        var fullKey = $"{_redisKey}:{key}";
        _memoryCache.Remove(fullKey);

        if (IsConnected)
        {
            try
            {
                var db = _multiplexer!.GetDatabase();
                await db.KeyDeleteAsync(fullKey);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể xóa key Redis: {Message}", ex.Message);
            }
        }
    }

    public async Task<bool> Exists(string key)
    {
        var fullKey = $"{_redisKey}:{key}";

        if (IsConnected)
        {
            try
            {
                var db = _multiplexer!.GetDatabase();
                return await db.KeyExistsAsync(fullKey);
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể kiểm tra key Redis: {Message}", ex.Message);
            }
        }

        return _memoryCache.TryGetValue(fullKey, out _);
    }

    public async Task Clear()
    {
        if (_memoryCache is MemoryCache memCache)
        {
            memCache.Compact(1.0);
        }

        if (IsConnected)
        {
            try
            {
                var db = _multiplexer!.GetDatabase();
                await db.ExecuteAsync("FLUSHDB");
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể FLUSHDB Redis: {Message}", ex.Message);
            }
        }
    }

    public async Task ClearWithPattern(string pattern)
    {
        if (IsConnected)
        {
            try
            {
                var db = _multiplexer!.GetDatabase();
                var endpoints = db.Multiplexer.GetEndPoints();
                if (endpoints.Length > 0)
                {
                    var server = db.Multiplexer.GetServer(endpoints.First());
                    var keys = server.Keys(pattern: $"{_redisKey}:{pattern}*").ToArray();
                    if (keys.Length > 0)
                    {
                        await db.KeyDeleteAsync(keys);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning("Không thể ClearWithPattern Redis: {Message}", ex.Message);
            }
        }
    }

    public Task ForceLogout(Guid userId)
    {
        var redisKey = $"ss:{userId}";
        return ClearWithPattern(redisKey);
    }
}
