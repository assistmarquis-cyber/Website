# Sales dashboard (/ops/sales/): what was tested, and what was not

Tested (all automated, `npm test`, `npm run security`, `node tests/ops-browser.mjs`):
- Login: constant-time password check, rejects wrong, empty, malformed, oversize and invalid-UTF-8 headers, refuses passwords under 12 characters, fails closed when SALES_PASSWORD is unset, rate limited, no-store, noindex. /portal now uses the same helper.
- Data stays in the browser: CSP connect-src 'none', zero network requests after loading a file, no cookies or storage, not in the sitemap.
- Hostile input: script and markup in names and notes show as text and never run; spreadsheet formulas are flagged and neutralized in the CSV export.
- KYC-lite and AML-lite rules (flag, never block): sanctioned-place mentions (OFAC list names), cash, crypto, gift cards, wires and third-party payers, amounts of $10,000 or more, active or closed leads with no identity or record, duplicates.
- Secret patterns scan, headers (HSTS, nosniff, frame-ancestors none), no leads.csv in the repo.

Not covered, and not claimed:
- This is not legal KYC or AML compliance. A coaching business that takes card payments through Stripe is normally not a regulated financial institution, and Stripe verifies the merchant and screens payments. Confirm with an accountant or lawyer.
- No live sanctions list lookup. Use https://sanctionssearch.ofac.treas.gov for any unfamiliar payer.
- No penetration test of Netlify itself, and the edge login has not been exercised on a live deploy (needs SALES_PASSWORD set in Netlify).
- npm audit still reports advisories in astro and sharp (build-time, not in the dashboard page). Upgrading Astro is a breaking change and belongs in its own PR.
