# landmand — SaaS product research

Deep research on **50 SaaS products a single developer could build with AI assistance**, evaluated for problem, customer, value, competition, pricing, path to profitability, and what it takes to reach an MVP.

Research date: September 2026. Founder assumption: one developer, Nordic-based, EU market first, building with AI coding tools.

## Start here

| File | What it is |
|---|---|
| [research/00-overview.md](research/00-overview.md) | Scope (what we are / are not doing), method, scoring framework, **shortlist and recommendation** |
| [research/09-scorecard.md](research/09-scorecard.md) | All 50 ideas scored on six criteria; a sortable, filterable version is published at https://claude.ai/code/artifact/c9482619-c4d7-4d87-8231-1f979cde0c1a |
| [research/07-building-with-ai.md](research/07-building-with-ai.md) | Where AI is used to *build* the product, the reference stack, costs, and the generic MVP playbook |
| [research/08-regulatory-calendar.md](research/08-regulatory-calendar.md) | EU regulatory dates 2025–2027 that create demand for several ideas |

## The 50 ideas, by cluster

| # | Cluster | File |
|---|---|---|
| 1–7 | Agriculture, rural & land | [research/01-agriculture-rural.md](research/01-agriculture-rural.md) |
| 8–16 | Trades, field service & property | [research/02-trades-field-service-property.md](research/02-trades-field-service-property.md) |
| 17–25 | Developer & technical tools | [research/03-developer-tools.md](research/03-developer-tools.md) |
| 26–35 | Compliance, finance, legal & HR admin | [research/04-compliance-finance-legal-hr.md](research/04-compliance-finance-legal-hr.md) |
| 36–43 | Marketing, sales & content | [research/05-marketing-sales-content.md](research/05-marketing-sales-content.md) |
| 44–50 | Vertical SaaS: health, education, hospitality, associations | [research/06-vertical-saas.md](research/06-vertical-saas.md) |

Every idea follows the same template so they can be compared side by side:

1. Problem statement
2. Who experiences the problem
3. Value of solving it
4. Main competitors (with published pricing)
5. Pricing model
6. Path to profitability
7. Where AI is used (in the product, and to build it)
8. MVP: what we are doing / not doing, effort, dependencies, hardest part
9. Score and verdict

Sources are listed at the end of each file.

## Data and tooling

| File | What it is |
|---|---|
| [research/scores.json](research/scores.json) | The six criterion scores, ARPU, MVP weeks and verdict for every idea (the single source for the scorecard) |
| [research/ideas.json](research/ideas.json) | scores.json plus each idea's one-line pitch, used by the browsable scorecard |
| [research/tools/build_scorecard.py](research/tools/build_scorecard.py) | Regenerates 09-scorecard.md from scores.json |
| [research/tools/extract_oneliners.py](research/tools/extract_oneliners.py) | Builds ideas.json from scores.json and the chapter files |
| [research/tools/build_artifact.py](research/tools/build_artifact.py) | Builds the browsable HTML scorecard from ideas.json and the template |

To change a score: edit `research/scores.json`, then run the three scripts in that order.

## Method and limits

Research was done in September 2026 by web search and direct fetches of pricing pages, regulator sites and statistics offices, then written up against a fixed template. Every fact that could be sourced has a URL in the chapter's source list; facts that could not be verified are marked as estimates or "not found" in the text. Scores are judgement calls informed by that research, meant to make the ranking arguable rather than to measure it. No customer interviews were done; the overview says what to validate before building anything.
