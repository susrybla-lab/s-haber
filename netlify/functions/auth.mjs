import {configured,authenticated,checkPassword,equal,sessionToken,cookie,json,sameOrigin} from '../../lib/auth.mjs';
export default async function handler(req) {
  if(!configured()) return json({error:'Yönetici hesabı henüz yapılandırılmamış. Site sahibi kurulum kılavuzundaki hesap ayarlarını tamamlamalı.'},503);
  if(req.method==='GET') return json({authenticated:authenticated(req)});
  if(req.method!=='POST') return json({error:'Desteklenmeyen işlem.'},405);
  if(!sameOrigin(req)) return json({error:'İstek doğrulanamadı.'},403);
  try {
    const raw=await req.text(); if(raw.length>2048) return json({error:'İstek çok büyük.'},413);
    const data=JSON.parse(raw);
    if(data.action==='logout') return json({ok:true},200,{'Set-Cookie':cookie('sh_session','',0)});
    if(typeof data.password!=='string'||data.password.length>256||typeof data.username!=='string') return json({error:'Kullanıcı adı veya şifre hatalı.'},401);
    const pass=checkPassword(data.password,process.env.ADMIN_PASSWORD_HASH);
    if(!pass||!equal(data.username,process.env.ADMIN_USERNAME)) return json({error:'Kullanıcı adı veya şifre hatalı.'},401);
    return json({ok:true},200,{'Set-Cookie':cookie('sh_session',sessionToken(process.env.ADMIN_USERNAME,process.env.SESSION_SECRET))});
  } catch { return json({error:'İstek işlenemedi.'},400); }
}
export const config={path:'/api/auth',rateLimit:{windowLimit:15,windowSize:60,aggregateBy:['ip','domain']}};
