const API_ORIGIN = "";

const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "employer-login.html";
}

const companyNameInput = document.getElementById("companyName");
const logoPreview = document.getElementById("logoPreview");
const logoFileInput = document.getElementById("logoFile");
const cityInput = document.getElementById("city");
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const companyModelInput = document.getElementById("companyModel");
const companySizeInput = document.getElementById("companySize");
const workingTimeInput = document.getElementById("workingTime");
const overtimePolicyInput = document.getElementById("overtimePolicy");
const phoneInput = document.getElementById("phone");
const descriptionInput = document.getElementById("description");

// Đường dẫn tương đối (vd /uploads/logo/abc.png), đây là thứ lưu vào DB
let logoPath = "";

// Ghép thêm địa chỉ backend để trình duyệt hiển thị được ảnh
function toFullUrl(url) {
    return url && url.startsWith("/uploads/") ? API_ORIGIN + url : url;
}

async function loadCompanyData() {
    const response = await fetch(`${API_ORIGIN}/api/company/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    if (!response.ok) {
        const message = await getApiErrorMessage(response);
        alert(message);
        return;
    }
    const companyData = await response.json();

    companyNameInput.value = companyData.companyName;
    cityInput.value = companyData.city;
    logoPath = companyData.logoUrl || "";
    logoPreview.src = toFullUrl(logoPath);
    addressInput.value = companyData.address;
    emailInput.value = companyData.email;
    companyModelInput.value = companyData.companyModel;
    companySizeInput.value = companyData.companySize;
    workingTimeInput.value = companyData.workingTime;
    overtimePolicyInput.value = companyData.overtimePolicy;
    phoneInput.value = companyData.phone;
    descriptionInput.value = companyData.description;
}
loadCompanyData();

// MỚI: khi chọn logo thì upload ngay
logoFileInput.addEventListener("change", async function () {
    const file = logoFileInput.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
        alert("Ảnh tối đa 2 MB");
        logoFileInput.value = "";
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "logo");

    const response = await fetch(`${API_ORIGIN}/api/upload/image`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }, // không tự set Content-Type
        body: formData
    });

    if (!response.ok) {
        const message = await getApiErrorMessage(response);
        alert(message);
        return;
    }

    const data = await response.json();
    logoPath = data.url;
    logoPreview.src = toFullUrl(logoPath);
});

const form = document.getElementById("company-profile-form");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const response = await fetch(`${API_ORIGIN}/api/company/me`, {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            companyName: companyNameInput.value,
            logoUrl: logoPath,   // đổi từ logoPreview.src
            city: cityInput.value,
            address: addressInput.value,
            companyModel: companyModelInput.value,
            companySize: companySizeInput.value,
            workingTime: workingTimeInput.value,
            overtimePolicy: overtimePolicyInput.value,
            phone: phoneInput.value,
            description: descriptionInput.value
        })
    });

    if (response.ok) {
        alert("Thông tin công ty đã được cập nhật thành công.");
    } else {
        const message = await getApiErrorMessage(response);
        alert(message);
    }
});