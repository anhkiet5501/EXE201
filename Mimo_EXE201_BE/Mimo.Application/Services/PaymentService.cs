using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Cryptography;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Mimo.Application.DTOs.Payment;
using Mimo.Application.Repositories;
using Mimo.DomainLayer.Entities;
using Mimo.DomainLayer.Exceptions;
using Mimo.Application.Helper.Payment;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.Application.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly IGenericRepository<Transaction> _transactionRepository;
        private readonly IGenericRepository<UserStats> _statsRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<Course> _courseRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly VnPayOptions _vnPayOptions;
        private readonly SePayOptions _sePayOptions;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(
            IGenericRepository<Transaction> transactionRepository,
            IGenericRepository<UserStats> statsRepository,
            IGenericRepository<User> userRepository,
            IGenericRepository<Course> courseRepository,
            IUnitOfWork unitOfWork,
            IOptions<VnPayOptions> vnPayOptions,
            IOptions<SePayOptions> sePayOptions,
            ILogger<PaymentService> logger)
        {
            _transactionRepository = transactionRepository;
            _statsRepository = statsRepository;
            _userRepository = userRepository;
            _courseRepository = courseRepository;
            _unitOfWork = unitOfWork;
            _vnPayOptions = vnPayOptions.Value;
            _sePayOptions = sePayOptions.Value;
            _logger = logger;
        }

        public async Task<PaymentUrlResponseDto> CreateVnPayPaymentUrlAsync(
            Guid userId,
            CreatePaymentRequestDto request,
            string ipAddress,
            CancellationToken cancellationToken = default)
        {
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin tài khoản người dùng.");
            }

            decimal amount = 0;
            string orderInfo = "";
            string rawPlanCode = request.PlanCode?.Trim().ToUpperInvariant() ?? "";
            string planCode = rawPlanCode;
            if (planCode.StartsWith("MIMO_"))
            {
                planCode = planCode.Substring(5);
            }

            if (!string.IsNullOrEmpty(planCode))
            {
                switch (planCode)
                {
                    case "PREMIUM_1M":
                        amount = 79000;
                        orderInfo = $"MIMO - Nang cap goi Pro 1 Thang ({user.Email})";
                        break;
                    case "PREMIUM_3M":
                        amount = 219000;
                        orderInfo = $"MIMO - Nang cap goi Pro 3 Thang ({user.Email})";
                        break;
                    case "PREMIUM_6M":
                        amount = 399000;
                        orderInfo = $"MIMO - Nang cap goi Pro 6 Thang ({user.Email})";
                        break;
                    default:
                        throw new BadRequestException($"Gói đăng ký '{request.PlanCode}' không hợp lệ.");
                }
            }
            else if (request.CourseId.HasValue)
            {
                var course = await _courseRepository.FirstOrDefaultAsync(c => c.Id == request.CourseId.Value);
                if (course == null)
                {
                    throw new NotFoundException("Không tìm thấy khóa học yêu cầu thanh toán.");
                }

                amount = course.Price;
                orderInfo = $"MIMO - Mua khoa hoc {course.Title} ({user.Email})";
            }
            else
            {
                throw new BadRequestException("Cần cung cấp PlanCode hoặc CourseId để thanh toán.");
            }

            if (!string.IsNullOrEmpty(request.OrderInfo))
            {
                orderInfo = request.OrderInfo;
            }

            // Sinh mã tham chiếu giao dịch độc nhất
            var timestamp = DateTime.UtcNow.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture);
            var randomSuffix = Guid.NewGuid().ToString("N")[..8];
            var txnRef = $"{timestamp}_{randomSuffix}";

            // Dùng UnitOfWork bọc Transaction tạo bản ghi Pending
            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                var transaction = new Transaction
                {
                    UserId = userId,
                    CourseId = request.CourseId,
                    PlanCode = string.IsNullOrEmpty(planCode) ? null : planCode,
                    TxnRef = txnRef,
                    OrderInfo = orderInfo,
                    Amount = amount,
                    Currency = "VND",
                    PaymentMethod = PaymentMethodEnum.VNPay,
                    Status = TransactionStatusEnum.Pending,
                    TransactionDate = DateTime.UtcNow
                };

                await _transactionRepository.CreateAsync(transaction);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                _logger.LogInformation("Khởi tạo giao dịch VNPay thành công. TxnRef: {TxnRef}, UserId: {UserId}, Amount: {Amount}",
                    txnRef, userId, amount);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi lưu giao dịch Transaction vào Database. TxnRef: {TxnRef}", txnRef);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }

            // Xây dựng URL thanh toán VNPay
            var vnPay = new VnPayLibrary();
            var vnTimeZone = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var nowVn = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, vnTimeZone);

            vnPay.AddRequestData("vnp_Version", _vnPayOptions.Version);
            vnPay.AddRequestData("vnp_Command", _vnPayOptions.Command);
            vnPay.AddRequestData("vnp_TmnCode", _vnPayOptions.TmnCode);
            vnPay.AddRequestData("vnp_Amount", ((long)(amount * 100)).ToString(CultureInfo.InvariantCulture));
            vnPay.AddRequestData("vnp_CreateDate", nowVn.ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture));
            vnPay.AddRequestData("vnp_CurrCode", _vnPayOptions.CurrCode);
            vnPay.AddRequestData("vnp_IpAddr", string.IsNullOrWhiteSpace(ipAddress) ? "127.0.0.1" : ipAddress);
            vnPay.AddRequestData("vnp_Locale", _vnPayOptions.Locale);
            vnPay.AddRequestData("vnp_OrderInfo", orderInfo);
            vnPay.AddRequestData("vnp_OrderType", "other");
            vnPay.AddRequestData("vnp_ReturnUrl", _vnPayOptions.ReturnUrl);
            vnPay.AddRequestData("vnp_TxnRef", txnRef);
            vnPay.AddRequestData("vnp_ExpireDate", nowVn.AddMinutes(15).ToString("yyyyMMddHHmmss", CultureInfo.InvariantCulture));

            var paymentUrl = vnPay.CreateRequestUrl(_vnPayOptions.BaseUrl, _vnPayOptions.HashSecret);

            return new PaymentUrlResponseDto
            {
                PaymentUrl = paymentUrl,
                TxnRef = txnRef,
                Amount = amount,
                PlanCode = planCode,
                OrderInfo = orderInfo
            };
        }

        public async Task<PaymentResultDto> ProcessVnPayCallbackAsync(
            IQueryCollection queryParams,
            CancellationToken cancellationToken = default)
        {
            var vnPay = new VnPayLibrary();
            foreach (var key in queryParams.Keys)
            {
                var value = queryParams[key].ToString();
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnPay.AddResponseData(key, value);
                }
            }

            var inputHash = queryParams["vnp_SecureHash"].ToString();
            var isValidSignature = vnPay.ValidateSignature(inputHash, _vnPayOptions.HashSecret);
            if (!isValidSignature)
            {
                _logger.LogWarning("Chữ ký VNPay Callback không hợp lệ.");
                throw new BadRequestException("Chữ ký VNPay không hợp lệ.");
            }

            var txnRef = vnPay.GetResponseData("vnp_TxnRef");
            var vnpResponseCode = vnPay.GetResponseData("vnp_ResponseCode");
            var vnpTransactionNo = vnPay.GetResponseData("vnp_TransactionNo");
            var vnpBankCode = vnPay.GetResponseData("vnp_BankCode");
            var vnpAmountStr = vnPay.GetResponseData("vnp_Amount");

            long.TryParse(vnpAmountStr, out var vnpAmount);
            var amount = vnpAmount / 100;

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                var transaction = await _transactionRepository.FirstOrDefaultAsync(t => t.TxnRef == txnRef);
                if (transaction == null)
                {
                    _logger.LogWarning("Không tìm thấy giao dịch với TxnRef: {TxnRef}", txnRef);
                    throw new NotFoundException($"Không tìm thấy giao dịch với mã tham chiếu '{txnRef}'.");
                }

                // Nếu giao dịch đã hoàn tất trước đó (Idempotency)
                if (transaction.Status == TransactionStatusEnum.Success)
                {
                    var userStatsExisting = await _statsRepository.FirstOrDefaultAsync(s => s.UserId == transaction.UserId);
                    await _unitOfWork.CommitTransactionAsync(cancellationToken);

                    return new PaymentResultDto
                    {
                        TxnRef = transaction.TxnRef,
                        VnpayTransactionNo = transaction.VnpayTransactionNo,
                        BankCode = transaction.BankCode,
                        Amount = transaction.Amount,
                        Status = "Success",
                        Message = "Giao dịch đã được ghi nhận thành công trước đó.",
                        PlanCode = transaction.PlanCode,
                        IsPro = userStatsExisting?.IsPro ?? true,
                        ProExpiresAt = userStatsExisting?.ProExpiresAt,
                        StreakFreezeAdded = 0
                    };
                }

                transaction.VnpayResponseCode = vnpResponseCode;
                transaction.VnpayTransactionNo = vnpTransactionNo;
                transaction.BankCode = vnpBankCode;
                transaction.CompletedAt = DateTime.UtcNow;

                bool isSuccess = vnpResponseCode == "00";
                int streakFreezeAdded = 0;
                bool isPro = false;
                DateTime? proExpiresAt = null;

                if (isSuccess)
                {
                    transaction.Status = TransactionStatusEnum.Success;

                    // Kích hoạt hoặc gia hạn gói Mimo Pro cho người dùng
                    if (!string.IsNullOrEmpty(transaction.PlanCode))
                    {
                        var activation = await ActivatePlanAsync(transaction.UserId, transaction.PlanCode);
                        streakFreezeAdded = activation.StreakFreezeAdded;
                        isPro = activation.Stats.IsPro;
                        proExpiresAt = activation.Stats.ProExpiresAt;
                    }
                }
                else
                {
                    transaction.Status = TransactionStatusEnum.Failed;
                    _logger.LogWarning("Thanh toán VNPay thất bại hoặc bị hủy. TxnRef: {TxnRef}, ResponseCode: {Code}",
                        txnRef, vnpResponseCode);
                }

                await _transactionRepository.UpdateAsync(transaction);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                return new PaymentResultDto
                {
                    TxnRef = txnRef,
                    VnpayTransactionNo = vnpTransactionNo,
                    BankCode = vnpBankCode,
                    Amount = amount,
                    Status = isSuccess ? "Success" : "Failed",
                    Message = isSuccess
                        ? "Thanh toán thành công! Gói Mimo Pro đã được kích hoạt."
                        : "Thanh toán không thành công hoặc giao dịch đã bị hủy bởi người dùng.",
                    PlanCode = transaction.PlanCode,
                    IsPro = isPro,
                    ProExpiresAt = proExpiresAt,
                    StreakFreezeAdded = streakFreezeAdded
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý Callback giao dịch VNPay. TxnRef: {TxnRef}", txnRef);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }
        }

        public async Task<(string code, string message)> ProcessVnPayIpnAsync(
            IQueryCollection queryParams,
            CancellationToken cancellationToken = default)
        {
            var vnPay = new VnPayLibrary();
            foreach (var key in queryParams.Keys)
            {
                var value = queryParams[key].ToString();
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnPay.AddResponseData(key, value);
                }
            }

            var inputHash = queryParams["vnp_SecureHash"].ToString();
            var isValidSignature = vnPay.ValidateSignature(inputHash, _vnPayOptions.HashSecret);
            if (!isValidSignature)
            {
                return ("97", "Invalid signature");
            }

            var txnRef = vnPay.GetResponseData("vnp_TxnRef");
            var vnpResponseCode = vnPay.GetResponseData("vnp_ResponseCode");
            var vnpTransactionNo = vnPay.GetResponseData("vnp_TransactionNo");
            var vnpBankCode = vnPay.GetResponseData("vnp_BankCode");
            var vnpAmountStr = vnPay.GetResponseData("vnp_Amount");

            long.TryParse(vnpAmountStr, out var vnpAmount);
            var amount = vnpAmount / 100;

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                var transaction = await _transactionRepository.FirstOrDefaultAsync(t => t.TxnRef == txnRef);
                if (transaction == null)
                {
                    await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                    return ("01", "Order not found");
                }

                if (transaction.Amount != amount)
                {
                    await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                    return ("04", "Invalid amount");
                }

                if (transaction.Status == TransactionStatusEnum.Success || transaction.Status == TransactionStatusEnum.Failed)
                {
                    await _unitOfWork.CommitTransactionAsync(cancellationToken);
                    return ("02", "Order already confirmed");
                }

                transaction.VnpayResponseCode = vnpResponseCode;
                transaction.VnpayTransactionNo = vnpTransactionNo;
                transaction.BankCode = vnpBankCode;
                transaction.CompletedAt = DateTime.UtcNow;

                if (vnpResponseCode == "00")
                {
                    transaction.Status = TransactionStatusEnum.Success;

                    if (!string.IsNullOrEmpty(transaction.PlanCode))
                    {
                        await ActivatePlanAsync(transaction.UserId, transaction.PlanCode);
                    }
                }
                else
                {
                    transaction.Status = TransactionStatusEnum.Failed;
                }

                await _transactionRepository.UpdateAsync(transaction);
                await _unitOfWork.CommitTransactionAsync(cancellationToken);

                return ("00", "Confirm Success");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý IPN VNPay cho TxnRef: {TxnRef}", txnRef);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                return ("99", "Unknown error");
            }
        }

        public async Task<List<TransactionDto>> GetUserTransactionsAsync(
            Guid userId,
            CancellationToken cancellationToken = default)
        {
            var transactions = await _transactionRepository.WhereAsync(t => t.UserId == userId);
            return transactions
                .OrderByDescending(t => t.TransactionDate)
                .Select(t => new TransactionDto
                {
                    Id = t.Id,
                    TxnRef = t.TxnRef,
                    PlanCode = t.PlanCode,
                    CourseId = t.CourseId,
                    Amount = t.Amount,
                    Currency = t.Currency,
                    PaymentMethod = t.PaymentMethod.ToString(),
                    Status = t.Status.ToString(),
                    TransactionDate = t.TransactionDate,
                    CompletedAt = t.CompletedAt,
                    OrderInfo = t.OrderInfo
                })
                .ToList();
        }

        // =====================================================================
        // KÍCH HOẠT GÓI PRO (dùng chung cho mọi cổng thanh toán)
        // =====================================================================

        private sealed record PlanActivation(UserStats Stats, int StreakFreezeAdded);

        /// <summary>
        /// Kích hoạt hoặc gia hạn Mimo Pro: cộng dồn ngày nếu còn hạn, tặng bùa Streak Freeze theo gói, hồi đầy tim.
        /// Gọi bên trong transaction của nơi gọi. Mã gói không hợp lệ được coi như gói 1 tháng (hành vi cũ).
        /// </summary>
        private async Task<PlanActivation> ActivatePlanAsync(Guid userId, string? planCode)
        {
            var plan = PaymentPlans.Resolve(planCode) ?? PaymentPlans.Resolve("PREMIUM_1M")!;
            var now = DateTime.UtcNow;

            var stats = await _statsRepository.FirstOrDefaultAsync(s => s.UserId == userId);
            if (stats == null)
            {
                stats = new UserStats
                {
                    UserId = userId,
                    Hearts = 5,
                    HeartsUpdatedAt = now,
                    Streak = 0,
                    StreakFreezeCount = 0
                };
                await _statsRepository.CreateAsync(stats);
            }

            stats.IsPro = true;
            stats.ProExpiresAt = stats.ProExpiresAt.HasValue && stats.ProExpiresAt.Value > now
                ? stats.ProExpiresAt.Value.AddDays(plan.Days)
                : now.AddDays(plan.Days);
            stats.StreakFreezeCount += plan.StreakFreezeBonus;
            stats.Hearts = 5;
            stats.HeartsUpdatedAt = now;

            await _statsRepository.UpdateAsync(stats);

            _logger.LogInformation("Kích hoạt Mimo Pro cho User {UserId}. Plan: {Plan}, ProExpiresAt: {ExpiresAt}, Bùa Freeze tặng: {Freeze}",
                userId, plan.Code, stats.ProExpiresAt, plan.StreakFreezeBonus);

            return new PlanActivation(stats, plan.StreakFreezeBonus);
        }

        // =====================================================================
        // THANH TOÁN CHUYỂN KHOẢN QUA SEPAY (VietQR + Webhook)
        // =====================================================================

        private const string OrderCodeAlphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        private const int OrderCodeLength = 8;

        private TimeSpan OrderLifetime => TimeSpan.FromMinutes(Math.Max(5, _sePayOptions.OrderExpiryMinutes));

        private void EnsureSePayConfigured()
        {
            if (string.IsNullOrWhiteSpace(_sePayOptions.BankCode) || string.IsNullOrWhiteSpace(_sePayOptions.AccountNumber))
            {
                _logger.LogError("Thiếu cấu hình SePay (SePay__BankCode / SePay__AccountNumber).");
                throw new ServiceUnavailableException("Cổng thanh toán chưa được cấu hình. Vui lòng thử lại sau.");
            }
        }

        private string GenerateOrderCode()
        {
            var chars = new char[OrderCodeLength];
            for (int i = 0; i < chars.Length; i++)
            {
                chars[i] = OrderCodeAlphabet[RandomNumberGenerator.GetInt32(OrderCodeAlphabet.Length)];
            }

            return _sePayOptions.OrderPrefix.ToUpperInvariant() + new string(chars);
        }

        private PaymentOrderDto BuildOrderDto(Transaction txn, PaymentPlan plan)
        {
            var qrUrl = $"{_sePayOptions.QrBaseUrl}?acc={Uri.EscapeDataString(_sePayOptions.AccountNumber)}" +
                        $"&bank={Uri.EscapeDataString(_sePayOptions.BankCode)}" +
                        $"&amount={(long)txn.Amount}" +
                        $"&des={Uri.EscapeDataString(txn.TxnRef)}&template=compact";

            return new PaymentOrderDto
            {
                TxnRef = txn.TxnRef,
                PlanCode = plan.Code,
                PlanName = plan.Name,
                Amount = txn.Amount,
                TransferContent = txn.TxnRef,
                BankCode = _sePayOptions.BankCode,
                AccountNumber = _sePayOptions.AccountNumber,
                AccountName = _sePayOptions.AccountName,
                QrUrl = qrUrl,
                ExpiresAt = txn.TransactionDate.Add(OrderLifetime),
                Status = txn.Status.ToString()
            };
        }

        public async Task<PaymentOrderDto> CreateOrderAsync(
            Guid userId,
            CreateOrderRequestDto request,
            CancellationToken cancellationToken = default)
        {
            var plan = PaymentPlans.Resolve(request.PlanCode)
                ?? throw new BadRequestException($"Gói đăng ký '{request.PlanCode}' không hợp lệ.");

            EnsureSePayConfigured();

            var now = DateTime.UtcNow;

            // Dùng lại đơn đang chờ cùng gói (chưa quá hạn) để tránh tạo đơn rác mỗi lần bấm
            var pendingOrders = await _transactionRepository.WhereAsync(t =>
                t.UserId == userId &&
                t.PaymentMethod == PaymentMethodEnum.BankTransfer &&
                t.Status == TransactionStatusEnum.Pending &&
                t.PlanCode == plan.Code);

            var reusable = pendingOrders
                .OrderByDescending(t => t.TransactionDate)
                .FirstOrDefault(t => t.TransactionDate.Add(OrderLifetime) > now);
            if (reusable != null)
            {
                return BuildOrderDto(reusable, plan);
            }

            string code;
            do
            {
                code = GenerateOrderCode();
            }
            while (await _transactionRepository.FirstOrDefaultAsync(t => t.TxnRef == code) != null);

            var transaction = await _transactionRepository.CreateAsync(new Transaction
            {
                UserId = userId,
                PlanCode = plan.Code,
                TxnRef = code,
                OrderInfo = $"MIMO - Nang cap goi {plan.Name}",
                Amount = plan.Amount,
                Currency = "VND",
                PaymentMethod = PaymentMethodEnum.BankTransfer,
                Status = TransactionStatusEnum.Pending,
                TransactionDate = now
            });

            _logger.LogInformation("Tạo đơn chuyển khoản SePay. TxnRef: {TxnRef}, UserId: {UserId}, Plan: {Plan}, Amount: {Amount}",
                code, userId, plan.Code, plan.Amount);

            return BuildOrderDto(transaction, plan);
        }

        public async Task<OrderStatusDto> GetOrderStatusAsync(
            Guid userId,
            string txnRef,
            CancellationToken cancellationToken = default)
        {
            var normalized = (txnRef ?? string.Empty).Trim().ToUpperInvariant();
            var transaction = await _transactionRepository.FirstOrDefaultAsync(t => t.TxnRef == normalized && t.UserId == userId)
                ?? throw new NotFoundException("Không tìm thấy đơn thanh toán.");

            var expiresAt = transaction.TransactionDate.Add(OrderLifetime);
            var status = transaction.Status.ToString();

            // Quá hạn hiển thị: chưa có tiền về. Nếu tiền về muộn, webhook vẫn kích hoạt gói và trạng thái sẽ thành Success.
            if (transaction.Status == TransactionStatusEnum.Pending && DateTime.UtcNow > expiresAt)
            {
                status = "Expired";
            }

            return new OrderStatusDto
            {
                TxnRef = transaction.TxnRef,
                Status = status,
                PlanCode = transaction.PlanCode,
                Amount = transaction.Amount,
                PaymentMethod = transaction.PaymentMethod.ToString(),
                ExpiresAt = expiresAt,
                CompletedAt = transaction.CompletedAt
            };
        }

        private string? ExtractOrderCode(string? code, string? content)
        {
            var prefix = Regex.Escape(_sePayOptions.OrderPrefix);
            var pattern = new Regex($"{prefix}[A-Za-z0-9]{{{OrderCodeLength}}}", RegexOptions.IgnoreCase);

            foreach (var candidate in new[] { code, content })
            {
                if (string.IsNullOrWhiteSpace(candidate)) continue;
                var match = pattern.Match(candidate);
                if (match.Success) return match.Value.ToUpperInvariant();
            }

            return null;
        }

        public async Task<SePayWebhookOutcome> ProcessSePayWebhookAsync(
            SePayWebhookDto payload,
            CancellationToken cancellationToken = default)
        {
            // Chỉ quan tâm tiền VÀO
            if (!string.Equals(payload.TransferType, "in", StringComparison.OrdinalIgnoreCase))
            {
                return SePayWebhookOutcome.Ignored;
            }

            var gatewayTxnId = $"SEPAY_{payload.Id}";

            // Chống xử lý trùng: SePay có thể gửi lại cùng một giao dịch (retry)
            var duplicate = await _transactionRepository.FirstOrDefaultAsync(t => t.VnpayTransactionNo == gatewayTxnId);
            if (duplicate != null)
            {
                _logger.LogInformation("Webhook SePay trùng, bỏ qua. SePayId: {Id}", payload.Id);
                return SePayWebhookOutcome.Duplicate;
            }

            var orderCode = ExtractOrderCode(payload.Code, payload.Content);
            if (orderCode == null)
            {
                _logger.LogInformation("Webhook SePay không có mã đơn {Prefix}*, bỏ qua. SePayId: {Id}", _sePayOptions.OrderPrefix, payload.Id);
                return SePayWebhookOutcome.Ignored;
            }

            var transaction = await _transactionRepository.FirstOrDefaultAsync(t =>
                t.TxnRef == orderCode && t.PaymentMethod == PaymentMethodEnum.BankTransfer);
            if (transaction == null)
            {
                _logger.LogWarning("Webhook SePay: không tìm thấy đơn {OrderCode}. SePayId: {Id}, Amount: {Amount}",
                    orderCode, payload.Id, payload.TransferAmount);
                return SePayWebhookOutcome.Ignored;
            }

            if (transaction.Status == TransactionStatusEnum.Success)
            {
                _logger.LogWarning("Webhook SePay: đơn {OrderCode} đã thanh toán trước đó, giao dịch mới {Id} cần đối soát thủ công (có thể chuyển dư).",
                    orderCode, payload.Id);
                return SePayWebhookOutcome.Duplicate;
            }

            if (transaction.Status != TransactionStatusEnum.Pending)
            {
                _logger.LogWarning("Webhook SePay: đơn {OrderCode} ở trạng thái {Status}, không kích hoạt. SePayId: {Id}",
                    orderCode, transaction.Status, payload.Id);
                return SePayWebhookOutcome.Ignored;
            }

            if (payload.TransferAmount < transaction.Amount)
            {
                _logger.LogWarning("Webhook SePay: đơn {OrderCode} chuyển thiếu tiền (nhận {Received}, cần {Expected}). SePayId: {Id}, cần xử lý thủ công.",
                    orderCode, payload.TransferAmount, transaction.Amount, payload.Id);
                return SePayWebhookOutcome.Ignored;
            }

            var paidLate = DateTime.UtcNow > transaction.TransactionDate.Add(OrderLifetime);

            await _unitOfWork.BeginTransactionAsync(cancellationToken);
            try
            {
                transaction.Status = TransactionStatusEnum.Success;
                transaction.CompletedAt = DateTime.UtcNow;
                transaction.VnpayTransactionNo = gatewayTxnId;
                transaction.VnpayResponseCode = "00";
                var gateway = payload.Gateway?.Trim();
                transaction.BankCode = string.IsNullOrEmpty(gateway) ? null : (gateway.Length > 20 ? gateway[..20] : gateway);
                await _transactionRepository.UpdateAsync(transaction);

                // Hai webhook song song cho cùng một đơn sẽ cùng sửa UserStats (có xmin): bên thua bị rollback và SePay sẽ gửi lại -> Duplicate
                await ActivatePlanAsync(transaction.UserId, transaction.PlanCode);

                await _unitOfWork.CommitTransactionAsync(cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Lỗi khi xử lý webhook SePay cho đơn {OrderCode}", orderCode);
                await _unitOfWork.RollbackTransactionAsync(cancellationToken);
                throw;
            }

            _logger.LogInformation("Thanh toán SePay thành công. Đơn {OrderCode}, SePayId {Id}, Số tiền {Amount}{Late}",
                orderCode, payload.Id, payload.TransferAmount, paidLate ? " (trả muộn sau thời hạn đơn)" : string.Empty);

            return SePayWebhookOutcome.Processed;
        }
    }
}
