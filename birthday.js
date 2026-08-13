/*
 * Static-site note: this creates a friendly gate, not a secure login.
 * Change BIRTHDAY_CODE_HASH to the SHA-256 hash of your chosen code before publishing.
 * Default code: ANNE2026
 */
const BIRTHDAY_CODE_HASH = '755444b8e20d2a5731b2a4ded1a6553ad518776ff5b079aaa93ba91b4f221b72';
const ACCESS_KEY = 's-haber-birthday-access';

const encoder = new TextEncoder();
const login = document.getElementById('birthday-login');
const form = document.getElementById('birthday-form');
const codeInput = document.getElementById('birthday-code');
const error = document.getElementById('birthday-error');

async function sha256(value) {
    const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(value));
    return [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

if (sessionStorage.getItem(ACCESS_KEY) === 'granted') {
    window.location.replace('anneye-surpriz.html');
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    error.textContent = '';
    const enteredHash = await sha256(codeInput.value.trim());

    if (enteredHash === BIRTHDAY_CODE_HASH) {
        sessionStorage.setItem(ACCESS_KEY, 'granted');
        window.location.assign('anneye-surpriz.html');
        return;
    }

    error.textContent = 'Bu kod doğru görünmüyor. Bir kez daha deneyelim mi?';
    codeInput.select();
});
