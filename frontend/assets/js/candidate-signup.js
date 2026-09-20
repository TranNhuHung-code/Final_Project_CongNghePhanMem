const form = document.getElementById("candidate-signup-form");
const fullNameInput = document.getElementById("fullName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = fullNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch("http://localhost:8080/api/auth/register/candidate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullName: fullName, email: email, password: password })
    });

    const data = await response.json();

    if (response.ok) {
        // Đăng ký xong, chuyển sang trang login để người dùng tự đăng nhập
        window.location.href = "candidate-login.html";
    } else {
        errorMessage.textContent = data.message || "Đăng ký thất bại, vui lòng thử lại";
        errorMessage.classList.remove("hidden");
    }
});
