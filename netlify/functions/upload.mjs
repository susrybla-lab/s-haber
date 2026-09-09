import {randomUUID} from 'node:crypto';
import {authenticated,json,sameOrigin} from '../../lib/auth.mjs';
import {github,branch} from '../../lib/github.mjs';
export default async function handler(req){
  if(!authenticated(req))return json({error:'Giriş yapın.'},401);
  if(req.method!=='POST')return json({error:'Desteklenmeyen işlem.'},405);
  if(!sameOrigin(req))return json({error:'İstek doğrulanamadı.'},403);
  try{
    const raw=await req.text();if(raw.length>4200000)return json({error:'Görsel en fazla 3 MB olabilir.'},413);
    const {content}=JSON.parse(raw);if(typeof content!=='string'||!/^[A-Za-z0-9+/]+={0,2}$/.test(content))return json({error:'Görsel okunamadı.'},400);
    const bytes=Buffer.from(content,'base64');if(bytes.length>3*1024*1024)return json({error:'Görsel en fazla 3 MB olabilir.'},413);
    const ext=bytes.subarray(0,3).equals(Buffer.from([255,216,255]))?'jpg':bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))?'png':bytes.subarray(0,4).toString()==='RIFF'&&bytes.subarray(8,12).toString()==='WEBP'?'webp':null;
    if(!ext)return json({error:'JPG, PNG veya WebP görsel seçin.'},400);
    const path=`img/${randomUUID()}.${ext}`;
    await github(`contents/${path}`,{method:'PUT',body:JSON.stringify({message:'Haber görseli eklendi',content:bytes.toString('base64'),branch:branch()})});
    return json({url:`/${path}`});
  }catch(e){return json({error:e.status?e.message:'Görsel yüklenemedi.'},e.status||400);}
}
export const config={path:'/api/upload'};
