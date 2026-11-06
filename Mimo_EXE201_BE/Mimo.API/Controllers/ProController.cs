using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Mimo.Application.DTOs;
using Mimo.Application.DTOs.Practice;
using Mimo.Application.DTOs.Pro;
using Mimo.Application.Middlewares;
using Mimo.Application.ResponseCode;
using Mimo.Application.Services;
using Mimo.DomainLayer.Constants;
using Mimo.DomainLayer.Exceptions;

namespace Mimo.API.Controllers
{
    /// <summary>
    /// Quyền lợi dành riêng cho thành viên Mimo Pro. Server kiểm tra Pro (kể cả hết hạn); người dùng Free nhận 403.
    /// </summary>
    [ApiController]
    [Route("api/v1/pro")]
    [Produces("application/json")]
    public class ProController : ControllerBase
    {
        private readonly IProService _proService;

        public ProController(IProService proService)
        {
            _proService = proService;
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

        /// <summary>Báo cáo rủi ro an toàn 30 ngày: độ chính xác theo chủ đề, điểm yếu, xu hướng 7 ngày.</summary>
        [HttpGet("risk-report")]
        [Protected]
        [ProducesResponseType(typeof(ProRiskReportDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetRiskReport(CancellationToken cancellationToken)
        {
            var result = await _proService.GetRiskReportAsync(GetCurrentUserId(), cancellationToken);
            return SuccessResp.Ok(result);
        }

        /// <summary>Danh sách câu từng làm sai (mọi thời điểm) để ôn tập chuyên sâu. Không chứa đáp án.</summary>
        [HttpGet("deep-review")]
        [Protected]
        [ProducesResponseType(typeof(List<DeepReviewQuestionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> GetDeepReview(CancellationToken cancellationToken)
        {
            var result = await _proService.GetDeepReviewQuestionsAsync(GetCurrentUserId(), cancellationToken);
            return SuccessResp.Ok(result);
        }

        /// <summary>Nộp đáp án ôn tập chuyên sâu: chấm điểm ở server, trả lời giải thích. Không cộng XP/tim.</summary>
        [HttpPost("deep-review/answer")]
        [Protected]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(DeepReviewAnswerResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<IActionResult> SubmitDeepReviewAnswer(
            [FromBody] PracticeAnswerRequestDto request,
            CancellationToken cancellationToken)
        {
            var result = await _proService.SubmitDeepReviewAnswerAsync(GetCurrentUserId(), request, cancellationToken);
            return SuccessResp.Ok(result);
        }
    }
}
