const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "employer-login.html"; // trang login nào?
}

const companyNameInput = document.getElementById("companyName");
const logoPreview = document.getElementById("logoPreview");
const cityInput = document.getElementById("city");
const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const companyModelInput = document.getElementById("companyModel");
const companySizeInput = document.getElementById("companySize");
const workingTimeInput = document.getElementById("workingTime");
const overtimePolicyInput = document.getElementById("overtimePolicy");
const phoneInput = document.getElementById("phone");
const descriptionInput = document.getElementById("description");

async function loadCompanyData(){
    const response = await fetch("http://localhost:8080/api/company/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });
    const companyData = await response.json();

    if(response.ok){
    companyNameInput.value = companyData.companyName;
    cityInput.value = companyData.city;
    logoPreview.src = companyData.logoUrl;
    addressInput.value = companyData.address;
    emailInput.value = companyData.email;
    companyModelInput.value = companyData.companyModel;
    companySizeInput.value = companyData.companySize;
    workingTimeInput.value = companyData.workingTime;
    overtimePolicyInput.value = companyData.overtimePolicy;
    phoneInput.value = companyData.phone;
    descriptionInput.value = companyData.description;
    } else{
        alert("Khong thể tải dữ liệu công ty. Vui lòng thử lại sau.");
    }

}
    loadCompanyData();

    const form = document.getElementById("company-profile-form");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const response = await fetch("http://localhost:8080/api/company/me", {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                companyName: companyNameInput.value,
                logoUrl: logoPreview.src,
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
            alert("Cập nhật thành công");
        } else {
            alert("Cập nhật thất bại");
        }
    });