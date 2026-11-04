using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mimo.Application.DTOs;
using Mimo.Application.DTOs.Auth;
using Mimo.Application.DTOs.User;
using Mimo.Application.Middlewares;
using Mimo.Application.ResponseCode;
using Mimo.Application.Services;
using Mimo.DomainLayer.Constants;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.API.Controllers
{
    [ApiController]
    [Route("api/v1/auth")]
    [Produces("application/json")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IAuthService authService, IUserService userService)
        {
            _authService = authService;
            _userService = userService;
        }

        /// <summary>
        /// Đăng ký tài khoản người học cá nhân (Student / B2C)
        /// Tự động gán quyền Student, khởi tạo 5 Tim và Hồ sơ cá nhân. Trả về HTTP 201 Created.
        /// </summary>
        [HttpPost("register")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
        {
            var result = await _authService.RegisterAsync(request);
            return SuccessResp.Created(result);
        }

        /// <summary>
        /// Đăng ký tổ chức trường học mới (B2B)
        /// Tạo mới bản ghi trong bảng Organizations và tạo tài khoản đại diện trường (Role = Organization). Trả về HTTP 201 Created.
        /// </summary>
        [HttpPost("register-organization")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> RegisterOrganization([FromBody] OrganizationRegisterRequestDto request)
        {
            var result = await _authService.RegisterOrganizationAsync(request);
            return SuccessResp.Created(result);
        }

        /// <summary>
        /// Đăng ký tài khoản tác giả / chuyên gia kịch bản tình huống (Curator)
        /// Gán quyền Curator, mở quyền truy cập Curator Studio (/studio). Trả về HTTP 201 Created.
        /// </summary>
        [HttpPost("register-curator")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(RegisterResponseDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> RegisterCurator([FromBody] CuratorRegisterRequestDto request)
        {
            var result = await _authService.RegisterCuratorAsync(request);
            return SuccessResp.Created(result);
        }

        /// <summary>
        /// Đăng nhập bằng Email/Username và Password
        /// </summary>
        [HttpPost("login")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            var result = await _authService.LoginAsync(request);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Đăng nhập / Đăng ký nhanh qua Google OAuth (ID Token)
        /// </summary>
        [HttpPost("google")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuthRequestDto request)
        {
            var result = await _authService.GoogleLoginAsync(request);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Cấp lại Access Token mới bằng Refresh Token
        /// </summary>
        [HttpPost("refresh-token")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(AuthResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto request)
        {
            var result = await _authService.RefreshTokenAsync(request);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Yêu cầu gửi hướng dẫn đặt lại mật khẩu qua email
        /// </summary>
        [HttpPost("forgot-password")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequestDto request)
        {
            var result = await _authService.ForgotPasswordAsync(request);
            return SuccessResp.Ok(new { message = result });
        }

        /// <summary>
        /// Đặt lại mật khẩu bằng mã token nhận qua email
        /// </summary>
        [HttpPost("reset-password")]
        [Consumes("application/json")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto request)
        {
            var result = await _authService.ResetPasswordAsync(request);
            return SuccessResp.Ok(new { message = result });
        }

        /// <summary>
        /// Đăng xuất - Thu hồi session hiện tại trên Redis và hủy Refresh Token
        /// </summary>
        [HttpPost("logout")]
        [Protected]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Logout()
        {
            if (HttpContext.Items.TryGetValue(JwtConst.PAYLOAD_KEY, out var payloadObj) && payloadObj is Payload payload)
            {
                await _authService.LogoutAsync(payload.UserId, payload.SessionId);
                return SuccessResp.Ok(new { message = "Đăng xuất thành công." });
            }

            return ErrorResp.Unauthorized("Không thể xác định phiên làm việc.");
        }

        /// <summary>
        /// Buộc đăng xuất tất cả các phiên của một người dùng (Dành cho Quản trị viên - Admin)
        /// </summary>
        [HttpPost("force-logout/{userId}")]
        [RequireRoles(UserRoleEnum.Admin)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> ForceLogout([FromRoute] Guid userId)
        {
            await _authService.ForceLogoutAsync(userId);
            return SuccessResp.Ok(new { message = $"Đã thu hồi toàn bộ phiên đăng nhập của người dùng {userId}." });
        }

        /// <summary>
        /// Lấy thông tin tài khoản đang đăng nhập (Yêu cầu Bearer Token)
        /// </summary>
        [HttpGet("me")]
        [Protected]
        [ProducesResponseType(typeof(UserDetailDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetCurrentUser()
        {
            if (HttpContext.Items.TryGetValue(JwtConst.PAYLOAD_KEY, out var payloadObj) && payloadObj is Payload payload)
            {
                var user = await _userService.GetMeAsync(payload.UserId);
                return SuccessResp.Ok(user);
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value 
                ?? User.FindFirst("userId")?.Value;

            if (Guid.TryParse(userIdClaim, out var userId))
            {
                var user = await _userService.GetMeAsync(userId);
                return SuccessResp.Ok(user);
            }

            return ErrorResp.Unauthorized("Không thể xác định danh tính người dùng.");
        }

        /// <summary>
        /// Endpoint kiểm tra phân quyền riêng cho Role Admin
        /// </summary>
        [HttpGet("admin-only")]
        [RequireRoles(UserRoleEnum.Admin)]
        public IActionResult AdminOnly()
        {
            return SuccessResp.Ok(new { message = "Xin chào Admin! Bạn có toàn quyền quản trị hệ thống MIMO." });
        }

        /// <summary>
        /// Endpoint kiểm tra phân quyền cho Role Curator hoặc Admin
        /// </summary>
        [HttpGet("curator-only")]
        [RequireRoles(UserRoleEnum.Curator, UserRoleEnum.Admin)]
        public IActionResult CuratorOnly()
        {
            return SuccessResp.Ok(new { message = "Xin chào Giảng viên / Curator! Bạn có quyền quản lý bài giảng & kịch bản." });
        }

        /// <summary>
        /// Endpoint kiểm tra phân quyền cho Role Organization hoặc Admin
        /// </summary>
        [HttpGet("organization-only")]
        [RequireRoles(UserRoleEnum.Organization, UserRoleEnum.Admin)]
        public IActionResult OrganizationOnly()
        {
            return SuccessResp.Ok(new { message = "Xin chào Tổ chức B2B! Bạn có quyền quản trị trường học và lớp học." });
        }

        /// <summary>
        /// Endpoint kiểm tra phân quyền cho Role Educator hoặc Admin
        /// </summary>
        [HttpGet("educator-only")]
        [RequireRoles(UserRoleEnum.Educator, UserRoleEnum.Admin)]
        public IActionResult EducatorOnly()
        {
            return SuccessResp.Ok(new { message = "Xin chào Giáo viên / Educator! Bạn có quyền quản lý lớp học và theo dõi học sinh." });
        }
    }
}

