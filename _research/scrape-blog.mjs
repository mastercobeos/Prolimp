import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const posts = [
  'https://blog.prolimp.com/blog/diferentes-tipos-de-desengrasantes',
  'https://blog.prolimp.com/blog/los-diferentes-tipos-de-desengrasantes-clasificaci%C3%B3n-y-c%C3%B3mo-elegir-el-mejor',
  'https://blog.prolimp.com/blog/c%C3%B3mo-limpiar-canastilla-freidora',
  'https://blog.prolimp.com/blog/c%C3%B3mo-limpiar-plancha-decocina-0',
  'https://blog.prolimp.com/blog/aromatizante-para-ba%C3%B1o',
  'https://blog.prolimp.com/blog/c%C3%B3mo-limpiar-un-mingitorio-seco-1',
  'https://blog.prolimp.com/blog/qu%C3%A9-papel-higi%C3%A9nico-elijo-para-mi-negocio',
  'https://blog.prolimp.com/blog/como-limpiar-y-cuidar-tu-piso-ep%C3%B3xico-para-prolongar-su-durabilidad',
  'https://blog.prolimp.com/blog/trapeadores',
  'https://blog.prolimp.com/blog/como-limpiar-un-piso-ceramico',
];

const slugify = (u) => decodeURIComponent(u.split('/').filter(Boolean).pop() || 'post');

const extract = (html, url) => {
  const strip = (s) => s.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const clean = strip(html);
  const grab = (re) => (clean.match(re)?.[1] || '').trim();
  const title = grab(/<meta property="og:title" content="([^"]+)"/i) || grab(/<title>([^<]+)<\/title>/i);
  const description = grab(/<meta name="description" content="([^"]+)"/i) || grab(/<meta property="og:description" content="([^"]+)"/i);
  const image = grab(/<meta property="og:image" content="([^"]+)"/i);
  const date = grab(/<meta property="article:published_time" content="([^"]+)"/i);
  const bodyMatch = clean.match(/<article[\s\S]*?<\/article>/i) || clean.match(/<main[\s\S]*?<\/main>/i) || clean.match(/<body[\s\S]*?<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[0] : '';
  const paragraphs = Array.from(bodyHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi))
    .map(m => m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(p => p.length > 30);
  const images = Array.from(bodyHtml.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*(?:alt=["']([^"']*)["'])?/gi))
    .map(m => ({ src: m[1], alt: m[2] || '' }))
    .filter(i => !i.src.includes('data:') && !i.src.includes('logo'));
  const h2s = Array.from(bodyHtml.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)).map(m => m[1].replace(/<[^>]+>/g,'').trim()).filter(Boolean);
  return { url, slug: slugify(url), title, description, image, date, headings: h2s.slice(0, 20), paragraphs: paragraphs.slice(0, 80), images: images.slice(0, 30) };
};

const results = [];
for (const url of posts) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (research bot)' } });
    const html = await res.text();
    const data = extract(html, url);
    results.push(data);
    console.log('OK', data.slug, data.paragraphs.length, 'paragraphs');
  } catch (e) {
    console.error('FAIL', url, e.message);
  }
}

await mkdir('./posts', { recursive: true });
await writeFile('./posts-scraped.json', JSON.stringify(results, null, 2));
console.log('\nSaved', results.length, 'posts to posts-scraped.json');
