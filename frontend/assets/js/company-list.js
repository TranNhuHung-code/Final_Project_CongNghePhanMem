const companyListContainer = document.getElementById("company-list");
const companySearchForm = document.getElementById("company-search-form");
const companySearchKeyword = document.getElementById("company-search-keyword");
const companySearchCity = document.getElementById("company-search-city");
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[char];
    });
}
function renderCompanies(companies) {
    companyListContainer.replaceChildren();

    if (companies.length === 0) {
        companyListContainer.textContent = "Chưa có công ty nào.";
        return;
    }

    companies.forEach(company => {
        if (!Number.isSafeInteger(company.id) || company.id <= 0) {
            return;
        }

        const card = document.createElement("div");
        card.className = "card-item";

        const logoPath = company.logoUrl || "";

        const logoUrl = /^\/uploads\/logo\/[a-zA-Z0-9._-]+$/.test(logoPath)
            ? `http://localhost:8080${logoPath}`
            : "assets/images/demo/image1.png";

        card.innerHTML = `
            <img src="assets/images/bg-card.png" class="inner-bg">

            <a href="company-details.html?companyId=${company.id}" class="inner-box">
                <div class="sm:pt-[32px] pt-[20px] sm:pb-[24px] pb-[16px] sm:px-[16px] px-[8px]">
                    <div class="inner-img sm:w-[160px] w-[125px]">
                        <img src="${logoUrl}" alt="Logo công ty">
                    </div>

                    <h3 class="font-[700] sm:text-[18px] text-[14px] text-[#121212] text-center line-clamp-[2]">
                        ${escapeHTML(company.companyName)}
                    </h3>
                </div>

                <div class="bg-[#F7F7F7] py-[12px] sm:px-[16px] px-[6px] flex items-center justify-between sm:flex-row flex-col gap-[12px]">
                    <div class="font-[400] sm:text-[14px] text-[12px] text-[#414042]">
                        ${escapeHTML(company.city || "Chưa cập nhật")}
                    </div>

                    <div class="font-[400] sm:text-[14px] text-[12px] text-[#121212]">
                        <i class="fa-solid fa-user-tie text-[16px] mr-[6px] text-[#000096]"></i>
                        ${Number(company.jobCount) || 0} Việc làm
                    </div>
                </div>
            </a>
        `;

        companyListContainer.appendChild(card);
    });
}

async function loadCompanies() {
    const params = new URLSearchParams();

    const keyword = companySearchKeyword.value.trim();
    const city = companySearchCity.value;

    if (keyword) params.set("keyword", keyword);
    if (city) params.set("city", city);
    try {
        const response = await fetch(
            `http://localhost:8080/api/company/public?${params.toString()}`
        );

        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }

        const companies = await response.json();

        console.log("Danh sách công ty:", companies);

        renderCompanies(companies);

    } catch (error) {
        console.error("Lỗi tải danh sách công ty:", error);
        companyListContainer.textContent =
            error.message || "Không thể tải danh sách công ty.";
    }
}
companySearchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    loadCompanies();
});
loadCompanies();