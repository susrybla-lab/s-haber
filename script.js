// Arama Fonksiyonu (1. Sorunun Çözümü)
function searchNews() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        if (title.includes(input)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Tema Değiştirme
const themeBtn = document.getElementById('theme-toggle');
if(themeBtn) {
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
    });
}

// Kategori Filtreleme (4. Sorunun Çözümü)
function filterCategory(cat) {
    alert(cat + " haberleri filtreleniyor... (Bu özellik bir sonraki güncellemede tam otomatik olacak)");
    // Şimdilik arama kutusuna kategori adını yazar
    document.getElementById('searchInput').value = cat;
    searchNews();
}
