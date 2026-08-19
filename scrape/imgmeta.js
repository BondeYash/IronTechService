const fs=require('fs');
const pages=['Home','AboutUs','Our-Services','Projects','Careers','Contact'];
const map={};
for(const l of fs.readFileSync('.scrape/image-map.tsv','utf8').trim().split('\n')){
  const [url,path]=l.split('\t'); map[url.split('/').pop()]=path.replace(/^public/,'');
}
const out={};
for(const p of pages){
  const h=fs.readFileSync(`.scrape/${p}.html`,'utf8');
  const imgs=[];
  const re=/<img\b[^>]*>/gi; let m;
  while((m=re.exec(h))){
    const tag=m[0];
    const src=(tag.match(/(?:data-src|src)="([^"]+)"/i)||[])[1]||'';
    const alt=(tag.match(/alt="([^"]*)"/i)||[])[1]||'';
    const file=src.split('/').pop();
    if(!file) continue;
    const local=map[file];
    if(!local) continue;
    if(!imgs.some(i=>i.local===local)) imgs.push({local,alt,origin:src});
  }
  out[p]=imgs;
}
fs.writeFileSync('.scrape/page-images.json',JSON.stringify(out,null,2));
for(const p of pages) console.log(p, out[p].length, out[p].map(i=>i.local.split('/').pop()).join(', '));
