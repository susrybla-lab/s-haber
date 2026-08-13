const ACCESS_KEY = 's-haber-birthday-access';
// Bunu annenin doğum günü ile değiştir: Yıl-Ay-GünT00:00:00+03:00
const BIRTHDAY_DATE = '2026-08-15T00:00:00+03:00';

if (sessionStorage.getItem(ACCESS_KEY) !== 'granted') {
    window.location.replace('anneye-ozel.html');
}

const target = new Date(BIRTHDAY_DATE).getTime();
const display = {
    days: document.getElementById('countdown-days'),
    hours: document.getElementById('countdown-hours'),
    minutes: document.getElementById('countdown-minutes'),
    seconds: document.getElementById('countdown-seconds'),
    message: document.getElementById('countdown-message')
};

function updateCountdown() {
    const distance = target - Date.now();
    if (distance <= 0) {
        display.days.textContent = '0'; display.hours.textContent = '0';
        display.minutes.textContent = '0'; display.seconds.textContent = '0';
        display.message.textContent = 'Bugün kutlama günü! İyi ki doğdun, Anne. ♥';
        return;
    }
    display.days.textContent = Math.floor(distance / 86400000);
    display.hours.textContent = Math.floor((distance / 3600000) % 24);
    display.minutes.textContent = Math.floor((distance / 60000) % 60);
    display.seconds.textContent = Math.floor((distance / 1000) % 60);
    display.message.textContent = 'Her saniye kutlamaya biraz daha yaklaşıyoruz.';
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.getElementById('birthday-logout').addEventListener('click', () => {
    sessionStorage.removeItem(ACCESS_KEY);
    window.location.replace('anneye-ozel.html');
});

const compliments = [
    'Sevgin, evimizi her zaman yuva yapan en güzel şey.',
    'Gülüşün, en zor günlerde bile içimizi ısıtıyor.',
    'Gücün ve sabrın hepimize ilham veriyor.',
    'Sen varken her şey biraz daha güzel.',
    'İyi ki bizim annemizsin. ♥'
];
let complimentIndex = 0;
const complimentText = document.getElementById('compliment-text');
document.getElementById('compliment-button').addEventListener('click', () => {
    complimentText.textContent = compliments[complimentIndex++ % compliments.length];
});

document.getElementById('gift-button').addEventListener('click', () => {
    document.getElementById('gift-message').hidden = false;
    document.getElementById('gift-button').hidden = true;
});

document.getElementById('wish-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const wish = document.getElementById('wish-input').value.trim();
    if (!wish) return;
    document.getElementById('wish-result').textContent = `Dileğin kalbimize yazıldı: “${wish}” ♥`;
    event.currentTarget.reset();
});

document.querySelectorAll('.candle').forEach((candle) => {
    candle.addEventListener('click', () => candle.classList.toggle('blown-out'));
});
