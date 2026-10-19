# TÀI LIỆU THIẾT KẾ & PHÂN TÍCH UI/UX: MIMO PLATFORM
## SỰ KẾT HỢP GIỮA DUOLINGO VÀ GETMIMO.COM (MICRO-LEARNING & GAMIFIED SAFETY)

> **Dự án:** EXE201 — Khởi nghiệp & Phát triển Sản phẩm  
> **Chủ đề:** Nền tảng Học Kỹ năng sống & An toàn khẩn cấp qua Tình huống mô phỏng  
> **Phong cách chủ đạo:** Gamified Micro-learning, Playful & High-Trust Design System  
> **Mô hình tham chiếu:** **Duolingo** (Gamification, 3D Buttons, Feedback Loops) + **Getmimo.com** (Card-based UI, Interactive Micro-actions, Modern Clean Aesthetics)

---

## MỤC LỤC
1. [TỔNG QUAN PHONG CÁCH & TRIẾT LÝ THIẾT KẾ](#1-tổng-quan-phong-cách--triết-lý-thiết-kế)
2. [SO SÁNH & CHẮT LỌC TINH HOA: DUOLINGO VS GETMIMO](#2-so-sánh--chắt-lọc-tinh-hoa-duolingo-vs-getmimo)
3. [HỆ THỐNG THIẾT KẾ (MIMO DESIGN SYSTEM)](#3-hệ-thống-thiết-kế-mimo-design-system)
4. [BỐ CỤC KHÔNG GIAN (LAYOUT ARCHITECTURE)](#4-bố-cục-không-gian-layout-architecture)
5. [CHI TIẾT THIẾT KẾ TỪNG MÀN HÌNH THEN CHỐT](#5-chi-tiết-thiết-kế-từng-màn-hình-then-chốt)
6. [THIẾT KẾ MÀN HÌNH CHƠI TÌNH HUỐNG (SCENARIO GAME ENGINE)](#6-thiết-kế-màn-hình-chơi-tình-huống-scenario-game-engine)
7. [HIỆU ỨNG TƯƠNG TÁC, ÂM THANH & CẢM XÚC (MICRO-INTERACTIONS)](#7-hiệu-ứng-tương-tác-âm-thanh--cảm-xúc-micro-interactions)
8. [KẾ HOẠCH CHUYỂN HÓA LÊN SOURCE CODE HIỆN TẠI](#8-kế-hoạch-chuyển-hóa-lên-source-code-hiện-tại)

---

## 1. TỔNG QUAN PHONG CÁCH & TRIẾT LÝ THIẾT KẾ

### 1.1. Thách thức lớn của Kỹ năng sống & An toàn
* Kiến thức sơ cấp cứu, hỏa hoạn, bạo lực học đường, an toàn mạng vốn là những chủ đề **nghiêm túc, căng thẳng và dễ gây nhàm chán**.
* Nếu làm giao diện quá nghiêm túc kiểu tài liệu bệnh viện/công an ➔ Người trẻ sẽ **lười vào học**.
* Nếu làm giao diện quá trẻ con, hoạt hình nhí nhố ➔ Người học **thiếu sự tin tưởng** vào tính chuẩn xác của kiến thức y tế/an toàn.

### 1.2. Công thức dung hòa của MIMO: "Playful yet Trustworthy"
MIMO kết hợp:
* **Sự cuốn hút, gây nghiện của Duolingo:** Nút bấm 3D nổi khối, âm thanh nổ pháo hoa, chuỗi Streak rực lửa, thanh Bottom Sheet phản hồi đúng/sai tức thì.
* **Sự hiện đại, tinh gọn và rõ ràng của Getmimo.com:** Thiết kế thẻ (Cards) khoa học, phân cấp thông tin mạch lạc, font chữ hiện đại, giảm tải nhận thức (Low cognitive load), phù hợp cho cả học sinh lẫn sinh viên/người lớn.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CÔNG THỨC UI/UX CỦA MIMO                        │
│                                                                        │
│   [ DUOLINGO GAMIFICATION ]       +        [ GETMIMO MODERN CARDS ]    │
│   • 3D Physical Buttons                   • Clean Card-based Layout    │
│   • Bottom Feedback Sheet                 • Step-by-step Micro Steps   │
│   • The Snake Learning Path               • Minimalist Typography      │
│   • Hearts / Streak / Leagues             • High Contrast Dark/Light   │
│                                                                        │
│                                   ▼                                    │
│                    MIMO SAFETY & LIFE SKILLS UI/UX                     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. SO SÁNH & CHẮT LỌC TINH HOA: DUOLINGO VS GETMIMO

| Thành phần UI/UX | Duolingo làm gì? | Getmimo.com làm gì? | MIMO Life Skills sẽ áp dụng thế nào? |
| :--- | :--- | :--- | :--- |
| **Bản đồ học tập (Learning Path)** | Dạng đường uốn lượn (Snake Path) với các nút tròn stepping stones và rương thưởng. | Dạng danh sách lộ trình theo chặng (Unit/Track) với tiến độ phần trăm rõ ràng. | **Kế thừa Snake Path của Duolingo** nhưng các nút bài học có icon đại diện tình huống thực tế (🔥 Lửa, 🩹 Băng gạc, 🚦 Đèn giao thông, 🛡️ Khiên bảo vệ). |
| **Thẻ câu hỏi / Tương tác** | Câu hỏi ngắn một dòng, lựa chọn từ hoặc bấm nút to. | Thẻ code tương tác, kéo thả từ khóa, điền vào chỗ trống từng bước nhỏ. | **Kế thừa Getmimo:** Thẻ tình huống có hình ảnh/GIF minh họa ngữ cảnh thực tế, hỗ trợ kéo thả thứ tự sơ cứu và chạm vào điểm nguy hiểm (Spot the bug/scam). |
| **Nút bấm & Tương tác xúc giác** | **3D Press Effect:** Nút có viền đáy 4px nổi khối như viên lego, bấm vào lún xuống 2px cực kỳ sướng tay. | Nút phẳng hiện đại (Flat/Minimal), bo góc mềm mại, hover đổi màu mượt. | **Kế thừa 100% nút 3D của Duolingo** cho các nút chính (Kiểm tra, Tiếp tục, Chọn đáp án) vì nó tạo cảm giác chơi game chân thực. |
| **Khay phản hồi (Feedback Sheet)** | Trượt lên từ đáy màn hình (Bottom Sheet): Xanh lá rực rỡ khi đúng, Đỏ khi sai kèm giải thích. | Hiện giải thích lỗi ngữ pháp/code ngay bên dưới thẻ bài. | **Kế thừa Bottom Sheet của Duolingo:** Trượt từ dưới lên, chiếm 25% màn hình, che đi các yếu tố gây xao nhãng để người học tập trung đọc giải thích y tế/an toàn. |
| **Thống kê & Header** | Thanh cố định: 🔥 Streak, 💎 Đá quý, ❤️ Tim. | Header gọn gàng: Streak, Tiến độ tuần, Profile avatar. | **Dùng chuẩn Duolingo:** Header 3 thông số vàng: **🔥 Chuỗi ngày | ⭐ XP Tích lũy | ❤️ Số Tim còn lại**. |

---

## 3. HỆ THỐNG THIẾT KẾ (MIMO DESIGN SYSTEM)

### 3.1. Bảng màu Nhận diện & Ngữ nghĩa (Semantic Color Palette)

MIMO sử dụng các gam màu tươi sáng, tương phản cao, mang ý nghĩa an toàn quốc tế:

```
/* ─── BẢNG MÀU CHÍNH CỦA MIMO ─── */
:root {
  /* Xanh lá An toàn (Primary - Dùng cho nút Đúng, Nút chính, Hoàn thành) */
  --mimo-green: #22C55E;
  --mimo-green-shadow: #15803D; /* Đáy 3D của nút xanh */
  --mimo-green-light: #DCFCE7;  /* Nền khay phản hồi khi trả lời đúng */

  /* Đỏ Cảnh báo & Mạng sống (Dùng cho Tim, Báo nguy hiểm, Trả lời sai) */
  --mimo-red: #EF4444;
  --mimo-red-shadow: #B91C1C;   /* Đáy 3D của nút đỏ */
  --mimo-red-light: #FEE2E2;    /* Nền khay phản hồi khi trả lời sai */

  /* Cam Khẩn cấp & Ngọn lửa Streak (Dùng cho PCCC, Chuỗi ngày Streak) */
  --mimo-orange: #F97316;
  --mimo-orange-shadow: #C2410C;

  /* Vàng Thành tích (Dùng cho XP, Cúp giải đấu, Ngôi sao) */
  --mimo-yellow: #F59E0B;
  --mimo-yellow-shadow: #B45309;

  /* Xanh dương Bảo vệ & Sơ cứu (Dùng cho Y tế, An ninh mạng, Info) */
  --mimo-blue: #0EA5E9;
  --mimo-blue-shadow: #0369A1;

  /* Nền & Trung tính (Thừa hưởng phong cách sạch sẽ của Getmimo) */
  --bg-page: #F8FAFC;          /* Trắng kem xám nhạt chống mỏi mắt */
  --bg-card: #FFFFFF;          /* Trắng tinh khôi cho thẻ nội dung */
  --border-subtle: #E2E8F0;    /* Đường viền thẻ siêu tinh tế */
  --border-bold: #CBD5E1;      /* Viền các nút chưa chọn */
  --text-main: #0F172A;        /* Xanh đen đậm, dễ đọc tuyệt đối */
  --text-muted: #64748B;       /* Chữ phụ, giải thích */
}
```

### 3.2. Quy chuẩn Bo góc & Nút bấm 3D (Border Radius & 3D Buttons)
* **Bo góc (Border Radius):**
  * Thẻ nội dung (Cards): `16px` — `20px` (tạo cảm giác thân thiện, mềm mại).
  * Nút lựa chọn (Choice Buttons): `14px` — `16px`.
  * Huy hiệu/Tag (Pills): `9999px` (bo tròn tuyệt đối).
* **Hiệu ứng nút bấm vật lý 3D (The Signature 3D Button):**
  * Trạng thái thường: `border: 2px solid var(--color); border-bottom: 5px solid var(--color-shadow);`
  * Khi hover: màu sáng nhẹ lên 5%.
  * Khi bấm (Active): `transform: translateY(3px); border-bottom: 2px solid var(--color-shadow);` ➔ Cho cảm giác phím cơ lún xuống thật.

### 3.3. Kiểu chữ (Typography)
* **Font chữ khuyến nghị:** **Inter**, **Be Vietnam Pro** hoặc **Plus Jakarta Sans** (Google Fonts).
* Các font này có nét chữ tròn trịa, hiện đại, hiển thị dấu tiếng Việt hoàn hảo và rất dễ đọc trên màn hình điện thoại nhỏ.

---

## 4. BỐ CỤC KHÔNG GIAN (LAYOUT ARCHITECTURE)

### 4.1. Bố cục 3 Cột trên Màn hình Desktop (Desktop 3-Column Layout)
Lấy cảm hứng từ bố cục tiêu chuẩn của Duolingo Web:

```
┌──────────────┬──────────────────────────────────────────┬────────────────────────┐
│ CỘT TRÁI     │ CỘT GIỮA (LỘ TRÌNH CHÍNH)                │ CỘT PHẢI               │
│ (Sidebar Cố  │ (Center Learning Path - Max 620px)       │ (Tiện ích & Đua top)   │
│  định 260px) │                                          │ (Widgets 340px)        │
├──────────────┼──────────────────────────────────────────┼────────────────────────┤
│ 🤖 MIMO      │ [BANNER CHẶNG 1: SƠ CẤP CỨU CƠ BẢN]      │ ┌────────────────────┐ │
│              │ "Học cách cứu người trong 3 phút vàng"   │ │ 🔥 7 Ngày Streak   │ │
│ 🏠 Học tập   │                                          │ │ ⭐ 1.250 XP        │ │
│ 🏆 Xếp hạng  │         (●) Nút 1: Bỏng nước sôi         │ │ ❤️ 5/5 Tim         │ │
│ 🏅 Thành tích│        ／                                │ └────────────────────┘ │
│ 📚 Cẩm nang  │     (●) Nút 2: Vết thương hở             │                        │
│ 🏫 Lớp học   │       ＼                                 │ ┌────────────────────┐ │
│ ⚙️ Cài đặt   │         (●) Nút 3: Rương thưởng 🎁       │ │ 🏆 GIẢI ĐẤU VÀNG   │ │
│              │        ／                                │ │ Hạng 4 • Thăng hạng│ │
│              │     (●) Nút 4: Khám phá Boss CPR 👑      │ └────────────────────┘ │
│              │                                          │ ┌────────────────────┐ │
│              │ [BANNER CHẶNG 2: THOÁT HIỂM HỎA HOẠN]    │ │ ⚡ NHIỆM VỤ NGÀY   │ │
│              │          (○) Nút khóa 2.1...             │ │ 2/3 Bài hoàn thành │ │
│              │                                          │ └────────────────────┘ │
└──────────────┴──────────────────────────────────────────┴────────────────────────┘
```

### 4.2. Bố cục Di động (Mobile-First Layout)
* **Top Bar (Cố định):** Hiển thị Cờ chủ đề đang học + 🔥 7 + ⭐ 1.250 + ❤️ 5.
* **Khu vực thân trang:** Cuộn dọc bản đồ uốn lượn (Snake Path) toàn màn hình.
* **Bottom Navigation Bar (Cố định đáy):** 5 icon chuyển tab nhanh:
  * 🏠 *Học tập (Path)* | 🏆 *Xếp hạng (Leagues)* | ⚡ *Nhiệm vụ (Quests)* | 🏅 *Hồ sơ & Huy hiệu (Profile)* | 🏫 *Lớp học (School)*.

---

## 5. CHI TIẾT THIẾT KẾ TỪNG MÀN HÌNH THEN CHỐT

### 5.1. Màn hình Lộ trình học (Learning Path Screen)
* **Header Chặng (Unit Banner):** Mỗi chặng có một thẻ Card lớn nổi bật với màu nền đặc trưng (Xanh cho Sơ cứu, Cam cho Hỏa hoạn, Tím cho Scam mạng). Có tiêu đề chặng, mô tả ngắn và thanh tiến độ chặng (vd: 3/5 bài).
* **Nút bài học hình tròn (The Stepping Stone Nodes):**
  * Nút tròn đường kính `70px` có đổ bóng 3D.
  * **Trạng thái Đã hoàn thành:** Màu vàng óng hoặc xanh lá rực rỡ, có biểu tượng 3 ngôi sao nhỏ trên đầu.
  * **Trạng thái Đang học (Active):** Nút nhấp nháy ánh sáng nhẹ (pulse animation), có linh vật Mimo 🤖 đứng vẫy tay bên cạnh và bong bóng thoại: *"Bắt đầu nào!"*.
  * **Trạng thái Bị khóa (Locked):** Nút màu xám nhạt, có biểu tượng ổ khóa nhỏ `🔒`.
* **Nút Rương thưởng (Gift Chest):** Nằm giữa các bài học, khi người học đi qua sẽ mở bung ra hạt vàng + thưởng 20 XP hoặc tặng 1 Bùa đóng băng chuỗi.

---

### 5.2. Màn hình Bảng xếp hạng Tuần (Weekly Leagues Screen)
* **Bục vinh quang Top 3 (Podium):**
  * Vị trí #1: Bục cao nhất màu vàng Gold, gắn vương miện 👑.
  * Vị trí #2: Bục màu bạc Silver.
  * Vị trí #3: Bục màu đồng Bronze.
* **Vùng ranh giới thăng hạng / rớt hạng:**
  * Có đường kẻ phân cách màu xanh lá rõ ràng: *"Vùng thăng hạng lên Giải Kim Cương (Top 7)"*.
  * Vùng giữa: *"Trụ hạng"*.
  * Đường kẻ màu đỏ ở đáy: *"Vùng rớt hạng về Giải Bạc (Top 5 cuối)"*.
* **Highlight người dùng:** Hàng của chính người học luôn được tô nền vàng sáng, gắn nhãn *"Bạn"* để dễ dàng định vị vị trí của mình đang ở đâu.

---

### 5.3. Màn hình Kho Thành tích & Huy hiệu (Badges Showcase)
* Thiết kế dạng lưới lưới 3 cột (Grid) với các tấm huy hiệu 3D:
  * **Huy hiệu đã đạt:** Màu sắc sáng bóng, có thể bấm vào để xem ngày đạt được và nút "Chia sẻ lên Facebook/TikTok" để khoe chiến tích.
  * **Huy hiệu chưa đạt:** Hiển thị dưới dạng bóng đen mờ (Silhouette) kèm điều kiện mở khóa (vd: *"Cứu sống 10 nạn nhân giả lập trong kịch bản CPR để mở khóa"*).

---

## 6. THIẾT KẾ MÀN HÌNH CHƠI TÌNH HUỐNG (SCENARIO GAME ENGINE)

Đây là **màn hình quan trọng nhất** của toàn bộ sản phẩm. Khi người học bước vào màn này, mọi thanh menu xung quanh sẽ ẩn đi để tạo sự tập trung 100% (Zen mode).

```
┌────────────────────────────────────────────────────────────────────────┐
│ [✕ Thoát]   ██████████████████░░░░░░░░░░ (60%)                ❤️ ❤️ ❤️ ❤️ 🤍 │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   🤖 MIMO CẢNH BÁO:                                                    │
│   "Bạn nghe thấy tiếng còi báo cháy réo vang ở hành lang chung cư.     │
│    Khói đen bắt đầu len qua khe cửa vào căn hộ tầng 8 của bạn!"        │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ [ẢNH MINH HỌA NGỮ CẢNH: Cửa phòng khói đen cuồn cuộn bốc lên]  │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   CÂU HỎI: HÀNH ĐỘNG AN TOÀN ĐẦU TIÊN CỦA BẠN LÀ GÌ?                   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │ [ 1 ]  Mở toang cửa chạy ngay ra phía cầu thang máy            │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ [ 2 ]  Chạy ra ban công đứng kêu cứu và nhảy xuống             │   │
│   ├────────────────────────────────────────────────────────────────┤   │
│   │ [ 3 ]  Lấy khăn thấm nước chèn kín khe cửa và hạ thấp người    │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│ KHAY PHẢN HỒI DƯỚI ĐÁY (BOTTOM SHEET TRƯỢT LÊN KHI BẤM KIỂM TRA):      │
│                                                                        │
│ ✓ CHÍNH XÁC! TUYỆT VỜI! (+10 XP)                    [ TIẾP TỤC ➔ (Enter)]│
│ Giải thích an toàn: Khói độc bốc lên cao sẽ gây ngạt thở trong 30 giây.│
│ Khăn ướt chèn cửa chặn khói và hạ thấp người giúp bạn có oxy để sống! │
└────────────────────────────────────────────────────────────────────────┘
```

### 6.1. Ba Trạng thái của Khay phản hồi đáy (Bottom Feedback Sheet)
1. **Trạng thái Chờ (Idle State):**
   * Nền trắng hoặc xám nhạt. Nút bên phải mang tên *"KIỂM TRA"*.
   * Khi chưa chọn đáp án: Nút xám mờ (Disabled).
   * Khi vừa bấm chọn 1 đáp án: Nút chuyển sang xanh lá sáng rực, hiệu ứng 3D sẵn sàng bấm (hoặc gõ phím `Enter`).
2. **Trạng thái Trả lời ĐÚNG (Success State):**
   * Toàn bộ thanh đáy trượt lên với nền màu xanh lá pastel (`#DCFCE7`), viền trên xanh lá đậm.
   * Icon tích xanh tròn to `✅` kèm tiêu đề: *"Chính xác!"* hoặc *"Tuyệt vời!"*.
   * Dòng chữ giải thích cơ chế y tế/an toàn ngắn gọn (2 dòng).
   * Nút bấm chuyển thành: *"TIẾP TỤC"* (Màu xanh lá 3D, hỗ trợ phím `Enter`).
3. **Trạng thái Trả lời SAI (Danger / Error State):**
   * Toàn bộ thanh đáy trượt lên với nền màu đỏ pastel (`#FEE2E2`), viền trên đỏ thẫm.
   * Icon cảnh báo đỏ `⚠️` kèm dòng chữ: *"Nguy hiểm! Đáp án đúng là..."*.
   * Giải thích hậu quả thực tế: *"Tuyệt đối không dùng thang máy khi cháy vì mất điện sẽ biến thang máy thành lò thiêu!"*.
   * Góc trên màn hình: Biểu tượng Tim bị vỡ kèm hiệu ứng -1 ❤️.
   * Nút bấm chuyển thành: *"ĐÃ HIỂU"* (Màu đỏ 3D).

---

## 7. HIỆU ỨNG TƯƠNG TÁC, ÂM THANH & CẢM XÚC (MICRO-INTERACTIONS)

Để ứng dụng tạo cảm giác "chơi game cuốn hút", các hiệu ứng vi mô đóng vai trò quyết định:

### 7.1. Âm thanh phản hồi (Audio Soundscapes)
* **Âm thanh Chọn đáp án (Tap):** Tiếng "pop" nhẹ nhàng, vui tai.
* **Âm thanh Trả lời Đúng (Correct Chime):** Hợp âm trưởng leng keng ngân vang (tương tự tiếng chuông Duolingo), kích thích não bộ tiết Dopamine.
* **Âm thanh Trả lời Sai (Wrong Thud):** Tiếng "bụp" trầm nhẹ, nhắc nhở nghiêm túc nhưng không gây ức chế tinh thần.
* **Âm thanh Chiến thắng Bài học (Lesson Complete):** Đoạn nhạc kèn chiến thắng fanfare ngắn 3 giây + tiếng nổ pháo hoa hạt giấy Confetti bay tung tóe khắp màn hình.

### 7.2. Tương tác xúc giác & Chuyển động (Haptics & Motion)
* **Rung nhẹ điện thoại (Haptic feedback):** Rung 1 nhịp nhẹ khi chọn đúng; rung đôi (buzz-buzz) khi chọn sai mất tim.
* **Pháo hoa Confetti:** Khi hoàn thành câu hỏi cuối cùng của bài học, hiệu ứng canvas bắn pháo hoa giấy nhiều màu chúc mừng giữ chuỗi Streak.
* **Biểu cảm Linh vật Mimo 🤖:**
  * Đứng chào ở trang chủ: Vẫy tay, mắt chớp.
  * Khi người học trả lời đúng: Nhảy cẫng lên mừng rỡ, giơ hai tay chữ V.
  * Khi người học trả lời sai: Đưa tay ôm mặt lo lắng, động viên cố lên.

---

## 8. KẾ HOẠCH CHUYỂN HÓA LÊN SOURCE CODE HIỆN TẠI

Nhìn vào cấu trúc thư mục hiện tại trong `d:\EXE\EXE201\Mimo_EXE201_FE\src`:
* Bạn đã có nền tảng vững chắc với `MimoDashboard.jsx`, `MimoLandingPage.jsx`, các file CSS và mock data.
* Kế hoạch nâng cấp UI/UX sắp tới theo chuẩn tài liệu này:
  1. **Bước 1 — Chuẩn hóa CSS Variables:** Cập nhật bảng màu, font chữ và class `.btn-3d` (3D press button) vào `index.css` & `App.css`.
  2. **Bước 2 — Refactor Màn hình Lộ trình (Path Map Component):** Tái cấu trúc khu vực học tập thành dạng bản đồ uốn lượn (Snake Path) có các nút tròn 3D thay vì danh sách phẳng.
  3. **Bước 3 — Nâng cấp Scenario Game Engine:** Tách riêng màn hình làm bài kiểm tra, tích hợp thanh Bottom Sheet phản hồi đúng/sai trượt lên mượt mà.
  4. **Bước 4 — Thêm Âm thanh & Confetti:** Tích hợp thư viện âm thanh nhỏ (hoặc web audio API) và hiệu ứng pháo hoa `canvas-confetti` khi hoàn thành bài.

---

*Tài liệu này được biên soạn độc quyền cho dự án MIMO (EXE201). Mọi chi tiết thiết kế đều hướng tới tiêu chí: trực quan, hấp dẫn, hiện đại và tạo dựng lòng tin vững chắc cho hội đồng thẩm định.*
