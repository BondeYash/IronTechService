const fs = require('fs');
const pages = ['Home','AboutUs','Our-Services','Projects','Careers','Contact'];
fs.mkdirSync('.scrape/text', {recursive: true});
for (const p of pages) {
  let h = fs.readFileSync(`.scrape/${p}.html`, 'utf8');
  h = h.replace(/<script[\s\S]*?<\/script>/gi, '')
       .replace(/<style[\s\S]*?<\/style>/gi, '')
       .replace(/<!--[\s\S]*?-->/g, '')
       .replace(/<(br|\/p|\/div|\/h[1-6]|\/li|\/tr|\/section)[^>]*>/gi, '\n')
       .replace(/<[^>]+>/g, ' ')
       .replace(/&nbsp;/g, ' ').replace(/&amp;/g,'&').replace(/&#39;|&rsquo;/g,"'")
       .replace(/&quot;|&ldquo;|&rdquo;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>')
       .replace(/&[a-z]+;/gi, ' ');
  const lines = h.split('\n').map(l => l.replace(/\s+/g,' ').trim()).filter(Boolean);
  const out = [];
  for (const l of lines) if (out[out.length-1] !== l) out.push(l);
  fs.writeFileSync(`.scrape/text/${p}.txt`, out.join('\n'));
  console.log(p, out.length, 'lines');
}
