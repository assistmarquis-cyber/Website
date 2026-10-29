// Static checks for the private areas. Run after `npm run build`: node scripts/security-check.mjs
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

let bad = 0;
const ok = (cond, msg) => { console.log(`${cond ? 'PASS' : 'FAIL'}  ${msg}`); if (!cond) bad++; };

const toml = readFileSync('netlify.toml', 'utf8');
const block = (path) => { const m = toml.match(new RegExp(`for = "${path.replace(/[/*.]/g, '\\$&')}"[\\s\\S]*?(?=\\n\\[\\[|$)`)); return m ? m[0] : ''; };
for (const p of ['/ops/*', '/alan/*']) {
  const b = block(p);
  ok(/connect-src '(none|self)'/.test(b), `${p}: CSP restricts connect-src`);
  ok(/frame-ancestors 'none'/.test(b) && /X-Frame-Options = "DENY"/.test(b), `${p}: cannot be framed`);
  ok(/Cache-Control = "no-store"/.test(b), `${p}: no-store`);
  ok(/form-action 'none'/.test(b) && /object-src 'none'/.test(b) && /base-uri 'none'/.test(b), `${p}: form-action, object-src, base-uri locked`);
}
ok(/connect-src 'none'/.test(block('/ops/*')), '/ops/*: page cannot send data anywhere (connect-src none)');
ok(!/unsafe-eval/.test(toml), 'no unsafe-eval anywhere');
ok(/Strict-Transport-Security/.test(toml) && /nosniff/.test(toml), 'HSTS and nosniff sitewide');

for (const f of ['ops-auth.ts', 'portal-auth.ts']) {
  const s = readFileSync(join('netlify/edge-functions', f), 'utf8');
  ok(/checkBasic/.test(s) && !/===\s*password/.test(s), `${f}: constant-time check, no plain === on the password`);
  ok(/rateLimit/.test(s), `${f}: rate limited`);
  ok(/no-store/.test(s), `${f}: no-store on responses`);
}
ok(/\/ops/.test(readFileSync('netlify/edge-functions/ops-auth.ts', 'utf8')), 'ops-auth covers /ops');

if (existsSync('dist/ops/sales/index.html')) {
  const h = readFileSync('dist/ops/sales/index.html', 'utf8');
  ok(/name="robots" content="noindex"/.test(h), 'built /ops/sales is noindex');
  const ext = [...h.matchAll(/(?:src|href|action)="(https?:)?\/\/[^"]+"/g)].map((m) => m[0]).filter((u) => !/schema\.org|bigpicturearchitect\.com/.test(u));
  ok(ext.length === 0, `built /ops/sales loads nothing from other hosts ${ext.join(' ')}`);
  ok(!/innerHTML|document\.write|eval\(/.test(h), 'inline code has no innerHTML, document.write or eval');
  const sm = existsSync('dist/sitemap-0.xml') ? readFileSync('dist/sitemap-0.xml', 'utf8') : '';
  ok(!/\/ops\//.test(sm), 'sitemap excludes /ops');
} else console.log('SKIP  build first (dist/ops/sales/index.html missing)');

// Secrets in tracked source (cheap pattern scan; use a real scanner in CI too)
const pats = [/sk-ant-[A-Za-z0-9_-]{20,}/, /AKIA[0-9A-Z]{16}/, /-----BEGIN [A-Z ]*PRIVATE KEY-----/, /ghp_[A-Za-z0-9]{30,}/, /sk_(live|test)_[A-Za-z0-9]{20,}/, /xox[bp]-[A-Za-z0-9-]{20,}/];
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return /node_modules|\.git$|dist|\.astro/.test(p) ? [] : statSync(p).isDirectory() ? walk(p) : [p]; });
const hits = walk('.').filter((p) => /\.(mjs|js|ts|astro|json|toml|md|yml|csv)$/.test(p)).filter((p) => { const t = readFileSync(p, 'utf8'); return pats.some((r) => r.test(t)); });
ok(hits.length === 0, `no secret patterns in source ${hits.join(' ')}`);
ok(!walk('.').some((p) => /(^|\/)leads\.csv$/.test(p)), 'no real leads.csv committed in the repo');

process.exit(bad ? 1 : 0);
