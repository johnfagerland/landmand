# 10 — Sports and athletics, US (ideas 51–55)

Five ideas where the buyer sits inside organized sport rather than around it: the person who assigns officials to games, the club administrator who has to prove every coach is background-checked, the one- or two-person compliance office at a small college, the athletic director clearing students to play each season, and the volunteer or small-business tournament director running a weekend bracket. The US runs organized sport at real scale — 237,811 registered high-school officials in 2024–25, 19,943 NFHS-affiliated high schools, 220-plus national youth-sports organizations claiming 60 million registered participants, and $274.5 billion of sports-tourism economic impact in 2025 — but two consolidators already sit across most of this cluster's software: Arbiter (officiating assignment, K-12 registration, and, after two 2025 acquisitions, rSchoolToday and BigTeams' eligibility platform) and Teamworks (ARMS compliance, Front Rush, and INFLCR's NIL tools). The wedge in this cluster is narrower than in trades or property: a payment-threshold rule nobody has built for yet, a state law with real liability, or a buyer tier the consolidators price for enterprise sales, not for a solo founder's self-serve signup.

One candidate from the original brief — NIL deal disclosure and tax tracking for athletes, collectives and high-school families — was replaced. NIL Go, the Deloitte-run clearinghouse, only started requiring $600-plus deal reports in September 2025, the rules are still moving (a federal SCORE Act is pending, state NIL laws differ, and enforcement mechanics are being litigated), and the buyer is genuinely unclear: collectives and athletic departments already get Opendorse and INFLCR largely built for them, while an individual athlete or high-school family is a consumer buyer with the low willingness to pay this research consistently down-scores. It is replaced with high-school athletic department clearance, eligibility and physical-form compliance (candidate (c) in the brief's reserve list) — a steadier, season-driven compliance chore with an institutional buyer, even though its incumbents (FinalForms, DragonFly MAX) are also well entrenched.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 51. Sports officials assigning, availability and payment with 1099 handling

**One-liner.** A scheduling and payment hub for the person who assigns referees and umpires to games: officials set availability once, get matched by certification, distance and conflict-of-interest rules, and get paid with 1099s handled correctly as a new IRS threshold changes who needs one.

### Problem statement
NFHS's 2024–25 survey put registered high-school officials at 237,811, 8% above 2018–19 levels but still recovering from a pandemic exodus of about 50,000 that bottomed out at 189,140 in 2019–20. NASO's 2023 survey of 35,813 officials found the average age rose from 53.29 (2017) to 56.68 (2023), and 79% said they were taking on more assignments because of the shortage. Separately, the One Big Beautiful Bill Act (signed 4 July 2025) raises the 1099-NEC/1099-MISC reporting threshold from $600 to $2,000 for payments made from 2026 onward, indexed to inflation from 2027. Officials are commonly paid $50–120 a varsity game (Illinois's 2025 IHSA football rate is $90), so one working 20-plus games for a single assigning body still crosses $2,000, but one working fewer, or split across leagues, may not — a distinction assignors must apply correctly, per official, for the first time in 2026. Arbiter's assigning software serves 10,000-plus organizations and 500,000 officials, and its ArbiterPay/RefPay already computes combined 1099 totals for leagues that opt in, free for the official. Assignr and Horizon WebRef publish tiered pricing; RefTown, DragonFly and ZebraWeb publish none. On 28 August 2025 Arbiter acquired BigTeams, building on its earlier rSchoolToday acquisition and extending the same company from assigning and payment into K-12 eligibility software.

### Who experiences the problem
237,811 high-school officials nationally (NFHS, 2024–25), plus an uncounted population of youth- and adult-recreation officials; NASO's own paid membership was 32,276 at the end of 2025. The buyer is the independent assignor or the league/conference office that pays officials each season; the user is the official checking availability and expecting accurate, on-time payment.

### Value of solving it
An official working 20–30 games a season at $50–120 a game earns $1,000–3,600 a year from one assigning body — money a late or misclassified 1099 puts at risk, and real hours an assignor spends reconciling availability, conflicts and certification levels across 50–150 officials a season by spreadsheet.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Arbiter (assigning + ArbiterPay/RefPay) | Not published; 10,000+ orgs, 500,000 officials | Combined 1099 reporting already built in; hard to underprice on features alone |
| Assignr | $240–$480/yr for 60 officials, +$40–80/10 more; 600+ contact pricing | W-9/1099 filing is a paid add-on, not core |
| Horizon WebRef | $217.50–$3,100/yr across 6 tiers, +$3.45–8.05/licence | No published 1099 workflow |
| RefTown, DragonFly, ZebraWeb | Not published | Quote-only; features unclear from public pages |

### Pricing model
Per assigning body, not per official: $29/month for up to 75 officials, $59/month for up to 200, with 1099-threshold tracking, Stripe Connect direct deposit and unlimited assignments included — undercutting Assignr's per-official add-on model and Horizon's $900-plus mid tiers.

### Path to profitability
At $45 ARPU you need 112 assigning bodies for $5k MRR and 223 for $10k. Stripe Connect payout fees and SMS notifications are the main variable cost; margins are otherwise high. Distribution: the 50 state officiating associations, NASO's directory and annual Officiating Summit, and the assigning-side Facebook and Reddit groups that already discuss ArbiterPay fees publicly. Churn should be low once a season's roster is loaded, but this is a duopoly — Arbiter alone reaches 500,000 officials — and the leader keeps acquiring adjacent products.

### Where AI is used
- **In the product:** natural-language conflict rules ("never assign X to a school where a family member teaches"), auto-matching by certification, distance and availability, and flagging officials approaching the new $2,000 threshold so 1099s go out correctly.
- **To build it:** the matching engine is standard constraint-solving, not a hard AI problem; the useful AI piece is turning officials' free-text availability into structured calendar slots.

### MVP
- **Doing:** official roster with certification levels, availability capture (web form and SMS), rules-based auto-assignment with manual override, Stripe Connect payouts, per-official 1099-NEC threshold tracking, season reporting for the assigning body.
- **Not doing:** background-check integration (idea 52's territory), video or replay review, federation-level multi-sport administration.
- **Effort:** 8 weeks.
- **Dependencies:** Stripe Connect (1099 generation), Twilio with 10DLC registration for SMS, outreach to state officiating associations for distribution.
- **Hardest part:** displacing Arbiter's 500,000-official network effect and RefPay's existing free-for-officials 1099 tool.

### Score and verdict
Pain 3 · Solo 4 · AI 3 · Gap 2 · WTP 3 · Reach 3 = **18/30**. A real and newly changed payment rule sits behind this, but Arbiter and Assignr already do most of the job, including 1099 handling. Win on price and on the one thing they surface poorly today — the new $2,000 threshold — rather than on features.

---

## 52. Youth sports club safety and credential compliance

**One-liner.** A dashboard where a youth-sports club tracks every coach's SafeSport training, background check, concussion/CPR certification and state-mandated policy against its expiry date, so a volunteer administrator can produce one clean export for a national governing body or an insurer instead of chasing three separate vendor portals.

### Problem statement
As of early 2026, thirteen states have statutes specifically requiring background checks for youth-sports volunteers or the organizations using them. California's AB 506 (effective 1 January 2022) requires every youth-serving-organization employee, even part-time, to complete a DOJ fingerprint background check, extends this to any "regular volunteer" with over 16 hours a month or 32 hours a year of child contact, and mandates abuse-reporting training and an annually reviewed prevention policy. Layered on top are U.S. Center for SafeSport training requirements that cascade from national governing bodies to local clubs, and sport-specific coach credentials (US Soccer, USA Hockey, Little League) — so a club juggles a SafeSport certificate, a background-check vendor's report, an NGB licence portal and a spreadsheet, each with its own renewal clock. Sterling Check Corp, parent of Sterling Volunteers, was acquired by First Advantage for $2.2 billion in a deal completed 31 October 2024 and no longer publishes a rate card; NCSI advertises checks from about $15 per coach for a two-year check with a 12-month follow-up, and general vendor pricing runs $10–50 per person. SportsEngine's compliance module is bundled into its $79–129/month tiers, partnered with NCSI for the check itself. None of these is a pure tracking layer sitting across whichever vendors a club already uses.

### Who experiences the problem
SFIA's 2025 team-sports research counts about 7.2 million youth-sports coaches nationwide, most of them volunteers; the National Council of Youth Sports counts 220-plus member organizations serving 60 million registered participants. The buyer is the club or league administrator, frequently a volunteer board member; the user is that administrator plus every coach uploading documents each season.

### Value of solving it
A lapsed background check or missing SafeSport certificate is both a liability and an insurance problem: youth-sports liability coverage already prices in a club's documented safety compliance, and a club that cannot produce a clean roster for its NGB or insurer risks losing its charter or coverage — real, but not independently dollar-quantified.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| SportsEngine (compliance module) | $79–129/mo (Express–Premium), $2,199/yr Pro | Bundled inside a full registration suite |
| Sterling Volunteers (Sterling Check / First Advantage) | Not published since the 2024 acquisition | Background checks only, no cross-vendor tracking |
| NCSI | ~$15–50 per person per check | Background checks only |
| Players Health | Not independently verified; insurance-led | Insurance product, not a compliance dashboard |
| Vantage, Abuse Prevention Systems | Not published | Niche, narrow scope |

### Pricing model
Per club per season, banded by roster size: $39/month for up to 25 coaches, $89/month for up to 100, covering expiry tracking and document storage across whatever background-check and SafeSport systems the club already uses — not a background-check vendor itself, so no state licensing exposure of its own.

### Path to profitability
At $59 ARPU you need 85 clubs for $5k MRR and 170 for $10k. Costs are document storage and extraction, cents per document. Distribution: NGB-affiliated club directories, state youth-sports associations, insurance brokers who sell into these clubs and want compliance proof for underwriting, and NCYS's 220-plus member organizations as a partner channel. Compliance records should keep churn low, but sales are slow and board-driven, the same pattern as HOA boards in idea 16.

### Where AI is used
- **In the product:** extraction of credential type and expiry from uploaded certificates across incompatible vendor formats (a SafeSport PDF looks nothing like an NCSI report), automatic reminders before lapse, one-click export formatted for a specific NGB or insurer.
- **To build it:** extraction and reminders are standard; the hard piece is normalizing different certificate layouts into one schema without missing a field that causes a false "compliant" status.

### MVP
- **Doing:** coach roster, document upload (manual and email-in), AI extraction of type and expiry, dashboard of expiring items, one-click compliance export, reminders.
- **Not doing:** running background checks itself (link to NCSI/Sterling instead), SafeSport training delivery, registration or payment processing.
- **Effort:** 7 weeks.
- **Dependencies:** a document-extraction LLM, email ingestion, Twilio with 10DLC; no licensing gate since the product performs no checks itself, but marketing must avoid implying it guarantees compliance.
- **Hardest part:** getting a volunteer board to pay for a third dashboard on top of systems it already uses.

### Score and verdict
A real and growing patchwork of state and NGB requirements sits behind this idea. But the buyer is a volunteer board that budgets in the tens of dollars a month and is hard to reach outside its own NGB's channel: Pain 3 · Solo 4 · AI 3 · Gap 3 · WTP 2 · Reach 2 = **17/30**.

---

## 53. Small-college athletics compliance workspace for NCAA Division II and III, NAIA and NJCAA

**One-liner.** Countable athletically related activity (CARA) logs, recruiting-contact logs and eligibility checklists for the one- or two-person compliance office at a small college, priced and sold self-serve at a budget the enterprise platforms don't chase.

### Problem statement
The House v. NCAA settlement, approved 6 June 2025, added roster limits and revenue-sharing obligations only for Division I schools that opt in; Division II, Division III, NAIA and NJCAA kept their existing rules, so their day-to-day compliance load — CARA hour logs, recruiting-contact logs, eligibility checks, transfer paperwork — is unchanged and still due weekly. The NCAA's own Compliance Assistant, which applies NCAA legislation to financial aid, eligibility, recruiting and playing-season rules, is free to every member school, capping what a paid product can charge for pure bylaw record-keeping. The commercial alternatives have consolidated: Teamworks owns both ARMS and Front Rush (having acquired Front Rush's inventory-management line outright), and JumpForward has been part of ACTIVE Network since 2016, serving 150,000-plus users and, on varying published figures, 175 to 350 college athletic departments — but none of the three publishes a price, pointing to an enterprise, multi-year sales motion built for Division I departments with dedicated compliance staff, not the one- or two-person office typical below that tier. NCAA Division II carries 293 member schools, Division III 422, NAIA 233 (2026–27), and NJCAA 525 across 24 regions — roughly 1,473 athletic departments outside the Division I sales motion.

### Who experiences the problem
Roughly 1,473 small-college athletic departments (Division II 293, Division III 422, NAIA 233, NJCAA 525); the National Association for Athletics Compliance is the profession's own association, affiliated with NACDA. The buyer is the athletic director or the sole compliance officer; the user is that same person plus every coach who submits CARA hours weekly.

### Value of solving it
Even a secondary NCAA violation costs a small school staff time on self-reporting and can put eligibility at risk; the free Compliance Assistant covers the bylaw database but not day-to-day CARA logging, recruiting-log capture from a coach's phone, or a plain audit trail a one-person office needs to satisfy a conference or NCAA reviewer — value that is real but not independently dollar-quantified in public sources.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| NCAA Compliance Assistant | Free to all member schools | Bylaw and eligibility database, not a CARA or recruiting-log workflow tool |
| ARMS (Teamworks) | Not published | Built and sold for Division I; Teamworks also now owns Front Rush |
| Front Rush | Not published | Now a Teamworks product |
| JumpForward (ACTIVE Network) | Not published; 150,000+ users, 175–350 mostly D1 athletic departments | Customer base weighted to Division I |

### Pricing model
Per athletic department per year, banded by division: $588/year for NAIA and NJCAA schools, $988/year for Division II and III — self-serve signup with a credit card or purchase order, no enterprise sales call, undercutting whatever ARMS, Front Rush and JumpForward charge a department that goes through their sales teams (unpublished, but implicitly higher given the sales-team model).

### Path to profitability
At $70 ARPU (annualized average, expressed monthly) you need 72 departments for $5k MRR and 143 for $10k, out of roughly 1,473 candidate schools — a 10% share only if the incumbents keep ignoring this tier. Costs are low: no hardware, no live data feed beyond a coach's own logging. Distribution: the National Association for Athletics Compliance, conference compliance-officer listservs, and NACDA membership. Sales are slow — one department at a time, on a fiscal-year cycle — and the buyer is cautious about FERPA-adjacent data, so a clear security page matters even without a formal SOC 2 audit.

### Where AI is used
- **In the product:** parsing a coach's CARA-hour submissions (text, spreadsheet, or a photo of a sign-in sheet) into the weekly-hour-limit format bylaws require, drafting recruiting-contact log entries from a coach's calendar, and flagging eligibility red flags — a missing transcript, a credit-hour shortfall — before a self-report becomes necessary.
- **To build it:** the workspace (logs, dashboards, exports) is standard CRUD; the hard piece is encoding current NCAA, NAIA and NJCAA bylaw thresholds correctly and keeping them current each legislative cycle, which needs a compliance-experienced reviewer, not just a developer.

### MVP
- **Doing:** CARA-hour logging (text or photo), recruiting-contact log, per-sport eligibility checklist, one-click compliance export, a single dashboard for the one-person office.
- **Not doing:** financial-aid and scholarship accounting, NIL, ticketing, recruiting-CRM features (Front Rush's core business).
- **Effort:** 9 weeks.
- **Dependencies:** an NCAA/NAIA/NJCAA bylaw reference reviewed by a compliance-experienced person; FERPA-aware data handling, though no HIPAA BAA since no health data is held.
- **Hardest part:** selling into a slow, budget-cycle buyer against three brands now consolidated under two owners.

### Score and verdict
A real, underserved tier below Division I sits behind this idea, but NCAA's own free tool covers the bylaw database and the paid competitors are now consolidated under two owners. Small-college procurement is slow enough that this is a niche worth a side project, not a first bet: Pain 3 · Solo 3 · AI 3 · Gap 2 · WTP 3 · Reach 2 = **16/30**.

---

## 54. High-school athletic department clearance, eligibility and physical-form compliance

**One-liner.** A parent-upload portal where a district's required physical exam, concussion and cardiac-screening paperwork is read by AI straight off whatever form the family's own doctor handed them, checked against the state's rules, e-signed and rolled into an athletic director's always-current clearance list.

### Problem statement
All 50 states and DC now have a sports-concussion law covering removal- and return-to-play procedures, and roughly 40 of those laws require a signed concussion-information form from the athlete and a parent each season. Nearly every state also requires a pre-participation physical exam before a student can practice, but the exam is usually done by the family's own doctor on paper, not through the school's system, so a district athletic office receives hundreds of non-standard, handwritten PDFs and phone photos every August and has to manually check each against the state's required fields and its typical 12–13 month validity window. NCES counts about 19,183 operating public school districts for 2024–25, and NFHS's 51 member state associations serve 19,943 high schools running this process every season, every sport. FinalForms and DragonFly MAX (now under Arbiter, which also owns BigTeams' Eligibility Central and rSchoolToday after two 2025 acquisitions) and rankOne Sport all sell to the district, not the family, and none advertises AI extraction from a parent- or doctor-submitted PDF — they are built around the district's own digital form, not around reading whatever a pediatrician's office actually hands a parent.

### Who experiences the problem
19,943 NFHS-affiliated high schools across roughly 19,183 public school districts (NCES, 2024–25); some states extend the requirement to middle school. The buyer is the district athletic director or a district-level activities coordinator; the users are that office's staff and the parents submitting documents.

### Value of solving it
A missing or expired physical benches a student and exposes the district to liability if an uncleared student plays; office staff spend the first weeks of every season chasing and manually checking hundreds of forms per school, a seasonal crunch every incumbent's own marketing describes but none quantifies in dollars.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| FinalForms | Not published (district quote) | Built around the district's own digital form, not doctor-submitted paper |
| DragonFly MAX (Arbiter) | Not published | Same gap; now inside the Arbiter/BigTeams/rSchoolToday roll-up |
| rankOne Sport | Not published | Legacy interface, district contract |
| BigTeams Eligibility Central (Arbiter) | Not published | Acquired by Arbiter, 28 August 2025 |

### Pricing model
Per district per year, banded by enrollment: $499/year for a single high school, $1,499/year for a district of up to five schools — self-serve with a purchase-order option, since districts commonly need one, undercutting the enterprise sales cycle the incumbents run.

### Path to profitability
At $85 ARPU (annualized average, expressed monthly) you need 59 districts for $5k MRR and 118 for $10k, out of roughly 19,183 candidate districts. Costs are document extraction (cents per PDF or photo) and e-sign. Distribution: state high-school athletic-association vendor lists (several of the 51 NFHS member associations list or endorse approved vendors), the National Interscholastic Athletic Administrators Association's conferences, and district purchasing consortia. Sales are seasonal — spring and summer, ahead of the fall season — and slow, and the incumbents are consolidating under Arbiter, which also sells the assigning software in idea 51 to the same buyer for a different job.

### Where AI is used
- **In the product:** vision extraction of arbitrary physician-submitted physical-exam forms — not just the district's own digital form — into a structured clearance record, automatic flagging against the state's required fields and validity window, parent e-sign for concussion and cardiac-screening acknowledgment forms, and a one-click eligibility-roster export for a state audit.
- **To build it:** the portal, e-sign and reminders are standard; the one hard piece is reliably extracting data from wildly inconsistent scanned paper forms across 50 states' different physical-exam templates.

### MVP
- **Doing:** parent upload portal (photo or PDF), AI extraction and state-rule validation, e-sign for information and consent forms, an athletic director's dashboard of cleared, pending and expired athletes, export for a state audit.
- **Not doing:** scheduling, registration-fee payments, communication or newsletter features the district's student-information system already provides.
- **Effort:** 8 weeks.
- **Dependencies:** vision-LLM extraction, e-sign, a 50-state physical-exam and concussion-form rule table maintained over time, and district procurement processes (purchase orders, sometimes a security review, even though no HIPAA business-associate agreement applies since the school itself is not a covered entity handling this data as PHI).
- **Hardest part:** FinalForms and DragonFly MAX already hold most district contracts, and Arbiter's 2025 acquisitions of rSchoolToday and BigTeams show the category leader is still buying up the space.

### Score and verdict
A real, universal, season-driven compliance chore sits behind this idea, with a genuine AI wedge: reading doctors' own paperwork instead of requiring the district's digital form. Two incumbents already hold most district contracts, and the market leader is still consolidating the category: Pain 3 · Solo 3 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **18/30**.

---

## 55. Tournament and event operations for youth sports tournament directors

**One-liner.** Constraint-based bracket and field-schedule generation — team availability, field counts, official assignment, rest rules — for the volunteer or small-business tournament director running a weekend youth-sports event, priced per event instead of buried in a full club-management platform.

### Problem statement
US sports tourism produced $274.5 billion in total economic impact in 2025 (Sports ETA); participatory events, mostly youth and amateur, generated $60.1 billion in direct spending and $149.1 billion in total impact from 227.6 million travelers, overtaking spectator sports' share of the total (54% versus 46%) for the first time. Individual tournaments already move real money: the AAU Junior National Volleyball Championships generated $825.5 million in economic impact for Central Florida in 2025, and the AAU Junior Olympic Games about $90 million for Houston. Digital ticketing (GoFan, HomeTown Ticketing) already covers gate revenue for regular-season games at no platform fee to the school, so the underserved layer is the tournament itself: constraint-based scheduling across dozens to hundreds of teams in a single weekend. GotSport prices per player on a custom quote; SportsEngine Tourney starts around $69/month but its tournament tiers are unpublished; Exposure Events sells scheduling credits at $2 per visible team plus $30 per event for marketing (a 100-team bracket costs about $200 to schedule); LeagueLobster offers a free core tier per vendor comparisons; TeamSnap Tournaments and EventConnect both require a quote. None advertises AI-assisted scheduling; the category still sells manual bracket tools behind credit-based or opaque pricing.

### Who experiences the problem
Tournament directors running one-off or recurring weekend events across the sports generating the $149.1 billion above; many are club administrators or small event-management businesses running 5–20 events a year. A national count of "tournament directors" as a distinct role was not found; the buyer is the event organizer, and officials, coaches and parents are all downstream users of the schedule.

### Value of solving it
A single mis-scheduled bracket or field conflict at a 100–200 team event risks refunds and reputational damage on an event that may already have generated $200-plus in scheduling fees alone (Exposure Events' rate) before any gate or vendor revenue; instant, constraint-satisfying rescheduling when a field floods or a team withdraws is the core value, not independently quantified in dollars by any source found.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| GotSport | Per-player, custom quote | Full platform; heavy for a single-event director |
| SportsEngine Tourney | From ~$69/mo base tier | Tournament-specific pricing requires a quote |
| Exposure Events | $2 per visible team scheduled; $30/event marketing credit | Pay-per-use; no AI scheduling |
| LeagueLobster | Free core scheduling (per vendor comparisons) | Thin on constraint-based field/official assignment |
| TeamSnap Tournaments, EventConnect | Custom quote | Enterprise sales motion, dedicated account teams |

### Pricing model
Per event, not per month: $99 per weekend tournament up to 50 teams, $249 up to 200 teams, including field- and official-conflict scheduling and a free public bracket page — a flat, predictable alternative to Exposure Events' $2-per-team credit model.

### Path to profitability
At $150 average event fee you need 34 events a month for $5k MRR and 67 for $10k — achievable only with repeat directors running several events a year, since this is transactional rather than subscription revenue; a $49/month "director" tier bundling unlimited small events is worth testing once volume is proven. Distribution: youth-sports Facebook groups and subreddits by sport and region, AAU and USSSA event calendars, referee-assigning networks (a natural cross-sell with idea 51), and sponsoring a handful of visible regional tournaments as a loss-leader.

### Where AI is used
- **In the product:** constraint-based schedule generation (availability, field/court counts, rest rules, official double-booking) re-solved instantly when a team withdraws or a field closes for weather, plus natural-language rules input ("no team plays twice in a row on Field 3") instead of a rigid form.
- **To build it:** bracket and round-robin generation with constraint solving is a well-understood algorithmic problem, not an LLM task; the AI piece is translating a director's plain-English rules into the solver's format, and drafting parent or team communication when a schedule changes.

### MVP
- **Doing:** team/division import (CSV or manual), constraint-based schedule generation with live re-solve, a public bracket page, manual or API-based official assignment, Stripe checkout for entry fees.
- **Not doing:** gate ticketing (left to GoFan or HomeTown), hotel-block booking, livestreaming, split payments to multiple stakeholders.
- **Effort:** 7 weeks.
- **Dependencies:** an open-source constraint solver (e.g. OR-Tools), Stripe, CSV import compatible with common registration tools since directors will not re-enter rosters by hand.
- **Hardest part:** getting a director to trust an automated mid-event re-solve over a spreadsheet they already understand.

### Score and verdict
The biggest dollar number in the cluster sits behind this workflow, and nobody has shipped real constraint-solving with an AI rules interface at director-friendly pricing. The ceiling is capped by transactional, not subscription, revenue until a director runs enough events to justify a monthly plan: Pain 3 · Solo 4 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **20/30**.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 55 | Tournament and event operations for tournament directors | **20** | 150 | 67 | 7 |
| 51 | Officials assigning, availability and 1099 payment | **18** | 45 | 223 | 8 |
| 54 | High-school clearance, eligibility and physical forms | **18** | 85 | 118 | 8 |
| 52 | Youth sports club safety and credential compliance | **17** | 59 | 170 | 7 |
| 53 | Small-college athletics compliance workspace | **16** | 70 | 143 | 9 |

None of the five clears the 21-point shortlist bar used elsewhere in this research. The pattern is consistent across all five: two well-funded consolidators (Arbiter and Teamworks) already sit across officiating, K-12 registration and eligibility, and college compliance and NIL software, and the remaining buyers — volunteer boards, one-person compliance offices, part-time tournament directors — are exactly the segments this research's scoring framework marks down on reach and willingness to pay. The strongest of the five, tournament operations (55), scores well mainly because it is the one idea not already touched by either consolidator and sits on top of the cluster's single largest verified dollar figure ($149.1 billion in participatory sports-tourism impact); it is also the one idea whose revenue is per-event rather than monthly, which is the honest trade-off for that gap.

## Sources
- https://www.naso.org/state-of-the-association/
- https://www.naso.org/35813-individuals-respond-to-national-officiating-survey/
- https://nfhs.org/stories/number-of-officials-continues-to-rise-across-country
- https://nfhs.org/stories/officiating-shortage-reaches-crisis-level-all-groups-must-work-together
- https://www.assignr.com/pricing/
- https://arbiter.io/referee-assigning-software/
- https://arbiter.io/markets/assigning-software/
- https://www.arbiterpay.com/
- https://www.horizonwebref.com/?pageID=pricing
- https://www.avalara.com/blog/en/north-america/2025/07/one-big-beautiful-bill-act-1099-reporting-threshold.html
- https://www.cpapracticeadvisor.com/2025/07/30/one-big-beautiful-bill-act-changes-1099-thresholds/165863/
- https://sports.yahoo.com/article/much-ihsa-officials-per-game-085608992.html
- https://www.dreambigofficials.com/blog/how-much-are-high-school-football-referees-paid-per-game
- https://www.morningstar.com/news/pr-newswire/20250828la60782/arbiter-welcomes-bigteams-expanding-its-leadership-and-reach-across-us-high-schools
- https://www.prnewswire.com/news-releases/arbiter-welcomes-bigteams-expanding-its-leadership-and-reach-across-us-high-schools-302540732.html
- https://securesearchpro.com/youth-sports-background-check-requirements-by-state/
- https://www.lcwlegal.com/news/ab-506-imposes-mandated-reporter-training-and-prevention-policy-requirements-on-youth-service-organizations/
- https://legalclarity.org/california-ab-506-requirements-for-youth-organizations/
- https://investors.fadv.com/news-releases/news-release-details/first-advantage-completes-acquisition-sterling-check-22-billion
- https://www.globenewswire.com/news-release/2024/10/31/2972659/0/en/First-Advantage-Completes-Acquisition-of-Sterling-Check-for-2-2-Billion.html
- https://solutions.ncsisafe.com/by-organization/youth-sports-organizations/
- https://www.volunteerbadge.com/blog/volunteer-background-check-cost-2026
- https://www.sportsengine.com/motion/pricing/
- https://sfia.org/resources/how-many-youth-sports-coaches-are-there-in-the-u-s/
- https://ncys.org/
- https://ncys.org/about-us/meet-our-partners/
- https://projectplay.org/state-of-play-2025/coaching-trends
- https://projectplay.org/state-of-play-2025/participation-trends
- https://www.ropesgray.com/en/insights/alerts/2025/06/house-v-ncaa-settlement-approved-era-of-direct-payments-to-college-athletes-begins
- https://www.ncaa.org/news/2025/6/23/media-center-di-board-of-directors-formally-adopts-changes-to-roster-limits.aspx
- https://www.ncaa.org/what-we-do/programs/compliance-assistant/
- https://teamworks.com/compliance
- https://www.imgacademy.com/news/teamworks-acquires-front-rush-inventory-management-solution
- https://www.athleticbusiness.com/industry-press-room/article/15147745/active-network-acquires-jumpforward-to-offer-a-comprehensive-technology-solution-to-collegiate-sports-programs
- https://www.activenetwork.com/jumpforward
- https://www.ncaa.org/news/2025/7/10/media-center-4-schools-to-become-active-dii-members-sept-1.aspx
- https://www.ncaa.org/media-center-2-schools-to-become-active-diii-members-sept-1/
- https://en.wikipedia.org/wiki/List_of_NAIA_institutions
- https://www.njcaa.org/general/2025-26/releases/20250805mwpjrr
- https://www.njcaa.org/eligibility/member_college/headlines-featured
- https://nacda.com/sports/naac/
- https://www.sportico.com/leagues/college-sports/2025/deloitte-college-sports-consulting-nil-go-1234854616/
- https://www.collegesportscommission.org/nil/
- https://www.nilrevolution.com/2025/05/nil-go-deloitte-establishes-basic-framework-to-review-third-party-nil-deals/
- https://assets.nfhs.org/umbraco/media/7212351/2022-23_participation_survey.pdf
- https://nces.ed.gov/ccd/tables/202425_summary_2.asp
- https://nces.ed.gov/fastfacts/display.asp?id=84
- https://www.finalforms.com/finalforms-pricing/
- https://www.dragonflymax.com/
- https://www.bigteams.com/products/bigteams-eligibility-central/
- https://nfhs.org/stories/legal-perspectives-recommendations-on-state-concussion-laws
- https://www.shapeamerica.org/MemberPortal/standards/guidelines/Concussion/state-policy.aspx
- https://home.gotsport.com/competition-solution/
- https://www.sportsengine.com/tourney/
- https://exposureevents.com/pricing
- https://www.sportsleaguesoftware.com/post/top-10-youth-sports-tournament-software-platforms
- https://www.sportsfirst.net/post/tournament-management-system-pricing-in-the-us-what-you-ll-pay-why
- https://www.thesportsexaminer.com/sports-economics-sports-eta-report-shows-youth-and-amateur-events-have-more-economic-impact-than-spectator-sports-in-2025/
- https://www.insideworldfootball.com/2026/04/22/us-sports-tourism-generated-274-5bn-economic-impact-2025-finds-sports-eta-report
