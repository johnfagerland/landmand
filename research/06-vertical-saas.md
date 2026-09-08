# 06 — Vertical SaaS: health, education, hospitality, associations (ideas 44–50)

Seven ideas in verticals where the buyer is a clinic, a teacher, a restaurant, a nonprofit, a tour operator or a volunteer board. The research shows why most are hard for a solo founder in the US: the buyers with money (clinics) sit behind practice-management systems that charge for API access and bundle the feature; the buyers without money (teachers, clubs) already have free or tip-funded tools. Two things change the picture versus a generic view: Medicare reimbursement turns the exercise app (44) from a cost into a revenue line for clinics, and California's SB 68 puts a July 2026 deadline on allergen disclosure for restaurant chains (47). The strongest idea remains clinic recall (46), with strong clinical evidence and business-grade pricing.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 44. Home-exercise programme builder with Remote Therapeutic Monitoring billing

**One-liner.** A physical therapist builds a video exercise programme from the evaluation note in two minutes; the patient app logs adherence and pain; the clinic bills Medicare's Remote Therapeutic Monitoring codes from the logged interactions, with the monthly note drafted automatically.

### Problem statement
Non-adherence to home exercise runs 50–70%; video delivery lifts three-month adherence to 76% versus 55% for paper. In the US this is also a billing problem: CPT codes 98975–98981 have paid for Remote Therapeutic Monitoring since 2022, the 2026 fee schedule added new codes (98979 for shorter management, 98984–98986 for 2–15 day device supply), and vendors quote 2026 national rates of about $22 for setup, $40 for device supply and $54 for the first 20 minutes of management. One Medicare patient yields roughly $47–118 a month; claims volume is up about 400% since 2022. FDA's January 2026 general-wellness guidance confirms that exercise software without disease claims is not a device, and RTM "devices" are typically Class I. The category is consolidating: Net Health bought Keet from WebPT and now owns Limber Health; Sword paid $285 million for Kaia. Practice-management systems bundle home programmes (Prompt "Engage", WebPT), and HHS's inspector general has flagged remote-monitoring audit risk.

### Who experiences the problem
Outpatient physical-therapy, occupational-therapy and chiropractic clinics: 283,700 physical therapists, about 70,000 chiropractors, over 37,000 outpatient rehab clinics where the largest operator has about 5% share. The buyer is the clinic owner or biller; users are clinician and patient.

### Value of solving it
Reimbursement: 30 active RTM patients are about $2,550–4,050 a month for a clinic, against software and admin costs of $15–40 per patient-month. The documentation for the management codes (interactive communication, minutes) is where time goes and where audits bite.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Physitrack | Exercise library plus RTM add-on | $23.99 per user/mo; RTM $30 per user plus $8 per active patient | Auto-logout and app complaints; no EMR |
| MedBridge | Education plus HEP | $325/yr individual; group quote with per-episode overage | Complex |
| Limber Health, Keet (Net Health) | RTM-first, full-service monitoring | Quote-only | Roll-up, no Epic integration listed |
| OneStep | Phone-camera gait analysis, $48M raised | Quote | Small provider base |
| MovementRx | RTM software or service | $15 per active patient/mo, or about 55% revenue share | Shows the two models |
| WebPT, Prompt Health, PtEverywhere | EMRs with bundled HEP and RTM | $75–$289 per provider/mo | Bundling |
| SimpleSet, Rehab Guru | Cheap HEP | $12–$20/mo | No billing |

### Pricing model
Per active RTM patient, $10 a month, plus a $29 per clinician seat for the programme builder. Aligns the price with the clinic's reimbursement.

### Path to profitability
At $150 ARPU (a clinic with 10–15 active RTM patients) you need 34 clinics for $5k MRR and 67 for $10k. The economics are the best in this cluster because the product pays for itself out of reimbursement. The costs are the gate: a licensed or produced exercise video library, HIPAA business-associate agreements with every vendor in the stack, and a claims export path (837P via a clearinghouse or the EMR). Distribution: state PT associations, private-practice Facebook groups, billing consultants.

### Where AI is used
- **In the product:** drafting programmes from evaluation notes, adherence-driven progression, triaging patient messages, Spanish instructions, checking billing eligibility (16-day thresholds, one-biller rule) and drafting the monthly management note from real logged interactions. Anything that infers "minutes" that did not happen is false-claims exposure; camera form-scoring drifts toward device claims.
- **To build it:** patient app, programme builder and dashboards are standard; the claims and HIPAA layers are not, and the video library is a content project, not a coding one.

### MVP
- **Doing:** programme builder on a licensed library, patient app with adherence and pain logging (the "device"), eligibility checks, monthly note drafting, RTM billing report and 837P export through one clearinghouse, HIPAA-compliant hosting and messaging.
- **Not doing:** EMR replacement, telehealth, camera analysis, commercial-payer contracting.
- **Effort:** 10 weeks plus content licensing.
- **Dependencies:** exercise video licence, Supabase HIPAA add-on and BAA, Twilio HIPAA, clearinghouse API, LLM vendor BAA.
- **Hardest part:** the content library and the audit exposure of billing automation.

### Score and verdict
Pain 3 · Solo 2 · AI 3 · Gap 2 · WTP 4 · Reach 3 = **17/30**. Reimbursement makes this a revenue product for clinics, which lifts willingness to pay, but the content, HIPAA and billing gates keep it out of solo range. Consider it only with a content partner.

---

## 45. Independent tutor and music teacher management

**One-liner.** Scheduling, make-up credits, invoicing and parent updates for a teacher with 20–60 students, with reminder texts that comply with TCPA consent rules.

### Problem statement
The incumbents are old and loved but dated: My Music Staff and TutorBird charge $16.95 a month plus $4.95 per extra teacher (an eight-teacher studio roughly triples its bill), pool make-up credits and lack a native mobile app; TutorCruncher has a steep learning curve. Automated reminder texts to parents fall under the TCPA (prior express consent; $500 per text statutory damages, trebled if wilful; revocation must be honoured within ten business days since April 2025), and under-13 users trigger COPPA. IBISWorld counts 176,000 tutoring and driving-school businesses and 20,000 online tutoring businesses.

### Who experiences the problem
BLS counts 162,300 employed tutors and 272,110 self-enrichment teachers, with the latter growing 19% a decade; self-employed teachers are not in those figures. The buyer is the teacher or studio owner; users are teacher, parents and students.

### Value of solving it
Fewer missed lessons and faster payment; willingness to pay is $15–20 a month, as the incumbents show.

### Main competitors
| Product | Published pricing |
|---|---|
| My Music Staff, TutorBird | $16.95/mo plus $4.95 per teacher |
| Teachworks | $16.49–$187.99/mo plus per-lesson fees |
| TutorCruncher | $30–$80/mo plus 1% |
| Fons, Duet | $19.95/mo; $20/mo or $99/yr plus 1% |
| Opus1.io (schools) | $98–$325/mo |
| Acuity plus Stripe | $20–$61/mo |

### Pricing model
Flat $19 a month per studio, unlimited teachers, which is the incumbents' weakness.

### Path to profitability
At $18 ARPU you need 278 studios for $5k MRR and 556 for $10k, against fifteen-year-old incumbents and "Calendly plus Stripe". Not attractive.

### Where AI is used
Voice lesson notes to parent summaries, practice plans, invoice chasing, make-up scheduling. Small.

### MVP
- **Doing / not doing:** not recommended as a business; a fine side project.
- **Effort:** 5 weeks.
- **Dependencies:** Stripe Connect, calendar sync, Twilio with consent capture and STOP handling, QuickBooks export.
- **Hardest part:** tiny ARPU.

### Score and verdict
Pain 2 · Solo 5 · AI 3 · Gap 2 · WTP 2 · Reach 3 = **17/30**. Easy, pleasant, too small.

---

## 46. Small clinic recall and no-show reduction

**One-liner.** Two-way SMS recalls and reminders for dental, veterinary and physical-therapy practices that understand "can I move it to Thursday", rebook automatically, backfill cancelled slots from a waitlist, and keep a TCPA-safe consent ledger.

### Problem statement
Dental no-show rates run 15–20% and each missed slot costs $200–400 of production; a Cochrane review of eight trials found SMS reminders lift attendance from 67.8% to 78.6% at 55–65% lower cost than calls. The US market is large and priced high (Weave from $199 a month plus setup fees, NexHealth from about $299, Solutionreach on annual contracts), and the practice-management systems have started bundling one-way reminders (Jane App includes unlimited free SMS reminders; Open Dental sells eConfirmations at $25 a month). Two gates define the product. First, TCPA: the FCC's healthcare exemption allows free appointment reminders without prior consent within limits (one a day, three a week, no marketing), but recall and marketing texts need prior express written consent, revocation must be honoured within ten business days, and after the Supreme Court's June 2025 McLaughlin decision courts no longer defer to FCC interpretations, so litigation risk is up. Second, integration: Dentrix charges $5,000 plus $5,000 for read and write access plus royalties, Curve has no self-serve API, while Open Dental's API is free and NexHealth's Synchronizer resells access to 15+ systems at $0.10 per call.

### Who experiences the problem
205,088 professionally active dentists (16% in DSO-affiliated practices), over 30,000 veterinary practices mostly with one to three vets, over 37,000 outpatient rehab clinics. The buyer is the owner or office manager; the user is the front desk.

### Value of solving it
One recovered slot a day at $200–400 is $50k+ a year per dental practice; the Cochrane effect on a 20-patient day is about two slots.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Weave | Phones, texts, payments | From $199/mo per location; Pro $249; setup $500–750 | Phone bundle |
| NexHealth | Scheduling, recall, waitlist via Synchronizer | About $299–350/mo | Modular quote |
| Solutionreach, RevenueWell, Dental Intelligence | Dental engagement suites | Quote; from $189; from $399 | Annual contracts |
| PetDesk, Vello, Otto (vet) | IDEXX-ecosystem communication partners | Quote | Ecosystem-gated |
| Jane App, Cliniko, Open Dental | Practice systems with bundled reminders | $54–$395/mo; $25/mo add-on | One-way only |

### Pricing model
Per location, $149 a month including 1,000 messages, $299 for multi-provider practices; messages at cost beyond.

### Path to profitability
At $200 ARPU you need 25 practices for $5k MRR and 50 for $10k. Practices churn slowly once recall lists live in the tool. Costs: SMS (about 1 cent per message), NexHealth Synchronizer fees, LLM intent handling (cents). Pick one system with open or resold access (Open Dental for dental, Jane or Cliniko for PT, ezyVet with partner approval for vets) and one specialty. Distribution: state dental associations, dental Facebook groups, consultants who sell "recall systems", and the Open Dental user community.

### Where AI is used
- **In the product:** two-way SMS intent handling (reschedule, cancel, question) with automatic rebooking and waitlist backfill, no-show risk scoring from history, per-procedure recall copy in English and Spanish, summaries of replies for the front desk, and explicit classification of each message as healthcare (exempt) or marketing (consent required) for TCPA. This is the differentiator over bundled one-way reminders.
- **To build it:** SMS gateway, scheduling logic and dashboards are standard; the PMS connectors are the work.

### MVP
- **Doing:** one vertical with an accessible system (Open Dental first), appointment sync, reminder and recall sequences, two-way SMS with AI intent and rebooking, waitlist backfill, consent ledger with STOP handling, no-show risk flag, weekly recovered-revenue report.
- **Not doing:** payments, phones, online booking widgets, Dentrix and Eaglesoft until revenue justifies the fees.
- **Effort:** 7 weeks.
- **Dependencies:** Open Dental API key (1–3 days), NexHealth Synchronizer for expansion, Twilio with 10DLC registration and a HIPAA BAA, hosting BAA, LLM vendor BAA, SOC 2 evidence for DSO buyers later.
- **Hardest part:** API gatekeepers and TCPA litigation exposure; basic reminders are becoming free.

### Score and verdict
Pain 4 · Solo 3 · AI 4 · Gap 2 · WTP 4 · Reach 3 = **20/30**. The best vertical idea: clinical evidence, $150–300 a month price points already paid, reachable buyers, and an AI wedge (two-way handling and backfill) the bundled reminders lack. Integration access decides it.

---

## 47. Restaurant allergen matrix and menu compliance

**One-liner.** Upload supplier spec sheets and recipes; the tool extracts the nine major allergens and "may contain" warnings, builds the dish-level matrix, publishes menu disclosures and QR menus that satisfy California SB 68 and state training laws, and logs staff training.

### Problem statement
Federal law requires calorie labelling for chains with 20+ locations (21 CFR 101.11, since 2018) and the Food Code requires the person in charge to know the nine major allergens (sesame since January 2023). States have layered on training and notice laws (Massachusetts, Rhode Island, Michigan, Virginia, Maryland, Illinois with gluten content from January 2026, Connecticut from January 2025, New York), and California's SB 68, signed 13 October 2025, is the first to mandate written disclosure of the nine allergens on menus for chains of 20+ locations, with compliance from 1 July 2026. Restaurants rebuild the allergen matrix by hand at every menu change; a 2025 wrongful-death suit against a Las Vegas restaurant after a disclosed shellfish allergy shows the tort exposure. The tools are recipe-costing products (meez, Galley, MarketMan) with allergen tags as a side feature, or UK-centric compliance tools; no AI-native allergen extractor was found.

### Who experiences the problem
412,498 independent restaurant locations (down 2.3% in 2025) and 263,000+ chain units. Chains with 20+ units are the legally bound buyer for menu labelling and SB 68; independents are bound by Food Code and state training rules. The buyer is the owner, operations lead or franchisee; the user is the chef.

### Value of solving it
Avoided citations and SB 68 recordkeeping burden, tort defence (a documented matrix and training log), hours per menu change. Not quantified.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| meez | $19–$199/mo | Recipes first; allergens as tags |
| Galley | Free; SMB $99/mo; nutrition at enterprise | Costing first |
| MarketMan | $199–$249/mo, 12-month contracts | Inventory first |
| Toast | Allergen tags on online ordering; POS pricing not public | Bundled, shallow |
| MenuCalc, Nutritics | Quote; about $21 per feature | US and UK compliance tools, dated |
| FoodDocs | $99–$299 per site/mo | HACCP first |
| Menu Tiger | Free to $119/mo | QR menus without allergen logic |

### Pricing model
Per location for independents ($49 a month) and per brand for regional chains of 20–150 units ($299–999 a month with multi-location matrix management), which is the buyer the law created.

### Path to profitability
At $120 blended ARPU you need 42 customers for $5k MRR and 84 for $10k. Ten regional chains at $499 gets you to $5k. Distribution: state restaurant associations (the California Restaurant Association is already publishing SB 68 guidance), franchise consultants, food-safety trainers, and content on the state-by-state patchwork. Independents churn with closures; chains do not.

### Where AI is used
- **In the product:** extracting allergens and "may contain" statements from supplier spec PDFs, photos and USDA FoodData Central into the recipe-to-dish matrix, generating the SB 68 menu disclosure and QR output, Spanish translation, staff training quizzes. Human sign-off is mandatory because a missed allergen is a tort event.
- **To build it:** recipe and matrix logic is standard; the rules engine needs the federal and state texts, which are short.

### MVP
- **Doing:** spec-sheet upload and extraction, recipe builder with allergen roll-up, dish matrix per location with change log, SB 68 menu disclosure export and QR menu, staff training record, state-rule checklist.
- **Not doing:** nutrition declarations (idea 40), inventory, POS integration at launch.
- **Effort:** 6 weeks.
- **Dependencies:** USDA FoodData Central API (free), Open Food Facts, supplier PDFs, LLM, QR hosting, liability insurance.
- **Hardest part:** the buyer with the legal duty (chains) buys through procurement; the buyer that is easy to reach (independents) pays little.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **19/30**. A dated-incumbent category with a new California deadline and an extraction problem that fits current models. Sell to regional chains, not to single restaurants.

---

## 48. Nonprofit grant discovery, deadline tracking and AI proposal drafting

**One-liner.** A profile of the organisation, opportunity matching across foundations and government programmes, a deadline calendar, and proposal drafts written from the organisation's own past applications and Form 990 data, priced for organisations under $500k.

### Problem statement
Early 2025 brought a funding shock: one third of public charities surveyed by the Urban Institute experienced government funding disruption, 21% lost a grant or contract, and disrupted organisations drew 42% of revenue from government. Demand for replacement foundation funding rose accordingly. The tools are priced for mid-size organisations: Instrumentl at $299–999 a month (4,500 customers, $55 million raised), Candid Premium at $219 a month, GrantStation at $199–699 a year; AI-native Grantable starts at $50 a month with drafting but no discovery. The long tail is enormous: 1.3 million organisations file the 990-N postcard because they have under $50k of gross receipts.

### Who experiences the problem
1.54 million 501(c)(3) organisations, plus 71,000 (c)(4), 59,000 (c)(6) and 46,000 (c)(7). The buyer is the executive director or development lead; the user is the grant writer or a consultant serving several organisations.

### Value of solving it
A lost $50k grant versus $600–1,800 a year of software; vendor claims of 50–90% less proposal time.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Instrumentl | $299–$999/mo | Price for small orgs |
| Candid | Free; Premium $219/mo; Ultimate $1,699/yr | Data owner, free tier |
| GrantStation | $199–$699/yr | Dated |
| Grantable | Free; $50–$150/mo; Agency Hub $300 | Drafting without discovery |
| Grant Assistant | Quote | AI-native, enterprise |
| Submittable, Foundant, Fluxx | Grantmaker side | |

### Pricing model
$79 a month per organisation with unlimited users; $249 a month consultant tier for multiple clients; 50% off under $250k budgets.

### Path to profitability
At $80 ARPU you need 63 organisations for $5k MRR and 125 for $10k. The data moat belongs to Candid and Instrumentl, so the product must win on the drafting workflow (organisation memory, 990 data, reporting) with discovery from free sources (Grants.gov, IRS master file, ProPublica). Distribution: TechSoup, state nonprofit associations, grant-writing consultants who need a client portal.

### Where AI is used
Profile-to-opportunity matching, deadline and eligibility extraction from PDFs, proposal drafting from past applications and 990 data, report drafting. Hallucinated deadlines and one-click submission are the risks.

### MVP
- **Doing:** organisation profile from the IRS master file and 990 data, Grants.gov and foundation matching, deadline calendar, proposal drafting with past-application memory, Word export, consultant workspace.
- **Not doing:** Candid data licensing at launch, submission, grantmaker features.
- **Effort:** 7 weeks.
- **Dependencies:** Grants.gov APIs, IRS EO BMF and 990-N extracts, ProPublica Nonprofit Explorer API, foundation-site scraping, LLM.
- **Hardest part:** the data moat and small-organisation willingness to pay.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **18/30**. A large, reachable, currently distressed customer base behind two data-rich incumbents. Viable as a drafting-first product for the long tail.

---

## 49. Small tour and activity operator booking, waivers and capacity

**One-liner.** Bookings, capacity, state-aware digital waivers, guide assignment and weather-driven cancellation messaging for guided tours, charters and outfitters, at a flat price instead of a 6% commission.

### Problem statement
FareHarbor charges 6% per direct booking plus 1.9% + $0.30 processing, effectively 9–11% of every sale, with a further OTA fee reportedly added in 2026; operators actively search for alternatives. The alternatives are $49–249 a month plus 1–3% (Rezdy, Checkfront, TrekkSoft) or free tiers tied to Viator (Bókun). Waiver law is a state patchwork: Louisiana, Montana and Virginia do not enforce pre-injury releases and 17 states reject parental waivers for minors, so a state-aware waiver engine is a genuine differentiator. The global tours and activities market is about $271 billion in 2025.

### Who experiences the problem
Guided tours, charters, outfitters and small attractions; US establishment counts were not retrievable this pass. The buyer is the owner; users are guides and customers.

### Value of solving it
An operator with $200k of online sales pays about $12k a year in FareHarbor fees versus $600–3,000 on flat plans; waivers cost $19+ a month separately; weather cancellations are handled by hand.

### Main competitors
| Product | Model | Gap |
|---|---|---|
| FareHarbor (Booking Holdings) | 6% plus processing, no monthly | Fees |
| Peek Pro, Xola | About 6%; partner fee | Weak for rentals |
| Bókun (Viator) | Free; $49–$499/mo plus 1–1.5% | OTA lock-in |
| Rezdy, Checkfront, TrekkSoft | $49–$249/mo plus 1–3% | Similar |
| Smartwaiver, WaiverSign | From $19/mo | Waivers only |

### Pricing model
$99 a month flat with payments at cost and no booking fee; waivers included.

### Path to profitability
At $99 ARPU you need 51 operators for $5k MRR and 101 for $10k. Seasonality is the drag, and the online travel agencies control demand. Distribution: outfitter associations (America Outdoors), charter-boat forums, state tourism offices.

### Where AI is used
Weather-driven cancellation and reschedule messages drafted per booking from the free NWS API, review replies, Spanish listings, capacity forecasting, waiver risk flags by state. Useful, not decisive.

### MVP
- **Doing:** products and schedules, capacity, Stripe checkout, state-aware digital waivers with minor-consent logic, guide assignment, NWS-driven weather alerts with drafted messages, iCal export.
- **Not doing:** OTA channel management at launch (v2 via Viator), packages, gift cards.
- **Effort:** 7 weeks.
- **Dependencies:** Stripe, NWS API, e-signature, later Viator Partner API.
- **Hardest part:** seasonality and OTA-owned distribution.

### Score and verdict
Pain 3 · Solo 3 · AI 3 · Gap 2 · WTP 3 · Reach 3 = **17/30**. A fee-driven switching market that the online travel agencies are steadily absorbing. Skip unless you are embedded in a tourism region.

---

## 50. Club, league and association membership, dues and volunteer scheduling

**One-liner.** Members, registration and dues at Stripe cost, events, volunteer shift scheduling and communications for youth leagues, clubs and community organisations.

### Problem statement
The youth-sports incumbents monetise through fee stacks: SportsEngine charges $799–2,199 a year plus 3.2–4.5% and $1–2 per registration, with minimum processing volumes and setup fees reviewers put above $6,000; LeagueApps takes an undisclosed percentage per transaction. At the other end, free platforms have reset expectations: Zeffy is fully free and tip-funded (over $1 billion processed), Givebutter is free with tips or a 3% flat fee, TeamSnap is free for teams, Planning Center is free for church member records. Volunteer boards are slow, price-sensitive and turn over annually.

### Who experiences the problem
96,874 amateur sports clubs and leagues (29,597 under $250k revenue), 46,441 social and recreation clubs, 1.54 million 501(c)(3) organisations; Little League alone has 7,400 leagues. The buyer is the volunteer board or treasurer; users are members, parents and volunteers.

### Value of solving it
Fee spread: a 500-registration league at $150 average pays about $3,400–4,400 a year in SportsEngine fees plus the subscription, against Stripe's 2.9% + 30¢. Volunteer scheduling has no priced US benchmark.

### Main competitors
| Product | Published pricing |
|---|---|
| SportsEngine (NBC Sports) | $799–$2,199/yr plus 3.2–4.5% + $1–2 per registration |
| LeagueApps | Setup fee plus per-transaction percentage |
| TeamSnap | Teams free; clubs quote |
| Zeffy, Givebutter | Free, tip-funded; Givebutter 3% or $29/mo Plus |
| Wild Apricot, Join It, ClubExpress | $29–$226/mo |
| Bloomerang, Neon CRM | $79–$439/mo |
| Planning Center (churches) | Free people module; $15–$239/mo modules |

### Pricing model
$49 a month flat with Stripe at cost, or free with optional supporter tips (the Zeffy model).

### Path to profitability
At $50 ARPU you need 100 organisations for $5k MRR and 200 for $10k, against free platforms and governing bodies that mandate SportsEngine or LeagueApps. Not attractive.

### Where AI is used
Volunteer shift matching by availability and skills, dues chasing, board minutes and newsletters, roster deduplication, 990-N deadline reminders. Nice, not decisive.

### MVP
- **Doing / not doing:** not recommended; the volunteer-scheduling module with AI matching could be sold as an add-on to existing platforms.
- **Effort:** 7 weeks.
- **Dependencies:** Stripe Connect, SMS with consent, background-check partner for youth coaches, COPPA.
- **Hardest part:** free platforms and mandated systems.

### Score and verdict
Pain 2 · Solo 3 · AI 3 · Gap 2 · WTP 2 · Reach 3 = **15/30**. Reachable, lovable, already served for free. Skip.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 46 | Clinic recall and no-show reduction | **20** | 200 | 50 | 7 |
| 47 | Restaurant allergen matrix (SB 68) | **19** | 120 | 84 | 6 |
| 48 | Nonprofit grant discovery and drafting | **18** | 80 | 125 | 7 |
| 44 | Home-exercise builder with RTM billing | **17** | 150 | 67 | 10 |
| 45 | Tutor and music teacher management | **17** | 18 | 556 | 5 |
| 49 | Tour and activity operator booking | **17** | 99 | 101 | 7 |
| 50 | Club and league membership | **15** | 50 | 200 | 7 |

## Sources
- https://www.tenovi.com/rtm-cpt-codes-2026/
- https://www.nixonlawgroup.com/resources/cms-finalizes-2026-remote-monitoring-reimbursement-updates-what-changed-for-rpm-and-rtm
- https://www.federalregister.gov/documents/2025/11/05/2025-19787/medicare-and-medicaid-programs-cy-2026-payment-policies-under-the-physician-fee-schedule-and-other
- https://vmghealth.com/insights/blog/remote-therapeutic-monitoring-implications-for-physical-therapy-operators/
- https://www.sprypt.com/blog/exploring-remote-therapeutic-monitoring-rtm-and-its-advantages-for-pt-clinics
- https://mymovementrx.com/best-rtm-software-for-physical-therapy-clinics-2026-buyers-guide/
- https://www.physitrack.com/insights/best-rtm-software-physical-therapy
- https://support.physitrack.com/article/159-how-much-does-physitrack-cost
- https://www.cov.com/en/news-and-insights/insights/2026/01/fda-issues-revised-guidance-on-general-wellness-products
- https://en.wikipedia.org/wiki/OneStep
- https://www.webpt.com/products/keet
- https://www.limberhealth.com/
- https://www.pteverywhere.com/pricing
- https://www.bls.gov/ooh/healthcare/physical-therapists.htm
- https://www.withorbital.com/data/how-many-chiropractors-in-the-us/
- https://oig.hhs.gov/reports/all/2024/additional-oversight-of-remote-patient-monitoring-in-medicare-is-needed/
- https://www.bls.gov/oes/2023/may/oes253041.htm
- https://www.bls.gov/oes/2023/may/oes253021.htm
- https://www.ibisworld.com/united-states/number-of-businesses/tutoring-driving-schools/1544
- https://www.law.cornell.edu/uscode/text/47/227
- https://bassberry.com/news/tcpa-exemptions-for-healthcare-companies/
- https://natlawreview.com/article/upcoming-telephone-consumer-protection-act-tcpa-changes-2025
- https://www.consumerfinancialserviceslawmonitor.com/2026/01/fcc-further-extends-effective-date-for-tcpa-revoke-all-rule/
- https://www.faegredrinker.com/en/insights/publications/2025/6/supreme-court-decides-mclaughlin-chiropractic-associates-v-mckesson-corp
- https://ddp.dentrix.com/pages/faq
- https://www.opendental.com/site/apisetup.html
- https://www.opendental.com/site/fees.html
- https://supergood.ai/api-report-card/curve-dental
- https://synchronizer.nexhealth.com/
- https://developers.ezyvet.com/
- https://software.idexx.com/neo-integrations
- https://developers.jane.app/docs/getting-started
- https://jane.app/pricing
- https://www.getweave.com/pricing/
- https://www.themolarreport.com/learn/weave-pricing
- https://www.nexhealth.com/pricing
- https://softwarefinder.com/emr-software/revenuewell
- https://www.selecthub.com/p/dental-software/dental-intelligence/
- https://www.ada.org/resources/research/health-policy-institute/dentist-workforce
- https://hellopearl.com/blog/dentist-workforce-statistics-2026-trends-and-insights-pearl-ai
- https://co.vet/post/veterinarian-facts/
- https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/menu-labeling-requirements
- https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies
- https://www.fda.gov/media/164231/download
- https://www.foodallergy.org/our-initiatives/advocacy/know-your-rights/food-allergies-and-food-service-establishments
- https://www.gtlaw.com/en/insights/2025/9/california-poised-to-become-first-state-to-mandate-food-allergen-disclosures-for-restaurants-sb-68-awaits-gov-newsoms-signature
- https://www.calrest.org/allergen-disclosures-sb-68
- https://aaafoodhandler.com/food-allergen-law/
- https://snacksafely.com/2025/01/family-sues-vegas-restaurant-for-anaphylactic-death-longhorn-sued-for-landing-diner-in-er-trigger-warning/
- https://www.nrn.com/independent-restaurants/the-independent-restaurant-sector-shrunk-by-2-3-in-2025
- https://www.getmeez.com/pricing
- https://www.galleysolutions.com/blog/new-pricing-for-smb-kitchens
- https://www.g2.com/products/marketman/pricing
- https://support.toasttab.com/en/article/Add-Allergen-Information-to-Online-Ordering-Menu-Items
- https://www.urban.org/research/publication/how-government-funding-disruptions-affected-nonprofits-early-2025
- https://ministrywatch.com/data-book-brief-a-look-at-tax-exempt-activity-in-2024/
- https://nccs.urban.org/nccs/datasets/postcard/
- https://www.irs.gov/charities-non-profits/exempt-organizations-business-master-file-extract-eo-bmf
- https://www.instrumentl.com/pricing
- https://candid.org/pricing/
- https://www.grantable.co/pricing
- https://www.sportwaiver.com/waivers-for-minor-participants-statutes-relating-to-particular-activities-part-i/
- https://nonprofitrisk.org/resources/waivers-and-young-participants/
- https://arival.travel/research/the-outlook-for-operators-the-state-of-tours-activities-attractions/
- https://www.bokun.io/pricing
- https://rezdy.com/pricing/
- https://www.checkfront.com/pricing/
- https://equipdash.com/fareharbor-alternatives
- https://www.waresport.com/blog/sportsengine-pricing-2026-hidden-fees-vs-waresport
- https://leagueapps.com/pricing/
- https://www.teamsnap.com/pricing
- https://www.zeffy.com/home/free-online-fundraising-platform
- https://givebutter.com/pricing
- https://help.planningcenter.com/en/136790-planning-center-pricing.html
- https://www.causeiq.com/directory/amateur-sports-clubs-list/
- https://www.wildapricot.com/pricing
- https://www.joinit.com/pricing
