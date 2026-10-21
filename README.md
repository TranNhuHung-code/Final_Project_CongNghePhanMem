# VN.ITJobs – Nền tảng tuyển dụng IT

Đồ án môn **Công nghệ phần mềm**, Nhóm 06. Website kết nối ứng viên với nhà tuyển dụng trong lĩnh vực công nghệ thông tin.

## Chức năng chính

| Đối tượng | Chức năng |
|---|---|
| Khách | Tìm kiếm/lọc việc làm, xem chi tiết công việc và công ty. |
| Ứng viên | Đăng ký, đăng nhập, cập nhật thông tin cá nhân, nộp CV PDF, xem danh sách đơn ứng tuyển và trạng thái. |
| Nhà tuyển dụng | Đăng ký, đăng nhập, cập nhật thông tin công ty, thêm/sửa/xóa công việc, xem và xử lý CV ứng tuyển (đã xem, duyệt, từ chối, xóa). |

> Chỉ bổ sung chức năng **rút đơn ứng tuyển** vào danh sách trên sau khi API và giao diện được commit và kiểm thử.

## Công nghệ

- Backend: Java 17, Spring Boot, Spring Security JWT, Spring Data JPA / Hibernate, Gradle.
- Frontend: Pug, HTML, CSS, JavaScript.
- Database: MySQL 8.
- Triển khai: Docker, Docker Compose, Nginx và Railway.

## Cấu trúc dự án

```text
Final_Project_CongNghePhanMem/
├── backend/                   # Spring Boot và Gradle
├── frontend/
│   ├── views/pages/           # Pug templates
│   └── assets/                # JS, CSS, hình ảnh
├── compose.yaml               # Nhánh feature/docker-deploy
└── README.md
```

## Chạy local (nhánh `main`)

**Yêu cầu:** JDK 17, MySQL 8, Node.js/npm, IntelliJ IDEA (hoặc IDE Java tương đương), trình duyệt và Live Server.

1. Clone mã nguồn:

   ```bash
   git clone https://github.com/TranNhuHung-code/Final_Project_CongNghePhanMem.git
   cd Final_Project_CongNghePhanMem
   git switch main
   ```

2. Tạo database trên MySQL local:

   ```sql
   CREATE DATABASE IF NOT EXISTS itjobs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

   Nếu có script SQL kèm bộ bài nộp, nhập vào database thử nghiệm trước khi chạy.

3. Mở thư mục `backend` bằng IntelliJ. Trong **Run → Edit Configurations → Environment variables**, cấu hình:

   ```dotenv
   DB_URL=jdbc:mysql://localhost:3306/itjobs_db
   DB_USERNAME=root
   DB_PASSWORD=<mat_khau_mysql_local>
   JWT_SECRET=<khoa_ngau_nhien_toi_thieu_32_bytes>
   ```

   Chạy `BackendApplication` hoặc trong thư mục `backend` chạy `gradlew.bat bootRun` (Windows) / `./gradlew bootRun` (Linux/macOS). Backend mặc định ở `http://localhost:8080`.

4. Trong thư mục `frontend`:

   ```bash
   npm install
   npm run start
   ```

   `npm run start` biên dịch Pug thành HTML và theo dõi thay đổi. Mở `frontend/index.html` qua Live Server. Với Live Server, cấu hình các lời gọi API hướng đến Backend tại `http://localhost:8080`.

## Hướng dẫn chạy chương trình bằng Docker

Nhóm đã đóng gói hệ thống VN.ITJobs thành bộ Docker Demo, bao gồm Frontend, Backend, MySQL và dữ liệu mẫu. Giảng viên có thể chạy chương trình mà không cần cài đặt riêng Java, Gradle, Node.js hoặc MySQL.

### 1. Yêu cầu hệ thống

- Máy tính sử dụng Windows 10/11.
- Đã cài đặt và khởi động Docker Desktop.
- Đã tải bộ `VNITJobs_Docker.zip` từ Google Drive và giải nén.

### 2. Các bước khởi động

**Bước 1:** Giải nén `VNITJobs_Docker.zip` vào một thư mục trên máy tính.

**Bước 2:** Mở Docker Desktop và đợi Docker Engine khởi động hoàn tất.

**Bước 3:** Mở thư mục `VNITJobs_Docker`, nhấp đúp vào tệp `START.bat`.

Chương trình sẽ tự động:

- Nạp các Docker Images đã được nhóm đóng gói.
- Khởi động MySQL, Backend và Frontend.
- Khởi tạo cơ sở dữ liệu và nạp dữ liệu mẫu ở lần chạy đầu tiên.

**Bước 4:** Đợi quá trình khởi động hoàn tất, sau đó mở trình duyệt và truy cập:

**http://localhost:18082**

### 3. Tài khoản đăng nhập thử nghiệm

| Vai trò | Email | Mật khẩu |
|---|---|---|
| Ứng viên | candidate1@vnitjobs.demo | Demo@2026 |
| Nhà tuyển dụng | employer1@vnitjobs.demo | Demo@2026 |

Các tài khoản và dữ liệu trên được tạo phục vụ mục đích kiểm thử, không chứa thông tin cá nhân thực tế.

### 4. Dừng chương trình

Khi không sử dụng, nhấp đúp vào tệp `STOP.bat` trong thư mục `VNITJobs_Demo` để dừng hệ thống.

Dữ liệu đã tạo trong quá trình sử dụng được lưu trữ bằng Docker Volume và không bị xóa khi dừng chương trình thông thường.

### 5. Lưu ý

- Không cần thực hiện các lệnh `docker build`, `npm install` hoặc `gradlew`.
- Không cần tạo cơ sở dữ liệu MySQL thủ công.
- Cần giữ nguyên cấu trúc thư mục sau khi giải nén.
- Nếu website chưa hiển thị ngay, vui lòng đợi quá trình khởi động Backend và MySQL hoàn tất rồi tải lại trang.
- Bộ Docker Demo được chuẩn bị cho máy Windows có Docker Desktop và kiến trúc tương thích với các Docker Images được cung cấp.


## Triển khai Railway

Nhánh `feature/docker-deploy` được sử dụng để triển khai ba service **Frontend (Nginx)**, **Backend (Spring Boot)** và **MySQL**.

- Frontend phục vụ các trang HTML và proxy `/api/`, `/uploads/` đến Backend.
- Backend sử dụng profile `railway` và các Railway Variables: `SPRING_PROFILES_ACTIVE=railway`, `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`.
- MySQL dùng persistent volume. Đường dẫn truy cập công khai của Frontend có thể thay đổi; xem Railway → Frontend → Networking để lấy domain hiện tại.

## Bảo mật và lưu trữ

- Mật khẩu tài khoản được mã hóa bằng BCrypt; JWT xác thực các yêu cầu cần đăng nhập.
- Không commit mật khẩu database, JWT secret, `.env.docker.local` hoặc CV chứa dữ liệu cá nhân thật.
- CV được lưu trên hệ thống file và có đường dẫn tham chiếu trong database. Docker Volume hỗ trợ giữ file qua các lần tạo lại container, **không thay thế backup**.
- Phiên bản demo có thể còn các hạn chế về quản lý token, sao lưu file CV và kiểm thử tự động.

## Tài liệu nộp bài

Bộ nộp nên đi kèm **báo cáo đồ án**, **source code**, **script SQL tạo cấu trúc và dữ liệu mẫu** cùng README này. Script SQL nên được xuất/kiểm thử từ database tương ứng với phiên bản source cuối cùng.

**Repository:** https://github.com/TranNhuHung-code/Final_Project_CongNghePhanMem
