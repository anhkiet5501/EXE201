namespace Mimo.Application.Helper.Payment
{
    /// <summary>
    /// Cấu hình thanh toán chuyển khoản qua SePay (VietQR + Webhook biến động số dư).
    /// Giá trị nhạy cảm (ApiKey, số tài khoản...) đặt qua biến môi trường SePay__*, KHÔNG commit vào git.
    /// </summary>
    public class SePayOptions
    {
        public const string SectionName = "SePay";

        /// <summary>Khóa SePay gửi kèm webhook (header "Authorization: Apikey {ApiKey}").</summary>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>Tên ngân hàng theo SePay QR (ví dụ: TPBank, Vietcombank).</summary>
        public string BankCode { get; set; } = string.Empty;

        public string AccountNumber { get; set; } = string.Empty;

        /// <summary>Tên chủ tài khoản hiển thị cho người chuyển khoản.</summary>
        public string AccountName { get; set; } = string.Empty;

        /// <summary>Tiền tố mã đơn, trùng với tiền tố cấu hình ở SePay (Cấu trúc mã thanh toán).</summary>
        public string OrderPrefix { get; set; } = "MIMO";

        /// <summary>Thời gian hiển thị đơn chờ thanh toán (phút). Tiền về muộn hơn vẫn được ghi nhận.</summary>
        public int OrderExpiryMinutes { get; set; } = 30;

        public string QrBaseUrl { get; set; } = "https://qr.sepay.vn/img";
    }
}
