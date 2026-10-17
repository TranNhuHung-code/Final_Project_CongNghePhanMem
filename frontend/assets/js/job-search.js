const searchForm = document.getElementById("job-search-form");
const searchCity = document.getElementById("search-city");
const searchKeyword = document.getElementById("search-keyword");

searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const keyword = searchKeyword.value.trim();
    const city = searchCity.value;

    const params = new URLSearchParams();

    if (keyword) params.set("keyword", keyword);
    if (city) params.set("city", city);

    window.location.href = `search.html?${params.toString()}`;
});