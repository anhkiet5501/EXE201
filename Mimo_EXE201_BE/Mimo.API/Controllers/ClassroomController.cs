using System;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mimo.Application.DTOs;
using Mimo.Application.DTOs.Business;
using Mimo.Application.Middlewares;
using Mimo.Application.Services;
using Mimo.DomainLayer.Constants;
using Mimo.DomainLayer.Exceptions;

namespace Mimo.API.Controllers
{
    [ApiController]
    [Route("api/v1/classroom")]
    [Produces("application/json")]
    [Protected]
    public class ClassroomController : ControllerBase
    {
        private readonly IClassMembershipService _membershipService;

        public ClassroomController(IClassMembershipService membershipService)
        {
            _membershipService = membershipService;
        }

        private Guid GetCurrentUserId()
        {
            if (HttpContext.Items.TryGetValue(JwtConst.PAYLOAD_KEY, out var payloadObj) && payloadObj is Payload payload)
            {
                return payload.UserId;
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                ?? User.FindFirst("userId")?.Value;

            if (Guid.TryParse(userIdClaim, out var userId))
            {
                return userId;
            }

            throw new UnauthorizedException("Không thể xác định danh tính người dùng.");
        }

        /// <summary>
        /// Lấy thông tin lớp học của học sinh hiện tại và danh sách bài tập được giao
        /// </summary>
        [HttpGet("me")]
        [ProducesResponseType(typeof(StudentClassroomDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyClassroom(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _membershipService.GetMyClassroomAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Tham gia lớp học theo mã code (dùng cho MyClassroomPage)
        /// </summary>
        [HttpPost("join")]
        [ProducesResponseType(typeof(StudentClassroomDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> JoinClassroom([FromBody] JoinClassRequestDto request, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _membershipService.JoinClassByCodeAsync(userId, request.ClassCode, cancellationToken);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Rời khỏi lớp học hiện tại
        /// </summary>
        [HttpPost("leave")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> LeaveClassroom(
            [FromQuery] Guid? classId,
            [FromBody] LeaveClassRequestDto? request,
            CancellationToken cancellationToken)
        {
            var targetClassId = classId ?? request?.ClassId;
            if (!targetClassId.HasValue || targetClassId.Value == Guid.Empty)
            {
                throw new BadRequestException("Vui lòng cung cấp mã lớp học (classId) muốn rời.");
            }

            var userId = GetCurrentUserId();
            await _membershipService.LeaveClassAsync(userId, targetClassId.Value, cancellationToken);
            return SuccessResp.Ok("Đã rời khỏi lớp học thành công.");
        }
    }
}
