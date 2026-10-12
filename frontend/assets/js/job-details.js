const API_BASE_URL = "http://localhost:8080/api";

const params = new URLSearchParams(window.location.search);
const jobId = params.get("jobId");

const token = localStorage.getItem("token");

const elements = {
    title: document.getElementById("job-title"),
    company: document.getElementById("job-company"),
    companyName: document.getElementById("company-name"),
    salary: document.getElementById("job-salary"),
    level: document.getElementById("job-level"),
    workType: document.getElementById("job-work-type"),
    address: document.getElementById("job-address"),
    technologies: document.getElementById("job-technologies"),
    description: document.getElementById("job-description"),
    images: document.getElementById("job-images"),
    loadMessage: document.getElementById("job-load-message"),
    companyLogo: document.getElementById("company-logo"),
    companyModel: document.getElementById("company-model"),
    companySize: document.getElementById("company-size"),
    companyWorkingTime: document.getElementById("company-working-time"),
    companyOvertimePolicy: document.getElementById("company-overtime-policy")
};

const applyForm = document.getElementById("apply-form");
const cvFileInput = document.getElementById("cvFile");
const applyMessage = document.getElementById("apply-message");

// Hiển thị thông báo tải chi tiết Job
function showLoadMessage(message, isError = false) {
    if (!elements.loadMessage) return;

    elements.loadMessage.textContent = message;
    elements.loadMessage.classList.toggle("text-red-500", isError);
    elements.loadMessage.classList.toggle("text-green-600", !isError);
}

// Hiển thị thông báo ứng tuyển
function showApplyMessage(message, isError = false) {
    if (!applyMessage) return;

    applyMessage.textContent = message;
    applyMessage.classList.remove("hidden", "text-red-500", "text-green-600");
    applyMessage.classList.add(
        isError ? "text-red-500" : "text-green-600"
    );
}

// Định dạng mức lương theo giao diện hiện tại
function formatSalary(minSalary, maxSalary) {
    const formatter = new Intl.NumberFormat("vi-VN");

    return `${formatter.format(minSalary)}$ - ${formatter.format(maxSalary)}$`;
}
function renderImages(value) {
    if (!elements.images) return;

    elements.images.replaceChildren();

    // Bỏ qua giá trị rỗng, null hoặc chuỗi "null"
    if (
        value == null ||
        ["", "null", "undefined"].includes(
            String(value).trim().toLowerCase()
        )
    ) {
        return;
    }

    const imageUrls = String(value)
        .split(",")
        .map(url => url.trim())
        .filter(url =>
            url &&
            !["null", "undefined"].includes(url.toLowerCase())
        );

    imageUrls.forEach(url => {
        const image = document.createElement("img");

        // Nếu URL là đường dẫn upload từ backend
        image.src = url.startsWith("/uploads/")
            ? `http://localhost:8080${url}`
            : url;

        image.alt = "Ảnh công việc";
        image.className = "rounded-[4px] w-full object-cover";

        image.onerror = function () {
            this.remove();
        };

        elements.images.appendChild(image);
    });
}
// Render công nghệ từ chuỗi trong JobResponse
function renderTechnologies(value) {
    if (!elements.technologies) return;

    elements.technologies.replaceChildren();

    if (!value) return;

    const technologies = String(value)
        .split(",")
        .map(item => item.trim())
        .filter(Boolean);

    technologies.forEach(technology => {
        const tag = document.createElement("div");

        tag.className =
            "border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] " +
            "font-[400] text-[12px] text-[#414042]";

        tag.textContent = technology;
        elements.technologies.appendChild(tag);
    });
}

// Tải chi tiết Job theo jobId trên URL
async function loadJobDetails() {
    if (!jobId || !/^\d+$/.test(jobId) || Number(jobId) <= 0) {
        showLoadMessage("URL không có jobId hợp lệ.", true);
        return;
    }

    showLoadMessage("Đang tải thông tin công việc...");

    try {
        const response = await fetch(
            `${API_BASE_URL}/job/public/${encodeURIComponent(jobId)}`
        );

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Không tìm thấy công việc này.");
            }

            throw new Error(`Tải công việc thất bại (HTTP ${response.status}).`);
        }

        const job = await response.json();

        elements.title.textContent = job.title ?? "Chưa có tiêu đề";

        elements.company.textContent =
            job.companyName ?? "Chưa có thông tin công ty";

        if (elements.companyName) {
            elements.companyName.textContent =
                job.companyName ?? "Chưa có thông tin công ty";
        }

        elements.salary.textContent = formatSalary(
            job.minSalary,
            job.maxSalary
        );

        elements.level.textContent = job.level ?? "Chưa cập nhật";
        elements.workType.textContent = job.workType ?? "Chưa cập nhật";
        elements.address.textContent = job.address ?? "Chưa cập nhật";

        elements.description.textContent =
            job.description ?? "Chưa có mô tả công việc.";

        renderTechnologies(job.technologies);
        renderImages(job.images);

        // Thông tin công ty
        if (elements.companyName) {
            elements.companyName.textContent =
                job.companyName ?? "Chưa cập nhật";
        }

        elements.companyModel.textContent =
            job.companyModel ?? "Chưa cập nhật";

        elements.companySize.textContent =
            job.companySize ?? "Chưa cập nhật";

        elements.companyWorkingTime.textContent =
            job.companyWorkingTime ?? "Chưa cập nhật";

        elements.companyOvertimePolicy.textContent =
            job.companyOvertimePolicy ?? "Chưa cập nhật";

        // Logo công ty
            if (elements.companyLogo) {
        const logoUrl = job.companyLogoUrl;

        if (
            logoUrl &&
            !["null", "undefined"].includes(
                String(logoUrl).trim().toLowerCase()
            )
        ) {
            elements.companyLogo.src = logoUrl;
        } else {
            elements.companyLogo.src = "assets/images/demo/demo4.png";
        }
    }
        
        showLoadMessage("");
    } catch (error) {
        console.error("Lỗi khi tải chi tiết Job:", error);

        showLoadMessage(
            error.message || "Không thể tải thông tin công việc.",
            true
        );
    }
}

// Kiểm tra file PDF được chọn
if (applyForm) {
    applyForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const token = localStorage.getItem("token");
        const file = cvFileInput.files[0];

        if (!token) {
            showApplyMessage(
                "Bạn cần đăng nhập bằng tài khoản ứng viên.",
                true
            );
            return;
        }

        if (!jobId) {
            showApplyMessage("Không xác định được công việc.", true);
            return;
        }

        if (!file) {
            showApplyMessage("Vui lòng chọn file CV PDF.", true);
            return;
        }

        if (
            !file.name.toLowerCase().endsWith(".pdf") ||
            file.type !== "application/pdf"
        ) {
            showApplyMessage("CV phải là file PDF.", true);
            return;
        }

        const formData = new FormData();
        formData.append("jobId", jobId);
        formData.append("cvFile", file);

        const submitButton = applyForm.querySelector(
            'button[type="submit"]'
        );

        try {
            submitButton.disabled = true;
            showApplyMessage("Đang gửi đơn ứng tuyển...", false);

            const response = await fetch(
                `${API_BASE_URL}/application/me`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: formData
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();

                if (response.status === 409) {
                    throw new Error("Bạn đã ứng tuyển công việc này rồi.");
                }

                throw new Error(
                    `HTTP ${response.status}: ${errorBody || response.statusText}`
                );
            }

            await response.json();

            showApplyMessage("Ứng tuyển thành công!", false);
            applyForm.reset();

        } catch (error) {
            console.error("Lỗi ứng tuyển:", error);
            showApplyMessage(
                "Không thể gửi đơn ứng tuyển. " + error.message,
                true
            );
        } finally {
            submitButton.disabled = false;
        }
    });
}

loadJobDetails();