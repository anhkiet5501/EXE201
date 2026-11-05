using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Mimo.Application.DTOs;
using Mimo.Application.ResponseCode;
using Mimo.Application.Services;
using Mimo.DomainLayer.Constants;

namespace Mimo.Application.Middlewares;

// Middleware to protect routes with JWT and active Redis session verification
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
public class ProtectedAttribute : Attribute, IAsyncAuthorizationFilter
{
    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var authHeader = context.HttpContext.Request.Headers["Authorization"].ToString();

        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Result = ErrorResp.Unauthorized("No token provided");
            return;
        }

        var token = authHeader.Substring("Bearer ".Length).Trim();

        try
        {
            var jwtService = context.HttpContext.RequestServices.GetRequiredService<IJwtService>();
            var payload = jwtService.ValidateToken(token);

            if (payload == null)
            {
                context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                context.Result = ErrorResp.Unauthorized("Invalid or expired token");
                return;
            }

            // Kiểm tra trạng thái phiên làm việc (Session) trong Redis nếu có kết nối
            if (payload.SessionId != Guid.Empty)
            {
                try
                {
                    var cacheService = context.HttpContext.RequestServices.GetService<ICacheService>();
                    if (cacheService != null && cacheService.IsConnected)
                    {
                        var isSessionActive = await cacheService.Exists($"ss:{payload.UserId}:{payload.SessionId}");
                        if (!isSessionActive)
                        {
                            context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Result = ErrorResp.Unauthorized("Phiên đăng nhập đã kết thúc hoặc đã bị thu hồi.");
                            return;
                        }
                    }
                }
                catch (Exception)
                {
                    // Graceful fallback nếu Redis offline tạm thời
                }
            }

            // add payload to context
            context.HttpContext.Items[JwtConst.PAYLOAD_KEY] = payload;
        }
        catch (Exception e)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Result = ErrorResp.Unauthorized(e.Message);
            return;
        }
    }
}

