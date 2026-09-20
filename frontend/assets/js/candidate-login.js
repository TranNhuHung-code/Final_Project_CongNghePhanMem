// 1. Lấy các phần tử HTML ra để JS có thể thao tác
const form = document.getElementById("candidate-login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

// 2. Lắng nghe sự kiện submit của form (xảy ra khi bấm nút "Đăng nhập")
form.addEventListener("submit", async function (event) {
    event.preventDefault(); // Chặn hành vi mặc định (tải lại trang)

    // 3. Lấy giá trị người dùng đã nhập
    const email = emailInput.value;
    const password = passwordInput.value;

    // 4. Gọi API backend
    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    });

    // 5. Đọc phần thân (body) của response, chuyển từ JSON string thành object JS
    const data = await response.json();

    // 6. Kiểm tra request có thành công không
    if (response.ok) {
        // response.ok là true khi status nằm trong khoảng 200-299
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        window.location.href = "index.html"; // Chuyển hướng sau khi đăng nhập thành công
    } else {
        // Thất bại (401, 409, 500...) -> hiện thông báo lỗi cho người dùng thấy
        errorMessage.textContent = data.message || "Đăng nhập thất bại, vui lòng thử lại";
        errorMessage.classList.remove("hidden");
    }
});
