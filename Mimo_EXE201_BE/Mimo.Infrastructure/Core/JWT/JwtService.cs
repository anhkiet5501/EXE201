using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Mimo.Application.DTOs;
using Mimo.Application.Services;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.Infrastructure.Core.JWT;

public class JwtService : IJwtService
{
    private const int MIN_SECRET_LENGTH = 32;
    private readonly byte[] _key;
    private readonly JwtSecurityTokenHandler _handler;

    public JwtService(IConfiguration? configuration = null)
    {
        var secretKey = configuration?["Jwt:Secret"];
        if (string.IsNullOrWhiteSpace(secretKey))
        {
            secretKey = Environment.GetEnvironmentVariable("JWT_SECRET");
        }

        if (string.IsNullOrWhiteSpace(secretKey) || secretKey.Length < MIN_SECRET_LENGTH)
        {
            throw new InvalidOperationException(
                $"Thiếu cấu hình Jwt:Secret (biến môi trường Jwt__Secret hoặc JWT_SECRET), tối thiểu {MIN_SECRET_LENGTH} ký tự.");
        }

        _key = Encoding.UTF8.GetBytes(secretKey);
        _handler = new JwtSecurityTokenHandler();
    }

    public string GenerateToken(Guid userId, string role, Guid sessionId, string email, UserStatusEnum status, int exp)
    {
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim("userId", userId.ToString()),
                new Claim("sessionId", sessionId.ToString()),
                new Claim("status", status.ToString()),
                new Claim("email", email),
                new Claim(ClaimTypes.Email, email),
                new Claim("role", role),
                new Claim(ClaimTypes.Role, role)
            }),
            Issuer = userId.ToString(),
            Expires = DateTime.UtcNow.AddSeconds(exp),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = _handler.CreateToken(tokenDescriptor);
        return _handler.WriteToken(token);
    }

    public Payload? ValidateToken(string token)
    {
        try
        {
            _handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(_key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var result = (JwtSecurityToken)validatedToken;
            var emailClaim = result.Claims.FirstOrDefault(x => x.Type == "email")?.Value ?? string.Empty;
            var sessionClaim = result.Claims.FirstOrDefault(x => x.Type == "sessionId")?.Value;
            var statusClaim = result.Claims.FirstOrDefault(x => x.Type == "status")?.Value;
            var roleClaim = result.Claims.FirstOrDefault(x => x.Type == "role")?.Value;

            return new Payload
            {
                UserId = Guid.TryParse(result.Issuer, out var userId) ? userId : Guid.Empty,
                Email = emailClaim,
                SessionId = Guid.TryParse(sessionClaim, out var sessId) ? sessId : Guid.Empty,
                Status = Enum.TryParse<UserStatusEnum>(statusClaim, out var st) ? st : UserStatusEnum.NotVerified,
                Role = roleClaim
            };
        }
        catch
        {
            return null;
        }
    }
}
