import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,cp,mkdir,writeFile,readFile,readdir,symlink,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {articleMarkdown} from '../lib/content.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
test('Yayın çıktısı: taslaklar gizlenir, detaylar ve RSS üretilir, eski çıktı temizlenir',async()=>{
 const scratch=path.join(root,'.test-work');await mkdir(scratch,{recursive:true});const temp=await mkdtemp(path.join(scratch,'build-'));
 try{
  for(const p of ['tools','lib','assets','img','admin','silincek','style.css','birthday.js','birthday-surprise.js','anneye-ozel.html','anneye-surpriz.html','site.json','package.json'])await cp(path.join(root,p),path.join(temp,p),{recursive:true});
  await symlink(path.join(root,'node_modules'),path.join(temp,'node_modules'),'junction');await mkdir(path.join(temp,'haberler'));
  const a={id:'test-haber',title:'Türkçe & güvenli haber',date:'2026-01-01T00:00:00.000Z',category:'Spor',author:'Editör',image:'',imageAlt:'',summary:'Kısa özet',body:'## Alt başlık\n\nGerçek metin\n\n<script>alert(1)</script>',draft:false};
  await writeFile(path.join(temp,'haberler/test-haber.md'),articleMarkdown(a));await writeFile(path.join(temp,'haberler/taslak.md'),articleMarkdown({...a,id:'taslak',title:'Gizli taslak başlığı',draft:true}));
  const build=()=>{const r=spawnSync(process.execPath,['tools/build.mjs'],{cwd:temp,encoding:'utf8'});assert.equal(r.status,0,r.stderr);};build();
  const home=await readFile(path.join(temp,'dist/index.html'),'utf8');assert(home.includes('Türkçe &amp; güvenli haber'));assert(!home.includes('Gizli taslak'));assert(!(await readdir(path.join(temp,'dist'))).includes('haberler'));
  const detail=await readFile(path.join(temp,'dist/haber/test-haber/index.html'),'utf8');assert(detail.includes('NewsArticle'));assert(detail.includes('<h2>Alt başlık</h2>'));assert(!detail.includes('<script>alert'));
  const rss=await readFile(path.join(temp,'dist/rss.xml'),'utf8');assert(rss.includes('Türkçe &amp; güvenli haber'));assert(!rss.includes('Gizli taslak'));
  await writeFile(path.join(temp,'haberler/test-haber.md'),articleMarkdown({...a,draft:true}));build();
  await assert.rejects(readFile(path.join(temp,'dist/haber/test-haber/index.html')));
 }finally{if(path.dirname(temp)!==scratch)throw new Error('Geçersiz geçici klasör');await rm(temp,{recursive:true,force:true});}
});
