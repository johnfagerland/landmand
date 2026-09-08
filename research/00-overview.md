# 00 — Overview, scope, method and recommendation

*Research date: 8 September 2026 (version 2). Version 1, dated 6 September, assumed a Nordic-based founder; the founder has since said the market is most likely the United States and the list must hold regardless of location. This version rewrites all 50 ideas for a US-first buyer with global applicability noted, and replaces seven ideas that only existed because of EU or Nordic regulation. Version 1 remains in the git history.*

## 1. What this research is for

You asked for deep research on a new SaaS product you could build yourself, with 50 ideas, each covering the problem, who has it, the value of solving it, competitors, pricing models, the path to profitability, where AI can be used to build it, and what it takes to reach an MVP. This document set answers that. It is written for one person deciding what to build next, not for investors.

## 2. What we are doing and what we are not doing

**We are doing**

- Generating 50 distinct product ideas that one developer can plausibly build to a paying MVP in 4–16 weeks of focused work with AI coding assistance.
- Treating the United States as the primary market: US regulation, US buyer counts (Census, BLS, IRS, trade associations), US competitors with published US prices, and US distribution channels. Where a product is global by nature (developer tools, most marketing tools) we say so; where an EU or UK rule matters for a US company that exports, it gets one line.
- Researching each idea against the same nine-part template so they can be compared, with a URL for every fact we could source.
- Scoring every idea on six criteria and ranking them, then recommending a shortlist of five and one primary pick.
- Describing the reference stack, the concrete ways AI is used in the *build* (not just in the product), the running costs at 0, 100 and 1,000 customers, and a generic MVP playbook.

**Seven ideas were replaced between version 1 and version 2** because they only existed because of an EU or Nordic law: the EU whistleblower channel, Danish working-time registration, EU e-invoicing, VSME sustainability reporting, a Nordic cap table, a Nordic-language phone receptionist, and Nordic forest-owner management. Their replacements are US-regulation-driven: product compliance for small consumer brands (Prop 65, MoCRA), the IRS written-information-security-plan rule for tax preparers, CMMC readiness for small defense subcontractors, the HIPAA Security Rule for small practices, sales-tax exemption certificate management, business licence and permit renewals, and FSMA 204 food traceability. The other 43 keep their numbers and are reframed for a US buyer.

**We are not doing**

- Building anything. No code, prototypes, or landing pages are in this repository.
- Customer interviews or surveys. All demand evidence is secondary (regulator sites, pricing pages, statistics offices, founder revenue posts, review sites). Every shortlisted idea needs 10–20 real conversations before code is written.
- Legal advice. Regulatory dates, thresholds and penalties are quoted from official sources where we found them, but a lawyer or accountant should confirm anything that gates a launch (HIPAA business-associate obligations, TCPA consent, state licensing, sales-tax nexus).
- Consumer apps, marketplaces that need two-sided liquidity, hardware, or anything requiring a licence a single person cannot get (banking, insurance carrier, medical device Class II+). These are excluded on principle because they are not solo-buildable to profitability.
- Ideas that depend on beating a well-funded horizontal incumbent on its core feature. Where a category is crowded we say so, and we only keep the idea if there is a defensible wedge (a regulation, a data source, a segment or a workflow the incumbents ignore).
- Financial projections beyond simple unit economics. We give the numbers needed to sanity-check a path to $5k and $10k MRR; we do not build a five-year model.

## 3. Method

1. **Ideation.** We started from four sources of demand: (a) US federal and state regulation with 2025–2028 deadlines that forces small organisations to buy software, (b) niches where incumbents are enterprise-priced or pre-AI, (c) workflows where large language models turn a data-entry chore into a review step, and (d) segments close to the founder's stated interests (this repository is named after farming, so agriculture keeps a cluster). We generated ~80 candidates, removed duplicates and anything failing the exclusions above, and kept 50.
2. **Research.** Six parallel research passes (one per cluster) plus one cross-cutting pass, each running web searches and fetching pricing and regulator pages directly. Version 2 reused the competitor pricing already gathered in version 1 (most competitors are US products) and spent its budget on US evidence. Facts without a source are labelled as estimates.
3. **Scoring.** Each idea is scored 1–5 on six criteria (below), summed to a score out of 30. Scores are judgement calls informed by the research, not measurements; they are there to make the ranking arguable.
4. **Synthesis.** A per-idea write-up in the shared template, a scorecard, a shortlist, and a recommendation.

## 4. Scoring framework

| Criterion | 1 | 5 |
|---|---|---|
| **Pain & urgency** | Nice-to-have; nobody is fined, sued or losing money without it | A legal deadline, an audit, a lawsuit risk, or a direct revenue loss forces a purchase this year |
| **Solo-buildability** | Needs certification, hardware, field sales, or many deep integrations | A CRUD app plus one or two APIs and an LLM; no gatekeeper |
| **AI leverage** | AI is a chatbot bolted on | AI removes the main labour cost of the workflow or makes the product possible at all |
| **Competitive gap** | Several funded, AI-native competitors already sell to the same segment at the same price | Incumbents are enterprise-priced, pre-AI, or absent from the segment |
| **Willingness to pay** | Under $15/month and price-sensitive | $100+/month with a clear ROI story, or per-unit pricing that scales with the customer |
| **Reachability** | Buyers are hard to identify or need field sales | Buyers cluster in public registers, licensing boards, associations, marketplaces, or communities a solo founder can reach with SEO and email |

## 5. Assumptions used in every "path to profitability"

- Fixed monthly cost of running a small SaaS: about $150–400 at launch (hosting, database, email, domain, error tracking, LLM usage), rising to roughly $800–2,000 at 1,000 customers. See [07-building-with-ai.md](07-building-with-ai.md) for the itemised stack.
- Payment processing via Stripe (about 2.9% + 30¢ plus Stripe Tax) for a US-based seller, or a merchant of record (Paddle, Lemon Squeezy, Polar) at roughly 4–5% + fixed fee if the founder is outside the US or wants sales tax handled.
- Milestones: **break-even** at ~$1k MRR, **ramen-profitable** at $5k MRR, **full-time replacement** at $10k MRR. For each idea we show customers needed at its realistic ARPU to hit $5k and $10k MRR.
- Churn for SMB SaaS of 3–5% per month unless the product holds compliance records (then 1–2%). This matters: at 5% monthly churn you must add 50 customers a month just to hold 1,000.
- Founder time is free in year one; the goal is to reach $5k MRR within 12 months of launch.

## 6. What the research found

Six patterns hold across all 50 ideas and should shape whatever you pick.

1. **Regulation beats everything else as a demand source.** The highest-scoring ideas all have a legal instrument with a date behind them: the Cyber Resilience Act (reporting from 11 September 2026, full application 11 December 2027), NIS2 supply-chain questionnaires, the European Accessibility Act, GDPR, EU pesticide-record rules from January 2026. Regulation creates a deadline, a defined buyer and a budget line. The full calendar is in [08-regulatory-calendar.md](08-regulatory-calendar.md).
2. **Business buyers pay ten times what households and micro-vendors pay.** Trades firms accept $29–49 a month AI add-ons; contractors pay DKK 1,660 per user a year; security-questionnaire tools sell at $300–1,300 a month. Farmers pay NOK 950–4,000 a *year*, landlords expect free, hosts pay $10 per property. The number of customers needed to reach €10k MRR ranges from 40 (ideas 28, 42) to 1,250 (idea 6). Pick a buyer who already pays business prices.
3. **The AI that works is extraction and drafting, not chat.** Every idea's AI feature that survived scrutiny is one of: turn a document, photo or voice note into structured data; draft a document from structured data; classify or diff. These are cheap (a three-page document costs $0.001–0.01 to extract; see [07-building-with-ai.md](07-building-with-ai.md#45-in-product-ai-costs-september-2026-list-prices)) and reliable with a human confirm step. "AI insights", "AI scores" and "chat with your data" were gimmicks in every category.
4. **Incumbents are one release away in horizontal categories, and absent in Nordic ones.** Jobber, Tradify, Spectora, Canny, Visualping and incident.io all shipped AI features in 2024–26. The gaps that remain are national: Nordic languages, Nordic registers (Brønnøysund, Altinn, Gårdskart, CHR), Nordic accounting systems (Fiken, Tripletex, e-conomic, Dinero), and Nordic laws. A Nordic founder's edge is the wedge the US incumbents cannot copy cheaply.
5. **Distribution is the constraint, not building.** Cold email replies at 0.45%; organic click-through on AI-Overview queries halved; paid search is unaffordable below €100 ARPU. What works for a solo founder is a register-derived buyer list (every 50+ employee company, every housing association, every contractor is in a public register), a partner channel (accountants, advisors, associations), a marketplace with checkout (GitHub, Shopify, Atlassian), or a free tool as lead magnet.
6. **Several categories that look promising were killed by 2025–26 events.** CSRD's SME cascade was gutted by the Omnibus (29); Google removed the Business Profile Q&A API and gates access against multi-tenant SaaS (36); the whistleblower market was bought in 2023–24 (26); e-invoicing is bundled into every accounting suite and gated by certification (31); 365FarmNet, Harvie and Plantevernguiden shut down, which opens gaps (1, 2, 4, 5) but also shows how thin the margins are.

## 7. Shortlist and recommendation

### The thesis: sell trust evidence to small software vendors

Three of the top ideas sell to the same buyer, the CTO or founder of a 5–50 person software company, and solve the same problem, proving to customers and regulators that the company is safe to buy from:

| Idea | What the buyer gets | Score | ARPU € | Customers to €10k MRR | MVP weeks |
|---|---|---|---|---|---|
| [23. CRA evidence pack](03-developer-tools.md#23-dependency-licence-and-sbom-compliance-for-small-software-vendors-eu-cyber-resilience-act) | SBOM on every release, licence policy, vulnerability tracking, the technical documentation the Cyber Resilience Act requires | 23 | 90 | 111 | 8 |
| [42. Security questionnaire auto-responder](05-marketing-sales-content.md#42-rfp-and-security-questionnaire-auto-responder-for-small-vendors) | The 300-row spreadsheet from the enterprise buyer, answered with citations in an hour | 22 | 250 | 40 | 7 |
| [28. NIS2 supplier profile](04-compliance-finance-legal-hr.md#28-nis2-ready-supplier-profile-and-cyber-hygiene-tracker-for-small-suppliers) | A control checklist, policies and evidence that answer the questionnaire before it is sent | 20 | 250 | 40 | 8 |

Why this founder: a solo developer is the most credible person to sell to other small software companies, speaks the buyer's language, distributes through GitHub Marketplace and developer communities, and can dogfood every feature. The AI is pure document generation and retrieval, which is the reliable kind. The regulatory dates (11 September 2026, 11 December 2027, NIS2 transposition through 2026) pull demand forward for the next 18 months. The three products share a codebase (repo connector, document store, policy templates, evidence export) and a trust gate (the vendor's own ISO 27001 or SOC 2 evidence), so the gate is paid for once.

**Recommendation: start with idea 23, the CRA evidence pack.** It has the hardest deadline, the emptiest price band (nothing between free GitHub SBOM export and $25-per-developer security suites that gate SBOM to enterprise), and the lowest trust gate (an SBOM is not a secret; a security policy is). Once 30 customers are paying, add the questionnaire responder (42) as the upsell to the same accounts, then the NIS2 supplier profile (28).

### Four alternatives, each the best of its kind

| If you want... | Pick | Why | Score |
|---|---|---|---|
| The fastest first revenue | [33. Vendor contract and renewal tracker](04-compliance-finance-legal-hr.md#33-vendor-contract-and-saas-renewal-tracker-with-ai-clause-extraction) | Five weeks to build, extraction is cents per contract, accountants are the channel, Nordic accounting integrations are the moat | 21 |
| A GitHub-native product riding an incumbent price shock | [21. PR-driven AI localisation](03-developer-tools.md#21-pull-request-driven-localisation-with-context-aware-ai-translation) | Lokalise and Phrase removed their cheap tiers in 2025–26; small teams are actively searching for alternatives | 22 |
| The biggest pain in a Nordic vertical | [8. AI trades quoting from photos and voice](02-trades-field-service-property.md#8-ai-estimating-and-quoting-for-small-trades-from-photos-and-voice) | Tradespeople lose 5–8 hours a week to admin; nobody does photo-and-voice capture in Norwegian or Danish; needs two accounting-firm partners | 21 |
| To stay close to agriculture (the name of this repository) | [1. Farm compliance record-keeper](01-agriculture-rural.md#1-farm-compliance-and-subsidy-record-keeper) with [5](01-agriculture-rural.md#5-spray-window-and-field-operation-decision-assistant) as a module | Mandatory electronic pesticide records from January 2026, Norway's new fertiliser journal, 365FarmNet closing in November 2026; low farmer willingness to pay means selling through advisors | 20 |

Honourable mentions with a specific condition attached: [43. Nordic AI phone receptionist](05-marketing-sales-content.md#43-ai-phone-receptionist-for-small-service-businesses-in-nordic-languages) has the best unit economics of all 50 (25 customers to €5k MRR) but already a dozen local entrants, so only with a vertical integration; [30. Accessibility fix PRs](04-compliance-finance-legal-hr.md#30-web-accessibility-monitor-with-ai-generated-fix-pull-requests) if you want to sell to web agencies; [24. DMARC monitoring](03-developer-tools.md#24-dmarc-spf-and-dkim-monitoring-with-guided-fixes-for-smbs-and-agencies) as a four-week warm-up product.

### What to do in the next two weeks, whichever you pick

1. Find 15 people who match the buyer and talk to 10 of them. For idea 23, that is CTOs of Nordic software companies with a shipped product; ask whether a customer has asked for an SBOM yet and who owns "CRA" internally. Kill the idea if fewer than five describe the problem unprompted.
2. Put a landing page up with the price on it and the regulation date in the headline. Aim for 20 sign-ups from the interviewees' networks.
3. Only then start the 12-week playbook in [07-building-with-ai.md](07-building-with-ai.md#3-the-generic-mvp-playbook-12-weeks).

### How the 50 split

- **Six ideas score 21 or more** and are shortlist-grade: 23, 42, 21, 8, 24, 33. They are the table above plus the DMARC warm-up product.
- **Twenty-four score 18–20** and are viable with a specific condition attached (a partner channel, a platform's goodwill, a feasibility spike, a lawyer). The condition is named in each verdict. The strongest of them: 1 and 4 (agriculture, via advisors), 28, 30, 32 and 26 (compliance for SMEs), 43 (Nordic voice), 46 (clinic recall), 18 (Supabase security).
- **Twenty score 17 or below** and are not worth a solo founder's year, for reasons that are structural rather than fixable: free or entrenched incumbents (6, 12, 14, 15, 27, 37, 44, 45, 50), a platform that blocks, bundles or owns distribution (19, 36, 41, 49), a certification gate a solo founder cannot pass cheaply (31), a locked or tiny market (11, 35), a regulatory wave that was cancelled (29), a feature rather than a product (5, 22), or a shrinking channel with price-sensitive buyers (2). They are documented in full so the reasoning can be checked and so they are not re-proposed in six months.

The complete ranking with all six criteria is in [09-scorecard.md](09-scorecard.md).
