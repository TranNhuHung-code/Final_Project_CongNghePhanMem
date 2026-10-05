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

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const response = await fetch("http://localhost:8080/api/job/me", {
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
            images: "",
            description: descriptionInput.value
        })
    });
    if (response.ok) {
        console.log("STATUS:", response.status);
        console.log("RESPONSE:", await response.text());
        window.location.href = "manage-jobs.html";
    } else {
        const text = await response.text();
        console.log("STATUS:", response.status);
        console.log("RESPONSE:", text);
        alert("Tạo tin thất bại: " + text);
    }
    
});
