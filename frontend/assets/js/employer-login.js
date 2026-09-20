const form = document.getElementById("employer-login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        window.location.href = "index.html";
    } else {
        errorMessage.textContent = data.message || "Đăng nhập thất bại, vui lòng thử lại";
        errorMessage.classList.remove("hidden");
    }
});
