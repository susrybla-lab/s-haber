export async function github(path, options={}) {
  const repo=process.env.GITHUB_REPOSITORY || 'susrybla-lab/s-haber';
  if(!/^[\w.-]+\/[\w.-]+$/.test(repo)||!process.env.GITHUB_TOKEN) throw Object.assign(new Error('GitHub bağlantısı yapılandırılmamış.'),{status:503});
  const response=await fetch(`https://api.github.com/repos/${repo}/${path}`,{...options,signal:AbortSignal.timeout(20000),headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${process.env.GITHUB_TOKEN}`,'X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...options.headers}});
  if(!response.ok) { const status=response.status===409||response.status===422?409:response.status===404?404:502; throw Object.assign(new Error(status===409?'Haber başka bir işlemde değişti. Yeniden açıp tekrar deneyin.':status===404?'Haber bulunamadı.':'GitHub bağlantısı tamamlanamadı. Hesap izinlerini kontrol edin.'),{status}); }
  return response.json();
}
export const branch=()=>process.env.GITHUB_BRANCH||'main';
export const contentPath=id=>`contents/haberler/${encodeURIComponent(id)}.md`;
