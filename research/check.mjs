// Guardrail against fabricated research. Run: node research/check.mjs
import { readFileSync } from 'node:fs';
const lib = JSON.parse(readFileSync(new URL('./library.json', import.meta.url)));
const loops = JSON.parse(readFileSync(new URL('./loops.json', import.meta.url)));
const need = ['id', 'citation', 'year', 'verifiedUrl', 'verifiedOn', 'topics', 'design', 'evidence', 'finding', 'caveat', 'loops', 'maps'];
const errs = [];
const ids = new Set();
for (const e of lib.entries) {
  for (const k of need) if (e[k] === undefined || e[k] === '') errs.push(`${e.id || '?'}: missing ${k}`);
  if (ids.has(e.id)) errs.push(`${e.id}: duplicate id`);
  ids.add(e.id);
  if (!/^https:\/\//.test(e.verifiedUrl || '')) errs.push(`${e.id}: verifiedUrl must be https`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.verifiedOn || '')) errs.push(`${e.id}: verifiedOn must be YYYY-MM-DD`);
}
for (const l of loops.loops) for (const id of l.evidence) if (!ids.has(id)) errs.push(`loop ${l.id}: unknown evidence ${id}`);
if (errs.length) { console.error(errs.join('\n')); process.exit(1); }
console.log(`OK: ${lib.entries.length} sources, ${loops.loops.length} loops`);
