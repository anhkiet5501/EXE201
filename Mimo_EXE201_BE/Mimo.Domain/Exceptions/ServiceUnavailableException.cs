using AutoWrapper.Wrappers;
using Microsoft.AspNetCore.Http;

namespace Mimo.DomainLayer.Exceptions;

public class ServiceUnavailableException : BaseHttpException
{
    private readonly static int statusCode = StatusCodes.Status503ServiceUnavailable;

    public ServiceUnavailableException(object customError) : base(customError, statusCode)
    {
    }

    public ServiceUnavailableException(IEnumerable<ValidationError> errors) : base(errors, statusCode)
    {
    }

    public ServiceUnavailableException(Exception ex) : base(ex, statusCode)
    {
    }

    public ServiceUnavailableException(string message = "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.", string? errorCode = null, string? refLink = null) : base(message, statusCode, errorCode, refLink)
    {
    }
}

