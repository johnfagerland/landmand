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

1. **In the US, private enforcement beats regulators as a demand source.** The highest-scoring ideas sit where plaintiffs, attestations or customer requirements already bite: about 5,000 Prop 65 notices a year and $66 million of settlements (26), over 5,000 web-accessibility suits in 2025 (30), an IRS attestation every tax preparer signs at renewal (27), security questionnaires that gate enterprise deals (42), the FDA's statutory SBOM requirement for device software (23). Dated federal rules moved in 2025–26 (CMMC certification suspended, HIPAA update slipped to 2027, ADA Title II pushed a year, click-to-cancel vacated), so anchor on a duty that exists today. The calendar is in [08-regulatory-calendar.md](08-regulatory-calendar.md).
2. **Business buyers pay ten times what households and micro-vendors pay.** Clinics pay $189–449 a month for patient communication, defense subcontractors $99–450 for compliance workspaces, trades firms accept $29–49 AI add-ons; farmers, landlords, hosts and tutors expect free or $10–20. Customers needed for $10k MRR range from 40 (idea 42) to 833 (idea 14). Pick a buyer who already pays business prices; the Census counts 561,160 US firms with 20–99 employees, the band that reliably does.
3. **The AI that works is extraction and drafting, not chat.** Every AI feature that survived scrutiny turns a document, photo or voice note into structured data, drafts a document from structured data, or classifies and diffs. It costs $0.001–0.01 per document ([07-building-with-ai.md](07-building-with-ai.md#45-in-product-ai-costs-september-2026-list-prices)) and is reliable with a human confirm step. "AI insights", "AI scores" and "chat with your data" were gimmicks in every category, and "AI guarantees compliance" is a liability.
4. **Incumbents are one release away in horizontal categories, and absent in the compliance layer.** Jobber, Housecall Pro, Spectora, Ramp, Visualping, Supabase and incident.io all shipped AI features in 2024–26; photo quoting is already sold at $29.99 and bilingual answering at $25. What remains open is the compliance layer nobody productised at SMB prices: warnings and label transitions, written security plans, fix PRs rather than scans, state-specific deposit rules, FDA addenda, cottage-food labels.
5. **Distribution decides more than product.** Cold email replies at 0.45%; paid search in home services and legal runs $20–80 a click; organic click-through on AI-Overview queries halved. What works for a solo founder is a marketplace with checkout (Shopify pays 100% of the first $1 million; Atlassian the same to $1 million lifetime; GitHub 95% after 100 installs), a public register or licensing board that lists every buyer (PTIN holders, SAM.gov contractors, Florida condo associations, InterNACHI inspectors), a partner channel (accountants, franchisors, associations), or a free tool as lead magnet.
6. **Several ideas that look promising were settled by 2025–26 events.** OMB withdrew the federal software-attestation mandate (23 now leans on the FDA and EU), CMMC's certification wave was suspended (28), Ramp made vendor-contract extraction a free feature (33), FarmRaise and Ambrook both concluded farm grant-finding does not monetise (7), Google removed the Business Profile Q&A API (36), and Castiron's cottage-food marketplace failed (40). They are documented so they are not re-proposed.

## 7. Shortlist and recommendation

### Recommendation: start with idea 30, accessibility scan-and-fix, and add Prop 65 screening on the same channel

| Idea | What the buyer gets | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| [30. Web accessibility monitor with AI fix PRs](04-compliance-finance-legal-hr.md#30-web-accessibility-monitor-with-ai-generated-fix-pull-requests) | A crawl, a litigation-weighted priority list, pull requests that fix the six error classes making up 96% of failures, and the statement and conformance report public and healthcare buyers require | 21 | 99 | 101 | 7 |
| [26. Product compliance screening (Prop 65, MoCRA, PFAS)](04-compliance-finance-legal-hr.md#26-product-regulatory-compliance-screening-for-small-consumer-brands) | Bill-of-materials screening against the Prop 65 and PFAS lists, the correct warning text for labels and listings, and the 2028 transition and registration calendars | 21 | 99 | 101 | 7 |

Why 30 first: it has the strongest US driver in the list (3,117 federal web suits in 2025, up 27%, most against companies under $25 million, plus hard public deadlines in May 2026 and April 2027), no certification or trust gate, discredited incumbents (the overlay vendors after the FTC's order) and scanners that stop at detection, a seven-week build on open-source foundations (axe-core, Playwright), and two channels a solo founder can work alone: a free scanner as lead magnet and the Shopify App Store, where you keep 100% of the first $1 million. Why 26 second: the same Shopify merchants face a privately enforced regime with 5,000 notices a year and a label transition ending 1 January 2028, the tools are either $199 a year alert feeds or $500+ a month platforms, and the crawler, product catalogue integration and merchant relationship are shared. Together they make one company: compliance for small consumer brands and the agencies that serve them, sold through Shopify and agency partners.

### Four alternatives, each the best of its kind

| If you want... | Pick | Why | Score |
|---|---|---|---|
| The highest ceiling and are willing to get SOC 2 | [42. Security questionnaire auto-responder](05-marketing-sales-content.md#42-rfp-and-security-questionnaire-auto-responder-for-small-vendors) | $930 per questionnaire manually, an empty tier under $300 a month, retrieval-augmented drafting that works today; 40 customers at $250 reach $10k MRR. The gate is trust: a solo vendor holding customers' security policies needs SOC 2 Type II ($10–20k, 6–12 months). Grows into the same buyer's SBOM (23) and CMMC (28) needs | 22 |
| The fastest first revenue | [27. Written security plan for tax preparers](04-compliance-finance-legal-hr.md#27-written-information-security-plan-and-safeguards-rule-compliance-for-tax-preparers-accountants-and-small-financial-firms) | A four-week build, 879,698 PTIN holders who attest every renewal season, an empty $19–49 band between free templates and $999 consultants, and no data in the tool. Launch for the October-to-December renewal window; low ARPU, seasonal | 21 |
| A GitHub-native product | [21. PR-driven AI localisation with US Spanish](03-developer-tools.md#21-pull-request-driven-localisation-with-context-aware-ai-translation) | Lokalise and Phrase removed their cheap tiers in 2025–26; 45 million US Spanish speakers; diff-only translation in the PR is the workflow the incumbents lack. A funded three-person competitor already holds the slot, so speed decides | 21 |
| To stay close to agriculture (the name of this repository) | [1. Farm compliance record-keeper](01-agriculture-rural.md#1-farm-compliance-record-keeper) with [5](01-agriculture-rural.md#5-spray-window-and-label-constraint-assistant) as a module | Federal, state, FSMA and organic records with dated deadlines through 2027, the 2026 dicamba label's weather-screenshot rule, specialty-crop farms already paying $99–299 a month for tools without AI or state formats; voice-and-weather records nobody has. Sell through food-safety auditors and applicator associations | 21 |

Honourable mentions with a condition: [23. SBOM evidence pack](03-developer-tools.md#23-sbom-and-software-supply-chain-evidence-for-small-vendors-selling-to-medical-device-federal-and-eu-markets) if you can reach medical-device software makers through their regulatory consultants; [13. Move-in/out inspections](02-trades-field-service-property.md#13-move-in-and-move-out-inspections-with-ai-photo-comparison-and-state-deadline-compliance) and [16. HOA boards](02-trades-field-service-property.md#16-hoa-and-condo-board-management-with-reserve-study-and-filing-compliance) for property, both lifted by 2025 state laws; [46. Clinic recall](06-vertical-saas.md#46-small-clinic-recall-and-no-show-reduction) if you start on Open Dental's free API; [28. CMMC readiness](04-compliance-finance-legal-hr.md#28-cmmc-level-1-and-level-2-readiness-for-small-defense-subcontractors) once the certification phase restarts.

### What to do in the next two weeks, whichever you pick

1. Find 15 people who match the buyer and talk to 10 of them. For idea 30, that is web agencies with 20+ client sites and Shopify merchants over $1 million in sales; ask whether they have received a demand letter, what they did, and what they pay today. Kill the idea if fewer than five describe the problem unprompted.
2. Put a landing page up with the price on it and the litigation number in the headline. Aim for 20 sign-ups from the interviewees' networks.
3. Only then start the 12-week playbook in [07-building-with-ai.md](07-building-with-ai.md#3-the-generic-mvp-playbook-12-weeks).

### How the 50 split

- **Seven ideas score 21 or more** and are shortlist-grade: 42, 1, 21, 23, 26, 27, 30.
- **Twenty-nine score 18–20** and are viable with a specific condition named in each verdict: a platform's API terms, a partner channel, a lawyer, a trust gate, or a regulatory restart. The strongest of them: 13, 16, 18, 24, 28, 33 and 46 at 20.
- **Fourteen score 17 or below** and are not worth a solo founder's year, for structural reasons: free or entrenched incumbents (2, 7, 12, 14, 15, 45, 50), a platform that blocks, bundles or owns distribution (19, 36, 41, 49), a feature rather than a product (5, 22), or a content and regulatory gate (44). They are documented in full so the reasoning can be checked and so they are not re-proposed in six months.

The complete ranking with all six criteria is in [09-scorecard.md](09-scorecard.md).
