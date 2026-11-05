using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Mimo.Application.DTOs.Payment;

namespace Mimo.Application.Services
{
    public interface IPaymentService
    {
        Task<PaymentUrlResponseDto> CreateVnPayPaymentUrlAsync(Guid userId, CreatePaymentRequestDto request, string ipAddress, CancellationToken cancellationToken = default);
        Task<PaymentResultDto> ProcessVnPayCallbackAsync(IQueryCollection queryParams, CancellationToken cancellationToken = default);
        Task<(string code, string message)> ProcessVnPayIpnAsync(IQueryCollection queryParams, CancellationToken cancellationToken = default);
        Task<PaymentOrderDto> CreateOrderAsync(Guid userId, CreateOrderRequestDto request, CancellationToken cancellationToken = default);
        Task<OrderStatusDto> GetOrderStatusAsync(Guid userId, string txnRef, CancellationToken cancellationToken = default);
        Task<SePayWebhookOutcome> ProcessSePayWebhookAsync(SePayWebhookDto payload, CancellationToken cancellationToken = default);
        Task<List<TransactionDto>> GetUserTransactionsAsync(Guid userId, CancellationToken cancellationToken = default);
    }

    public enum SePayWebhookOutcome
    {
        /// <summary>Đã khớp đơn và kích hoạt gói.</summary>
        Processed,
        /// <summary>Giao dịch đã được xử lý trước đó (SePay gửi lại).</summary>
        Duplicate,
        /// <summary>Không phải tiền vào, không có mã đơn, không khớp đơn hoặc số tiền thiếu: không làm gì.</summary>
        Ignored
    }
}
