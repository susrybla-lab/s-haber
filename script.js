let currentSlide = 0;

function changeSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + direction + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

// Otomatik Slider (5 saniyede bir)
setInterval(() => {
    changeSlide(1);
}, 5000);

const themeBtn = document.getElementById('theme-toggle');

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Tercihi hafızaya al (Sayfa yenilense de gitmez)
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Sayfa açıldığında hafızadaki temayı yükle
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
}

// Arama Fonksiyonu
function searchNews() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? "block" : "none";
    });
}
