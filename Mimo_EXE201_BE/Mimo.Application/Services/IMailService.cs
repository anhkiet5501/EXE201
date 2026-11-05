using System.Threading.Tasks;

namespace Mimo.Application.Services;

public interface IMailService
{
    bool IsConfigured();
    Task SendEmailAsync(string email, string subject, string message);
}
