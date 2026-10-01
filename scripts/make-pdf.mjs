// Exports /one-sheet to public/marquis-harmon-speaker-one-sheet.pdf. Run: npm run build && npm run pdf
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const srv = spawn('npx', ['astro', 'preview', '--port', '4399'], { stdio: 'ignore' });
await new Promise((r) => setTimeout(r, 3000));
const b = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const p = await b.newPage();
await p.goto('http://localhost:4399/one-sheet/', { waitUntil: 'networkidle' });
await p.pdf({ path: 'public/marquis-harmon-speaker-one-sheet.pdf', format: 'Letter', printBackground: true, preferCSSPageSize: true });
await b.close(); srv.kill();
