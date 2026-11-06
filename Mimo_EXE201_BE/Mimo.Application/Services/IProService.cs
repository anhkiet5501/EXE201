using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Mimo.Application.DTOs.Practice;
using Mimo.Application.DTOs.Pro;

namespace Mimo.Application.Services
{
    /// <summary>Quyền lợi dành riêng cho thành viên Mimo Pro. Mọi phương thức kiểm tra Pro ở phía server.</summary>
    public interface IProService
    {
        Task<ProRiskReportDto> GetRiskReportAsync(Guid userId, CancellationToken cancellationToken = default);

        Task<List<DeepReviewQuestionDto>> GetDeepReviewQuestionsAsync(Guid userId, CancellationToken cancellationToken = default);

        Task<DeepReviewAnswerResponseDto> SubmitDeepReviewAnswerAsync(Guid userId, PracticeAnswerRequestDto request, CancellationToken cancellationToken = default);
    }
}
