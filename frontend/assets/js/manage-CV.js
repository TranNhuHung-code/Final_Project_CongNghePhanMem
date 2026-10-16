const API_BASE_URL = "http://localhost:8080/api";

// ==================================================
// 1. LẤY CÁC PHẦN TỬ HTML
// ==================================================

const applicationsContainer = document.getElementById(
    "applications-container"
);

// ==================================================
// 2. CÁC HÀM DÙNG CHUNG
// ==================================================

// Hiển thị thông báo trên trang
function showMessage(message, isError = false) {
    if (!applicationsContainer) return;

    const paragraph = document.createElement("p");

    paragraph.id = "applications-message";
    paragraph.className = isError
        ? "col-span-full text-center text-red-500"
        : "col-span-full text-center text-[#666]";

    paragraph.textContent = message;

    applicationsContainer.replaceChildren(paragraph);
}

// Tạo phần tử HTML chứa văn bản
function createTextElement(tag, className, text) {
    const element = document.createElement(tag);

    element.className = className;
    element.textContent =
        text !== null && text !== undefined && text !== ""
            ? text
            : "Chưa cập nhật";

    return element;
}

// Định dạng mức lương
function formatSalary(value) {
    const salary = Number(value);

    if (!Number.isFinite(salary)) {
        return "Thỏa thuận";
    }

    return salary.toLocaleString("en-US") + "$";
}

// Hiển thị trạng thái đơn ứng tuyển
function getStatusText(status) {
    switch (status) {
        case "PENDING":
            return "Chưa duyệt";

        case "APPROVED":
            return "Đã duyệt";

        case "REJECTED":
            return "Đã từ chối";

        default:
            return "Chưa xác định";
    }
}

// Tạo nút và gắn sự kiện click
function createActionButton(text, className, onClick) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = text;
    button.className = className;

    button.addEventListener("click", onClick);

    return button;
}

// ==================================================
// 3. HÀM GỬI REQUEST ĐẾN API NHÀ TUYỂN DỤNG
// ==================================================

async function sendEmployerApplicationRequest(
    applicationId,
    endpoint,
    method,
    body
) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Bạn chưa đăng nhập. Vui lòng đăng nhập lại.");
    }

    const headers = {
        "Authorization": `Bearer ${token}`
    };

    const options = {
        method: method,
        headers: headers
    };

    // Chỉ gửi JSON body khi API cần dữ liệu
    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const url =
        `${API_BASE_URL}/application/employer/${applicationId}${endpoint}`;

    const response = await fetch(url, options);

    if (!response.ok) {
        const message = await getApiErrorMessage(response);
        throw new Error(message);
    }

    // Các API cập nhật và xóa hiện không cần đọc response body
}

// ==================================================
// 4. NÚT XEM: ĐÁNH DẤU ĐÃ XEM VÀ MỞ CV
// ==================================================

async function markApplicationViewed(application) {
    // Mở CV ngay trong thao tác click nếu có URL
    if (application.cvFileUrl) {
        const cvUrl = new URL(application.cvFileUrl, "http://localhost:8080").href;
        window.open(cvUrl, "_blank", "noopener,noreferrer");
    }

    try {
        await sendEmployerApplicationRequest(
            application.id,
            "/viewed",
            "PATCH"
        );

        // Tải lại danh sách để cập nhật trạng thái
        await loadApplications();

        if (!application.cvFileUrl) {
            alert(
                "Đơn đã được đánh dấu đã xem, nhưng chưa có URL CV."
            );
        }
    } catch (error) {
        console.error("Lỗi đánh dấu đơn đã xem:", error);

        alert(
            "Không thể đánh dấu đơn đã xem: " + error.message
        );
    }
}

// ==================================================
// 5. NÚT DUYỆT VÀ TỪ CHỐI
// ==================================================

async function changeApplicationStatus(applicationId, status) {
    const action =
        status === "APPROVED" ? "duyệt" : "từ chối";

    const confirmed = window.confirm(
        `Bạn có chắc chắn muốn ${action} đơn ứng tuyển này?`
    );

    if (!confirmed) {
        return;
    }

    try {
        await sendEmployerApplicationRequest(
            applicationId,
            "/status",
            "PATCH",
            {
                status: status
            }
        );

        alert(
            status === "APPROVED"
                ? "Đã duyệt đơn ứng tuyển."
                : "Đã từ chối đơn ứng tuyển."
        );

        // Tải lại để hiển thị trạng thái mới
        await loadApplications();
    } catch (error) {
        console.error("Lỗi cập nhật trạng thái:", error);

        alert(
            "Không thể cập nhật trạng thái: " + error.message
        );
    }
}

// ==================================================
// 6. NÚT XÓA ĐƠN ỨNG TUYỂN
// ==================================================

async function deleteApplicationCard(applicationId) {
    const confirmed = window.confirm(
        "Bạn có chắc chắn muốn xóa đơn ứng tuyển này? Thao tác này không thể hoàn tác."
    );

    if (!confirmed) {
        return;
    }

    try {
        await sendEmployerApplicationRequest(
            applicationId,
            "",
            "DELETE"
        );

        alert("Đã xóa đơn ứng tuyển.");

        // Tải lại danh sách sau khi xóa
        await loadApplications();
    } catch (error) {
        console.error("Lỗi xóa đơn ứng tuyển:", error);

        alert(
            error.message || "Không thể xóa đơn ứng tuyển. Vui lòng thử lại."
        );
    }
}

// ==================================================
// 7. TẠO CÁC THẺ CV TỪ DỮ LIỆU BACKEND
// ==================================================

function renderApplications(applications) {
    const fragment = document.createDocumentFragment();

    applications.forEach(application => {
        // Khung thẻ CV
        const card = document.createElement("div");
        card.className = "card-item p-[20px]";

        // Ảnh nền
        const background = document.createElement("img");
        background.src = "assets/images/bg-card.png";
        background.className = "inner-bg";
        background.alt = "";

        // Tên công việc
        const jobTitle = createTextElement(
            "div",
            "font-[700] text-[18px] text-[#121212] text-center line-clamp-[2]",
            application.jobTitle || "Chưa có tên công việc"
        );

        // Tên ứng viên
        const candidate = createTextElement(
            "div",
            "mt-[12px] font-[400] text-[14px] text-center",
            `Ứng viên: ${application.candidateName || "Chưa cập nhật"}`
        );

        // Email
        const email = createTextElement(
            "div",
            "mt-[6px] font-[400] text-[14px] text-[#121212] text-center",
            `Email: ${application.candidateEmail || "Chưa cập nhật"}`
        );

        // Số điện thoại
        const phone = createTextElement(
            "div",
            "mt-[7px] font-[400] text-[14px] text-[#121212] text-center",
            `Điện thoại: ${application.candidatePhone || "Chưa cập nhật"}`
        );

        // Mức lương
        const salary = createTextElement(
            "div",
            "font-[600] text-[16px] text-[#0088FF] text-center mt-[12px]",
            `${formatSalary(application.minSalary)} - ${formatSalary(application.maxSalary)}`
        );

        // Cấp bậc
        const level = createTextElement(
            "div",
            "font-[400] text-[14px] text-[#121212] text-center mt-[6px]",
            `Cấp bậc: ${application.level || "Chưa cập nhật"}`
        );

        // Hình thức làm việc
        const workType = createTextElement(
            "div",
            "font-[400] text-[14px] text-[#121212] text-center mt-[6px]",
            `Hình thức: ${application.workType || "Chưa cập nhật"}`
        );

        // Trạng thái đã xem
        const viewed = createTextElement(
            "div",
            "font-[400] text-[14px] text-center mt-[7px]",
            application.viewed ? "Đã xem" : "Chưa xem"
        );

        viewed.classList.add(
            application.viewed
                ? "text-[#008000]"
                : "text-[#FF0000]"
        );

        // Trạng thái duyệt
        const status = createTextElement(
            "div",
            "font-[400] text-[14px] text-[#121212] text-center mt-[6px]",
            getStatusText(application.status)
        );

        // Khung chứa các nút
        const buttonContainer = document.createElement("div");

        buttonContainer.className =
            "flex flex-wrap justify-center gap-[8px] mt-[12px]";

        // Nút Xem
        const viewButton = createActionButton(
            "Xem",
            "bg-[#0088FF] rounded-[4px] py-[8px] px-[20px] cursor-pointer font-[400] text-[14px] text-white",
            () => markApplicationViewed(application)
        );

        // Nút Duyệt
        const approveButton = createActionButton(
            "Duyệt",
            "bg-[#9FDB7C] rounded-[4px] py-[8px] px-[20px] cursor-pointer font-[400] text-[14px] text-black",
            () => changeApplicationStatus(
                application.id,
                "APPROVED"
            )
        );

        // Nút Từ chối
        const rejectButton = createActionButton(
            "Từ chối",
            "bg-[#FF5100] rounded-[4px] py-[8px] px-[20px] cursor-pointer font-[400] text-[14px] text-white",
            () => changeApplicationStatus(
                application.id,
                "REJECTED"
            )
        );

        // Nút Xóa
        const deleteButton = createActionButton(
            "Xóa",
            "bg-[#FF0000] rounded-[4px] py-[8px] px-[20px] cursor-pointer font-[400] text-[14px] text-white",
            () => deleteApplicationCard(application.id)
        );

        // Ghép các nút vào khung
        buttonContainer.append(
            viewButton,
            approveButton,
            rejectButton,
            deleteButton
        );

        // Ghép nội dung và nút vào thẻ CV
        card.append(
            background,
            jobTitle,
            candidate,
            email,
            phone,
            salary,
            level,
            workType,
            viewed,
            status,
            buttonContainer
        );

        fragment.appendChild(card);
    });

    // Thay toàn bộ nội dung cũ bằng danh sách mới
    applicationsContainer.replaceChildren(fragment);
}

// ==================================================
// 8. TẢI DANH SÁCH ĐƠN ỨNG TUYỂN
// ==================================================

async function loadApplications() {
    if (!applicationsContainer) {
        console.error(
            "Không tìm thấy phần tử #applications-container trong HTML."
        );
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        showMessage("Bạn cần đăng nhập bằng tài khoản nhà tuyển dụng.");
        return;
    }

    showMessage("Đang tải danh sách CV...");

    try {
        const response = await fetch(
            `${API_BASE_URL}/application/employer/me`,
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }

        const applications = await response.json();

        console.log("Danh sách đơn ứng tuyển:", applications);

        if (!Array.isArray(applications)) {
            throw new Error("API không trả về một danh sách hợp lệ.");
        }

        if (applications.length === 0) {
            showMessage("Chưa có ứng viên nào ứng tuyển.");
            return;
        }

        renderApplications(applications);
    } catch (error) {
        console.error("Lỗi tải đơn ứng tuyển:", error);

        showMessage(
            error.message || "Không thể tải danh sách CV. Vui lòng thử lại.",
            true
        );
    }
}

// ==================================================
// 9. KHỞI CHẠY
// ==================================================

loadApplications();