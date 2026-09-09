import { randomBytes, scryptSync, timingSafeEqual, createHmac } from 'node:crypto';
export function passwordHash(password) { const salt=randomBytes(16).toString('hex'); return `${salt}:${scryptSync(password,salt,64).toString('hex')}`; }
export function equal(a,b) { const x=Buffer.from(String(a)),y=Buffer.from(String(b)); return x.length===y.length && timingSafeEqual(x,y); }
export function checkPassword(password, hash) { const [salt,key]=String(hash||'').split(':'); if(!/^[a-f0-9]{32}$/.test(salt||'')||!/^[a-f0-9]{128}$/.test(key||'')) return false; return equal(scryptSync(password,salt,64).toString('hex'),key); }
const sign=(data,secret)=>createHmac('sha256',secret).update(data).digest('base64url');
export function sessionToken(username,secret,now=Date.now()) { const data=Buffer.from(JSON.stringify({sub:username,exp:now+8*3600000,nonce:randomBytes(16).toString('hex')})).toString('base64url'); return `${data}.${sign(data,secret)}`; }
export function sessionUser(token,secret,now=Date.now()) { try { const [data,sig,extra]=token.split('.'); if(extra||!data||!sig||!equal(sig,sign(data,secret))) return null; const p=JSON.parse(Buffer.from(data,'base64url')); return p.exp>now && p.exp<=now+8*3600000 && typeof p.sub==='string' ? p.sub : null; } catch { return null; } }
export const cookies=req=>Object.fromEntries((req.headers.get('cookie')||'').split(';').map(s=>s.trim().split(/=(.*)/s).slice(0,2)).filter(x=>x.length===2));
export function cookie(name,value,maxAge=28800) { return `${name}=${value}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`; }
export function json(data,status=200,headers={}) { return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}}); }
export function sameOrigin(req) { return req.headers.get('origin')===new URL(req.url).origin && (req.headers.get('content-type')||'').startsWith('application/json'); }
export function configured() { return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD_HASH && process.env.SESSION_SECRET?.length>=32); }
export function authenticated(req) { return configured() && sessionUser(cookies(req).sh_session||'',process.env.SESSION_SECRET)===process.env.ADMIN_USERNAME; }
