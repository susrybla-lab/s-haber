const themeButton=document.querySelector('[data-theme]');
try{if(localStorage.getItem('theme')==='dark')document.body.classList.add('dark-theme');}catch{}
function themeLabel(){if(themeButton){const dark=document.body.classList.contains('dark-theme');themeButton.textContent=dark?'Açık görünüm':'Koyu görünüm';themeButton.setAttribute('aria-pressed',String(dark));}}
themeLabel();themeButton?.addEventListener('click',()=>{document.body.classList.toggle('dark-theme');try{localStorage.setItem('theme',document.body.classList.contains('dark-theme')?'dark':'light');}catch{}themeLabel();});
const date=document.querySelector('[data-today]');if(date)date.textContent=new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',year:'numeric',weekday:'long',timeZone:'Europe/Istanbul'}).format(new Date());
document.querySelectorAll('img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;}));
const grid=document.querySelector('[data-news-grid]'),search=document.querySelector('[data-search]');
if(grid&&search){
 const params=new URLSearchParams(location.search),title=document.querySelector('[data-grid-title]'),empty=document.querySelector('[data-filter-empty]'),lead=document.querySelector('.lead-grid');
 function filter(){const q=search.value.trim().toLocaleLowerCase('tr-TR'),cat=params.get('cat');let count=0;grid.querySelectorAll('[data-title]').forEach(card=>{const show=(!cat||card.dataset.category===cat)&&(!q||card.dataset.title.toLocaleLowerCase('tr-TR').includes(q));card.hidden=!show;if(show)count++;});if(empty)empty.hidden=count>0||(!q&&!cat);if(lead)lead.hidden=Boolean(q||cat);const initialEmpty=grid.querySelector(".empty");if(initialEmpty)initialEmpty.hidden=Boolean(q||cat);if(title)title.textContent=q?`“${search.value.trim()}” için haberler`:cat?`${cat} haberleri`:'Tüm haberler';document.querySelectorAll('.main-nav a').forEach(a=>{if(a.dataset.category===cat||(a.dataset.home!==undefined&&!cat))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});}
 search.value=params.get('q')||'';filter();document.querySelector('.search-form').addEventListener('submit',e=>{e.preventDefault();if(search.value.trim())params.set('q',search.value.trim());else params.delete('q');history.replaceState(null,'',`${location.pathname}${params.size?'?'+params:''}`);filter();});search.addEventListener('input',filter);
}

