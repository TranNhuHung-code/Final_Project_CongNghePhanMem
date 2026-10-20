
const API = "/api";
const params = new URLSearchParams(window.location.search);
const applicationId = Number(params.get("id"));

const setText = (id, value) => {
    document.getElementById(id).textContent =
        value === null || value === undefined || value === ""
            ? "Chưa cập nhật"
            : value;
};

function formatSalary(value) {
    if (value == null || value === "") return "Thỏa thuận";
    return Number(value).toLocaleString("en-US") + "$";
}

async function loadCVDetails() {
    const token = localStorage.getItem("token");
    const message = document.getElementById("cv-message");

    if (!token) {
        message.textContent = "Bạn chưa đăng nhập.";
        return;
    }

    if (!Number.isSafeInteger(applicationId) || applicationId <= 0) {
        message.textContent = "ID đơn ứng tuyển không hợp lệ.";
        return;
    }

    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await fetch(
            `${API}/application/employer/me`,
            { headers }
        );

        if (!response.ok) {
            throw new Error("Không thể lấy danh sách ứng tuyển.");
        }

        const applications = await response.json();
        const application = applications.find(
            a => Number(a.id) === applicationId
        );

        if (!application) {
            throw new Error("Không tìm thấy CV hoặc không có quyền truy cập.");
        }

        setText("candidate-name", application.candidateName);
        setText("candidate-email", application.candidateEmail);
        setText("candidate-phone", application.candidatePhone);

        setText("job-title", application.jobTitle);
        setText("job-level", application.level);
        setText("job-work-type", application.worktype ?? application.workType);

        setText(
            "job-salary",
            `${formatSalary(application.minSalary)} - ${formatSalary(application.maxSalary)}`
        );

        const statuses = {
            PENDING: "Chưa duyệt",
            APPROVED: "Đã duyệt",
            REJECTED: "Đã từ chối"
        };

        setText(
            "application-status",
            statuses[application.status] || "Chưa xác định"
        );

        if (application.cvFileUrl) {
            const backendOrigin = API.startsWith("http")
                ? new URL(API).origin
                : window.location.origin;

            const url = new URL(
                application.cvFileUrl,
                backendOrigin
            );

            if (
                url.origin !== backendOrigin ||
                !url.pathname.startsWith("/uploads/cv/")
            ) {
                throw new Error("Đường dẫn CV không hợp lệ.");
            }

            const pdf = document.getElementById("cv-pdf");
            pdf.src = url.href;
            pdf.classList.remove("hidden");

            const open = document.getElementById("cv-open");
            open.href = url.href;
            open.classList.remove("hidden");
        } else {
            document.getElementById("cv-empty")
                .classList.remove("hidden");
        }

        message.textContent = "";

        if (!application.viewed) {
            const viewedResponse = await fetch(
                `${API}/application/employer/${applicationId}/viewed`,
                {
                    method: "PATCH",
                    headers
                }
            );

            if (!viewedResponse.ok) {
                message.textContent =
                    "Đã hiển thị CV nhưng chưa đánh dấu đã xem được.";
            }
        }

    } catch (error) {
        console.error(error);
        message.textContent = error.message;
    }
}

loadCVDetails();
