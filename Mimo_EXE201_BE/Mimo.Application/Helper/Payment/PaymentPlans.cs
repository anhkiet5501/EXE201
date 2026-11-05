using System;
using System.Collections.Generic;

namespace Mimo.Application.Helper.Payment
{
    public record PaymentPlan(string Code, string Name, decimal Amount, int Days, int StreakFreezeBonus);

    /// <summary>Bảng giá gói Mimo Pro: nguồn duy nhất cho mọi luồng thanh toán.</summary>
    public static class PaymentPlans
    {
        private static readonly Dictionary<string, PaymentPlan> Plans = new(StringComparer.OrdinalIgnoreCase)
        {
            ["PREMIUM_1M"] = new("PREMIUM_1M", "Pro 1 Tháng", 79000, 30, 0),
            ["PREMIUM_3M"] = new("PREMIUM_3M", "Pro 3 Tháng", 219000, 90, 1),
            ["PREMIUM_6M"] = new("PREMIUM_6M", "Pro 6 Tháng", 399000, 180, 2),
        };

        /// <summary>Chuẩn hóa mã gói (chấp nhận tiền tố MIMO_) và trả về gói, hoặc null nếu không hợp lệ.</summary>
        public static PaymentPlan? Resolve(string? planCode)
        {
            var clean = (planCode ?? string.Empty).Trim().ToUpperInvariant();
            if (clean.StartsWith("MIMO_"))
            {
                clean = clean.Substring(5);
            }

            return Plans.TryGetValue(clean, out var plan) ? plan : null;
        }
    }
}
