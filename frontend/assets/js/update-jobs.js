const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "employer-login.html";
}

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");
if (!jobId) {
    window.location.href = "manage-jobs.html";
}

const form = document.getElementById("create-job-form");

const titleInput = document.getElementById("title");
const minSalaryInput = document.getElementById("minSalary");
const maxSalaryInput = document.getElementById("maxSalary");
const levelInput = document.getElementById("level");
const workTypeInput = document.getElementById("workType");
const technologiesInput = document.getElementById("technologies");
const imageFilesInput = document.getElementById("imageFiles");
const descriptionInput = document.getElementById("description");

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
        const job = jobs.find(j => j.id == jobId);

        if (!job) {
            alert("Không tìm thấy tin tuyển dụng này");
            window.location.href = "manage-jobs.html";
            return;
        }

        titleInput.value = job.title || "";
        minSalaryInput.value = job.minSalary || "";
        maxSalaryInput.value = job.maxSalary || "";
        levelInput.value = job.level || "";
        workTypeInput.value = job.workType || "";
        technologiesInput.value = job.technologies || "";
        descriptionInput.value = job.description || "";
    } else {
        const text = await response.text();
        console.log(response.status, text);
    }
}
loadJobData();

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    try {
        const response = await fetch(`http://localhost:8080/api/job/${jobId}`, {
            method: "PATCH",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: titleInput.value,
                minSalary: Number(minSalaryInput.value),
                maxSalary: Number(maxSalaryInput.value),
                level: levelInput.value,
                workType: workTypeInput.value,
                technologies: technologiesInput.value,
                images: "",
                description: descriptionInput.value
            })
        });

        if (response.ok) {
            window.location.href = "manage-jobs.html";
        } else {
            const text = await response.text();
            try {
                const errorData = JSON.parse(text);
                alert("Cập nhật thất bại: " + errorData.message);
            } catch {
                alert("Cập nhật thất bại: " + text);
            }
        }
    } catch (error) {
        console.error("FETCH ERROR:", error);
    }
});