import {authenticated,json,sameOrigin} from '../../lib/auth.mjs';
import {github,branch,contentPath} from '../../lib/github.mjs';
import {parseArticle,articleMarkdown,validateArticle,renderMarkdown} from '../../lib/content.mjs';
export default async function handler(req) {
  if(!authenticated(req)) return json({error:'Devam etmek için giriş yapın.'},401);
  try {
    const url=new URL(req.url),id=url.searchParams.get('id');
    if(id&&!/^[a-z0-9][a-z0-9-]{0,99}$/.test(id)) return json({error:'Haber adresi geçersiz.'},400);
    if(req.method==='GET') {
      if(id) { const f=await github(`${contentPath(id)}?ref=${encodeURIComponent(branch())}`); return json({...parseArticle(Buffer.from(f.content,'base64').toString('utf8'),`${id}.md`),sha:f.sha}); }
      let files; try { files=await github(`contents/haberler?ref=${encodeURIComponent(branch())}`); } catch(e) {if(e.status===404)return json([]);throw e;}
      if(!Array.isArray(files)) return json({error:'Haber klasörü okunamadı.'},502);
      const list=[];
      const selected=files.filter(f=>f.type==='file'&&/^[a-z0-9][a-z0-9-]{0,99}\.md$/.test(f.name));
      for(let i=0;i<selected.length;i+=8) list.push(...await Promise.all(selected.slice(i,i+8).map(async f=>{const raw=await github(`contents/haberler/${encodeURIComponent(f.name)}?ref=${encodeURIComponent(branch())}`);const a=parseArticle(Buffer.from(raw.content,'base64').toString('utf8'),f.name);return {id:a.id,title:a.title,date:a.date,category:a.category,draft:a.draft};})));
      return json(list.sort((a,b)=>Date.parse(b.date)-Date.parse(a.date)));
    }
    if(!['POST','PUT','DELETE'].includes(req.method))return json({error:'Desteklenmeyen işlem.'},405);
    if(!sameOrigin(req))return json({error:'İstek doğrulanamadı.'},403);
    const raw=await req.text();if(raw.length>200000)return json({error:'Haber çok uzun.'},413);
    const data=JSON.parse(raw);
    if(req.method==='POST'&&data.action==='preview') return json({html:renderMarkdown(String(data.body||'').slice(0,150000))});
    if(req.method==='DELETE') {
      if(!id||typeof data.sha!=='string')return json({error:'Haber seçilmedi.'},400);
      await github(contentPath(id),{method:'DELETE',body:JSON.stringify({message:`Haber silindi: ${id}`,sha:data.sha,branch:branch()})});return json({ok:true});
    }
    const article=validateArticle(data);
    if(req.method==='PUT'&&(!data.sha||id!==article.id))return json({error:'Güncellenecek haber seçilmedi.'},400);
    const saved=await github(contentPath(article.id),{method:'PUT',body:JSON.stringify({message:`${article.draft?'Taslak':'Haber'} kaydedildi: ${article.title}`,content:Buffer.from(articleMarkdown(article)).toString('base64'),branch:branch(),...(req.method==='PUT'?{sha:data.sha}:{})})});
    return json({ok:true,id:article.id,sha:saved.content.sha,message:article.draft?'Taslak kaydedildi.':'Haber kaydedildi. Otomatik site yayını tamamlandığında görünür olacak.'});
  }catch(e){return json({error:e.status?e.message:'Alanları kontrol edip tekrar deneyin.'},e.status||400);}
}
export const config={path:'/api/news'};
