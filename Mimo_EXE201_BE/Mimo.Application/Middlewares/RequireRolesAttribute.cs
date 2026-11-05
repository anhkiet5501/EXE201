using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Mimo.Application.DTOs;
using Mimo.Application.ResponseCode;
using Mimo.Application.Services;
using Mimo.DomainLayer.Constants;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.Application.Middlewares;

/// <summary>
/// Bộ lọc xác thực và phân quyền truy cập theo 4 Roles: Admin, Student, Curator, Organization kèm kiểm tra Session Redis
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
public class RequireRolesAttribute : Attribute, IAsyncAuthorizationFilter
{
    private readonly UserRoleEnum[] _allowedRoles;

    public RequireRolesAttribute(params UserRoleEnum[] allowedRoles)
    {
        _allowedRoles = allowedRoles;
    }

    public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
    {
        var authHeader = context.HttpContext.Request.Headers["Authorization"].ToString();

        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Result = ErrorResp.Unauthorized("Yêu cầu mã xác thực Bearer token.");
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
                context.Result = ErrorResp.Unauthorized("Token không hợp lệ hoặc đã hết hạn.");
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

            // Lưu payload vào HttpContext Items
            context.HttpContext.Items[JwtConst.PAYLOAD_KEY] = payload;

            // Kiểm tra phân quyền Role nếu có yêu cầu
            if (_allowedRoles.Length > 0)
            {
                var roleString = payload.Role;
                if (string.IsNullOrEmpty(roleString) || 
                    !Enum.TryParse<UserRoleEnum>(roleString, true, out var userRole) || 
                    !_allowedRoles.Contains(userRole))
                {
                    context.HttpContext.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Result = ErrorResp.Forbidden("Bạn không có quyền truy cập chức năng này.");
                    return;
                }
            }
        }
        catch (Exception ex)
        {
            context.HttpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Result = ErrorResp.Unauthorized(ex.Message);
        }
    }
}

