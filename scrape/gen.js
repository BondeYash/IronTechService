const fs=require('fs');
const pi=JSON.parse(fs.readFileSync('.scrape/page-images.json','utf8'));
const skip=/logos\/|\/(1|2|3|4|5|image|completion|completion1)\.png|xq-bs1xb9|x-qzi0|d-qrri/;
const seen=new Set();
const projects=pi.Projects.filter(i=>!skip.test(i.file)).map(i=>{
  const raw=i.src.replace(/^[a-z0-9]{5}_\d+_/,'').replace(/\.\w+$/,'');
  let words=raw.replace(/([a-z])([A-Z])/g,'$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g,'$1 $2')
               .replace(/([a-zA-Z])(\d)/g,'$1 $2').replace(/(\d)([a-zA-Z])/g,'$1 $2').trim();
  const tm=words.match(/(\d+(?:\.\d+)?)\s*[Tt]ons?\b/);
  const tonnage=tm?Number(tm[1]):null;
  let title=words.replace(/\s*\d+(?:\.\d+)?\s*[Tt]ons?\b/,'').trim();
  title=title.replace(/\bschool\b/gi,'School').replace(/\bcenter\b/gi,'Center')
             .replace(/\bstudio\b/gi,'Studio').replace(/\bfirestation\b/gi,'Fire Station')
             .replace(/\bEnrty\b/gi,'Entry').replace(/\bCoverails\b/gi,'Cover Rails')
             .replace(/\bpublicschool\b/gi,'Public School').replace(/\bnursingschool\b/gi,'Nursing School')
             .replace(/\bfacility\b/gi,'Facility').replace(/\balternativecare\b/gi,'Alternative Care')
             .replace(/\s+/g,' ').trim();
  const slug=title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  let s=slug,n=2; while(seen.has(s)) s=`${slug}-${n++}`; seen.add(s);
  return {slug:s,title,tonnage,image:i.file};
});
const ts=`// Auto-generated from irontechdetailing.com scrape. Titles/tonnage derived from source image names — verify before publishing.
export type Project = {
  slug: string;
  title: string;
  tonnage: number | null;
  image: string;
};

export const projects: Project[] = ${JSON.stringify(projects,null,2)};
`;
fs.mkdirSync('src/data',{recursive:true});
fs.writeFileSync('src/data/projects.ts',ts);
console.log('projects:',projects.length);
projects.forEach(p=>console.log(` ${p.title}${p.tonnage?` — ${p.tonnage}T`:''}`));
