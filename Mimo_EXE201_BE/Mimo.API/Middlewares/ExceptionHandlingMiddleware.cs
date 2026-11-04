using System;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Mimo.DomainLayer.Exceptions;

namespace Mimo.API.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            _logger.LogError(exception, "Unhandled Exception: {Message}", exception.Message);

            context.Response.ContentType = "application/problem+json";

            int statusCode = StatusCodes.Status500InternalServerError;
            string title = "Internal Server Error";
            string detail = "Đã xảy ra lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
            object? errors = null;

            switch (exception)
            {
                case BaseHttpException baseHttpEx:
                    statusCode = baseHttpEx.StatusCode;
                    detail = baseHttpEx.Message;
                    title = statusCode switch
                    {
                        400 => "Bad Request",
                        401 => "Unauthorized",
                        403 => "Forbidden",
                        404 => "Not Found",
                        409 => "Conflict",
                        503 => "Service Unavailable",
                        _ => "Client Error"
                    };
                    break;

                case BadHttpRequestException badRequestEx:
                    statusCode = StatusCodes.Status400BadRequest;
                    title = "Bad Request";
                    detail = badRequestEx.Message;
                    break;

                case UnauthorizedAccessException unauthorizedEx:
                    statusCode = StatusCodes.Status401Unauthorized;
                    title = "Unauthorized";
                    detail = unauthorizedEx.Message;
                    break;

                case FluentValidation.ValidationException fvEx:
                    statusCode = StatusCodes.Status400BadRequest;
                    title = "Validation Failed";
                    detail = "Dữ liệu yêu cầu không hợp lệ.";
                    errors = fvEx.Errors
                        .GroupBy(e => e.PropertyName)
                        .ToDictionary(
                            g => g.Key,
                            g => g.Select(e => e.ErrorMessage).ToArray()
                        );
                    break;

                default:
                    // Trong production không để lộ raw stack trace
                    break;
            }

            context.Response.StatusCode = statusCode;

            // RFC 7807 Problem Details
            var problemDetails = new
            {
                type = $"https://httpstatuses.com/{statusCode}",
                title = title,
                status = statusCode,
                detail = detail,
                instance = context.Request.Path.Value,
                error = detail, // Backward compatibility
                code = statusCode,
                timestamp = DateTime.UtcNow,
                errors = errors
            };

            var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
            await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails, jsonOptions));
        }
    }
}
