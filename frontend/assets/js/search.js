const params = new URLSearchParams(window.location.search);

const keyword = params.get("keyword") || "";
const city = params.get("city") || "";
const level = params.get("level") || "";
const workType = params.get("workType") || "";

document.getElementById("search-keyword").value = keyword;
document.getElementById("search-city").value = city;
document.getElementById("filter-level").value = level;
document.getElementById("filter-work-type").value = workType;

const jobListContainer = document.getElementById("search-job-list");
const resultTitle = document.getElementById("search-result-title");

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

function renderJobs(jobs) {
    jobListContainer.replaceChildren();

    if (jobs.length === 0) {
        jobListContainer.textContent = "Không tìm thấy công việc phù hợp.";
        return;
    }

    jobs.forEach(job => {
        const card = document.createElement("div");
        card.className = "card-item";

        const logoPath = job.companyLogoUrl || "";

        const logoUrl = /^\/uploads\/logo\/[a-zA-Z0-9._-]+$/.test(logoPath)
            ? `http://localhost:8080${logoPath}`
            : "assets/images/demo/image1.png";
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
                        ${job.minSalary.toLocaleString("vi-VN")} - ${job.maxSalary.toLocaleString("vi-VN")}
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
                        ${(job.technologies || "")
                            .split(",")
                            .filter(tech => tech.trim())
                            .map(tech => `
                                <div class="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]">
                                    ${escapeHTML(tech.trim())}
                                </div>
                            `).join("")}
                    </div>
                </div>
            </a>
        `;

        jobListContainer.appendChild(card);
    });
}

let latestRequestId = 0;

async function loadSearchResults() {
    const requestId = ++latestRequestId;
    const query = new URLSearchParams();

    if (keyword) query.set("keyword", keyword);
    if (city) query.set("city", city);

    const selectedLevel = document.getElementById("filter-level").value;
    const selectedWorkType = document.getElementById("filter-work-type").value;

    if (selectedLevel) query.set("level", selectedLevel);
    if (selectedWorkType) query.set("workType", selectedWorkType);

    try {
        const response = await fetch(
            `http://localhost:8080/api/job/public?${query.toString()}`
        );

        if (requestId !== latestRequestId) return;

        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }

        const jobs = await response.json();

        if (requestId !== latestRequestId) return;

        console.log("Kết quả Job:", jobs);
        resultTitle.textContent = `${jobs.length} việc làm phù hợp`;
        renderJobs(jobs);

    } catch (error) {
        if (requestId !== latestRequestId) return;

        console.error("Lỗi tải Job:", error);
        resultTitle.textContent = "Không thể tải kết quả";
        jobListContainer.textContent =
            error.message || "Vui lòng thử lại sau.";
    }
}


const filterLevel = document.getElementById("filter-level");
const filterWorkType = document.getElementById("filter-work-type");

function handleFilterChange() {
    const url = new URL(window.location.href);

    if (filterLevel.value) {
        url.searchParams.set("level", filterLevel.value);
    } else {
        url.searchParams.delete("level");
    }

    if (filterWorkType.value) {
        url.searchParams.set("workType", filterWorkType.value);
    } else {
        url.searchParams.delete("workType");
    }

    window.history.replaceState({}, "", url);

    loadSearchResults();
}

filterLevel.addEventListener("change", handleFilterChange);
filterWorkType.addEventListener("change", handleFilterChange);

loadSearchResults();