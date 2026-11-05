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
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.API.Controllers
{
    [ApiController]
    [Route("api/v1/business")]
    [Produces("application/json")]
    [Protected]
    [RequireRoles(UserRoleEnum.Organization, UserRoleEnum.Admin)]
    public class BusinessController : ControllerBase
    {
        private readonly IBusinessService _businessService;

        public BusinessController(IBusinessService businessService)
        {
            _businessService = businessService;
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

        [HttpGet("overview")]
        [ProducesResponseType(typeof(BusinessOverviewDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOverview(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GetOverviewAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpGet("classes")]
        [ProducesResponseType(typeof(ClassDto[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetClasses(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GetClassesAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpPost("classes")]
        [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateClass([FromBody] CreateClassRequestDto request, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.CreateClassAsync(userId, request, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpPut("classes/{id}")]
        [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateClass([FromRoute] Guid id, [FromBody] UpdateClassRequestDto request, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.UpdateClassAsync(userId, id, request, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpPost("classes/{id}/assign-teacher")]
        [ProducesResponseType(typeof(ClassDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> AssignTeacher([FromRoute] Guid id, [FromBody] AssignTeacherRequestDto request, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.AssignTeacherAsync(userId, id, request, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpGet("teachers/keys")]
        [ProducesResponseType(typeof(TeacherLicenseDto[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetTeacherKeys(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GetTeacherKeysAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpPost("teachers/keys")]
        [ProducesResponseType(typeof(TeacherLicenseDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GenerateTeacherKey([FromBody] CreateTeacherLicenseRequestDto request, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GenerateTeacherKeyAsync(userId, request, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpDelete("classes/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DeleteClass([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            await _businessService.DeleteClassAsync(userId, id, cancellationToken);
            return SuccessResp.Ok("Xóa lớp học thành công.");
        }

        [HttpDelete("teachers/keys/{id}")]
        [HttpPost("teachers/keys/{id}/revoke")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> RevokeTeacherKey([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            await _businessService.RevokeTeacherKeyAsync(userId, id, cancellationToken);
            return SuccessResp.Ok("Thu hồi mã bản quyền giáo viên thành công.");
        }

        [HttpGet("campaigns")]
        [ProducesResponseType(typeof(AssignmentDto[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCampaigns(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GetCampaignsAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpPost("campaigns")]
        [ProducesResponseType(typeof(AssignmentDto[]), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateCampaign([FromBody] CreateAssignmentRequestDto request, CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.CreateCampaignAsync(userId, request, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpGet("skill-gap")]
        [ProducesResponseType(typeof(SkillGapReportDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetSkillGap(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GetSkillGapReportAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpGet("reports")]
        [ProducesResponseType(typeof(BusinessOverviewDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetReports(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GetOverviewAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }

        [HttpGet("billing")]
        [ProducesResponseType(typeof(BusinessOverviewDto), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetBilling(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var result = await _businessService.GetOverviewAsync(userId, cancellationToken);
            return SuccessResp.Ok(result);
        }
    }
}
