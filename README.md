# landmand — SaaS product research

Deep research on **77 SaaS products a single developer could build with AI assistance**, evaluated for problem, customer, value, competition, pricing, path to profitability, and what it takes to reach an MVP.

Research date: September 2026 (version 4). Founder assumption: one developer building with AI coding tools; the United States is the primary market and every idea is written to hold regardless of the founder's location. Version 1 (6 September) assumed a Nordic founder and is kept in the git history. Version 2 rewrote all 50 ideas for a US-first buyer. Version 3 added 15 more ideas (51–65) across three areas the founder asked about — sports, short-term rentals and healthcare staffing — plus a stand-alone deep dive on idea 9, the founder's pick from the original 50. Version 4 added 12 more ideas (66–77) across golf and healthcare workforce planning, the founder's own stated interests, after the founder said none of the version-3 picks were exciting; two rules loosened for this round (only two-sided marketplaces stay excluded, and AI credit is no longer limited to document extraction), and under those rules **idea 67 (golf-course turf-disease prediction) now scores 23/30, the highest of all 77 ideas**.

## Start here

| File | What it is |
|---|---|
| [research/00-overview.md](research/00-overview.md) | Scope (what we are / are not doing), method, scoring framework, **shortlist and recommendation** |
| [research/09-scorecard.md](research/09-scorecard.md) | All 77 ideas scored on six criteria; a sortable, filterable version is published at https://claude.ai/code/artifact/c9482619-c4d7-4d87-8231-1f979cde0c1a |
| [research/13-deep-dive-idea-09.md](research/13-deep-dive-idea-09.md) | Deep dive on idea 9 (fence, roof and solar measurement): patents, data sources, live competitors, a validation plan and a week-by-week MVP spec |
| [research/16-healthcare-workforce-calendar.md](research/16-healthcare-workforce-calendar.md) | Every weekly, monthly, quarterly and annual task in healthcare workforce planning, mapped against ideas 61–65 and 72–77 — an audit that found no new idea, and says why |
| [research/17-deep-dive-idea-74.md](research/17-deep-dive-idea-74.md) | Deep dive on idea 74 (nurse schedule optimization): a corrected BAA/data-access answer, a sourced forecasting and scheduling-algorithm recommendation, a liability/disclaimer design, a validation plan and a week-by-week MVP spec |
| [research/07-building-with-ai.md](research/07-building-with-ai.md) | Where AI is used to *build* the product, the reference stack, costs, and the generic MVP playbook |
| [research/08-regulatory-calendar.md](research/08-regulatory-calendar.md) | US federal and state regulatory dates 2025–2028 that create demand for several ideas |

## The 77 ideas, by cluster

| # | Cluster | File |
|---|---|---|
| 1–7 | Agriculture, rural & land | [research/01-agriculture-rural.md](research/01-agriculture-rural.md) |
| 8–16 | Trades, field service & property | [research/02-trades-field-service-property.md](research/02-trades-field-service-property.md) |
| 17–25 | Developer & technical tools | [research/03-developer-tools.md](research/03-developer-tools.md) |
| 26–35 | Compliance, finance, legal & HR admin | [research/04-compliance-finance-legal-hr.md](research/04-compliance-finance-legal-hr.md) |
| 36–43 | Marketing, sales & content | [research/05-marketing-sales-content.md](research/05-marketing-sales-content.md) |
| 44–50 | Vertical SaaS: health, education, hospitality, associations | [research/06-vertical-saas.md](research/06-vertical-saas.md) |
| 51–55 | Sports and athletics | [research/10-sports.md](research/10-sports.md) |
| 56–60 | Short-term rental industry | [research/11-short-term-rental.md](research/11-short-term-rental.md) |
| 61–65 | Healthcare staffing | [research/12-healthcare-staffing.md](research/12-healthcare-staffing.md) |
| 66–71 | Golf industry | [research/14-golf.md](research/14-golf.md) |
| 72–77 | Healthcare workforce planning | [research/15-healthcare-workforce-planning.md](research/15-healthcare-workforce-planning.md) |

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

Research was done in September 2026 by web search and direct fetches of pricing pages, regulator sites and statistics offices, then written up against a fixed template. Version 2 rewrote all 50 ideas for a US-first buyer and replaced seven ideas that only existed because of EU or Nordic regulation. Version 3 added 15 ideas across sports, short-term rentals and healthcare staffing, and a deep dive on idea 9. Version 4 added 12 ideas across golf and healthcare workforce planning under loosened rules: consumer apps, hardware and licence-gated businesses are no longer excluded on principle, and the AI-leverage score now credits prediction, forecasting, optimization and computer vision, not only document extraction. The original 65 ideas and their scores are unchanged throughout. Every fact that could be sourced has a URL in the chapter's source list; facts that could not be verified are marked as estimates or "not found" in the text. Scores are judgement calls informed by that research, meant to make the ranking arguable rather than to measure it. No customer interviews were done; the overview says what to validate before building anything.
