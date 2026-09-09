import {getStore} from '@netlify/blobs';
import {createHmac,randomBytes} from 'node:crypto';
import {cookies,cookie,json,sameOrigin} from '../../lib/auth.mjs';
const poll='forma-2026';
export function createHandler(storeFactory=getStore){return async function handler(req){
  if(!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32)return json({error:'Anket henüz oylamaya açılmadı.'},503);
  if(!['GET','POST'].includes(req.method))return json({error:'Desteklenmeyen işlem.'},405);
  try{
    const store=storeFactory({name:'shaber-polls',consistency:'strong'});
    const old=cookies(req).sh_voter;
    const valid=/^[a-f0-9]{48}$/.test(old||'');
    const voter=valid?old:randomBytes(24).toString('hex');
    const key=`${poll}/${createHmac('sha256',process.env.SESSION_SECRET).update(voter).digest('hex')}`;
    if(req.method==='POST'){
      if(!sameOrigin(req))return json({error:'İstek doğrulanamadı.'},403);
      if(!valid)return json({error:'Oy vermek için çerezlere izin verip sayfayı yenileyin.'},400);
      const raw=await req.text();if(raw.length>200)return json({error:'Geçersiz oy.'},400);
      const {choice}=JSON.parse(raw);if(!Number.isInteger(choice)||choice<1||choice>6)return json({error:'Bir forma seçin.'},400);
      const result=await store.setJSON(key,{choice},{onlyIfNew:true,metadata:{choice}});
      if(!result.modified)return json({error:'Bu tarayıcıdan daha önce oy kullanılmış.'},409);
    }
    const counts=Array(6).fill(0);
    for await(const page of store.list({prefix:`${poll}/`,paginate:true})){for(let i=0;i<page.blobs.length;i+=12){const votes=await Promise.all(page.blobs.slice(i,i+12).map(b=>store.get(b.key,{type:'json'})));for(const v of votes)if(v?.choice>=1&&v.choice<=6)counts[v.choice-1]++;}}
    const vote=await store.get(key,{type:'json'});
    return json({counts,voted:Boolean(vote),choice:vote?.choice||null},200,{'Set-Cookie':cookie('sh_voter',voter,31536000)});
  }catch{return json({error:'Ankete şu anda ulaşılamıyor. Lütfen daha sonra tekrar deneyin.'},503);}
};}
export default createHandler();
export const config={path:'/api/poll',rateLimit:{windowLimit:20,windowSize:60,aggregateBy:['ip','domain']}};
