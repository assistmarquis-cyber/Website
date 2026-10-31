# Alan research agent: daily run instructions

Purpose: keep an evidence base on cognitive function, behavioral health, mental well-being and the architecture of an effective mindset, and map it to Marquis's frameworks so the Alan portal can use it. It is Marquis's own file set. Nothing here depends on any vendor, so the work can move to another tool or model unchanged.

## The three questions every entry serves
1. What makes up a mindset? (`loops.json` > `mindsetArchitecture`)
2. What negative loops keep people stuck? (`loops.json` > `loops`)
3. Which of Marquis's tools gets a person past the gap between what they say they want, who they want to become, and what they actually do? (`maps` on each entry and `strategy` on each loop)

## Daily steps
1. Read `library.json`, `loops.json`, `frameworks.md` and `queue.md`.
2. Take up to 3 items from `queue.md`. Search for the real paper (peer-reviewed, preprints only if labeled). Prefer meta-analyses, preregistered replications, large RCTs and reviews over single small studies.
3. For each, confirm the paper exists by finding a page for it (PubMed, publisher, university repository) and open or read enough to state what it found. Add `verifiedUrl` and `verifiedOn`.
4. Add it to `library.json` with a plain-language `finding`, an honest `evidence` grade and a `caveat`. If a classic effect failed to replicate, say so and use grade `contested`.
5. Link the entry to a loop and a pillar, tool and G.O.D. role. If it shows a new loop, add one to `loops.json`. Strategy wording is a draft until Marquis approves it.
6. Run `node research/check.mjs`. It must print OK.
7. Write `digests/YYYY-MM-DD.md`: what was added, what changed, anything that now looks weaker, and one suggested tweak for the portal. Rotate: move done items from `queue.md` to the digest.
8. Commit to the research branch, open or update a PR, and post the digest link in the thread.

## Hard rules
- No fabricated studies, authors, DOIs, sample sizes or quotes. If you cannot confirm it, it goes in `queue.md` as unverified, not in the library.
- Say what a study found, not what it would be nice if it found. Always fill `caveat`.
- Coaching, not therapy. Rumination and similar entries carry a refer-out note. No diagnosis or treatment claims, no guarantee of results.
- Avoid pop-science claims already debunked (21 days to a habit, willpower as a depleting tank, learning styles).
- Marquis finds slogan lines corny. Strategies use plain, specific wording and his real examples, not generic motivational copy.
- Do not put client data or private story details in this folder.

## Outputs the Alan app reads
`library.json` and `loops.json`. Keep their shape stable. Add fields, never rename.
