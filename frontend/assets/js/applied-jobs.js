const API_URL = "http://localhost:8080/api/application/me";

const applicationsContainer = document.getElementById(
    "applications-container"
);
const messageElement = document.getElementById("applications-message");

const token = localStorage.getItem("token");

// Chưa đăng nhập thì chuyển về trang đăng nhập candidate
if (!token) {
    window.location.href = "candidate-login.html";
}

// Chuyển dữ liệu thành chuỗi an toàn trước khi đưa vào innerHTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

// Định dạng lương theo giao diện hiện tại
function formatSalary(minSalary, maxSalary) {
    const min = Number(minSalary).toLocaleString("vi-VN");
    const max = Number(maxSalary).toLocaleString("vi-VN");

    return `${min}$ - ${max}$`;
}

// Chuyển trạng thái backend thành tiếng Việt
function getStatusText(status) {
    const statusMap = {
        PENDING: "Chưa duyệt",
        APPROVED: "Đã duyệt",
        REJECTED: "Từ chối"
    };

    return statusMap[status] || status || "Chưa xác định";
}

// Định dạng thời gian ứng tuyển
function formatDate(dateValue) {
    if (!dateValue) return "Chưa có thông tin";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return "Chưa có thông tin";
    }

    return date.toLocaleString("vi-VN");
}

// Chỉ cho phép mở URL HTTP/HTTPS
const CV_BASE_ORIGIN = "http://localhost:8080";   // đặt tên khác nếu file đã có biến tương tự

function getSafeUrl(value) {
    if (!value) return null;
    try {
        // Có địa chỉ gốc để xử lý được cả "/uploads/cv/x.pdf" lẫn URL đầy đủ
        const url = new URL(value, CV_BASE_ORIGIN);

        if (url.protocol === "http:" || url.protocol === "https:") {
            return url.href;
        }
    } catch (error) {
        // URL không hợp lệ
    }

    return null;
}

function showMessage(message, isError = false) {
    if (!messageElement) return;

    messageElement.textContent = message;
    messageElement.classList.remove("hidden", "text-red-500", "text-green-600");
    messageElement.classList.add(
        isError ? "text-red-500" : "text-green-600"
    );
}

// Tạo HTML cho một đơn ứng tuyển
function createApplicationCard(application) {
    const cvUrl = getSafeUrl(application.cvFileUrl);

    const cvButton = cvUrl
        ? `
            <a
                href="${escapeHTML(cvUrl)}"
                target="_blank"
                rel="noopener noreferrer"
                class="bg-[#0088FF] rounded-[4px] py-[8px] px-[20px]
                       cursor-pointer font-[400] text-[14px] text-white"
            >
                Xem CV
            </a>
        `
        : `
            <span class="text-[14px] text-[#A6A6A6]">
                Chưa có URL CV hợp lệ
            </span>
        `;

    return `
        <div class="card-item p-[20px]">
            <img src="assets/images/bg-card.png" class="inner-bg">

            <div class="font-[700] text-[18px] text-[#121212]
                        text-center line-clamp-[2]">
                ${escapeHTML(application.jobTitle)}
            </div>

            <div class="mt-[12px] font-[400] text-[14px] text-center">
                Mã đơn: #${escapeHTML(application.id)}
            </div>

            <div class="font-[600] text-[16px] text-[#0088FF]
                        text-center mt-[6px]">
                ${formatSalary(
                    application.minSalary,
                    application.maxSalary
                )}
            </div>

            <div class="font-[400] text-[14px] text-[#121212]
                        text-center mt-[6px]">
                Cấp bậc: ${escapeHTML(application.level)}
            </div>

            <div class="font-[400] text-[14px] text-[#121212]
                        text-center mt-[6px]">
                Hình thức: ${escapeHTML(application.workType)}
            </div>

            <div class="font-[400] text-[14px] text-[#121212]
                        text-center mt-[6px]">
                Ngày ứng tuyển: ${escapeHTML(
                    formatDate(application.appliedAt)
                )}
            </div>

            <div class="font-[600] text-[14px] text-[#0088FF]
                        text-center mt-[6px]">
                ${escapeHTML(getStatusText(application.status))}
            </div>

            <div class="flex flex-wrap justify-center gap-[8px] mt-[12px]">
                ${cvButton}
            </div>
        </div>
    `;
}

// Gọi API lấy danh sách đơn của candidate hiện tại
async function loadMyApplications() {
    if (!applicationsContainer) {
        console.error("Không tìm thấy applications-container trong Pug.");
        return;
    }

    applicationsContainer.innerHTML = "";
    showMessage("Đang tải danh sách đơn ứng tuyển...");

    try {
        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            showMessage("Phiên đăng nhập không hợp lệ hoặc bạn không có quyền.", true);
            return;
        }

        if (!response.ok) {
            throw new Error(`Lỗi API: HTTP ${response.status}`);
        }

        const applications = await response.json();

        if (!Array.isArray(applications) || applications.length === 0) {
            showMessage("Bạn chưa có đơn ứng tuyển nào.");
            return;
        }

        applicationsContainer.innerHTML = applications
            .map(createApplicationCard)
            .join("");

        if (messageElement) {
            messageElement.classList.add("hidden");
        }
    } catch (error) {
        console.error("Lỗi khi tải đơn ứng tuyển:", error);
        showMessage("Không thể tải danh sách đơn ứng tuyển. Vui lòng thử lại.", true);
    }
}

loadMyApplications();