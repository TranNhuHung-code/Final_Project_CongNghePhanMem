const form = document.getElementById("employer-login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch("/api/auth/login/employer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: email, password: password })
    });

    if (response.ok) {
        const data = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        alert("Đăng nhập thành công!");
        window.location.href = "index.html";
    } else {
        const message = await getApiErrorMessage(response);

        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }
});
