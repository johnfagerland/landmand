# 00 — Overview, scope, method and recommendation

*Research date: 6 September 2026.*

## 1. What this research is for

You asked for deep research on a new SaaS product you could build yourself, with 50 ideas, each covering the problem, who has it, the value of solving it, competitors, pricing models, the path to profitability, where AI can be used to build it, and what it takes to reach an MVP. This document set answers that. It is written for one person deciding what to build next, not for investors.

## 2. What we are doing and what we are not doing

**We are doing**

- Generating 50 distinct product ideas that one developer can plausibly build to a paying MVP in 4–16 weeks of focused work with AI coding assistance.
- Researching each idea against the same nine-part template so they can be compared, with published competitor prices, regulatory dates and demand evidence, and a URL for every fact we could source.
- Scoring every idea on six criteria and ranking them, then recommending a shortlist of five and one primary pick.
- Describing the reference stack, the concrete ways AI is used in the *build* (not just in the product), the running costs at 0, 100 and 1,000 customers, and a generic MVP playbook.
- Biasing toward the founder's situation: a Nordic-based solo developer, EU market first, able to sell globally later. Several ideas use Danish or Norwegian regulation as the wedge because local rules create urgency and keep the big US incumbents out.

**We are not doing**

- Building anything. No code, prototypes, or landing pages are in this repository.
- Customer interviews or surveys. All demand evidence is secondary (regulator sites, pricing pages, statistics offices, founder revenue posts, review sites). Every shortlisted idea needs 10–20 real conversations before code is written.
- Legal advice. Regulatory dates and thresholds are quoted from official sources where we found them, but a lawyer or accountant should confirm anything that gates a launch (e.g. Peppol access-point certification, health-data processing, e-signature validity).
- Consumer apps, marketplaces that need two-sided liquidity, hardware, or anything requiring a licence a single person cannot get (banking, insurance carrier, medical device Class IIa+). These are excluded on principle because they are not solo-buildable to profitability.
- Ideas that depend on beating a well-funded horizontal incumbent on its core feature. Where a category is crowded we say so, and we only keep the idea if there is a defensible wedge (a country, a regulation, a data source, a language, or a segment the incumbents ignore).
- Financial projections beyond simple unit economics. We give the numbers needed to sanity-check a path to €5k and €10k MRR; we do not build a five-year model.

## 3. Method

1. **Ideation.** We started from four sources of demand: (a) EU regulation with 2025–2027 deadlines that forces small organisations to buy software, (b) niches where incumbents are US-centric, enterprise-priced or pre-AI, (c) workflows where large language models turn a data-entry chore into a review step, and (d) segments close to the founder's context (agriculture and rural business, given this repository's name, plus Nordic SMEs). We generated ~80 candidates, removed duplicates and anything failing the exclusions above, and kept 50.
2. **Research.** Six parallel research passes (one per cluster) plus one cross-cutting pass, each running web searches and fetching pricing and regulator pages directly. Facts without a source are labelled as estimates.
3. **Scoring.** Each idea is scored 1–5 on six criteria (below), summed to a score out of 30. Scores are judgement calls informed by the research, not measurements; they are there to make the ranking arguable.
4. **Synthesis.** A per-idea write-up in the shared template, a scorecard, a shortlist, and a recommendation.

## 4. Scoring framework

| Criterion | 1 | 5 |
|---|---|---|
| **Pain & urgency** | Nice-to-have; nobody is fined or losing money without it | A legal deadline, an audit, or a direct revenue loss forces a purchase this year |
| **Solo-buildability** | Needs certification, hardware, on-site sales, or many deep integrations | A CRUD app plus one or two APIs and an LLM; no gatekeeper |
| **AI leverage** | AI is a chatbot bolted on | AI removes the main labour cost of the workflow or makes the product possible at all |
| **Competitive gap** | Several funded, AI-native competitors already sell to the same segment at the same price | Incumbents are enterprise-priced, pre-AI, or absent from the founder's market/language |
| **Willingness to pay** | Under €15/month and price-sensitive | €100+/month with a clear ROI story, or per-unit pricing that scales with the customer |
| **Reachability** | Buyers are hard to identify or need field sales | Buyers cluster in searchable directories, associations, marketplaces, or communities a solo founder can reach with SEO and email |

## 5. Assumptions used in every "path to profitability"

- Fixed monthly cost of running a small SaaS: about €150–400 at launch (hosting, database, email, domain, error tracking, LLM usage), rising to roughly €800–2,000 at 1,000 customers. See [07-building-with-ai.md](07-building-with-ai.md) for the itemised stack.
- Payment processing via a merchant of record (Paddle, Lemon Squeezy, Polar) at roughly 4–5% + fixed fee, which also handles EU VAT/OSS. Stripe direct is cheaper but you handle VAT yourself.
- Milestones: **break-even** at ~€1k MRR, **ramen-profitable** at €5k MRR, **full-time replacement** at €10k MRR. For each idea we show customers needed at its realistic ARPU to hit €5k and €10k MRR.
- Churn for SMB SaaS of 3–5% per month unless the product holds compliance records (then 1–2%). This matters: at 5% monthly churn you must add 50 customers a month just to hold 1,000.
- Founder time is free in year one; the goal is to reach €5k MRR within 12 months of launch.

## 6. Shortlist and recommendation

*(Filled in after the research passes; see section 6 below once complete.)*
