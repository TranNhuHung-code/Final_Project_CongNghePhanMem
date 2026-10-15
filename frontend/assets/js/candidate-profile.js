const API_ORIGIN = "http://localhost:8080";
const API_BASE_URL = `${API_ORIGIN}/api`;

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "candidate-login.html";
}

const fullNameInput = document.getElementById("fullName");
const avatarPreview = document.getElementById("avatarPreview");
const avatarFileInput = document.getElementById("avatarFile");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const form = document.getElementById("candidateProfileForm");

const submitButton = form?.querySelector(
    'button[type="submit"], button:not([type])'
);

// URL avatar được backend trả về, dùng để lưu trong database.
// Không lưu URL blob dùng cho preview vào database.
let avatarPath = "";

// Trạng thái upload và preview
let avatarChosenByUser = false;
let avatarUploadInProgress = false;
let avatarUploadFailed = false;
let localPreviewUrl = null;
let uploadSequence = 0;

// ==================================================
// 1. XỬ LÝ URL VÀ ẢNH PREVIEW
// ==================================================

function toFullUrl(url) {
    if (typeof url !== "string") {
        return "";
    }

    const value = url.trim();

    if (
        !value ||
        ["null", "undefined"].includes(value.toLowerCase())
    ) {
        return "";
    }

    // URL đầy đủ hoặc URL blob dùng để preview
    if (
        value.startsWith("http://") ||
        value.startsWith("https://") ||
        value.startsWith("blob:")
    ) {
        return value;
    }

    // URL ảnh được backend lưu dưới dạng /uploads/...
    if (value.startsWith("/uploads/")) {
        return `${API_ORIGIN}${value}`;
    }

    return value;
}

function setAvatarPreview(url) {
    if (!avatarPreview) {
        console.error("Không tìm thấy phần tử avatarPreview.");
        return;
    }

    const fullUrl = toFullUrl(url);

    if (!fullUrl) {
        avatarPreview.removeAttribute("src");
        avatarPreview.classList.add("hidden");
        return;
    }

    avatarPreview.classList.remove("hidden");
    avatarPreview.src = fullUrl;
}

function revokeLocalPreview() {
    if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
        localPreviewUrl = null;
    }
}

// ==================================================
// 2. TẢI THÔNG TIN ỨNG VIÊN
// ==================================================

async function loadCandidateData() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/candidate/me`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP ${response.status}: ${await response.text()}`
            );
        }

        const candidateData = await response.json();

        fullNameInput.value = candidateData.fullName ?? "";
        emailInput.value = candidateData.email ?? "";
        phoneInput.value = candidateData.phone ?? "";

        // Không để response tải hồ sơ ghi đè avatar mới người dùng vừa chọn.
        if (!avatarChosenByUser) {
            avatarPath = candidateData.avatarUrl ?? "";
            setAvatarPreview(avatarPath);
        }
    } catch (error) {
        console.error("Lỗi tải hồ sơ ứng viên:", error);

        alert(
            "Không thể tải thông tin ứng viên. " + error.message
        );
    }
}

// ==================================================
// 3. CHỌN VÀ UPLOAD AVATAR
// ==================================================

if (avatarFileInput) {
    avatarFileInput.addEventListener(
        "change",
        async function () {
            const file = avatarFileInput.files?.[0];

            if (!file) {
                return;
            }

            // Kiểm tra dung lượng
            const MAX_FILE_SIZE = 15 * 1024 * 1024;

            if (file.size > MAX_FILE_SIZE) {
                alert("Ảnh tối đa 15 MB.");
                avatarFileInput.value = "";
                return;
            }

            // Kiểm tra định dạng
            const extension = file.name
                .split(".")
                .pop()
                .toLowerCase();

            const allowedExtensions = [
                "png",
                "jpg",
                "jpeg",
                "webp"
            ];

            const allowedMimeTypes = [
                "image/png",
                "image/jpeg",
                "image/webp"
            ];

            if (
                !allowedExtensions.includes(extension) ||
                (
                    file.type &&
                    !allowedMimeTypes.includes(file.type)
                )
            ) {
                alert("Vui lòng chọn ảnh PNG, JPG hoặc WEBP.");
                avatarFileInput.value = "";
                return;
            }

            // Đánh dấu người dùng đã chọn avatar mới
            avatarChosenByUser = true;
            avatarUploadFailed = false;
            avatarUploadInProgress = true;

            // Mỗi lần chọn ảnh tạo một mã request mới,
            // tránh response cũ ghi đè ảnh vừa chọn sau đó.
            const currentSequence = ++uploadSequence;

            // Hiển thị preview ngay lập tức
            revokeLocalPreview();

            localPreviewUrl = URL.createObjectURL(file);
            setAvatarPreview(localPreviewUrl);

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Đang tải ảnh...";
            }

            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", "avatar");

            try {
                const response = await fetch(
                    `${API_BASE_URL}/upload/image`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        body: formData
                    }
                );

                if (!response.ok) {
                    const errorBody = await response.text();

                    throw new Error(
                        `HTTP ${response.status}: ${
                            errorBody || response.statusText
                        }`
                    );
                }

                // QUAN TRỌNG: đọc JSON trước khi dùng data.url
                const data = await response.json();

                if (!data.url) {
                    throw new Error(
                        "API upload không trả về trường url."
                    );
                }

                // Bỏ qua response của lần chọn ảnh cũ
                if (currentSequence !== uploadSequence) {
                    return;
                }

                // Lưu URL thực tế từ backend
                avatarPath = data.url;

                // Chuyển từ preview blob sang URL backend
                setAvatarPreview(avatarPath);

                revokeLocalPreview();

                avatarUploadFailed = false;

                console.log("Upload avatar thành công:", avatarPath);
            } catch (error) {
                if (currentSequence !== uploadSequence) {
                    return;
                }

                avatarUploadFailed = true;

                console.error("Lỗi upload avatar:", error);

                alert(
                    "Không thể upload avatar. " + error.message
                );
            } finally {
                // Không để request cũ thay đổi trạng thái của request mới
                if (currentSequence === uploadSequence) {
                    avatarUploadInProgress = false;

                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = "Cập nhật";
                    }
                }
            }
        }
    );
}

// ==================================================
// 4. CẬP NHẬT HỒ SƠ ỨNG VIÊN
// ==================================================

if (form) {
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (avatarUploadInProgress) {
            alert("Vui lòng đợi ảnh upload hoàn tất.");
            return;
        }

        if (avatarUploadFailed && avatarChosenByUser) {
            alert("Ảnh chưa upload thành công. Vui lòng chọn lại ảnh.");
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Đang cập nhật...";
        }

        try {
            const response = await fetch(
                `${API_BASE_URL}/candidate/me`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        fullName: fullNameInput.value.trim(),
                        avatarUrl: avatarPath,
                        phone: phoneInput.value.trim()
                    })
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();

                throw new Error(
                    `HTTP ${response.status}: ${
                        errorBody || response.statusText
                    }`
                );
            }

            alert("Thông tin ứng viên đã được cập nhật thành công.");

            // Giữ URL backend, không cần reload ngay để preview không nhấp nháy.
            avatarChosenByUser = false;
        } catch (error) {
            console.error("Lỗi cập nhật hồ sơ:", error);

            alert(
                "Không thể cập nhật thông tin ứng viên. " +
                error.message
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Cập nhật";
            }
        }
    });
}

// ==================================================
// 5. KHỞI CHẠY
// ==================================================

loadCandidateData();