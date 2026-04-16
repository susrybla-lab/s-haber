const username = "susrybla-lab";
const repo = "s-haber";

// TEMA DEĞİŞTİRME
document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-theme');

// HABERLERİ YÜKLE
async function loadNews(categoryFilter = null) {
    try {
        const res = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/haberler`);
        const files = await res.json();
        const mdFiles = files.filter(f => f.name.endsWith('.md')).reverse();

        const grid = document.getElementById('panel-haberleri');
        const slider = document.getElementById('dynamic-slider');
        const sidebar = document.getElementById('sidebar-list');

        if (!categoryFilter) { grid.innerHTML = ''; slider.innerHTML = ''; sidebar.innerHTML = ''; }
        else { 
            grid.innerHTML = ''; 
            document.getElementById('grid-title').innerText = categoryFilter + " Haberleri";
        }

        let sliderCount = 0;

        for (let file of mdFiles) {
            const contentRes = await fetch(file.download_url);
            const text = await contentRes.text();

            const title = text.match(/title:\s*"(.*)"/)?.[1] || text.match(/title:\s*(.*)/)?.[1] || "Başlıksız";
            const image = text.match(/image:\s*"(.*)"/)?.[1] || text.match(/image:\s*(.*)/)?.[1] || "img/placeholder.jpg";
            const category = text.match(/category:\s*"(.*)"/)?.[1] || text.match(/category:\s*(.*)/)?.[1] || "Gündem";

            // Kategori Filtreleme
            if (categoryFilter && category.toLowerCase() !== categoryFilter.toLowerCase()) continue;

            // GRID KARTI
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${image}" alt="${title}">
                <div class="card-body">
                    <span style="color:red; font-size:12px; font-weight:bold;">${category.toUpperCase()}</span>
                    <h3 style="font-size:16px;">${title}</h3>
                    <a href="haber-detay.html?haber=${file.name}" style="color:var(--primary); text-decoration:none; font-weight:bold;">Devamını Oku →</a>
                </div>
            `;
            grid.appendChild(card);

            // MANŞET (Sadece Filtresizken ve ilk 3 haber)
            if (!categoryFilter && sliderCount < 3) {
                const slide = document.createElement('div');
                slide.className = sliderCount === 0 ? 'slide active' : 'slide';
                slide.innerHTML = `
                    <a href="haber-detay.html?haber=${file.name}">
                        <img src="${image}" alt="${title}">
                        <div class="slide-content">
                            <span class="category">${category}</span>
                            <h2>${title}</h2>
                        </div>
                    </a>
                `;
                slider.appendChild(slide);
                sliderCount++;
            }
        }
    } catch (e) { console.log("Hata:", e); }
}

// SLIDER KONTROL
let currentSlide = 0;
function changeSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}
setInterval(() => changeSlide(1), 5000);

// ARAMA
function searchNews() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(term) ? 'block' : 'none';
    });
}

loadNews();

// ANKET SONUÇLARINI GÖSTER
function anketSonuclariniGoster() {
    const oylar = JSON.parse(localStorage.getItem('anketOylari')) || [];
    const sayilar = {};
    oylar.forEach(oy => {
        sayilar[oy.forma] = (sayilar[oy.forma] || 0) + 1;
    });
    const sonucDiv = document.getElementById('anket-sonuclar');
    if (Object.keys(sayilar).length === 0) {
        sonucDiv.innerHTML = 'Henüz oy verilmemiş.';
        return;
    }
    let html = '<ul>';
    for (const [forma, sayi] of Object.entries(sayilar)) {
        html += `<li>${forma}: ${sayi} oy</li>`;
    }
    html += '</ul>';
    sonucDiv.innerHTML = html;
}

loadNews();
anketSonuclariniGoster();
