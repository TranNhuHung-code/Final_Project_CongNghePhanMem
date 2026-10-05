const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "employer-login.html"; 
}
const jobCardsContainer = document.getElementById("job-cards");

function createJobCard(job) {
  const techList = job.technologies
    ? job.technologies.split(",").map(t => t.trim())
    : [];

  const techTags = techList
    .map(t => `<div class="border border-[#DEDEDE] rounded-[20px] py-[6px] px-[16px] font-[400] text-[12px] text-[#414042]">${t}</div>`)
    .join("");

  const salaryText = `${job.minSalary?.toLocaleString("vi-VN")}$ - ${job.maxSalary?.toLocaleString("vi-VN")}$`;

  return `
    <div class="card-item p-[20px]">
      <img src="assets/images/bg-card.png" class="inner-bg" />
      <div class="font-[700] text-[18px] text-[#121212] text-center line-clamp-[2]">${job.title || "Chưa có tiêu đề"}</div>
      <div class="font-[600] text-[16px] text-[#0088FF] text-center mt-[12px]">${salaryText}</div>
      <div class="font-[400] text-[14px] text-[#121212] text-center mt-[6px]">${job.level || "Chưa cập nhật"}</div>
      <div class="font-[400] text-[14px] text-[#121212] text-center mt-[6px]">${job.workType || "Chưa cập nhật"}</div>
      <div class="mt-[12px] mb-[19px] flex justify-center items-center flex-wrap gap-[8px]">${techTags}</div>
      <div class="flex justify-center gap-[12px]">
        <a data-id="${job.id}" class="btn-edit bg-[#FFB200] rounded-[4px] py-[8px] px-[20px] font-[400] text-[14px] text-black" href="update-jobs.html?id=${job.id}">Sửa</a>
        <a data-id="${job.id}" class="btn-delete bg-[#FF0000] rounded-[4px] py-[8px] px-[20px] font-[400] text-[14px] text-white" href="#">Xóa</a>
      </div>
    </div>
  `;
}

function renderJobs(jobs) {
  const jobCardsContainer = document.getElementById("job-cards");
  if (!jobs || jobs.length === 0) {
    jobCardsContainer.innerHTML = `<p class="text-center col-span-full">Chưa có tin tuyển dụng nào</p>`;
    return;
  }
  jobCardsContainer.innerHTML = jobs.map(createJobCard).join("");
}

//Nut xoa
jobCardsContainer.addEventListener("click", async (e) => {
  const delBtn = e.target.closest(".btn-delete");
  if (!delBtn) return;

  const jobId = delBtn.dataset.id;
  const confirmed = confirm("Bạn có chắc muốn xóa tin tuyển dụng này?");
  if (!confirmed) return;

  const response = await fetch(`http://localhost:8080/api/job/${jobId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (response.ok) {
    delBtn.closest(".card-item").remove();
  } else {
    const text = await response.text();
    alert("Xóa thất bại: " + text);
  }
});

async function loadJobData() {
    const response = await fetch("http://localhost:8080/api/job/me", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        const jobs = await response.json();
        renderJobs(jobs);
    } else {
        const text = await response.text();
        console.log(response.status, text);
    }
}
loadJobData();