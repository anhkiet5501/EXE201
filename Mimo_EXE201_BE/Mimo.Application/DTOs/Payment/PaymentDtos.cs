using System;
using System.ComponentModel.DataAnnotations;

namespace Mimo.Application.DTOs.Payment
{
    public class CreatePaymentRequestDto
    {
        [Required(ErrorMessage = "PlanCode hoặc CourseId là bắt buộc")]
        public string? PlanCode { get; set; }

        public Guid? CourseId { get; set; }

        public string? OrderInfo { get; set; }
    }

    public class PaymentUrlResponseDto
    {
        public string PaymentUrl { get; set; } = string.Empty;
        public string TxnRef { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string PlanCode { get; set; } = string.Empty;
        public string OrderInfo { get; set; } = string.Empty;
    }

    public class PaymentResultDto
    {
        public string TxnRef { get; set; } = string.Empty;
        public string? VnpayTransactionNo { get; set; }
        public string? BankCode { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string? PlanCode { get; set; }
        public bool IsPro { get; set; }
        public DateTime? ProExpiresAt { get; set; }
        public int StreakFreezeAdded { get; set; }
    }

    public class TransactionDto
    {
        public Guid Id { get; set; }
        public string TxnRef { get; set; } = string.Empty;
        public string? PlanCode { get; set; }
        public Guid? CourseId { get; set; }
        public decimal Amount { get; set; }
        public string Currency { get; set; } = "VND";
        public string PaymentMethod { get; set; } = "VNPay";
        public string Status { get; set; } = string.Empty;
        public DateTime TransactionDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? OrderInfo { get; set; }
    }
    public class CreateOrderRequestDto
    {
        [Required(ErrorMessage = "PlanCode là bắt buộc")]
        public string? PlanCode { get; set; }
    }

    /// <summary>Đơn chuyển khoản chờ thanh toán kèm thông tin để hiển thị mã QR.</summary>
    public class PaymentOrderDto
    {
        public string TxnRef { get; set; } = string.Empty;
        public string PlanCode { get; set; } = string.Empty;
        public string PlanName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string TransferContent { get; set; } = string.Empty;
        public string BankCode { get; set; } = string.Empty;
        public string AccountNumber { get; set; } = string.Empty;
        public string AccountName { get; set; } = string.Empty;
        public string QrUrl { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public string Status { get; set; } = "Pending";
    }

    /// <summary>Trạng thái đơn: Pending | Success | Failed | Refunded | Expired (quá hạn hiển thị, chưa có tiền về).</summary>
    public class OrderStatusDto
    {
        public string TxnRef { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? PlanCode { get; set; }
        public decimal Amount { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    /// <summary>Payload webhook "có biến động số dư" do SePay gửi tới.</summary>
    public class SePayWebhookDto
    {
        public long Id { get; set; }
        public string? Gateway { get; set; }
        public string? TransactionDate { get; set; }
        public string? AccountNumber { get; set; }
        public string? Code { get; set; }
        public string? Content { get; set; }
        public string? TransferType { get; set; }
        public decimal TransferAmount { get; set; }
        public decimal Accumulated { get; set; }
        public string? SubAccount { get; set; }
        public string? ReferenceCode { get; set; }
        public string? Description { get; set; }
    }
}
