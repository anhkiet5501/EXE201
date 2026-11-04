using System;
using FluentValidation;
using Mimo.Application.DTOs.Business;

namespace Mimo.Application.Validators.Business
{
    public class CreateClassRequestValidator : AbstractValidator<CreateClassRequestDto>
    {
        public CreateClassRequestValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên lớp học không được để trống.")
                .MaximumLength(100).WithMessage("Tên lớp học không được vượt quá 100 ký tự.");

            RuleFor(x => x.MaxStudents)
                .GreaterThan(0).WithMessage("Sĩ số tối đa phải lớn hơn 0.")
                .LessThanOrEqualTo(500).WithMessage("Sĩ số tối đa không được vượt quá 500 học sinh.")
                .When(x => x.MaxStudents.HasValue);

            RuleFor(x => x.TargetCount)
                .GreaterThan(0).WithMessage("Chỉ tiêu sĩ số phải lớn hơn 0.")
                .LessThanOrEqualTo(500).WithMessage("Chỉ tiêu sĩ số không được vượt quá 500 học sinh.")
                .When(x => x.TargetCount.HasValue);

            RuleFor(x => x.StudentsCount)
                .GreaterThan(0).WithMessage("Sĩ số học sinh phải lớn hơn 0.")
                .LessThanOrEqualTo(500).WithMessage("Sĩ số học sinh không được vượt quá 500 học sinh.")
                .When(x => x.StudentsCount.HasValue);
        }
    }

    public class AssignTeacherRequestValidator : AbstractValidator<AssignTeacherRequestDto>
    {
        public AssignTeacherRequestValidator()
        {
            RuleFor(x => x)
                .Must(x => (x.EducatorId.HasValue && x.EducatorId.Value != Guid.Empty)
                    || !string.IsNullOrWhiteSpace(x.TeacherId)
                    || !string.IsNullOrWhiteSpace(x.TeacherName))
                .WithMessage("Vui lòng cung cấp mã hoặc tên giáo viên cần phân công.");
        }
    }

    public class CreateTeacherLicenseRequestValidator : AbstractValidator<CreateTeacherLicenseRequestDto>
    {
        public CreateTeacherLicenseRequestValidator()
        {
            RuleFor(x => x)
                .Must(x => (x.AssignedClassIds != null && x.AssignedClassIds.Count > 0)
                    || (x.AssignedClassCodes != null && x.AssignedClassCodes.Count > 0))
                .WithMessage("Vui lòng chọn ít nhất một lớp học để gán bản quyền.");

            RuleFor(x => x.ExpiresInDays)
                .GreaterThan(0).WithMessage("Thời hạn bản quyền phải lớn hơn 0 ngày.")
                .LessThanOrEqualTo(3650).WithMessage("Thời hạn bản quyền không được vượt quá 3650 ngày (10 năm).");
        }
    }

    public class ClaimLicenseRequestValidator : AbstractValidator<ClaimLicenseRequestDto>
    {
        public ClaimLicenseRequestValidator()
        {
            RuleFor(x => x)
                .Must(x => !string.IsNullOrWhiteSpace(x.ActivationCode) || !string.IsNullOrWhiteSpace(x.LicenseKey))
                .WithMessage("Vui lòng nhập mã kích hoạt bản quyền.");
        }
    }
}

