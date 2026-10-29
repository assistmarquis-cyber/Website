# Alan: security, privacy and audit readiness

Plain-language status for Marquis. Last updated 2026-10-29.

## The honest bottom line

Code can make Alan *hard to misuse, light on data and easy to audit*. Code cannot make it "HIPAA compliant" or "SOC 2 compliant" by itself, because both are about how an organization operates, not only what software does.

- **HIPAA** is a law. It applies to *covered entities* (providers, health plans) and their *business associates*. A coaching product usually is neither, but if Alan is ever offered through a clinic, an insurer or an employer health program, or if it handles health records, HIPAA can apply. That needs a lawyer to decide. Where it applies, you need Business Associate Agreements (BAAs) with every vendor that touches the data, including the AI provider and the host.
- **SOC 2** is an audit report written by an independent CPA firm about your company's controls. Type I checks the design at one date. Type II checks that controls operated over 3 to 12 months. It is not a federal requirement. The federal cloud program is **FedRAMP**, a much larger effort. No code change can "pass" SOC 2; code can make the evidence easier to produce.
- Until there are BAAs and a lawyer's opinion, Alan should keep telling people not to enter health records or identifiers, which it does.

## What the code does now

| Area | What is built | Where |
|---|---|---|
| Data minimization | No database, no accounts, no answer text stored or logged. Browser holds answers in memory only; closing the tab, pressing Wipe, or 15 idle minutes clears them. | `src/pages/alan.astro` |
| Identifier removal | Emails, links, phone, SSN, card, dates, labelled IDs (MRN, DOB, policy) and street addresses are replaced with `[removed]` in the browser, then again on the server, then the AI's reply is scrubbed too. Names in free text are **not** reliably caught. | `src/lib/safety.mjs` |
| Safety | Crisis language skips the AI, logs nothing about content, and shows 988 / 911 immediately. Visitors must tick that Alan is an AI, not a professional. | `safety.mjs`, `alan.astro` |
| Abuse resistance | Same-origin only, JSON only, 8 KB body cap, Netlify edge rate limit (20/min per IP), generic errors, request timeouts, prompt-injection instructions, output length caps. | `netlify/functions/alan.mjs` |
| Transport and browser hardening | HSTS, no-sniff, strict referrer and permissions policies sitewide. On `/alan` and `/partner`: Content-Security-Policy, no framing, no caching. | `netlify.toml` |
| Provenance | Every AI reply carries a request id, model, prompt version (hash of the exact instructions), policy version, build commit and time. The final card marks each line as "in your words", "suggested by Alan, chosen by you" or "started by Alan, edited by you", and exports a downloadable receipt with SHA-256 hashes. | `alan.mjs`, `alan.astro` |
| Audit trail | One signed (HMAC-SHA256) line per request: event, status, timing, model, versions, counts, hashed visit id. No content. A verifier flags bad signatures and any field that should not be there. | `alan.mjs`, `scripts/verify-audit.mjs` |
| Monitoring | Vector and Prometheus alert examples (error rate, latency, blocked origins, rate limiting, silence). **Untested.** | `ops/` |
| Change control | Tests for scrubbing, crisis routing, origin rules, no-content logging and signatures run in CI on every PR, with a build. All changes go through pull requests. | `tests/`, `.github/workflows/ci.yml` |

## What code cannot do (needs people, paper or vendors)

1. **BAAs.** Ask the AI provider and the host whether they offer a BAA and under what plan or data-retention terms. Do not describe Alan as HIPAA-ready until you have them.
2. **A lawyer's call** on whether HIPAA, state privacy laws (for example Washington's My Health My Data Act), or GDPR apply to your audience, and a privacy policy and terms for Alan that match what the code does. The site's current privacy page does not yet mention Alan's AI mode.
3. **A SOC 2 engagement.** Choose a readiness tool and auditor, define scope, run controls for the audit window.
4. **Org controls auditors ask for:** access reviews, MFA on GitHub, Netlify, Anthropic and email, onboarding and offboarding, written incident response and breach notification, vendor risk reviews, risk assessment, security training, backup and recovery, a data retention rule.
5. **Write-once log storage.** The signed lines only help if a copy lands somewhere nobody can edit (for example S3 with Object Lock). Not set up yet.
6. **Penetration test** by a third party before any launch that claims security.

## SOC 2 trust criteria, mapped

- **Security (CC6, CC7, CC8):** access is via GitHub and Netlify accounts (needs MFA and a reviewer rule); edge limits, CSP, origin checks (built); monitoring and alerts (examples written); change management through PRs and CI (built).
- **Confidentiality:** no content stored or logged (built); secrets only in Netlify environment variables (done, never in code).
- **Privacy:** minimization, notice, consent tick, deletion on demand by Wipe (built); policy text and retention rules (to write).
- **Availability:** hosted on Netlify with a written fallback when the AI is down (built); no uptime commitment or recovery plan documented.
- **Processing integrity:** seven-word outputs are validated by code, not trusted from the model (built).

## Known limits

- Rate limiting: the edge limit is the real control. There is also no per-visitor cost cap, so budget limits on the AI account matter.
- CSP still allows inline scripts (the site layout uses them). Tightening needs hashes or nonces.
- The shared site layout stores click coordinates in `sessionStorage` for page transitions (no answers). Cleared when the tab closes.
- Existing site dependencies (Astro, sharp) have known high and critical advisories (`npm audit`). They predate Alan and need an upgrade pass. CI reports them without blocking.
- Crisis detection is keyword-based and will miss some phrasing. It is a safety net, not clinical screening.
- Alan's replies are AI-generated and can be wrong or tone-deaf. Because no transcripts are kept, nobody can review real conversations, so test with people you trust before wide release.

## Launch checklist

1. Set `ANTHROPIC_API_KEY` and `AUDIT_HMAC_KEY` in Netlify. Set a spend limit on the AI account.
2. Turn on MFA everywhere. Restrict who can merge.
3. Decide: lawyer, BAAs, privacy policy and terms updated for Alan.
4. Send logs to write-once storage and stand up the monitoring in `ops/`.
5. Run `npm run audit:verify` on a sample export.
6. Third-party penetration test.
7. Then, and only then, consider a SOC 2 readiness assessment.
