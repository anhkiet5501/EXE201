using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mimo.DomainLayer.Entities
{
    [Table("UserStats")]
    public class UserStats
    {
        [Key]
        public Guid UserId { get; set; }

        [ForeignKey("UserId")]
        public virtual User User { get; set; } = null!;

        [Range(0, 5)]
        public int Hearts { get; set; } = 5;

        public DateTime HeartsUpdatedAt { get; set; } = DateTime.UtcNow;

        public int Streak { get; set; } = 0;

        public DateOnly? LastActiveDate { get; set; }

        public int StreakFreezeCount { get; set; } = 0;

        public bool IsPro { get; set; } = false;

        public DateTime? ProExpiresAt { get; set; }

        /// <summary>
        /// Lazy Heart Regeneration theo công thức tại AGENT.md Section 5.1
        /// 1 Tim hồi phục mỗi 4 tiếng (14,400 giây). Tối đa 5 Tim.
        /// </summary>
        /// <summary>
        /// Hạ cờ Pro nếu gói đã hết hạn (ProExpiresAt đã qua). Pro không có ProExpiresAt (cấp tay) được giữ nguyên.
        /// Trả về true nếu có thay đổi để nơi gọi lưu lại.
        /// </summary>
        public bool ExpireProIfNeeded(DateTime currentUtc)
        {
            if (!IsPro || !ProExpiresAt.HasValue || ProExpiresAt.Value > currentUtc)
            {
                return false;
            }

            IsPro = false;
            // Bắt đầu tính hồi tim tự nhiên từ lúc hết hạn
            HeartsUpdatedAt = currentUtc;
            return true;
        }

        public (int currentHearts, int nextHeartInSeconds, bool updated) CalculateCurrentHearts(DateTime currentUtc)
        {
            bool proExpired = ExpireProIfNeeded(currentUtc);

            if (IsPro)
            {
                return (5, 0, false);
            }

            if (Hearts >= 5)
            {
                return (5, 0, proExpired);
            }

            var timeDiff = currentUtc - HeartsUpdatedAt;
            if (timeDiff <= TimeSpan.Zero)
            {
                return (Hearts, (int)TimeSpan.FromHours(4).TotalSeconds, proExpired);
            }

            var fourHours = TimeSpan.FromHours(4);
            int recoveredHearts = (int)(timeDiff.TotalSeconds / fourHours.TotalSeconds);
            bool updated = proExpired;

            if (recoveredHearts > 0)
            {
                int newHearts = Math.Min(5, Hearts + recoveredHearts);
                Hearts = newHearts;
                HeartsUpdatedAt = HeartsUpdatedAt.Add(TimeSpan.FromSeconds(recoveredHearts * fourHours.TotalSeconds));
                updated = true;
            }

            if (Hearts >= 5)
            {
                return (5, 0, updated);
            }

            var timeUntilNext = (HeartsUpdatedAt.Add(fourHours)) - currentUtc;
            int nextHeartInSeconds = (int)Math.Max(0, timeUntilNext.TotalSeconds);
            return (Hearts, nextHeartInSeconds, updated);
        }
    }
}
