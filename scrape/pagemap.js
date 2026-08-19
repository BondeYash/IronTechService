const fs=require('fs');
const pages=['Home','AboutUs','Our-Services','Projects','Careers','Contact'];
const map={};
for(const l of fs.readFileSync('.scrape/image-map.tsv','utf8').trim().split('\n')){
  const [url,path]=l.split('\t'); map[url.split('/').pop()]=path.replace(/^public/,'');
}
const alts={};
const out={};
for(const p of pages){
  const h=fs.readFileSync(`.scrape/${p}.html`,'utf8');
  // alt capture
  const re=/<img\b[^>]*>/gi; let m;
  while((m=re.exec(h))){
    const t=m[0];
    const s=(t.match(/data-src="([^"]+)"/i)||t.match(/src="([^"]+)"/i)||[])[1]||'';
    const a=(t.match(/alt="([^"]*)"/i)||[])[1]||'';
    const f=s.split('/').pop(); if(f&&a&&!alts[f]) alts[f]=a;
  }
  const files=[...new Set((h.match(/images\/5758\/[a-z0-9]{5}_\d+_[^"')\s,]+/g)||[]).map(u=>u.split('/').pop()))];
  out[p]=files.filter(f=>map[f]).map(f=>({file:map[f],alt:alts[f]||'',src:f}));
}
fs.writeFileSync('.scrape/page-images.json',JSON.stringify(out,null,2));
for(const p of pages) console.log(p,'=',out[p].length);
console.log('\nProjects files:'); out.Projects.forEach(i=>console.log(' ',i.file,'| alt:',i.alt));
