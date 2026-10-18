
const API_ORIGIN = "";
const API_BASE_URL = `${API_ORIGIN}/api`;

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "employer-login.html";
}

const jobCardsContainer = document.getElementById("job-cards");

// ==================================================
// 1. CÁC HÀM DÙNG CHUNG
// ==================================================

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

// Kiểm tra ID hợp lệ trước khi đưa vào URL và HTML
function getSafeJobId(value) {
    const id = String(value ?? "");

    return /^\d+$/.test(id) && Number(id) > 0
        ? id
        : null;
}

// Định dạng mức lương
function formatSalary(minSalary, maxSalary) {
    const min = Number(minSalary);
    const max = Number(maxSalary);

    if (
        minSalary == null ||
        maxSalary == null ||
        !Number.isFinite(min) ||
        !Number.isFinite(max)
    ) {
        return "Thỏa thuận";
    }

    return `${min.toLocaleString("vi-VN")}$ - ${max.toLocaleString("vi-VN")}$`;
}

// Hiển thị thông báo trong khu vực danh sách Job
function showMessage(message, isError = false) {
    if (!jobCardsContainer) {
        console.error("Không tìm thấy phần tử #job-cards.");
        return;
    }

    const paragraph = document.createElement("p");

    paragraph.className = isError
        ? "col-span-full text-center text-red-500"
        : "col-span-full text-center text-[#666]";

    paragraph.textContent = message;

    jobCardsContainer.replaceChildren(paragraph);
}

// ==================================================
// 2. TẠO THẺ HIỂN THỊ JOB
// ==================================================

function createJobCard(job) {
    const jobId = getSafeJobId(job.id);

    const techList = job.technologies
        ? String(job.technologies)
            .split(",")
            .map(technology => technology.trim())
            .filter(Boolean)
        : [];

    const techTags = techList
        .map(technology => `
            <div class="border border-[#DEDEDE] rounded-[20px]
                        py-[6px] px-[16px] font-[400] text-[12px]
                        text-[#414042]">
                ${escapeHTML(technology)}
            </div>
        `)
        .join("");

    const salaryText = formatSalary(
        job.minSalary,
        job.maxSalary
    );

    // Không tạo thao tác sửa/xóa khi ID không hợp lệ
    const actionButtons = jobId
        ? `
            <div class="flex justify-center gap-[12px]">
                <a
                    data-id="${jobId}"
                    class="btn-edit bg-[#FFB200] rounded-[4px]
                           py-[8px] px-[20px] font-[400]
                           text-[14px] text-black"
                    href="update-jobs.html?id=${encodeURIComponent(jobId)}"
                >
                    Sửa
                </a>

                <a
                    data-id="${jobId}"
                    class="btn-delete bg-[#FF0000] rounded-[4px]
                           py-[8px] px-[20px] font-[400]
                           text-[14px] text-white"
                    href="#"
                >
                    Xóa
                </a>
            </div>
        `
        : "";

    return `
        <div class="card-item p-[20px]">
            <img
                src="assets/images/bg-card.png"
                class="inner-bg"
                alt=""
            />

            <div class="font-[700] text-[18px] text-[#121212]
                        text-center line-clamp-[2]">
                ${escapeHTML(job.title || "Chưa có tiêu đề")}
            </div>

            <div class="font-[600] text-[16px] text-[#0088FF]
                        text-center mt-[12px]">
                ${escapeHTML(salaryText)}
            </div>

            <div class="font-[400] text-[14px] text-[#121212]
                        text-center mt-[6px]">
                ${escapeHTML(job.level || "Chưa cập nhật")}
            </div>

            <div class="font-[400] text-[14px] text-[#121212]
                        text-center mt-[6px]">
                ${escapeHTML(job.workType || "Chưa cập nhật")}
            </div>

            <div class="mt-[12px] mb-[19px] flex justify-center
                        items-center flex-wrap gap-[8px]">
                ${techTags}
            </div>

            ${actionButtons}
        </div>
    `;
}

// ==================================================
// 3. HIỂN THỊ DANH SÁCH JOB
// ==================================================

function renderJobs(jobs) {
    if (!jobCardsContainer) {
        console.error("Không tìm thấy phần tử #job-cards.");
        return;
    }

    if (!Array.isArray(jobs)) {
        showMessage("Dữ liệu công việc không hợp lệ.", true);
        return;
    }

    if (jobs.length === 0) {
        showMessage("Chưa có tin tuyển dụng nào.");
        return;
    }

    jobCardsContainer.innerHTML = jobs
        .map(createJobCard)
        .join("");
}

// ==================================================
// 4. XÓA JOB
// ==================================================

if (jobCardsContainer) {
    jobCardsContainer.addEventListener("click", async function (event) {
        const deleteButton = event.target.closest(".btn-delete");

        if (!deleteButton) {
            return;
        }

        // Chặn thẻ <a href="#"> nhảy lên đầu trang
        event.preventDefault();

        const jobId = getSafeJobId(deleteButton.dataset.id);

        if (!jobId) {
            alert("Không xác định được mã công việc hợp lệ.");
            return;
        }

        const confirmed = window.confirm(
            "Bạn có chắc muốn xóa tin tuyển dụng này?"
        );

        if (!confirmed) {
            return;
        }

        // Không cho người dùng xóa liên tục trong lúc chờ API
        if (deleteButton.dataset.loading === "true") {
            return;
        }

        deleteButton.dataset.loading = "true";
        deleteButton.textContent = "Đang xóa...";
        deleteButton.style.pointerEvents = "none";

        try {
            const response = await fetch(
                `${API_BASE_URL}/job/${encodeURIComponent(jobId)}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const message = await getApiErrorMessage(response);
                throw new Error(message);
            }

            // Chỉ xóa thẻ trên giao diện khi backend đã xóa thành công
            const jobCard = deleteButton.closest(".card-item");

            if (jobCard) {
                jobCard.remove();
            }

            // Nếu xóa hết Job thì hiển thị trạng thái danh sách trống
            if (!jobCardsContainer.querySelector(".card-item")) {
                showMessage("Chưa có tin tuyển dụng nào.");
            }

        } catch (error) {
            console.error("Lỗi xóa công việc:", error);

            alert(
                error.message || "Không thể xóa công việc. Vui lòng thử lại."
            );

        } finally {
            deleteButton.dataset.loading = "false";
            deleteButton.textContent = "Xóa";
            deleteButton.style.pointerEvents = "";
        }
    });
}

// ==================================================
// 5. TẢI DANH SÁCH JOB
// ==================================================

async function loadJobData() {
    if (!jobCardsContainer) {
        console.error("Không tìm thấy phần tử #job-cards.");
        return;
    }

    if (!token) {
        return;
    }

    showMessage("Đang tải danh sách công việc...");

    try {
        const response = await fetch(
            `${API_BASE_URL}/job/me`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }

        const jobs = await response.json();

        if (!Array.isArray(jobs)) {
            throw new Error(
                "API không trả về danh sách công việc hợp lệ."
            );
        }

        renderJobs(jobs);

    } catch (error) {
        console.error("Lỗi tải danh sách công việc:", error);

        showMessage(
            error.message || "Không thể tải danh sách công việc. Vui lòng thử lại.",
            true
        );
    }
}

// ==================================================
// 6. KHỞI CHẠY
// ==================================================

loadJobData();
