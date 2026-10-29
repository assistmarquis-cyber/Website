// Builds a day's draft content pack from Alan's brain files, for Marquis to approve and post.
// Usage: node scripts/content-pack.mjs [YYYY-MM-DD]   (prints Markdown)
// It uses only the research feed and brain/frameworks.json. It invents no story, stat or quote:
// the [brackets] are places for Marquis's real moments. Voice rules: open with a question or contrast,
// short lines, one human detail, end with a question anyone can answer in a line, one link, no em-dashes.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

export function pack(dateStr = new Date().toISOString().slice(0, 10)) {
  const fw = read('brain/frameworks.json'), loops = read('brain/feed/loops.json'), lib = read('brain/feed/library.json');
  const day = Math.floor(Date.parse(dateStr + 'T00:00:00Z') / 86400000);
  const loop = loops.loops[day % loops.loops.length];
  const h = fw.hooks[loop.id], ev = lib.entries.find((e) => e.id === loop.evidence[0]);
  const part = loops.mindsetArchitecture.find((p) => p.id === fw.loopPart[loop.id]);
  return `# Alan content pack, ${dateStr} (DRAFT, needs Marquis's OK)

Loop of the day: **${loop.name}**. ${loop.plain}
Sits in: ${part?.name}. G.O.D. role: ${loop.strategy.god}.

## 30 second reel or TikTok (talk to camera)

1. HOOK (first 2 seconds, also the on-screen text): "${h.hook}"
2. THE LOOP (5 seconds): "${loop.plain}"
3. YOUR MOMENT (8 seconds): ${h.story}
4. THE MOVE (10 seconds): "${loop.strategy.move}"
5. THE ASK (3 seconds): "What is the one you keep running?"
6. LINK: ${fw.cta}

Shot idea: one still from the gallery as the backdrop, slate in the corner: "Loop of the day: ${loop.name}".

## Caption

${h.hook}

${loop.plain}

The move: ${loop.strategy.move}

${fw.cta}

## The poster (static, one tap in the app: "Save this as a poster")

${loop.name}
${loop.plain}
${loop.strategy.move}

## What the research says, and its limit (keep this honest if asked)

${ev ? `${ev.finding}\nLimit: ${ev.caveat}\nSource: ${ev.citation} ${ev.verifiedUrl}` : 'No source linked yet. Do not post research claims for this loop until one is verified.'}

## Rules for this post

- Marquis reads it and fills the [bracket] with a real moment, or cuts that line.
- No income claims, no guarantees, no fake scarcity or deadlines.
- If the loop is rumination, add: "If this feels heavy or constant, talk to a doctor or therapist."
`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) process.stdout.write(pack(process.argv[2]));
