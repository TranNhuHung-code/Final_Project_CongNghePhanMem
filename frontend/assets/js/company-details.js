const params = new URLSearchParams(window.location.search);
const companyId = params.get("companyId");

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

function renderCompanyJobs(jobs) {
    const container = document.getElementById("company-job-list");
    container.replaceChildren();

    if (jobs.length === 0) {
        container.textContent = "Công ty hiện chưa có việc làm nào.";
        return;
    }

    jobs.forEach(job => {
        if (!Number.isSafeInteger(job.id) || job.id <= 0) {
            return;
        }

        const card = document.createElement("div");
        card.className = "card-item";

        const logoPath = job.companyLogoUrl || "";

        const logoUrl = /^\/uploads\/logo\/[a-zA-Z0-9._-]+$/.test(logoPath)
            ? `${logoPath}`
            : "assets/images/demo/image1.png";

        const technologiesHTML = (job.technologies || "")
            .split(",")
            .filter(tech => tech.trim())
            .map(tech => `
                <div class="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]">
                    ${escapeHTML(tech.trim())}
                </div>
            `).join("");

        card.innerHTML = `
            <img src="assets/images/bg-card.png" class="inner-bg">

            <a href="job-details.html?jobId=${job.id}" class="inner-box">
                <div class="py-[20px] px-[16px]">
                    <div class="inner-img w-[116px]">
                        <img src="${logoUrl}" alt="Logo công ty">
                    </div>

                    <h3 class="font-[700] text-[18px] text-[#121212] text-center line-clamp-[2] mb-[6px]">
                        ${escapeHTML(job.title)}
                    </h3>

                    <div class="font-[400] text-[14px] text-[#121212] text-center mb-[12px]">
                        ${escapeHTML(job.companyName)}
                    </div>

                    <div class="font-[600] text-[16px] text-[#0088FF] text-center mb-[6px]">
                        ${Number(job.minSalary).toLocaleString("vi-VN")} - ${Number(job.maxSalary).toLocaleString("vi-VN")}
                    </div>

                    <div class="font-[400] text-[14px] text-[#121212] text-center">
                        <i class="fa-solid fa-user-tie text-[16px] mr-[8px]"></i>
                        ${escapeHTML(job.level)}
                    </div>

                    <div class="font-[400] text-[14px] text-[#121212] text-center mt-[6px]">
                        <i class="fa-solid fa-briefcase text-[16px] mr-[8px]"></i>
                        ${escapeHTML(job.workType)}
                    </div>

                    <div class="font-[400] text-[14px] text-[#121212] text-center mt-[6px]">
                        <i class="fa-solid fa-location-dot text-[16px] mr-[8px]"></i>
                        ${escapeHTML(job.city)}
                    </div>

                    <div class="mt-[12px] flex justify-center items-center flex-wrap gap-[12px]">
                        ${technologiesHTML}
                    </div>
                </div>
            </a>
        `;

        container.appendChild(card);
    });
}


async function loadCompanyDetails() {
    if (!companyId || !/^[1-9]\d*$/.test(companyId)) {
        document.getElementById("company-name").textContent =
            "ID công ty không hợp lệ.";
        return;
    }

    try {
        const response = await fetch(
            `/api/company/public/${companyId}`
        );

        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }

        const company = await response.json();
        const logoPath = company.logoUrl || "";

        const logoUrl = /^\/uploads\/logo\/[a-zA-Z0-9._-]+$/.test(logoPath)
            ? `${logoPath}`
            : "assets/images/demo/image1.png";

        document.getElementById("company-logo").src = logoUrl;

        console.log("Thông tin công ty:", company);

        document.getElementById("company-name").textContent =
            company.companyName || "Chưa cập nhật";

        document.getElementById("company-address").textContent =
            company.address || "Chưa cập nhật";

        document.getElementById("company-model").textContent =
            company.companyModel || "Chưa cập nhật";

        document.getElementById("company-size").textContent =
            company.companySize || "Chưa cập nhật";

        document.getElementById("company-working-time").textContent =
            company.workingTime || "Chưa cập nhật";

        document.getElementById("company-overtime-policy").textContent =
            company.overtimePolicy || "Chưa cập nhật";

        document.getElementById("company-description").textContent =
            company.description || "Chưa có mô tả công ty.";

        document.getElementById("company-job-count").textContent =
            `Công ty có ${company.jobCount ?? 0} việc làm`;

    } catch (error) {
        document.getElementById("company-name").textContent =
        getFetchErrorMessage(error);
    }
}
async function loadCompanyJobs() {
    const jobListContainer = document.getElementById("company-job-list");

    if (!companyId || !/^[1-9]\d*$/.test(companyId)) {
        return;
    }

    try {
        const query = new URLSearchParams({ companyId });

        const response = await fetch(
            `/api/job/public?${query.toString()}`
        );

        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }

        const jobs = await response.json();

        console.log("Job của công ty:", jobs);

        document.getElementById("company-job-count").textContent =
            `Công ty có ${jobs.length} việc làm`;

        renderCompanyJobs(jobs);

    } catch (error) {
        console.error("Lỗi tải Job của công ty:", error);
        jobListContainer.textContent = "Không thể tải danh sách công việc.";
    }
}

loadCompanyJobs();
loadCompanyDetails();