# The brain

Everything that makes Alan *Marquis's* coach lives in this folder as plain files you own: JSON, Markdown and the code that reads them. Nothing here depends on one AI company.

| File | What it is |
|---|---|
| `frameworks.json` | The wants, offers, call-sheet times and Alan's lines, plus how each loop maps to a part of the mindset and to an offer. Edit this to change what Alan says. |
| `feed/` | The research agent's verified sources (`library.json`) and the negative-loop map with a strategy for each (`loops.json`). A copy synced from `research/` before every build. Refreshed daily by the research agent's pull requests. |
| `PHILOSOPHY.md` | Marquis's philosophy, in his words, with the gaps still to fill. |

## Owning it (IP portability)

- Your content, prompts, frameworks and code are in your repository, under your account. You can read, copy and move them any time.
- Alan calls an AI model only through one small function (`netlify/functions/alan.mjs`). Swapping providers means changing that one file, not rewriting the product. Nothing in the content files is specific to any model.
- Anthropic's commercial terms say customers own their outputs and that API inputs and outputs are not used to train its models by default. Terms change, and this is not legal advice, so have a lawyer confirm the current terms before you rely on it, and add a clear IP clause to any contract with clients and contributors.
- To protect the *brand and method* as IP (names such as G.O.D. Framework, the Pattern Audit, "Know your voice. Trust your instinct. Act fast."), talk to an IP attorney about trademark and copyright registration. Dating and keeping your source material in this repository is useful evidence of authorship.

## Review rule

AI can propose. A person approves. The research agent only adds a source with a verified link, and strategy wording stays "draft" until Marquis approves it. Alan never adds a research claim on his own.
