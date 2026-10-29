// Browser test for /ops/sales: serves dist/ with the real /ops CSP from netlify.toml,
// loads a hostile CSV, and checks nothing executes, nothing is sent, and the CSP is not violated.
// Run: npm run build && node tests/ops-browser.mjs [path-to-extra-csv-for-screenshot]
import http from 'node:http';
import { readFileSync, existsSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const csp = readFileSync('netlify.toml', 'utf8').match(/for = "\/ops\/\*"[\s\S]*?Content-Security-Policy = "([^"]+)"/)[1];
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const server = http.createServer((req, res) => {
  let p = join('dist', decodeURIComponent(req.url.split('?')[0]));
  if (!extname(p)) p = join(p, 'index.html');
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(p)] || 'application/octet-stream', 'content-security-policy': csp });
  res.end(readFileSync(p));
}).listen(0);
const base = `http://127.0.0.1:${server.address().port}`;

let bad = 0;
const ok = (c, m) => { console.log(`${c ? 'PASS' : 'FAIL'}  ${m}`); if (!c) bad++; };

const hostile = [
  'id,org_or_name,stage,next_action,next_action_date,notes,url,contact_route',
  '1,"<img src=x onerror=window.__pwned=1>",contacted,"<script>window.__pwned=2</script>",2020-01-01,"</td><svg onload=window.__pwned=3>",https://a.example,x',
  '2,"=cmd|\' /C calc\'!A0",closed,none,,"Paid $15000 in bitcoin",,',
  '3,Tehran Co,researched,send,2020-01-02,Iran,https://a.ir,',
].join('\n');
const dir = mkdtempSync(join(tmpdir(), 'ops-'));
writeFileSync(join(dir, 'h.csv'), hostile);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1100, height: 1400 } });
const reqs = [], cspErrors = [], dialogs = [];
page.on('request', (r) => reqs.push(r.url()));
page.on('console', (m) => { if (/Content Security Policy|violat/i.test(m.text())) cspErrors.push(m.text()); });
page.on('dialog', (d) => { dialogs.push(d.message()); d.dismiss(); });

await page.goto(`${base}/ops/sales/`);
const loadReqs = reqs.length;
await page.setInputFiles('#file', join(dir, 'h.csv'));
await page.waitForSelector('#out:not([hidden])');
await page.fill('#cash', '1000');
await page.waitForTimeout(300);

ok(await page.evaluate(() => !window.__pwned), 'hostile names/notes do not execute (no XSS)');
ok(dialogs.length === 0, 'no dialogs');
ok(await page.locator('#due tbody img, #due tbody script, #flags tbody svg').count() === 0, 'hostile markup rendered as text, not elements');
ok((await page.locator('#due tbody').innerText()).includes('<img src=x'), 'hostile text is shown literally');
ok(reqs.length === loadReqs, `no network requests after file load (${reqs.length - loadReqs} new)`);
ok(reqs.every((u) => u.startsWith(base)), 'every request is same-origin');
ok(cspErrors.length === 0, `no CSP violations ${cspErrors.join(' | ')}`);
const flagText = await page.locator('#flags tbody').innerText();
ok(/formula-cell/.test(flagText) && /sanctions-screen/.test(flagText) && /large-amount/.test(flagText) && /payment-method/.test(flagText), 'hostile file raises formula, sanctions, large-amount and payment flags');

const dl = page.waitForEvent('download');
await page.click('#dl');
const csvOut = readFileSync(await (await dl).path(), 'utf8');
ok(!csvOut.split('\n').slice(1).some((l) => /^[^,]*,[=+\-@]/.test(l)), 'exported CSV has no live formulas');

await page.setInputFiles('#file', { name: 'x.csv', mimeType: 'text/csv', buffer: Buffer.from('a,b\n1,2') });
await page.waitForTimeout(200);
ok(/does not look like leads/.test(await page.locator('#msg').innerText()), 'wrong file type is refused politely');

writeFileSync(join(dir, 'p.csv'), readFileSync('tests/fixtures/payments-synthetic.csv', 'utf8') + '7,2026-10-23,5,0,usd,Paid,"<img src=x onerror=window.__pwned=9>",x@y.com,\n');
await page.setInputFiles('#pfile', join(dir, 'p.csv'));
await page.waitForSelector('#sales:not([hidden])');
ok(/Pattern Audit/.test(await page.locator('#offers').innerText()) && /\$13,593/.test(await page.locator('#stiles').innerText()), 'payments ledger shows offers and net totals');
ok(await page.evaluate(() => !window.__pwned) && await page.locator('#sales img').count() === 0, 'hostile payment description is text, not code');
ok(reqs.every((u) => u.startsWith(base)), 'payments load: still same-origin only');

const real = process.argv[2];
if (real) {
  await page.setInputFiles('#file', real);
  await page.fill('#cash', '0');
  await page.waitForTimeout(400);
  await page.screenshot({ path: process.argv[3] || 'sales-dashboard.png', fullPage: true });
  ok(reqs.every((u) => u.startsWith(base)), 'real data load: still same-origin only');
}
await browser.close(); server.close();
process.exit(bad ? 1 : 0);
