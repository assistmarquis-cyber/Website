// Copies the research agent's files into brain/feed/ so the site build can read them.
// The research agent keeps its own folder (research/, with its own checks). This runs before every
// build: if research/ exists it wins, otherwise the committed snapshot in brain/feed/ is used.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(root, 'research'), dst = path.join(root, 'brain/feed');
fs.mkdirSync(dst, { recursive: true });
let copied = 0;
for (const f of ['loops.json', 'library.json']) {
  const from = path.join(src, f);
  if (!fs.existsSync(from)) continue;
  JSON.parse(fs.readFileSync(from, 'utf8')); // refuse to copy a broken file
  fs.copyFileSync(from, path.join(dst, f)); copied++;
}
console.log(copied ? `research feed synced (${copied} files)` : 'research/ not found, using committed snapshot in brain/feed/');
