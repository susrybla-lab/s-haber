import YAML from 'yaml';
import { marked } from 'marked';
import sanitizeHtml from './sanitize.cjs';

export const categories = ['Gündem', 'Ekonomi', 'Spor', 'Teknoloji'];
export const escape = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function imageURL(value) {
  const s = String(value || '');
  if (/^\/img\/[\w./%-]+$/.test(s) && !s.includes('..')) return s;
  try { const u = new URL(s); return u.protocol === 'https:' ? u.href : ''; } catch { return ''; }
}
export function parseArticle(text, filename) {
  const m = text.replace(/^\uFEFF/, '').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!m) throw new Error(`${filename}: haber başlığı alanları bulunamadı.`);
  const data = YAML.parse(m[1]);
  if (!data || typeof data !== 'object') throw new Error('Haber alanları geçersiz.');
  return { id: filename.replace(/\.md$/, ''), title: String(data.title || '').trim(),
    date: String(data.date || ''), category: categories.includes(data.category) ? data.category : 'Gündem',
    author: String(data.author || 'S-Haber'), image: imageURL(data.image), imageAlt: String(data.imageAlt || ''),
    summary: String(data.summary || ''), draft: data.draft === true, body: m[2].trim() };
}
export function articleMarkdown(a) {
  const { id, body, sha, ...meta } = a;
  return `---\n${YAML.stringify(meta)}---\n${body}\n`;
}
export function renderMarkdown(body) {
  return sanitizeHtml(marked.parse(body), { allowedTags: ['p','br','h2','h3','h4','strong','em','blockquote','ul','ol','li','a','img','hr','code','pre','table','thead','tbody','tr','th','td'],
    allowedAttributes: { a: ['href','title','rel'], img: ['src','alt','title'], th: ['align'], td: ['align'] },
    allowedSchemes: ['https','http','mailto'], allowProtocolRelative: false,
    transformTags: { a: (tagName, attribs) => ({ tagName, attribs: {...attribs, rel: 'noopener noreferrer'} }) } });
}
export function summary(a) { return a.summary || a.body.replace(/!\[[^\]]*\]\([^)]*\)/g,'').replace(/[#*_>`\[\]]/g,'').replace(/\s+/g,' ').slice(0,180); }
export function validateArticle(a) {
  if (!a || typeof a !== 'object') throw new Error('Haber verisi geçersiz.');
  if (!/^[a-z0-9][a-z0-9-]{0,99}$/.test(a.id || '')) throw new Error('Haber adresi yalnızca küçük harf, rakam ve tire içerebilir.');
  if (typeof a.title !== 'string' || !a.title.trim() || a.title.length > 180) throw new Error('Başlık 1–180 karakter olmalı.');
  if (typeof a.body !== 'string' || !a.body.trim() || a.body.length > 150000) throw new Error('Haber metni 1–150.000 karakter olmalı.');
  if (!categories.includes(a.category)) throw new Error('Bir kategori seçin.');
  if (!Number.isFinite(Date.parse(a.date))) throw new Error('Yayın tarihi geçersiz.');
  if (new Date(a.date).getTime() > Date.now() + 60000 && !a.draft) throw new Error('İleri tarihli haberleri taslak kaydedin; yayınlamak için zamanı geldiğinde tekrar açın.');
  if (a.image && !imageURL(a.image)) throw new Error('Görsel adresi geçersiz.');
  for (const field of ['author','imageAlt','summary']) if (typeof a[field] !== 'string' || a[field].length > 500) throw new Error(`${field} alanı geçersiz.`);
  if (typeof a.draft !== 'boolean') throw new Error('Yayın durumu geçersiz.');
  return {id:a.id,title:a.title.trim(),date:new Date(a.date).toISOString(),category:a.category,author:a.author.trim()||'S-Haber',image:imageURL(a.image),imageAlt:a.imageAlt,summary:a.summary,draft:a.draft,body:a.body};
}
