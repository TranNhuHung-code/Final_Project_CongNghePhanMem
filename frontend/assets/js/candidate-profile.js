const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "candidate-login.html"; 
}

const fullNameInput = document.getElementById("fullName");
const avatarPreview = document.getElementById("avatarPreview");
const avatarFileInput = document.getElementById("avatarFile");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

async function loadCandidateData() {
    const response = await fetch("http://localhost:8080/api/candidate/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const candidateData = await response.json();
    if (response.ok) {
        fullNameInput.value = candidateData.fullName;
        avatarPreview.src = candidateData.avatarUrl;
        emailInput.value = candidateData.email;
        phoneInput.value = candidateData.phone;
    } else{
        alert("Không thể tải dữ liệu ứng viên. Vui lòng thử lại sau.");
    }
}
loadCandidateData();


const form = document.getElementById("candidateProfileForm");
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const response = await fetch("http://localhost:8080/api/candidate/me", {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fullName: fullNameInput.value,
            avatarUrl: avatarPreview.src,
            phone: phoneInput.value
        })
    });
    if (response.ok) {
        alert("Thông tin ứng viên đã được cập nhật thành công.");
    } else {
        alert("Không thể cập nhật thông tin ứng viên. Vui lòng thử lại sau.");
    }
});