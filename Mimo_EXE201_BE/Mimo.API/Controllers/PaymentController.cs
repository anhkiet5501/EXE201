using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Mimo.Application.DTOs;
using Mimo.Application.DTOs.Payment;
using Mimo.Application.Middlewares;
using Mimo.Application.ResponseCode;
using Mimo.Application.Services;
using Mimo.DomainLayer.Constants;
using Mimo.DomainLayer.Exceptions;
using Mimo.Application.Helper.Payment;

namespace Mimo.API.Controllers
{
    [ApiController]
    [Route("api/v1/payment")]
    [Produces("application/json")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly VnPayOptions _vnPayOptions;
        private readonly IWebHostEnvironment _env;
        private readonly SePayOptions _sePayOptions;
        private readonly ILogger<PaymentController> _logger;

        public PaymentController(
            IPaymentService paymentService,
            IOptions<VnPayOptions> vnPayOptions,
            IOptions<SePayOptions> sePayOptions,
            IWebHostEnvironment env,
            ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _vnPayOptions = vnPayOptions.Value;
            _sePayOptions = sePayOptions.Value;
            _env = env;
            _logger = logger;
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
        /// Task BE9: Tạo liên kết thanh toán VNPay Sandbox cho gói Mimo Pro hoặc Khóa học
        /// </summary>
        [HttpPost("create-vnpay-url")]
        [Protected]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(PaymentUrlResponseDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CreateVnPayUrl(
            [FromBody] CreatePaymentRequestDto request,
            CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";

            var result = await _paymentService.CreateVnPayPaymentUrlAsync(userId, request, ipAddress, cancellationToken);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Task BE9: Cổng tiếp nhận Return URL từ VNPay sau khi người dùng hoàn tất thanh toán
        /// Tự động chuyển hướng về trang kết quả của Frontend hoặc trả JSON nếu có query param json=true
        /// </summary>
        [HttpGet("vnpay-return")]
        [ProducesResponseType(typeof(PaymentResultDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> VnPayReturn(
            [FromQuery] bool? json,
            CancellationToken cancellationToken)
        {
            var result = await _paymentService.ProcessVnPayCallbackAsync(Request.Query, cancellationToken);

            if (json == true)
            {
                return SuccessResp.Ok(result);
            }

            // Chuyển hướng trình duyệt về Frontend (Bắt buộc có FrontendReturnUrl ở Production)
            var baseUrl = _vnPayOptions.FrontendReturnUrl;
            if (string.IsNullOrWhiteSpace(baseUrl))
            {
                if (!_env.IsDevelopment())
                {
                    throw new ServerFailureException("Cấu hình FrontendReturnUrl (Vnpay:FrontendReturnUrl) chưa được thiết lập cho môi trường Production.");
                }
                baseUrl = "http://localhost:5173/payment-result";
            }
            else if (!_env.IsDevelopment() && (baseUrl.Contains("localhost", StringComparison.OrdinalIgnoreCase) || baseUrl.Contains("127.0.0.1")))
            {
                throw new ServerFailureException("Cấu hình FrontendReturnUrl không được trỏ về localhost trong môi trường Production.");
            }

            var redirectUrl = $"{baseUrl}?status={result.Status}" +
                              $"&txnRef={Uri.EscapeDataString(result.TxnRef)}" +
                              $"&amount={result.Amount}" +
                              $"&planCode={Uri.EscapeDataString(result.PlanCode ?? "")}" +
                              $"&isPro={result.IsPro.ToString().ToLower()}" +
                              $"&message={Uri.EscapeDataString(result.Message)}";

            return SuccessResp.Redirect(redirectUrl);
        }

        /// <summary>
        /// Task BE9: Webhook IPN (Server-to-Server) dành cho hệ thống VNPay gọi ngầm
        /// Trả về mã phản hồi theo đúng chuẩn tài liệu kỹ thuật VNPay
        /// </summary>
        [HttpGet("vnpay-ipn")]
        public async Task<IActionResult> VnPayIpn(CancellationToken cancellationToken)
        {
            var (code, message) = await _paymentService.ProcessVnPayIpnAsync(Request.Query, cancellationToken);
            return new JsonResult(new { RspCode = code, Message = message });
        }

        /// <summary>
        /// Task BE9: Lấy lịch sử giao dịch thanh toán của người dùng hiện tại
        /// </summary>
        [HttpGet("history")]
        [Protected]
        [ProducesResponseType(typeof(List<TransactionDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> GetUserPaymentHistory(CancellationToken cancellationToken)
        {
            var userId = GetCurrentUserId();
            var history = await _paymentService.GetUserTransactionsAsync(userId, cancellationToken);
            return SuccessResp.Ok(history);
        }

        /// <summary>
        /// Tạo đơn chuyển khoản (SePay + VietQR) cho gói Mimo Pro: trả về mã đơn, nội dung chuyển khoản và URL mã QR.
        /// </summary>
        [HttpPost("create-order")]
        [Protected]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(PaymentOrderDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status503ServiceUnavailable)]
        public async Task<IActionResult> CreateOrder(
            [FromBody] CreateOrderRequestDto request,
            CancellationToken cancellationToken)
        {
            var result = await _paymentService.CreateOrderAsync(GetCurrentUserId(), request, cancellationToken);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Trạng thái đơn thanh toán của người dùng hiện tại (FE gọi định kỳ để biết tiền đã về chưa).
        /// </summary>
        [HttpGet("order/{txnRef}")]
        [Protected]
        [ProducesResponseType(typeof(OrderStatusDto), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrderStatus(string txnRef, CancellationToken cancellationToken)
        {
            var result = await _paymentService.GetOrderStatusAsync(GetCurrentUserId(), txnRef, cancellationToken);
            return SuccessResp.Ok(result);
        }

        /// <summary>
        /// Webhook SePay (server-to-server) khi có biến động số dư. Xác thực bằng header "Authorization: Apikey {key}".
        /// Mọi trường hợp hợp lệ (kể cả bỏ qua/trùng) trả 200 {"success": true} để SePay không gửi lại; lỗi hệ thống trả 5xx để SePay gửi lại.
        /// </summary>
        [HttpPost("sepay-webhook")]
        [Consumes("application/json")]
        public async Task<IActionResult> SePayWebhook(
            [FromBody] SePayWebhookDto payload,
            CancellationToken cancellationToken)
        {
            if (!IsValidSePayApiKey(Request.Headers.Authorization.ToString()))
            {
                _logger.LogWarning("Webhook SePay bị từ chối: sai hoặc thiếu API Key.");
                return new JsonResult(new { success = false, message = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            }

            var outcome = await _paymentService.ProcessSePayWebhookAsync(payload, cancellationToken);
            return new JsonResult(new { success = true, outcome = outcome.ToString() });
        }

        private bool IsValidSePayApiKey(string authorizationHeader)
        {
            var expected = _sePayOptions.ApiKey;
            if (string.IsNullOrWhiteSpace(expected))
            {
                // Chưa cấu hình khóa: từ chối tất cả, tránh để webhook mở cho người ngoài
                return false;
            }

            const string scheme = "Apikey ";
            if (string.IsNullOrWhiteSpace(authorizationHeader) ||
                !authorizationHeader.StartsWith(scheme, StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            var provided = authorizationHeader.Substring(scheme.Length).Trim();
            return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(provided), Encoding.UTF8.GetBytes(expected));
        }
    }
}
