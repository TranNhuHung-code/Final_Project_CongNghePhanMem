const API_ORIGIN = "";
const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "employer-login.html";
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

// Upload lần lượt từng ảnh, trả về chuỗi "url1,url2,..."
async function uploadJobImages(files) {
    const urls = [];
    for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", "job");

        const response = await fetch(`${API_ORIGIN}/api/upload/image`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }, // không tự set Content-Type
            body: formData
        });
        if (!response.ok) {
            const message = await getApiErrorMessage(response);
            throw new Error(message);
        }
        urls.push((await response.json()).url);
    }
    return urls.join(",");
}

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const files = Array.from(imageFilesInput.files);
    if (files.length > MAX_IMAGES) {
        alert(`Chỉ được chọn tối đa ${MAX_IMAGES} ảnh`);
        return;
    }
    if (files.some(f => f.size > MAX_IMAGE_SIZE)) {
        alert("Mỗi ảnh tối đa 15 MB");
        return;
    }

    let images = "";
    try {
        images = await uploadJobImages(files);
    } catch (error) {
        alert("Upload ảnh thất bại: " + error.message);
        return;
    }

    const response = await fetch(`${API_ORIGIN}/api/job/me`, {
        method: "POST",
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
        alert("Tạo job thành công");
        window.location.href = "manage-jobs.html";
    } else {
        const message = await getApiErrorMessage(response);
        alert(message);
        return;
    }
});