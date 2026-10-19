// Adds new YouTube uploads as Content entries. Never touches existing files.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
const FEED = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCFfjAtwWLSTo2oyn1TG-VQw';
const DIR = 'src/content/content';
const dec = (s) => s.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&amp;/g,'&');
const tag = (s, t) => { const m = s.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? dec(m[1]).trim() : ''; };
const res = await fetch(FEED);
if (!res.ok) throw new Error(`Feed fetch failed: ${res.status}`);
const xml = await res.text();
mkdirSync(DIR, { recursive: true });
const existing = readdirSync(DIR).map((f) => readFileSync(`${DIR}/${f}`, 'utf8')).join('\n');
let added = 0;
for (const entry of xml.split('<entry>').slice(1)) {
  const id = tag(entry, 'yt:videoId');
  if (!id) continue;
  const file = `${DIR}/${id}.md`;
  if (existsSync(file) || existing.includes(`watch?v=${id}`)) continue;
  const title = tag(entry, 'title').replace(/\\/g,'\\\\').replace(/"/g,'\\"');
  const date = tag(entry, 'published').slice(0, 10);
  const body = tag(entry, 'media:description');
  writeFileSync(file, `---\ntitle: "${title}"\ndate: ${date}\ntype: video\nyoutube: https://www.youtube.com/watch?v=${id}\n---\n${body}\n`);
  console.log('Added', id, title);
  added++;
}
console.log(`Done. ${added} new.`);
