using System.Threading.Tasks;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using Mimo.Application.Services;

namespace Mimo.Infrastructure.Core.Mail;

public class MailService : IMailService
{
    private readonly string _smtpServer;
    private readonly int _smtpPort;
    private readonly string _smtpUsername;
    private readonly string _smtpPassword;

    public MailService(string smtpServer, int smtpPort, string smtpUsername, string smtpPassword)
    {
        _smtpServer = smtpServer;
        _smtpPort = smtpPort;
        _smtpUsername = smtpUsername;
        _smtpPassword = smtpPassword;
    }

    public MailService(IConfiguration configuration)
    {
        var section = configuration.GetSection("MailSettings");
        _smtpServer = section["Server"] ?? "smtp.gmail.com";
        _smtpPort = int.TryParse(section["Port"], out var port) ? port : 587;
        _smtpUsername = section["SenderEmail"] ?? "";
        _smtpPassword = section["Password"] ?? "";
    }

    public bool IsConfigured()
    {
        return !string.IsNullOrWhiteSpace(_smtpUsername) && !string.IsNullOrWhiteSpace(_smtpPassword);
    }

    public async Task SendEmailAsync(string email, string subject, string message)
    {
        var mimeMessage = new MimeMessage();
        mimeMessage.From.Add(new MailboxAddress("Mimo", _smtpUsername));
        mimeMessage.To.Add(new MailboxAddress("Receiver", email));
        mimeMessage.Subject = subject;

        var bodyBuilder = new BodyBuilder
        {
            HtmlBody = message
        };

        mimeMessage.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        var secureSocketOption = _smtpPort == 465 
            ? SecureSocketOptions.SslOnConnect 
            : SecureSocketOptions.StartTls;

        await client.ConnectAsync(_smtpServer, _smtpPort, secureSocketOption);
        if (!string.IsNullOrEmpty(_smtpUsername) && !string.IsNullOrEmpty(_smtpPassword))
        {
            await client.AuthenticateAsync(_smtpUsername, _smtpPassword);
        }
        await client.SendAsync(mimeMessage);
        await client.DisconnectAsync(true);
    }
}
