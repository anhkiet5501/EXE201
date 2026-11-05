using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Mimo.Application.DTOs.Business;
using Mimo.Application.Repositories;
using Mimo.DomainLayer.Entities;
using Mimo.DomainLayer.Exceptions;
using static Mimo.DomainLayer.Enum.GeneralEnum;

namespace Mimo.Application.Services
{
    public class BusinessService : IBusinessService
    {
        private readonly IGenericRepository<Organization> _orgRepository;
        private readonly IGenericRepository<Class> _classRepository;
        private readonly IGenericRepository<ClassMember> _memberRepository;
        private readonly IGenericRepository<Assignment> _assignmentRepository;
        private readonly IGenericRepository<AssignmentProgress> _progressRepository;
        private readonly IGenericRepository<TeacherLicense> _licenseRepository;
        private readonly IGenericRepository<User> _userRepository;
        private readonly IGenericRepository<Role> _roleRepository;
        private readonly IGenericRepository<SessionAnswer> _answerRepository;
        private readonly IGenericRepository<LessonSession> _sessionRepository;
        private readonly IGenericRepository<Question> _questionRepository;
        private readonly IGenericRepository<Node> _nodeRepository;
        private readonly IGenericRepository<Unit> _unitRepository;
        private readonly IGenericRepository<Domain> _domainRepository;
        private readonly IJwtService _jwtService;
        private readonly IUnitOfWork _unitOfWork;

        public BusinessService(
            IGenericRepository<Organization> orgRepository,
            IGenericRepository<Class> classRepository,
            IGenericRepository<ClassMember> memberRepository,
            IGenericRepository<Assignment> assignmentRepository,
            IGenericRepository<AssignmentProgress> progressRepository,
            IGenericRepository<TeacherLicense> licenseRepository,
            IGenericRepository<User> userRepository,
            IGenericRepository<Role> roleRepository,
            IGenericRepository<SessionAnswer> answerRepository,
            IGenericRepository<LessonSession> sessionRepository,
            IGenericRepository<Question> questionRepository,
            IGenericRepository<Node> nodeRepository,
            IGenericRepository<Unit> unitRepository,
            IGenericRepository<Domain> domainRepository,
            IJwtService jwtService,
            IUnitOfWork unitOfWork)
        {
            _orgRepository = orgRepository;
            _classRepository = classRepository;
            _memberRepository = memberRepository;
            _assignmentRepository = assignmentRepository;
            _progressRepository = progressRepository;
            _licenseRepository = licenseRepository;
            _userRepository = userRepository;
            _roleRepository = roleRepository;
            _answerRepository = answerRepository;
            _sessionRepository = sessionRepository;
            _questionRepository = questionRepository;
            _nodeRepository = nodeRepository;
            _unitRepository = unitRepository;
            _domainRepository = domainRepository;
            _jwtService = jwtService;
            _unitOfWork = unitOfWork;
        }

        private async Task<Guid> GetOrgIdAsync(Guid userId)
        {
            var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId);
            if (user?.OrganizationId == null)
            {
                throw new ForbiddenException("Tài khoản của bạn chưa được liên kết với trường học / tổ chức nào.");
            }
            return user.OrganizationId.Value;
        }

        public async Task<BusinessOverviewDto> GetOverviewAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var org = await _orgRepository.FirstOrDefaultAsync(o => o.Id == orgId);
            if (org == null)
            {
                throw new NotFoundException("Không tìm thấy thông tin tổ chức.");
            }

            var classes = await _classRepository.WhereAsync(c => c.OrganizationId == orgId);
            var classIds = classes.Select(c => c.Id).ToList();

            var members = await _memberRepository.WhereAsync(cm => classIds.Contains(cm.ClassId) && cm.Status == "Enrolled");
            var distinctStudentIds = members.Select(m => m.StudentId).Distinct().ToList();

            var assignments = await _assignmentRepository.WhereAsync(a => classIds.Contains(a.ClassId));
            var assignmentIds = assignments.Select(a => a.Id).ToList();

            var passedProgresses = await _progressRepository.WhereAsync(p => assignmentIds.Contains(p.AssignmentId) && p.IsPassed);

            double complianceRate = 0;
            if (assignments.Count > 0 && members.Count > 0)
            {
                int totalExpectedCompletions = members.Count * assignments.Count;
                complianceRate = Math.Round((double)passedProgresses.Count * 100 / totalExpectedCompletions, 1);
            }

            // Top 3 kỹ năng yếu
            var weakDomains = new List<WeakDomainDto>
            {
                new WeakDomainDto { DomainId = Guid.Empty, DomainName = "Kỹ năng PCCC & Thoát hiểm đám cháy", ErrorRate = 42.5, AlertLevel = "High" },
                new WeakDomainDto { DomainId = Guid.Empty, DomainName = "Sơ cấp cứu dị vật đường thở (Heimlich)", ErrorRate = 38.0, AlertLevel = "Medium" },
                new WeakDomainDto { DomainId = Guid.Empty, DomainName = "An toàn thông tin & Chống lừa đảo mạng", ErrorRate = 31.2, AlertLevel = "Medium" }
            };

            return new BusinessOverviewDto
            {
                OrganizationName = org.Name,
                OrganizationCode = org.Code,
                SeatCount = org.SeatCount,
                UsedSeats = org.UsedSeats,
                ClassesCount = classes.Count,
                StudentsCount = distinctStudentIds.Count,
                ComplianceRate = complianceRate,
                ExpirationDate = org.ExpirationDate,
                SubscriptionTier = org.SubscriptionTier.ToString(),
                TopWeakDomains = weakDomains
            };
        }

        public async Task<List<ClassDto>> GetClassesAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var classes = await _classRepository.WhereAsync(c => c.OrganizationId == orgId, "Educator", "Educator.Profile");

            var classIds = classes.Select(c => c.Id).ToList();
            var members = await _memberRepository.WhereAsync(cm => classIds.Contains(cm.ClassId) && cm.Status == "Enrolled");
            var assignments = await _assignmentRepository.WhereAsync(a => classIds.Contains(a.ClassId));
            var assignmentIds = assignments.Select(a => a.Id).ToList();
            var progresses = await _progressRepository.WhereAsync(ap => assignmentIds.Contains(ap.AssignmentId) && ap.IsPassed);

            var result = new List<ClassDto>();
            foreach (var c in classes.OrderBy(c => c.Name))
            {
                var classMembers = members.Where(m => m.ClassId == c.Id).ToList();
                var classAssignments = assignments.Where(a => a.ClassId == c.Id).ToList();
                var classPassed = progresses.Where(p => classAssignments.Select(a => a.Id).Contains(p.AssignmentId)).ToList();

                double compliance = 0;
                int totalTarget = classMembers.Count * classAssignments.Count;
                if (totalTarget > 0)
                {
                    compliance = Math.Round((double)classPassed.Count * 100 / totalTarget, 1);
                }

                string teacherName = c.Educator?.Profile?.FullName ?? c.Educator?.Name ?? "Chưa phân công";

                result.Add(new ClassDto
                {
                    Id = c.Id,
                    OrganizationId = c.OrganizationId,
                    EducatorId = c.EducatorId,
                    EducatorName = teacherName,
                    Name = c.Name,
                    ClassCode = c.ClassCode,
                    Grade = c.Grade,
                    Room = c.Room,
                    FocusTopic = c.FocusTopic,
                    MaxStudents = c.MaxStudents,
                    StudentsCount = classMembers.Count,
                    CompletedStudents = classPassed.Select(p => p.StudentId).Distinct().Count(),
                    ComplianceRate = compliance,
                    Status = c.Status
                });
            }

            return result;
        }

        public async Task<ClassDto> CreateClassAsync(Guid userId, CreateClassRequestDto request, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);

            if (string.IsNullOrWhiteSpace(request.Name))
            {
                throw new BadRequestException("Tên lớp học không được để trống.");
            }

            // Sinh mã lớp ngẫu nhiên độc nhất (bỏ 0, O, 1, I, L)
            const string chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
            string classCode;
            int retries = 0;
            do
            {
                var randChars = Enumerable.Range(0, 6)
                    .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
                    .ToArray();
                classCode = $"CLS-{new string(randChars)}";
                retries++;
            } while (await _classRepository.FirstOrDefaultAsync(c => c.ClassCode == classCode) != null && retries < 10);

            var newClass = new Class
            {
                OrganizationId = orgId,
                EducatorId = request.EducatorId,
                Name = request.Name.Trim(),
                ClassCode = classCode,
                Grade = request.Grade,
                Room = request.Room,
                FocusTopic = request.FocusTopic,
                MaxStudents = (request.MaxStudents.HasValue && request.MaxStudents.Value > 0)
                    ? request.MaxStudents.Value
                    : (request.TargetCount.HasValue && request.TargetCount.Value > 0)
                        ? request.TargetCount.Value
                        : (request.StudentsCount.HasValue && request.StudentsCount.Value > 0)
                            ? request.StudentsCount.Value
                            : 50,
                Status = "Active"
            };

            newClass = await _classRepository.CreateAsync(newClass);

            return new ClassDto
            {
                Id = newClass.Id,
                OrganizationId = newClass.OrganizationId,
                EducatorId = newClass.EducatorId,
                Name = newClass.Name,
                ClassCode = newClass.ClassCode,
                Grade = newClass.Grade,
                Room = newClass.Room,
                FocusTopic = newClass.FocusTopic,
                MaxStudents = newClass.MaxStudents,
                StudentsCount = 0,
                CompletedStudents = 0,
                ComplianceRate = 0,
                Status = newClass.Status
            };
        }

        public async Task<ClassDto> UpdateClassAsync(Guid userId, Guid classId, UpdateClassRequestDto request, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var cls = await _classRepository.FirstOrDefaultAsync(c => c.Id == classId && c.OrganizationId == orgId);
            if (cls == null)
            {
                throw new NotFoundException("Không tìm thấy lớp học.");
            }

            cls.Name = request.Name.Trim();
            cls.Grade = request.Grade;
            cls.Room = request.Room;
            cls.FocusTopic = request.FocusTopic;
            if (request.MaxStudents > 0)
            {
                cls.MaxStudents = request.MaxStudents;
            }
            cls.Status = request.Status;

            await _classRepository.UpdateAsync(cls);

            return new ClassDto
            {
                Id = cls.Id,
                OrganizationId = cls.OrganizationId,
                EducatorId = cls.EducatorId,
                Name = cls.Name,
                ClassCode = cls.ClassCode,
                Grade = cls.Grade,
                Room = cls.Room,
                FocusTopic = cls.FocusTopic,
                MaxStudents = cls.MaxStudents,
                Status = cls.Status
            };
        }

        public async Task DeleteClassAsync(Guid userId, Guid classId, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var cls = await _classRepository.FirstOrDefaultAsync(c => c.Id == classId && c.OrganizationId == orgId);
            if (cls == null)
            {
                throw new NotFoundException("Không tìm thấy lớp học.");
            }

            var members = await _memberRepository.WhereAsync(cm => cm.ClassId == classId && cm.Status == "Enrolled");
            if (members.Count > 0)
            {
                throw new BadRequestException("Không thể xóa lớp đang còn học sinh. Vui lòng chuyển hoặc rời học sinh trước.");
            }

            var assignments = await _assignmentRepository.WhereAsync(a => a.ClassId == classId);
            if (assignments.Count > 0)
            {
                throw new BadRequestException("Không thể xóa lớp đang còn bài tập được giao. Vui lòng xóa bài tập trước.");
            }

            await _classRepository.DeleteAsync(cls);
        }

        public async Task<ClassDto> AssignTeacherAsync(Guid userId, Guid classId, AssignTeacherRequestDto request, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var cls = await _classRepository.FirstOrDefaultAsync(c => c.Id == classId && c.OrganizationId == orgId);
            if (cls == null)
            {
                throw new NotFoundException("Không tìm thấy lớp học.");
            }

            User? educator = null;
            if (request.EducatorId.HasValue && request.EducatorId.Value != Guid.Empty)
            {
                educator = await _userRepository.FirstOrDefaultAsync(u => u.Id == request.EducatorId.Value && u.OrganizationId == orgId);
            }

            if (educator == null && !string.IsNullOrWhiteSpace(request.TeacherId))
            {
                var teacherIdRaw = request.TeacherId.Trim();
                if (Guid.TryParse(teacherIdRaw, out var teacherGuid))
                {
                    educator = await _userRepository.FirstOrDefaultAsync(u => u.Id == teacherGuid && u.OrganizationId == orgId);
                }
                else
                {
                    educator = await _userRepository.FirstOrDefaultAsync(u =>
                        u.OrganizationId == orgId &&
                        (u.Email.ToLower() == teacherIdRaw.ToLower() || u.Name.ToLower() == teacherIdRaw.ToLower()));
                }
            }

            if (educator == null && !string.IsNullOrWhiteSpace(request.TeacherName))
            {
                var teacherNameRaw = request.TeacherName.Trim();
                educator = await _userRepository.FirstOrDefaultAsync(u =>
                    u.OrganizationId == orgId &&
                    (u.Name.ToLower() == teacherNameRaw.ToLower() || u.Email.ToLower() == teacherNameRaw.ToLower()));
            }

            if (educator == null)
            {
                throw new NotFoundException("Không tìm thấy giáo viên.");
            }

            var educatorId = educator.Id;

            cls.EducatorId = educatorId;
            await _classRepository.UpdateAsync(cls);

            return new ClassDto
            {
                Id = cls.Id,
                OrganizationId = cls.OrganizationId,
                EducatorId = cls.EducatorId,
                EducatorName = educator.Name,
                Name = cls.Name,
                ClassCode = cls.ClassCode,
                Grade = cls.Grade,
                Room = cls.Room,
                FocusTopic = cls.FocusTopic,
                MaxStudents = cls.MaxStudents,
                Status = cls.Status
            };
        }

        public async Task<List<TeacherLicenseDto>> GetTeacherKeysAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var licenses = await _licenseRepository.WhereAsync(l => l.OrganizationId == orgId, "ClaimedByEducator", "ClaimedByEducator.Profile");
            var classes = await _classRepository.WhereAsync(c => c.OrganizationId == orgId);

            var result = new List<TeacherLicenseDto>();
            foreach (var l in licenses.OrderByDescending(l => l.CreatedAt))
            {
                List<Guid> assignedIds = new();
                try
                {
                    assignedIds = JsonSerializer.Deserialize<List<Guid>>(l.AssignedClassesJson) ?? new();
                }
                catch { }

                var assignedNames = classes.Where(c => assignedIds.Contains(c.Id)).Select(c => c.Name).ToList();
                string? teacherName = l.ClaimedByEducator?.Profile?.FullName ?? l.ClaimedByEducator?.Name;

                result.Add(new TeacherLicenseDto
                {
                    Id = l.Id,
                    ActivationCode = l.ActivationCode,
                    Note = l.Note,
                    AssignedClassIds = assignedIds,
                    AssignedClassNames = assignedNames,
                    ClaimedByEducatorId = l.ClaimedByEducatorId,
                    ClaimedByEducatorName = teacherName,
                    IsClaimed = l.IsClaimed,
                    ExpiresAt = l.ExpiresAt
                });
            }

            return result;
        }

        public async Task<TeacherLicenseDto> GenerateTeacherKeyAsync(Guid userId, CreateTeacherLicenseRequestDto request, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);

            // Resolve AssignedClassCodes (mã lớp dạng chuỗi từ FE) sang Guid
            var requestedIds = new List<Guid>(request.AssignedClassIds ?? new List<Guid>());
            if (request.AssignedClassCodes != null && request.AssignedClassCodes.Count > 0)
            {
                var orgClasses = await _classRepository.WhereAsync(c => c.OrganizationId == orgId);
                foreach (var rawCode in request.AssignedClassCodes)
                {
                    var code = (rawCode ?? string.Empty).Trim();
                    if (string.IsNullOrEmpty(code)) continue;
                    if (Guid.TryParse(code, out var parsedId))
                    {
                        requestedIds.Add(parsedId);
                        continue;
                    }
                    var matched = orgClasses.FirstOrDefault(c =>
                        string.Equals(c.ClassCode, code, StringComparison.OrdinalIgnoreCase) ||
                        string.Equals(c.Name, code, StringComparison.OrdinalIgnoreCase));
                    if (matched != null) requestedIds.Add(matched.Id);
                }
            }

            // Kiểm tra các classId thuộc org
            var orgClassesAll = await _classRepository.WhereAsync(c => c.OrganizationId == orgId);
            var validClassIds = orgClassesAll.Where(c => requestedIds.Contains(c.Id)).Select(c => c.Id).ToList();

            const string chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
            string activationCode;
            int retries = 0;
            do
            {
                var randChars = Enumerable.Range(0, 8)
                    .Select(_ => chars[RandomNumberGenerator.GetInt32(chars.Length)])
                    .ToArray();
                activationCode = $"MIMO-TEACH-{new string(randChars)}";
                retries++;
            } while (await _licenseRepository.FirstOrDefaultAsync(l => l.ActivationCode == activationCode) != null && retries < 10);

            int days = request.ExpiresInDays > 0 ? request.ExpiresInDays : 365;
            var license = new TeacherLicense
            {
                OrganizationId = orgId,
                ActivationCode = activationCode,
                Note = request.Note,
                AssignedClassesJson = JsonSerializer.Serialize(validClassIds),
                IsClaimed = false,
                ExpiresAt = DateTime.UtcNow.AddDays(days)
            };

            license = await _licenseRepository.CreateAsync(license);

            var classNames = orgClassesAll.Where(c => validClassIds.Contains(c.Id)).Select(c => c.Name).ToList();

            return new TeacherLicenseDto
            {
                Id = license.Id,
                ActivationCode = license.ActivationCode,
                Note = license.Note,
                AssignedClassIds = validClassIds,
                AssignedClassNames = classNames,
                IsClaimed = false,
                ExpiresAt = license.ExpiresAt
            };
        }

        public async Task RevokeTeacherKeyAsync(Guid userId, Guid keyId, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var license = await _licenseRepository.FirstOrDefaultAsync(l => l.Id == keyId && l.OrganizationId == orgId);
            if (license == null)
            {
                throw new NotFoundException("Không tìm thấy mã bản quyền.");
            }

            if (license.IsClaimed)
            {
                throw new BadRequestException("Mã bản quyền này đã được giáo viên kích hoạt, không thể thu hồi.");
            }

            await _licenseRepository.DeleteAsync(license);
        }

        public async Task<ClaimLicenseResponseDto> ClaimTeacherKeyAsync(Guid userId, ClaimLicenseRequestDto request, CancellationToken cancellationToken = default)
        {
            var activationCode = (request.ActivationCode ?? request.LicenseKey ?? string.Empty).Trim().ToUpperInvariant();
            if (string.IsNullOrWhiteSpace(activationCode))
            {
                throw new BadRequestException("Vui lòng nhập mã kích hoạt bản quyền.");
            }

            var code = activationCode;
            var license = await _licenseRepository.FirstOrDefaultAsync(l => l.ActivationCode == code);
            if (license == null)
            {
                throw new NotFoundException("Mã kích hoạt bản quyền không tồn tại hoặc không hợp lệ.");
            }

            if (license.IsClaimed)
            {
                throw new BadRequestException("Mã kích hoạt bản quyền này đã được sử dụng trước đó.");
            }

            if (DateTime.UtcNow > license.ExpiresAt)
            {
                throw new BadRequestException("Mã kích hoạt bản quyền đã hết hạn.");
            }

            var user = await _userRepository.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                throw new UnauthorizedException("Người dùng không tồn tại.");
            }

            await using var tx = await _unitOfWork.BeginTransactionAsync(cancellationToken);

            license.IsClaimed = true;
            license.ClaimedByEducatorId = userId;
            await _licenseRepository.UpdateAsync(license);

            // Gán role Educator cho User
            var educatorRole = await _roleRepository.FirstOrDefaultAsync(r => r.RoleName.ToLower() == "educator");
            if (educatorRole != null)
            {
                user.RoleId = educatorRole.Id;
            }
            user.OrganizationId = license.OrganizationId;
            await _userRepository.UpdateAsync(user);

            // Gán các lớp được chỉ định cho giáo viên này
            List<Guid> assignedClassIds = new();
            try
            {
                assignedClassIds = JsonSerializer.Deserialize<List<Guid>>(license.AssignedClassesJson) ?? new();
            }
            catch { }

            var assignedClasses = await _classRepository.WhereAsync(c => assignedClassIds.Contains(c.Id) && c.OrganizationId == license.OrganizationId);
            foreach (var cls in assignedClasses)
            {
                cls.EducatorId = userId;
                await _classRepository.UpdateAsync(cls);
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            // Cấp mới AccessToken với role Educator
            var newSessionId = Guid.NewGuid();
            var newAccessToken = _jwtService.GenerateToken(user.Id, "Educator", newSessionId, user.Email, user.Status, 60 * 24);
            var newRefreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));

            return new ClaimLicenseResponseDto
            {
                Success = true,
                Message = "Kích hoạt bản quyền Giáo viên thành công! Bạn đã được phân quyền quản lý lớp học.",
                AccessToken = newAccessToken,
                RefreshToken = newRefreshToken,
                AssignedClasses = assignedClasses.Select(c => c.Name).ToList()
            };
        }

        public async Task<List<AssignmentDto>> GetCampaignsAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var classes = await _classRepository.WhereAsync(c => c.OrganizationId == orgId);
            var classIds = classes.Select(c => c.Id).ToList();

            var assignments = await _assignmentRepository.WhereAsync(a => classIds.Contains(a.ClassId), "Class", "Node");
            var assignmentIds = assignments.Select(a => a.Id).ToList();

            var members = await _memberRepository.WhereAsync(cm => classIds.Contains(cm.ClassId) && cm.Status == "Enrolled");
            var progresses = await _progressRepository.WhereAsync(p => assignmentIds.Contains(p.AssignmentId));

            var result = new List<AssignmentDto>();
            var now = DateTime.UtcNow;

            foreach (var a in assignments.OrderByDescending(a => a.Deadline))
            {
                var classMembers = members.Where(m => m.ClassId == a.ClassId).ToList();
                var passedProgresses = progresses.Where(p => p.AssignmentId == a.Id && p.IsPassed).ToList();

                double compliance = 0;
                if (classMembers.Count > 0)
                {
                    compliance = Math.Round((double)passedProgresses.Count * 100 / classMembers.Count, 1);
                }

                result.Add(new AssignmentDto
                {
                    Id = a.Id,
                    ClassId = a.ClassId,
                    ClassName = a.Class?.Name ?? "Lớp học",
                    NodeId = a.NodeId,
                    NodeTitle = a.Node?.Title ?? "Bài học kỹ năng",
                    Title = a.Title,
                    Description = a.Description,
                    Deadline = a.Deadline,
                    PassScoreThreshold = a.PassScoreThreshold,
                    RewardXp = a.RewardXp,
                    TotalEnrolled = classMembers.Count,
                    CompletedCount = passedProgresses.Count,
                    ComplianceRate = compliance,
                    IsOverdue = now > a.Deadline
                });
            }

            return result;
        }

        public async Task<List<AssignmentDto>> CreateCampaignAsync(Guid userId, CreateAssignmentRequestDto request, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);

            if (request.ClassIds == null || request.ClassIds.Count == 0)
            {
                throw new BadRequestException("Vui lòng chọn ít nhất một lớp học để giao bài tập.");
            }

            if (string.IsNullOrWhiteSpace(request.Title))
            {
                throw new BadRequestException("Tiêu đề bài tập không được để trống.");
            }

            var node = await _nodeRepository.FirstOrDefaultAsync(n => n.Id == request.NodeId);
            if (node == null || !string.Equals(node.Status, "Published", StringComparison.OrdinalIgnoreCase))
            {
                throw new BadRequestException("Bài học được chọn không tồn tại hoặc chưa được xuất bản.");
            }

            var orgClasses = await _classRepository.WhereAsync(c => c.OrganizationId == orgId && request.ClassIds.Contains(c.Id));
            if (orgClasses.Count == 0)
            {
                throw new BadRequestException("Các lớp học được chọn không thuộc quyền quản lý của trường.");
            }

            await using var tx = await _unitOfWork.BeginTransactionAsync(cancellationToken);

            var createdList = new List<AssignmentDto>();
            foreach (var cls in orgClasses)
            {
                var assignment = new Assignment
                {
                    ClassId = cls.Id,
                    NodeId = request.NodeId,
                    CreatedBy = userId,
                    Title = request.Title.Trim(),
                    Description = request.Description,
                    Deadline = request.Deadline.ToUniversalTime(),
                    PassScoreThreshold = request.PassScoreThreshold > 0 ? request.PassScoreThreshold : 80,
                    RewardXp = request.RewardXp >= 0 ? request.RewardXp : 50
                };

                assignment = await _assignmentRepository.CreateAsync(assignment);

                createdList.Add(new AssignmentDto
                {
                    Id = assignment.Id,
                    ClassId = cls.Id,
                    ClassName = cls.Name,
                    NodeId = node.Id,
                    NodeTitle = node.Title,
                    Title = assignment.Title,
                    Description = assignment.Description,
                    Deadline = assignment.Deadline,
                    PassScoreThreshold = assignment.PassScoreThreshold,
                    RewardXp = assignment.RewardXp,
                    TotalEnrolled = 0,
                    CompletedCount = 0,
                    ComplianceRate = 0,
                    IsOverdue = DateTime.UtcNow > assignment.Deadline
                });
            }

            await _unitOfWork.CommitTransactionAsync(cancellationToken);

            return createdList;
        }

        public async Task<SkillGapReportDto> GetSkillGapReportAsync(Guid userId, CancellationToken cancellationToken = default)
        {
            var orgId = await GetOrgIdAsync(userId);
            var domains = await _domainRepository.ListAsync();

            var result = new List<DomainSkillGapDto>();
            foreach (var d in domains)
            {
                result.Add(new DomainSkillGapDto
                {
                    DomainId = d.Id,
                    DomainName = d.Name,
                    TotalQuestionsAnswered = 120,
                    TotalWrong = d.Name.Contains("PCCC") ? 45 : 22,
                    WrongRate = d.Name.Contains("PCCC") ? 37.5 : 18.3,
                    Severity = d.Name.Contains("PCCC") ? "High" : "Low"
                });
            }

            return new SkillGapReportDto { IsSample = true, Domains = result };
        }

        public async Task<ClassHeatmapDto> GetClassHeatmapAsync(Guid userId, Guid classId, CancellationToken cancellationToken = default)
        {
            var cls = await _classRepository.FirstOrDefaultAsync(c => c.Id == classId);
            if (cls == null)
            {
                throw new NotFoundException("Không tìm thấy lớp học.");
            }

            var members = await _memberRepository.WhereAsync(cm => cm.ClassId == classId && cm.Status == "Enrolled");
            var studentIds = members.Select(m => m.StudentId).ToList();

            var sessions = await _sessionRepository.WhereAsync(s => studentIds.Contains(s.UserId));
            var sessionIds = sessions.Select(s => s.Id).ToList();

            var answers = await _answerRepository.WhereAsync(a => sessionIds.Contains(a.SessionId));
            var questionIds = answers.Select(a => a.QuestionId).Distinct().ToList();

            var questions = await _questionRepository.WhereAsync(q => questionIds.Contains(q.Id));

            var heatmapItems = new List<QuestionHeatmapItemDto>();
            foreach (var q in questions)
            {
                var qAnswers = answers.Where(a => a.QuestionId == q.Id).ToList();
                int total = qAnswers.Count;
                int wrong = qAnswers.Count(a => !a.IsCorrect);
                double wrongRate = total > 0 ? Math.Round((double)wrong * 100 / total, 1) : 0;
                bool isRedFlag = wrongRate >= 50;

                string tip = isRedFlag
                    ? "Tỷ lệ sai vượt 50%: Giáo viên nên dành 5 phút đầu tiết để ôn tập lại kiến thức này."
                    : "Học sinh nắm vững kiến thức.";

                heatmapItems.Add(new QuestionHeatmapItemDto
                {
                    QuestionId = q.Id,
                    Title = q.Title,
                    Type = q.Type,
                    TotalAttempts = total,
                    WrongAttempts = wrong,
                    WrongRate = wrongRate,
                    IsRedFlag = isRedFlag,
                    PedagogicalTip = tip
                });
            }

            bool isSample = heatmapItems.Count == 0;
            // Nếu chưa có dữ liệu thực tế câu trả lời của lớp, sinh mẫu minh họa sinh động
            if (isSample)
            {
                heatmapItems.Add(new QuestionHeatmapItemDto
                {
                    QuestionId = Guid.NewGuid(),
                    Title = "Khi chập điện gây cháy trong phòng, bước đầu tiên cần làm là gì?",
                    Type = "choice",
                    TotalAttempts = 35,
                    WrongAttempts = 21,
                    WrongRate = 60.0,
                    IsRedFlag = true,
                    PedagogicalTip = "60% học sinh chọn hắt ngay xô nước. Thầy/Cô hãy nhấn mạnh quy tắc ngắt aptomat tổng trước."
                });
                heatmapItems.Add(new QuestionHeatmapItemDto
                {
                    QuestionId = Guid.NewGuid(),
                    Title = "Tần số ép tim chuẩn khi hồi sức CPR cho người lớn?",
                    Type = "choice",
                    TotalAttempts = 35,
                    WrongAttempts = 18,
                    WrongRate = 51.4,
                    IsRedFlag = true,
                    PedagogicalTip = "51% chọn 60-80 lần/phút (chuẩn là 100-120 lần/phút). Cho học sinh nghe bài Stayin' Alive."
                });
                heatmapItems.Add(new QuestionHeatmapItemDto
                {
                    QuestionId = Guid.NewGuid(),
                    Title = "Thứ tự các bước thoát hiểm khi chuông báo cháy reo?",
                    Type = "sequence",
                    TotalAttempts = 35,
                    WrongAttempts = 7,
                    WrongRate = 20.0,
                    IsRedFlag = false,
                    PedagogicalTip = "Học sinh thực hiện tốt kỹ năng thoát nạn."
                });
            }

            return new ClassHeatmapDto
            {
                ClassId = cls.Id,
                ClassName = cls.Name,
                IsSample = isSample,
                Questions = heatmapItems
            };
        }

        public async Task<ClassProgressDto> GetClassProgressAsync(Guid userId, Guid classId, CancellationToken cancellationToken = default)
        {
            var cls = await _classRepository.FirstOrDefaultAsync(c => c.Id == classId);
            if (cls == null)
            {
                throw new NotFoundException("Không tìm thấy lớp học.");
            }

            var members = await _memberRepository.WhereAsync(cm => cm.ClassId == classId && cm.Status == "Enrolled", "Student", "Student.Profile");
            var studentIds = members.Select(m => m.StudentId).ToList();

            var assignments = await _assignmentRepository.WhereAsync(a => a.ClassId == classId);
            var assignmentIds = assignments.Select(a => a.Id).ToList();

            var progresses = await _progressRepository.WhereAsync(p => assignmentIds.Contains(p.AssignmentId) && studentIds.Contains(p.StudentId));

            var studentItems = new List<StudentProgressItemDto>();
            foreach (var m in members)
            {
                var sProgs = progresses.Where(p => p.StudentId == m.StudentId).ToList();
                int best = sProgs.Count > 0 ? sProgs.Max(p => p.BestScore) : 0;
                bool passed = sProgs.Any(p => p.IsPassed);

                string status;
                if (passed)
                {
                    status = "Đã nộp bài";
                }
                else if (sProgs.Count > 0)
                {
                    status = "Đang làm dở";
                }
                else
                {
                    status = "Chưa làm bài";
                }

                string name = m.Student?.Profile?.FullName ?? m.Student?.Name ?? m.Student?.Email ?? "Học sinh";

                studentItems.Add(new StudentProgressItemDto
                {
                    StudentId = m.StudentId,
                    FullName = name,
                    Email = m.Student?.Email ?? string.Empty,
                    BestScore = best,
                    IsPassed = passed,
                    CompletedAt = sProgs.FirstOrDefault(p => p.IsPassed)?.CompletedAt,
                    Status = status
                });
            }

            return new ClassProgressDto
            {
                ClassId = cls.Id,
                ClassName = cls.Name,
                Students = studentItems
            };
        }

        public async Task<List<ClassDto>> GetEducatorClassesAsync(Guid educatorId, CancellationToken cancellationToken = default)
        {
            var classes = await _classRepository.WhereAsync(c => c.EducatorId == educatorId);
            var classIds = classes.Select(c => c.Id).ToList();

            var members = await _memberRepository.WhereAsync(cm => classIds.Contains(cm.ClassId) && cm.Status == "Enrolled");
            var assignments = await _assignmentRepository.WhereAsync(a => classIds.Contains(a.ClassId));
            var assignmentIds = assignments.Select(a => a.Id).ToList();
            var progresses = await _progressRepository.WhereAsync(ap => assignmentIds.Contains(ap.AssignmentId) && ap.IsPassed);

            var result = new List<ClassDto>();
            foreach (var c in classes.OrderBy(c => c.Name))
            {
                var classMembers = members.Where(m => m.ClassId == c.Id).ToList();
                var classAssignments = assignments.Where(a => a.ClassId == c.Id).ToList();
                var classPassed = progresses.Where(p => classAssignments.Select(a => a.Id).Contains(p.AssignmentId)).ToList();

                double compliance = 0;
                int totalTarget = classMembers.Count * classAssignments.Count;
                if (totalTarget > 0)
                {
                    compliance = Math.Round((double)classPassed.Count * 100 / totalTarget, 1);
                }

                result.Add(new ClassDto
                {
                    Id = c.Id,
                    OrganizationId = c.OrganizationId,
                    EducatorId = c.EducatorId,
                    Name = c.Name,
                    ClassCode = c.ClassCode,
                    Grade = c.Grade,
                    Room = c.Room,
                    FocusTopic = c.FocusTopic,
                    MaxStudents = c.MaxStudents,
                    StudentsCount = classMembers.Count,
                    CompletedStudents = classPassed.Select(p => p.StudentId).Distinct().Count(),
                    ComplianceRate = compliance,
                    Status = c.Status
                });
            }

            return result;
        }
    }
}
