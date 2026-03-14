// TEMA KONTROLÜ
const btn = document.getElementById("theme-toggle");
btn.addEventListener("click", () => {
    document.body.classList.toggle("dark-theme");
    localStorage.setItem("theme", document.body.classList.contains("dark-theme") ? "dark" : "light");
});

if (localStorage.getItem("theme") === "dark") document.body.classList.add("dark-theme");

// ARAMA FONKSİYONU
function searchNews() {
    const q = document.getElementById("searchInput").value;
    if(q) alert("'" + q + "' aranıyor...");
}

// SLIDER SİSTEMİ
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

function changeSlide(n) {
    if(slides.length === 0) return;
    slides[currentSlide].classList.remove("active");
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add("active");
}

setInterval(() => changeSlide(1), 5000);