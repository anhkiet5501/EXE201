using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Mimo.Application.DTOs.Practice;
using Mimo.Application.DTOs.Pro;
using Mimo.Application.Helper;
using Mimo.Application.Repositories;
using Mimo.DomainLayer.Entities;
using Mimo.DomainLayer.Exceptions;

namespace Mimo.Application.Services
{
    public class ProService : IProService
    {
        private const int ReportDays = 30;
        private const int MinAnswersForFocus = 3;
        private const int MaxDeepReviewQuestions = 50;

        private readonly IGenericRepository<UserStats> _statsRepository;
        private readonly IGenericRepository<LessonSession> _sessionRepository;
        private readonly IGenericRepository<SessionAnswer> _answerRepository;
        private readonly IGenericRepository<Question> _questionRepository;
        private readonly IGenericRepository<Node> _nodeRepository;
        private readonly IQuestionGrader _questionGrader;
        private readonly ILogger<ProService> _logger;

        public ProService(
            IGenericRepository<UserStats> statsRepository,
            IGenericRepository<LessonSession> sessionRepository,
            IGenericRepository<SessionAnswer> answerRepository,
            IGenericRepository<Question> questionRepository,
            IGenericRepository<Node> nodeRepository,
            IQuestionGrader questionGrader,
            ILogger<ProService> logger)
        {
            _statsRepository = statsRepository;
            _sessionRepository = sessionRepository;
            _answerRepository = answerRepository;
            _questionRepository = questionRepository;
            _nodeRepository = nodeRepository;
            _questionGrader = questionGrader;
            _logger = logger;
        }

        /// <summary>Kiểm tra Pro ở phía server (có xử lý hết hạn). Không phải Pro -> 403.</summary>
        private async Task<UserStats> RequireProAsync(Guid userId)
        {
            var stats = await _statsRepository.FirstOrDefaultAsync(s => s.UserId == userId);
            if (stats != null && stats.ExpireProIfNeeded(DateTime.UtcNow))
            {
                await _statsRepository.UpdateAsync(stats);
            }

            if (stats == null || !stats.IsPro)
            {
                throw new ForbiddenException("Tính năng này dành cho thành viên Mimo Pro. Hãy nâng cấp để mở khóa!");
            }

            return stats;
        }

        public async Task<ProRiskReportDto> GetRiskReportAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var stats = await RequireProAsync(userId);
            var nowUtc = DateTime.UtcNow;
            var sinceUtc = nowUtc.AddDays(-ReportDays);

            var sessions = await _sessionRepository.WhereAsync(s => s.UserId == userId && s.StartedAt >= sinceUtc);
            var sessionIds = sessions.Select(s => s.Id).ToList();
            var answers = sessionIds.Count == 0
                ? new List<SessionAnswer>()
                : await _answerRepository.WhereAsync(a => sessionIds.Contains(a.SessionId));

            // session -> domain (qua Node -> Unit -> Domain)
            var nodeIds = sessions.Select(s => s.NodeId).Distinct().ToList();
            var nodes = nodeIds.Count == 0
                ? new List<Node>()
                : await _nodeRepository.WhereAsync(n => nodeIds.Contains(n.Id), "Unit.Domain");
            var nodeDomain = nodes
                .Where(n => n.Unit?.Domain != null)
                .ToDictionary(n => n.Id, n => n.Unit.Domain);
            var sessionNode = sessions.ToDictionary(s => s.Id, s => s.NodeId);

            Domain? DomainOf(SessionAnswer a) =>
                sessionNode.TryGetValue(a.SessionId, out var nodeId) && nodeDomain.TryGetValue(nodeId, out var d) ? d : null;

            int total = answers.Count;
            int correct = answers.Count(a => a.IsCorrect);

            var domainStats = answers
                .Select(a => new { Answer = a, Domain = DomainOf(a) })
                .Where(x => x.Domain != null)
                .GroupBy(x => x.Domain!.Id)
                .Select(g =>
                {
                    var domain = g.First().Domain!;
                    int t = g.Count();
                    int wrong = g.Count(x => !x.Answer.IsCorrect);
                    return new DomainRiskDto
                    {
                        DomainId = domain.Id,
                        DomainName = domain.Name,
                        Slug = domain.Slug,
                        TotalAnswers = t,
                        WrongAnswers = wrong,
                        AccuracyPercent = t > 0 ? (int)Math.Round((t - wrong) * 100.0 / t) : 0
                    };
                })
                .OrderBy(d => d.AccuracyPercent)
                .ThenByDescending(d => d.WrongAnswers)
                .ToList();

            // Top 5 câu sai nhiều nhất
            var wrongByQuestion = answers
                .Where(a => !a.IsCorrect)
                .GroupBy(a => a.QuestionId)
                .Select(g => new { QuestionId = g.Key, Count = g.Count(), Sample = g.First() })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .ToList();

            var weakIds = wrongByQuestion.Select(x => x.QuestionId).ToList();
            var weakQuestions = weakIds.Count == 0
                ? new List<Question>()
                : await _questionRepository.WhereAsync(q => weakIds.Contains(q.Id));

            var weak = wrongByQuestion
                .Select(x => new WeakQuestionDto
                {
                    QuestionId = x.QuestionId,
                    Title = weakQuestions.FirstOrDefault(q => q.Id == x.QuestionId)?.Title ?? string.Empty,
                    TimesWrong = x.Count,
                    DomainName = DomainOf(x.Sample)?.Name ?? string.Empty
                })
                .Where(w => !string.IsNullOrEmpty(w.Title))
                .ToList();

            // 7 ngày gần nhất theo múi giờ Việt Nam (UTC+7)
            var vnToday = DateOnly.FromDateTime(nowUtc.AddHours(7));
            var daily = new List<DailyAccuracyDto>();
            for (int i = 6; i >= 0; i--)
            {
                var day = vnToday.AddDays(-i);
                var dayAnswers = answers.Where(a =>
                    a.CreatedAt.HasValue && DateOnly.FromDateTime(a.CreatedAt.Value.AddHours(7)) == day).ToList();
                daily.Add(new DailyAccuracyDto
                {
                    Date = day.ToString("yyyy-MM-dd"),
                    Total = dayAnswers.Count,
                    Correct = dayAnswers.Count(a => a.IsCorrect)
                });
            }

            var focus = domainStats.FirstOrDefault(d => d.TotalAnswers >= MinAnswersForFocus && d.AccuracyPercent < 100);
            string focusMessage = focus != null
                ? $"Bạn hay mắc lỗi ở chủ đề \"{focus.DomainName}\" (đúng {focus.AccuracyPercent}%). Hãy ôn tập chuyên sâu các câu sai thuộc chủ đề này trước."
                : total == 0
                    ? "Chưa có dữ liệu trong 30 ngày qua. Hãy hoàn thành vài bài học để Mimo phân tích điểm yếu của bạn."
                    : "Tuyệt vời! Chưa phát hiện chủ đề nào có nguy cơ cao. Hãy tiếp tục duy trì phản xạ an toàn.";

            int? daysLeft = stats.ProExpiresAt.HasValue
                ? Math.Max(0, (int)Math.Ceiling((stats.ProExpiresAt.Value - nowUtc).TotalDays))
                : null;

            return new ProRiskReportDto
            {
                PeriodDays = ReportDays,
                TotalAnswers = total,
                CorrectAnswers = correct,
                AccuracyPercent = total > 0 ? (int)Math.Round(correct * 100.0 / total) : 0,
                Domains = domainStats,
                WeakQuestions = weak,
                Daily = daily,
                FocusDomainName = focus?.DomainName,
                FocusMessage = focusMessage,
                ProExpiresAt = stats.ProExpiresAt,
                DaysLeft = daysLeft
            };
        }

        /// <summary>Các câu người dùng từng trả lời sai (mọi thời điểm), kể cả câu đã giải quyết ở phòng ôn tập thường.</summary>
        private async Task<List<IGrouping<Guid, SessionAnswer>>> GetWrongAnswerGroupsAsync(Guid userId)
        {
            var sessions = await _sessionRepository.WhereAsync(s => s.UserId == userId);
            var sessionIds = sessions.Select(s => s.Id).ToList();
            if (sessionIds.Count == 0)
            {
                return new List<IGrouping<Guid, SessionAnswer>>();
            }

            var wrongAnswers = await _answerRepository.WhereAsync(a => sessionIds.Contains(a.SessionId) && !a.IsCorrect);
            return wrongAnswers.GroupBy(a => a.QuestionId).ToList();
        }

        public async Task<List<DeepReviewQuestionDto>> GetDeepReviewQuestionsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            await RequireProAsync(userId);

            var groups = (await GetWrongAnswerGroupsAsync(userId))
                .OrderByDescending(g => g.Count())
                .ThenByDescending(g => g.Max(a => a.CreatedAt))
                .Take(MaxDeepReviewQuestions)
                .ToList();

            var ids = groups.Select(g => g.Key).ToList();
            var questions = ids.Count == 0
                ? new List<Question>()
                : await _questionRepository.WhereAsync(q => ids.Contains(q.Id) && q.Status == "Published");

            var result = new List<DeepReviewQuestionDto>();
            foreach (var g in groups)
            {
                var q = questions.FirstOrDefault(x => x.Id == g.Key);
                if (q == null) continue;

                object? payload;
                try { payload = JsonSerializer.Deserialize<object>(q.Payload); }
                catch { payload = q.Payload; }

                // ZERO LEAKAGE: không bao giờ trả CorrectData / Explanation trước khi trả lời
                result.Add(new DeepReviewQuestionDto
                {
                    QuestionId = q.Id,
                    Type = q.Type,
                    Title = q.Title,
                    ImageUrl = q.ImageUrl,
                    Payload = payload,
                    Difficulty = q.Difficulty,
                    TimesWrong = g.Count(),
                    LastWrongAt = g.Max(a => a.CreatedAt)
                });
            }

            return result;
        }

        public async Task<DeepReviewAnswerResponseDto> SubmitDeepReviewAnswerAsync(
            Guid userId,
            PracticeAnswerRequestDto request,
            CancellationToken cancellationToken = default)
        {
            await RequireProAsync(userId);

            // Chỉ cho ôn các câu chính người dùng từng sai: không biến API thành công cụ dò đáp án toàn bộ ngân hàng câu hỏi
            var groups = await GetWrongAnswerGroupsAsync(userId);
            if (!groups.Any(g => g.Key == request.QuestionId))
            {
                throw new BadRequestException("Câu hỏi này không nằm trong danh sách câu bạn từng làm sai.");
            }

            var question = await _questionRepository.FirstOrDefaultAsync(q => q.Id == request.QuestionId && q.Status == "Published")
                ?? throw new NotFoundException("Không tìm thấy câu hỏi.");

            bool isCorrect = _questionGrader.Grade(question.Type, request.SubmittedAnswer.GetRawText(), question.CorrectData);

            _logger.LogInformation("Pro {UserId} ôn tập chuyên sâu câu {QuestionId}: {Result}",
                userId, question.Id, isCorrect ? "đúng" : "sai");

            // Chế độ luyện tập thuần túy: không cộng XP/tim, không đổi trạng thái (tránh farm điểm)
            return new DeepReviewAnswerResponseDto
            {
                QuestionId = question.Id,
                IsCorrect = isCorrect,
                Explanation = question.Explanation,
                Source = question.Source,
                ReviewedBy = question.ReviewedBy
            };
        }
    }
}
