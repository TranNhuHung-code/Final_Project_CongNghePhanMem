const form = document.getElementById("employer-signup-form");
const companyNameInput = document.getElementById("companyName");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const companyName = companyNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch("http://localhost:8080/api/auth/register/employer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ companyName: companyName, email: email, password: password })
    });

    const data = await response.json();

    if (response.ok) {
        window.location.href = "employer-login.html";
    } else {
        errorMessage.textContent = data.message || "Đăng ký thất bại, vui lòng thử lại";
        errorMessage.classList.remove("hidden");
    }
});
