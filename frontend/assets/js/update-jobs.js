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

const API_ORIGIN = "";
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;
let currentImages = "";   // ảnh hiện có của job, dạng "url1,url2"
let jobLoaded = false;
async function uploadJobImages(files) {
    const urls = [];
    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "job");

        const response = await fetch(`${API_ORIGIN}/api/upload/image`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });
        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }

        const data = await response.json();

        if (!data.url) {
            throw new Error("API upload không trả về URL ảnh.");
        }

        urls.push(data.url);
    }
    return urls.join(",");
}

const titleInput = document.getElementById("title");
const minSalaryInput = document.getElementById("minSalary");
const maxSalaryInput = document.getElementById("maxSalary");
const levelInput = document.getElementById("level");
const workTypeInput = document.getElementById("workType");
const technologiesInput = document.getElementById("technologies");
const imageFilesInput = document.getElementById("imageFiles");
const descriptionInput = document.getElementById("description");
const currentJobImagesContainer = document.getElementById("current-job-images");

function renderCurrentImages(images) {
    if (!currentJobImagesContainer) return;

    currentJobImagesContainer.replaceChildren();

    if (!images) {
        currentJobImagesContainer.textContent = "Chưa có ảnh công việc.";
        return;
    }

    images.split(",").forEach(path => {
        const url = path.trim();

        if (!url || url === "null") return;

        const img = document.createElement("img");

        img.src = url.startsWith("/uploads/")
            ? `${API_ORIGIN}${url}`
            : url;

        img.alt = "Ảnh công việc";
        img.className =
            "w-full h-[120px] object-cover rounded-[4px]";

        currentJobImagesContainer.appendChild(img);
    });
}

async function loadJobData() {
    try {
        const response = await fetch("/api/job/me", {
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
            currentImages = job.images || "";
            renderCurrentImages(currentImages);
            jobLoaded = true;
        } else {
            const message = await getApiErrorMessage(response);
            alert(message);
        }
    } catch (error) {
        console.error("Lỗi tải Job:", error);
        alert("Không thể tải thông tin công việc. Vui lòng thử lại.");
    }
}
loadJobData();

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (!jobLoaded) {
    alert("Thông tin công việc chưa tải thành công. Vui lòng tải lại trang.");
    return;
    }
    const files = Array.from(imageFilesInput.files);

    if (files.length > MAX_IMAGES) {
        alert(`Chỉ được chọn tối đa ${MAX_IMAGES} ảnh.`);
        return;
    }

    if (files.some(file => file.size > MAX_IMAGE_SIZE)) {
        alert("Mỗi ảnh tối đa 15 MB.");
        return;
    }
    const submitButton = form.querySelector('button[type="submit"]');

    if (submitButton.disabled) return;

    submitButton.disabled = true;
    try {
        let images = currentImages;

        if (files.length > 0) {
            images = await uploadJobImages(files);
        }
        const response = await fetch(`/api/job/${jobId}`, {
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
                images: images,
                description: descriptionInput.value
            })
        });

        if (response.ok) {
            alert("Cập nhật công việc thành công!");
            window.location.href = "manage-jobs.html";
        } else {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
            }
    } catch (error) {
        console.error("Lỗi cập nhật Job:", error);

        alert(
            error.message || "Không thể cập nhật công việc. Vui lòng thử lại."
        );
    } finally {
        submitButton.disabled = false;
    }
});