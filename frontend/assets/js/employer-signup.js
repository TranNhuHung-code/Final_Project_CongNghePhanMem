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

    const response = await fetch("/api/auth/register/employer", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ companyName: companyName, email: email, password: password })
    });

    if (response.ok) {
        alert("Đăng ký thành công! Vui lòng đăng nhập.");
        window.location.href = "employer-login.html";
    } else {
        const message = await getApiErrorMessage(response);

        errorMessage.textContent = message;
        errorMessage.classList.remove("hidden");
    }
});
