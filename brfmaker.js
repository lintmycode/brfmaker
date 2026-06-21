#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { marked } from 'marked';

// ── helpers ──────────────────────────────────────────────────────────────────

const esc = s =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const die = msg => { console.error(msg); process.exit(1); };

const flag = (f) => {
  const i = process.argv.indexOf(f);
  return i !== -1 ? process.argv[i + 1] : null;
};

// ── CLI ───────────────────────────────────────────────────────────────────────

const inputDir   = flag('-i') ?? die('Usage: node brfmaker.js -i <input_dir> -o <output_file>');
const tripName   = `Briefing ${inputDir.split('/').filter(Boolean).pop().toUpperCase()}`;
const outputFile = flag('-o') ?? die('Usage: node brfmaker.js -i <input_dir> -o <output_file>');

// ── collect .md files ─────────────────────────────────────────────────────────

let files;
try { files = readdirSync(inputDir).filter(f => /^\d{2}-.*\.md$/.test(f)).sort(); }
catch { die(`Cannot read directory: ${inputDir}`); }
if (!files.length) die(`No .md files found in ${inputDir}`);

// ── mismatch check against 00-index.md ───────────────────────────────────────

if (files.includes('00-index.md')) {
  const indexMd = readFileSync(join(inputDir, '00-index.md'), 'utf8');
  const inIndex = new Set(
    [...indexMd.matchAll(/`(\d{2}-[^`]+\.md)`/g)].map(m => m[1])
  );
  inIndex.delete('00-index.md');

  const inDir = new Set(files.filter(f => f !== '00-index.md'));
  const missing = [...inIndex].filter(f => !inDir.has(f));
  const extra   = [...inDir].filter(f => !inIndex.has(f));

  if (missing.length) {
    process.stderr.write('\nWARNING — referenced in index but missing from input dir:\n');
    missing.forEach(f => process.stderr.write(`  ✗  ${f}\n`));
  }
  if (extra.length) {
    process.stderr.write('\nWARNING — present in input dir but not referenced in index:\n');
    extra.forEach(f => process.stderr.write(`  +  ${f}\n`));
  }
  if (missing.length || extra.length) process.stderr.write('\n');
}

// ── process articles ──────────────────────────────────────────────────────────

marked.use({ gfm: true });

const articles = files.map((filename, idx) => {
  const md       = readFileSync(join(inputDir, filename), 'utf8');
  const m        = md.match(/^#\s+(.+)$/m);
  const rawTitle = m ? m[1].replace(/[*_`]/g, '').trim() : filename.replace(/\.md$/, '');
  const prefix   = filename.match(/^(\d+)/)?.[1] ?? '';
  const title    = prefix ? `${prefix} · ${rawTitle}` : rawTitle;
  return { idx, filename, title, html: marked.parse(md) };
});

// ── embed external images as base64 ──────────────────────────────────────────
// Edge (and other browsers) block external img loads from file:// pages.
// Fetching and embedding as data URIs makes the file fully self-contained
// and works offline.

const imgPattern = /src="(https?:\/\/[^"]+)"/g;

const allImgUrls = new Set();
for (const a of articles) {
  for (const [, url] of a.html.matchAll(imgPattern)) allImgUrls.add(url);
}

if (allImgUrls.size) {
  process.stdout.write(`Embedding ${allImgUrls.size} image(s)…`);
  const embedded = await Promise.all([...allImgUrls].map(async url => {
    try {
      // Request thumbnail size for Wikimedia images to avoid embedding full-res files
      const fetchUrl = url.includes('commons.wikimedia.org/wiki/Special:FilePath/')
        ? url + (url.includes('?') ? '&' : '?') + 'width=900'
        : url;
      const res  = await fetch(fetchUrl, {
        redirect: 'follow',
        signal: AbortSignal.timeout(15000),
        headers: { 'User-Agent': 'brfmaker/1.0 (field briefing builder; contact@borealis.travel)' },
      });
      const mime = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg';
      if (!mime.startsWith('image/')) throw new Error(`unexpected content-type: ${mime}`);
      const buf  = Buffer.from(await res.arrayBuffer());
      return [url, `data:${mime};base64,${buf.toString('base64')}`];
    } catch (e) {
      process.stderr.write(`\n  ✗ ${url} (${e.message})`);
      return [url, url];
    }
  }));
  const embedMap = Object.fromEntries(embedded);
  for (const a of articles) {
    a.html = a.html.replace(imgPattern, (_, url) => `src="${embedMap[url] ?? url}"`);
  }
  console.log(` done.`);
}

console.log(`Building ${outputFile} — ${articles.length} articles from ${inputDir}…`);

// ── app icon ─────────────────────────────────────────────────────────────────
// Prefer OG image URL from program URL in 00-index.md (works as real URL on iOS).
// Falls back to local app.png/app.jpg embedded as base64 (limited iOS support).

let appIconTag = '';

const indexPath = join(inputDir, '00-index.md');
if (existsSync(indexPath)) {
  const indexMd = readFileSync(indexPath, 'utf8');
  const urlMatch = indexMd.match(/\((https?:\/\/[^)]+)\)/);
  if (urlMatch) {
    const programUrl = urlMatch[1];
    try {
      const res  = await fetch(programUrl, { signal: AbortSignal.timeout(6000) });
      const html = await res.text();
      const og   = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
                ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
      if (og) {
        appIconTag = `\n  <link rel="apple-touch-icon" href="${og[1]}">`;
        console.log(`✓ App icon → og:image from ${programUrl}`);
      } else {
        console.warn(`  No og:image found at ${programUrl}`);
      }
    } catch (e) {
      console.warn(`  Could not fetch OG image (${e.message}) — skipping icon`);
    }
  }
}


// ── CSS ───────────────────────────────────────────────────────────────────────

const CSS = `
:root {
  color-scheme: light dark;
  --bg:      #f2f5ee;
  --surface: #e4ede0;
  --border:  #c0d0b8;
  --text:    #1c2e1c;
  --text2:   #4e6650;
  --accent:  #2d6a2d;
  --link:    #6a3d8a;
  --code-bg: #dce8d4;
  --bar-bg:  rgba(228, 237, 224, 0.75);
  --bar-h:   calc(52px + env(safe-area-inset-top, 0px));
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    --bg:      #0c150c;
    --surface: #142014;
    --border:  #2a3e2a;
    --text:    #c8dcc8;
    --text2:   #7a9c7a;
    --accent:  #6abf6a;
    --link:    #b07ad0;
    --code-bg: #142014;
    --bar-bg:  rgba(20, 32, 20, 0.75);
  }
}
:root[data-theme="dark"] {
  color-scheme: dark;
  --bg:      #0c150c;
  --surface: #142014;
  --border:  #2a3e2a;
  --text:    #c8dcc8;
  --text2:   #7a9c7a;
  --accent:  #6abf6a;
  --link:    #b07ad0;
  --code-bg: #142014;
  --bar-bg:  rgba(20, 32, 20, 0.75);
}
:root[data-theme="light"] {
  color-scheme: light;
  --bg:      #f2f5ee;
  --surface: #e4ede0;
  --border:  #c0d0b8;
  --text:    #1c2e1c;
  --text2:   #4e6650;
  --accent:  #2d6a2d;
  --link:    #6a3d8a;
  --code-bg: #dce8d4;
  --bar-bg:  rgba(228, 237, 224, 0.75);
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow: hidden; }
body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-weight: 300;
  font-size: clamp(16px, 4vw, 19px);
  line-height: 1.75;
  -webkit-font-smoothing: antialiased;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

/* ── status bar ── */
#bar {
  position: fixed; inset: 0 0 auto 0;
  height: var(--bar-h);
  padding-top: env(safe-area-inset-top, 0px);
  padding-left:  max(6px, env(safe-area-inset-left, 0px));
  padding-right: max(6px, env(safe-area-inset-right, 0px));
  display: flex; align-items: center; gap: 2px;
  background: var(--bar-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid var(--border);
  z-index: 100;
}
#bar button {
  flex-shrink: 0;
  -webkit-appearance: none; appearance: none;
  background: transparent; border: none;
  color: var(--text);
  font-size: 13px; line-height: 1;
  min-width: 44px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
#bar button:active { background: var(--border); }
#bar-title {
  flex: 1; gap: 8px;
  text-align: left; justify-content: flex-start !important; padding: 0;
  -webkit-appearance: none; appearance: none;
  background: transparent; border: none;
  height: 44px; border-radius: 8px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
#bar-title:active { background: var(--border); }
#bar-title-text {
  overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 400;
  color: var(--text);
}
#bar-title-icon {
  display: flex; align-items: center; justify-content: center;
  width: 40px; flex-shrink: 0;
}
/* ── content ── */
#main {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  transition: opacity 0.08s ease;
}
#main.fade-out { opacity: 0; }
article {
  display: none;
  max-width: 68ch;
  margin: 0 auto;
  padding: 28px 20px 80px;
  padding-top: calc(var(--bar-h) + 16px);
}
article.visible { display: block; }
@media (min-width: 600px) { article { padding: 40px 32px 100px; padding-top: calc(var(--bar-h) + 24px); } }

/* ── typography ── */
article h1 {
  font-size: 1.55em; line-height: 1.25;
  font-weight: 700; color: var(--accent);
  margin-bottom: 0.25em;
}
article h2 { font-size: 1.15em; font-weight: 700; margin: 2em 0 0.4em; }
article h3 { font-size: 1em;    font-weight: 700; margin: 1.6em 0 0.3em; }
article p  { margin-bottom: 0.9em; }
article ul, article ol { margin: 0.4em 0 0.9em 1.5em; }
article li { margin-bottom: 0.25em; }
article a  { color: var(--link); text-decoration: underline; text-underline-offset: 2px; }
article hr { border: none; border-top: 1px solid var(--border); margin: 1.8em 0; }
article strong { font-weight: 700; }
article em     { font-style: italic; }
article blockquote {
  border-left: 3px solid var(--accent);
  margin: 1em 0; padding: 0.25em 0 0.25em 1em;
  color: var(--text2); font-style: italic;
}
article img {
  max-width: 100%; height: auto;
  display: block; margin: 1.5em auto;
  border-radius: 4px;
  max-height: 500px;
}
article code {
  font-family: 'Menlo', Monaco, 'Courier New', monospace;
  font-size: 0.85em;
  background: var(--code-bg);
  padding: 0.1em 0.35em; border-radius: 3px;
}
article pre {
  background: var(--code-bg);
  border-radius: 6px; padding: 1em;
  overflow-x: auto; margin: 1em 0;
}
article pre code { background: none; padding: 0; font-size: 0.82em; line-height: 1.6; }
article table   { width: 100%; border-collapse: collapse; margin: 1.2em 0; font-size: 0.88em; }
article th, article td {
  border: 1px solid var(--border);
  padding: 0.45em 0.65em; text-align: left; vertical-align: top;
}
article th { background: var(--surface); font-weight: 700; }

/* ── toc overlay ── */
#toc-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200; display: flex;
}
#toc-overlay[hidden] { display: none; }
#toc-panel {
  background: var(--bg);
  width: min(500px, 84vw);
  display: flex; flex-direction: column;
  box-shadow: 4px 0 24px rgba(0,0,0,0.3);
  padding-top: env(safe-area-inset-top, 0px);
  letter-spacing: 0.02em;
}
#btn-toc-close {
  -webkit-appearance: none; appearance: none;
  background: transparent; border: none;
  color: var(--text2); font-size: 18px;
  min-width: 44px; height: 44px;
  display: flex; align-items: center; justify-content: center;
  align-self: flex-start;
  border-radius: 8px; margin: 4px 4px 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
#btn-toc-close:active { background: var(--border); }
#toc-list {
  list-style: none;
  overflow-y: auto; -webkit-overflow-scrolling: touch;
  flex: 1;
}
#toc-list li button {
  -webkit-appearance: none; appearance: none;
  background: transparent; border: none;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  display: block; width: 100%;
  padding: 14px 20px;
  text-align: left; line-height: 1.4;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  font-size: 14px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
}
#toc-list li button:active  { background: var(--surface); }
#toc-list li button.active  { background: var(--surface); color: var(--accent); font-weight: 600; }
`.trim();

// ── icons (Lucide, inline SVG) ────────────────────────────────────────────────

const S = 'xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
const ICO_LIST  = `<svg ${S}><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg>`;
const ICO_SUN   = `<svg ${S}><circle cx="12" cy="12" r="4"/><path d="M12 3v1"/><path d="M12 20v1"/><path d="M3 12h1"/><path d="M20 12h1"/><path d="m18.364 5.636-.707.707"/><path d="m6.343 17.657-.707.707"/><path d="m5.636 5.636.707.707"/><path d="m17.657 17.657.707.707"/></svg>`;
const ICO_MOON  = `<svg ${S}><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></svg>`;
const ICO_PREV  = `<svg ${S}><path d="m15 18-6-6 6-6"/></svg>`;
const ICO_NEXT  = `<svg ${S}><path d="m9 18 6-6-6-6"/></svg>`;
const ICO_CLOSE = `<svg ${S}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

// ── JS (inlined into output HTML) ─────────────────────────────────────────────

const JS = `
const meta = __META__;
const KEY       = 'briefings_current';
const THEME_KEY = 'briefings_theme';

(function initTheme() {
  const root   = document.documentElement;
  const btn    = document.getElementById('btn-theme');
  const saved  = localStorage.getItem(THEME_KEY);
  const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  const SVG_SUN  = '${ICO_SUN}';
  const SVG_MOON = '${ICO_MOON}';

  function applyTheme(dark) {
    root.setAttribute('data-theme', dark ? 'dark' : 'light');
    btn.innerHTML = dark ? SVG_SUN : SVG_MOON;
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
  }

  applyTheme(isDark);
  btn.addEventListener('click', () => applyTheme(root.getAttribute('data-theme') !== 'dark'));
})();

const elMain  = document.getElementById('main');
const elTitle = document.getElementById('bar-title-text');
const elToc   = document.getElementById('toc-overlay');
const arts    = elMain.querySelectorAll('article');
const tocBtns = document.querySelectorAll('#toc-list li button');

let cur = parseInt(localStorage.getItem(KEY) || '0', 10);
if (!Number.isFinite(cur) || cur < 0 || cur >= meta.length) cur = 0;

function show(idx) {
  arts.forEach((a, i) => a.classList.toggle('visible', i === idx));
  tocBtns.forEach((b, i) => b.classList.toggle('active', i === idx));
  elTitle.textContent = meta[idx].t;
  document.title = meta[idx].t;
  elMain.scrollTo(0, 0);
  cur = idx;
  try { localStorage.setItem(KEY, cur); } catch (_) {}
}

function go(d) {
  elMain.classList.add('fade-out');
  setTimeout(() => {
    show((cur + d + meta.length) % meta.length);
    elMain.classList.remove('fade-out');
  }, 80);
}

show(cur);

document.getElementById('btn-prev').onclick = () => go(-1);
document.getElementById('btn-next').onclick = () => go(1);

const openToc = () => {
  elToc.hidden = false;
  const active = elToc.querySelector('button.active');
  if (active) setTimeout(() => active.scrollIntoView({ block: 'nearest' }), 0);
};
document.getElementById('bar-title').onclick = openToc;
document.getElementById('btn-toc-close').onclick = () => { elToc.hidden = true; };
elToc.addEventListener('click', e => { if (e.target === elToc) elToc.hidden = true; });
document.getElementById('toc-list').addEventListener('click', e => {
  const b = e.target.closest('[data-idx]');
  if (!b) return;
  elToc.hidden = true;
  show(parseInt(b.dataset.idx, 10));
});

let tx = 0, ty = 0;
elMain.addEventListener('touchstart', e => {
  tx = e.touches[0].clientX;
  ty = e.touches[0].clientY;
}, { passive: true });
elMain.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - tx;
  const dy = e.changedTouches[0].clientY - ty;
  if (Math.abs(dx) >= 50 && Math.abs(dy) <= 100) go(dx > 0 ? -1 : 1);
}, { passive: true });

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft')  go(-1);
  if (e.key === 'ArrowRight') go(1);
});
`.trim();

// ── assemble HTML ─────────────────────────────────────────────────────────────

const metaJson = JSON.stringify(articles.map(a => ({ f: a.filename, t: a.title })));
const inlineJs = JS.replace('__META__', metaJson);

const tocItems = articles
  .map(a => `        <li><button data-idx="${a.idx}">${esc(a.title)}</button></li>`)
  .join('\n');

const articleBlocks = articles
  .map(a => `    <article data-id="${a.idx}">\n${a.html}    </article>`)
  .join('\n');

const output = `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="${tripName}">
  <title>${esc(articles[0]?.title ?? 'Briefings')}</title>${appIconTag}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
${CSS}
  </style>
</head>
<body>
  <header id="bar">
    <button id="bar-title" aria-label="Índice"><span id="bar-title-icon">${ICO_LIST}</span><span id="bar-title-text"></span></button>
    <button id="btn-theme" aria-label="Alternar tema">${ICO_MOON}</button>
    <button id="btn-prev" aria-label="Anterior">${ICO_PREV}</button>
    <button id="btn-next" aria-label="Seguinte">${ICO_NEXT}</button>
  </header>

  <div id="toc-overlay" hidden>
    <div id="toc-panel">
      <button id="btn-toc-close" aria-label="Fechar">${ICO_CLOSE}</button>
      <ul id="toc-list">
${tocItems}
      </ul>
    </div>
  </div>

  <main id="main">
${articleBlocks}
  </main>

  <script>
${inlineJs}
  </script>
</body>
</html>`;

// ── write output ──────────────────────────────────────────────────────────────

mkdirSync(dirname(outputFile) || '.', { recursive: true });
writeFileSync(outputFile, output, 'utf8');
const kb = (output.length / 1024).toFixed(1);
console.log(`✓ Done — ${articles.length} articles, ${kb} KB → ${outputFile}`);
