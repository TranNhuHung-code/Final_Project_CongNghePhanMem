document.addEventListener("DOMContentLoaded", function () {
    // ==========================================
    // 1. LẤY CÁC PHẦN TỬ TRONG HEADER
    // ==========================================

    const loginLink = document.getElementById("login-link");
    const registerLink = document.getElementById("register-link");
    const authDivider = document.getElementById("auth-divider");
    const logoutButton = document.getElementById("logout-button");

    const modal = document.getElementById("auth-role-modal");
    const candidateButton = document.getElementById("auth-candidate");
    const employerButton = document.getElementById("auth-employer");
    const cancelButton = document.getElementById("auth-role-cancel");

    const candidateMenu = document.getElementById("candidate-menu");
    const employerMenu = document.getElementById("employer-menu");

    const mobileMenuButton = document.getElementById(
        "mobile-menu-button"
    );
    const mainNav = document.getElementById("main-nav");

    let authMode = "login";

    // ==========================================
    // 2. ĐỌC ROLE TỪ JWT
    // ==========================================

    function getCurrentRole() {
        const token = localStorage.getItem("token");

        if (!token) {
            return null;
        }

        try {
            const payloadPart = token.split(".")[1];

            if (!payloadPart) {
                throw new Error("JWT không hợp lệ.");
            }

            const base64 = payloadPart
                .replace(/-/g, "+")
                .replace(/_/g, "/");

            const paddedBase64 =
                base64 + "=".repeat((4 - base64.length % 4) % 4);

            const payload = JSON.parse(atob(paddedBase64));

            // Kiểm tra token hết hạn để cập nhật giao diện
            if (payload.exp && payload.exp * 1000 <= Date.now()) {
                localStorage.removeItem("token");
                return null;
            }

            if (
                payload.role !== "CANDIDATE" &&
                payload.role !== "EMPLOYER"
            ) {
                return null;
            }

            return payload.role;
        } catch (error) {
            console.error("Không đọc được JWT:", error);
            return null;
        }
    }

    // ==========================================
    // 3. CẬP NHẬT HEADER THEO ROLE
    // ==========================================

    function updateAuthHeader() {
        const role = getCurrentRole();
        const isLoggedIn = role !== null;

        if (loginLink) {
            loginLink.classList.toggle("hidden", isLoggedIn);
        }

        if (registerLink) {
            registerLink.classList.toggle("hidden", isLoggedIn);
        }

        if (authDivider) {
            authDivider.classList.toggle("hidden", isLoggedIn);
        }

        if (logoutButton) {
            logoutButton.classList.toggle("hidden", !isLoggedIn);
        }

        // Chỉ hiện Khu vực ứng viên khi role là CANDIDATE
        if (candidateMenu) {
            const showCandidateMenu = role === "CANDIDATE";

            candidateMenu.classList.toggle("hidden", !showCandidateMenu);
            candidateMenu.style.display = showCandidateMenu ? "" : "none";
        }

        // Chỉ hiện Kênh nhà tuyển dụng khi role là EMPLOYER
        if (employerMenu) {
            const showEmployerMenu = role === "EMPLOYER";

            employerMenu.classList.toggle("hidden", !showEmployerMenu);
            employerMenu.style.display = showEmployerMenu ? "" : "none";
        }
    }

    // ==========================================
    // 4. HỘP CHỌN LOẠI TÀI KHOẢN
    // ==========================================

    function openRoleModal(mode) {
        if (!modal) {
            console.error("Không tìm thấy auth-role-modal.");
            return;
        }

        authMode = mode;
        modal.classList.remove("hidden");
    }

    function closeRoleModal() {
        if (modal) {
            modal.classList.add("hidden");
        }
    }

    if (loginLink) {
        loginLink.addEventListener("click", function () {
            openRoleModal("login");
        });
    }

    if (registerLink) {
        registerLink.addEventListener("click", function () {
            openRoleModal("signup");
        });
    }

    function navigateToAuthPage(role) {
        const pages = {
            login: {
                candidate: "candidate-login.html",
                employer: "employer-login.html"
            },
            signup: {
                candidate: "candidate-signup.html",
                employer: "employer-signup.html"
            }
        };

        const destination = pages[authMode]?.[role];

        if (!destination) {
            console.error("Không tìm thấy trang xác thực phù hợp.");
            return;
        }

        window.location.href = destination;
    }

    if (candidateButton) {
        candidateButton.addEventListener("click", function () {
            navigateToAuthPage("candidate");
        });
    }

    if (employerButton) {
        employerButton.addEventListener("click", function () {
            navigateToAuthPage("employer");
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", closeRoleModal);
    }

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (event.target === modal) {
                closeRoleModal();
            }
        });
    }

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeRoleModal();
        }
    });

    // ==========================================
    // 5. ĐĂNG XUẤT
    // ==========================================

    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.href = "index.html";
        });
    }

    // ==========================================
    // 6. MENU MOBILE
    // ==========================================

    function closeMobileMenu() {
        if (!mainNav || !mobileMenuButton) {
            return;
        }

        mainNav.classList.add("hidden");

        mobileMenuButton.setAttribute("aria-expanded", "false");
        mobileMenuButton.setAttribute("aria-label", "Mở menu");

        const icon = mobileMenuButton.querySelector("i");

        if (icon) {
            icon.classList.add("fa-bars");
            icon.classList.remove("fa-xmark");
        }
    }

    if (mobileMenuButton && mainNav) {
        mobileMenuButton.addEventListener("click", function () {
            const isOpen = mainNav.classList.toggle("hidden");

            mobileMenuButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );

            mobileMenuButton.setAttribute(
                "aria-label",
                isOpen ? "Mở menu" : "Đóng menu"
            );

            const icon = mobileMenuButton.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-bars", isOpen);
                icon.classList.toggle("fa-xmark", !isOpen);
            }
        });

        mainNav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function (event) {
            const parentLi = link.parentElement;
            const submenu = Array.from(parentLi.children).find(
                child => child.tagName === "UL"
            );

            // Đây là tiêu đề menu có submenu, không phải đường dẫn trang
            if (link.getAttribute("href") === "#" && submenu) {
                event.preventDefault();

                if (window.innerWidth < 992) {
                    const isOpen = submenu.style.display === "block";
                    submenu.style.display = isOpen ? "none" : "block";
                }

                return;
            }

            // Chỉ đóng navbar mobile khi bấm vào liên kết trang thật
            if (window.innerWidth < 992) {
                closeMobileMenu();
            }
        });
    });

        // Khi chuyển từ mobile lên desktop rồi quay lại mobile
        window.addEventListener("resize", function () {
            if (window.innerWidth >= 992) {
                closeMobileMenu();
            }
        });
    }

    // ==========================================
    // 7. KHỞI TẠO
    // ==========================================

    updateAuthHeader();
});