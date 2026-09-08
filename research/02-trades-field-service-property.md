# 02 — Trades, field service & property (ideas 8–16)

Nine ideas where the buyer is a small business that does physical work or owns physical assets. The US has 521,315 specialty-trade contractor establishments with employees (80% under ten staff) plus 1.9 million one-person trade businesses, 254,630 general-contractor establishments, 19.3 million rental properties and 373,000 community associations. These buyers pay business prices, and their paperwork can now be captured by a phone. The obstacle in every category is a funded US incumbent, so the wedge has to be a state law (California's 2025 photo mandate for deposits, Florida's condo reserve-study statute), a data source (free federal imagery and lidar), or a segment the incumbents price out (small property managers, self-managed boards).

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 8. AI estimating and quoting for small trades from photos and voice

**One-liner.** An electrician or plumber walks the job, takes five photos and talks for two minutes; the app produces an itemised quote from their own price book, in English or Spanish, ready to send and e-sign, and pushes the accepted quote into QuickBooks.

### Problem statement
Jobber's 2026 survey of 1,050 US home-service owners found quoting among the three activities that consume most daily time (37%), that only 20% of pros reply to leads within an hour while 55% of customers expect it, and that 52% of owners already use AI. Housecall Pro's 2025 report says AI adopters reclaimed over four hours a week from admin. The incumbents ship text-only quote drafting (Jobber Copilot, Tradify SmartWrite on its top plan) and no photo estimating (Housecall Pro). But a wave of AI-native tools has already arrived: QuoteIQ sells photo-to-quote with satellite measuring from $29.99 a month, Contractor+ added "Estimatic AI", and VoxTrade and AirQuote sit at $10–12 a month, which sets a low price floor. QuoteIQ's "market-accurate" pricing claim is the liability to avoid; unit prices must come from the firm's price book.

### Who experiences the problem
521,315 employer specialty-trade establishments (80% under ten employees), 1.92 million non-employer specialty-trade businesses, 135,337 residential remodelers. The buyer and user are the owner-operator; an office manager appears at about five staff.

### Value of solving it
Four recovered hours a week at $75–150 billable is $15–30k a year of capacity; faster quotes win more work, though no neutral win-rate figure exists.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Jobber | Field-service leader | $29–$299/mo; AI Receptionist $29 | Copilot quotes from text only |
| Housecall Pro | Field service with "AI Team" | $59–$329/mo | No photo or voice estimating |
| QuoteIQ | AI-native photo-to-quote with satellite measuring | $29.99–$699/mo, credit-metered | LLM-guessed "market" prices |
| Contractor+ | Solo app with Estimatic AI | Free; $29–$58/mo with credits | Thin field-service features |
| VoxTrade, AirQuote | Voice and AI quotes | $10–$12/mo; lifetime $119 | Set the floor |
| Joist | Solo quoting and invoicing | $12–$100/mo | No site-walk capture |
| Tradify, Fergus, Estimate Rocket | Trades job management | $47–$139/mo | Per seat; dated |
| ServiceTitan | Enterprise | Quote | Overkill |

### Pricing model
Per firm, not per seat: $49 a month for one user, $99 for up to five, unlimited quotes, Spanish included.

### Path to profitability
At $59 ARPU you need 85 firms for $5k MRR and 170 for $10k. Costs: speech-to-text and vision extraction are cents per quote. Distribution: Jobber's app marketplace (350,000 pros), supply houses, trade Facebook groups, Spanish-language contractor networks. Churn is moderate; quotes are not compliance records. The US gap that existed in 2024 is closing fast.

### Where AI is used
- **In the product:** photos plus voice memo to structured scope and quantities, matching to the firm's price book, bilingual quote text, follow-up nudges. The trap is invented unit prices.
- **To build it:** the app is standard; the extraction prompt must be iterated against 50 real site walks collected from design partners before much code is written.

### MVP
- **Doing:** price-book import (CSV, QuickBooks items), photo-plus-voice capture, AI draft quote with line-by-line confirm, bilingual PDF, e-sign, QuickBooks Online push, SMS follow-up with TCPA consent capture.
- **Not doing:** scheduling, dispatch, timesheets, inventory, payments, satellite measuring (idea 9).
- **Effort:** 8 weeks.
- **Dependencies:** vision LLM, speech-to-text with Spanish, QuickBooks Online API, Stripe, e-sign, Twilio with 10DLC registration.
- **Hardest part:** differentiating from QuoteIQ at $29.99 and from the platforms that will ship photo quoting next.

### Score and verdict
Pain 4 · Solo 3 · AI 5 · Gap 1 · WTP 3 · Reach 3 = **19/30**. A large, validated pain with a workflow AI made possible this year, but the US market already has AI-native entrants at $10–30 and the platforms are one release away. Viable only with a price-book-first accuracy story and a Jobber marketplace listing.

---

## 9. Roof, fence and solar measurement with instant quotes from aerial imagery

**One-liner.** Type an address; get roof facets, pitch and area from free federal lidar and imagery, or the fence line from the county parcel map, a material take-off from the firm's price list, and a proposal, with no per-report fee.

### Problem statement
Roofing measurement reports cost $13–105 each (Roofr, EagleView, Hover) and take hours to days; Roofr sells an "Instant Estimator" add-on at $125–149 a month on top of a $109–349 subscription, and competitors advertise "no per-report fees", which shows the pain. Free federal data makes a low-cost entrant possible: USGS 3DEP lidar and 1-metre elevation models are free without use restrictions, USDA NAIP orthoimagery is public domain, and Google's Solar API returns roof segments and pitch at $10 per 1,000 requests. Fence tools are thin and expensive (FenceCloud from about $220 a month plus a $99 map-tracing add-on) and parcel boundaries are available from Regrid. The risk is patents: EagleView and Nearmap settled a five-year roofing-measurement patent suit on 29 May 2026 on confidential terms.

### Who experiences the problem
25,519 roofing establishments with employees (80% under ten staff) plus a share of 299,418 non-employer exterior-trade businesses; 42,748 establishments in the "other specialty trades" code that includes fencing; 178,713 solar installation and project-development jobs. The buyer is the owner or sales lead; the user is the estimator.

### Value of solving it
$13–105 saved per report and instant turnaround; a contractor ordering ten reports a month spends $130–1,000.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Roofr | Roofing CRM plus reports | $109–$349/mo plus $13–19 per report; Instant Estimator $125–149/mo | Per-report fees on top |
| EagleView | Aerial reports | $24–105 per report; subscription quote | Cost; litigious |
| Hover | Photo-to-3D | $29–139 per job | Needs on-site photos |
| Nearmap | Imagery plus AI | About $2,000+/yr | Enterprise |
| Aurora Solar, OpenSolar | Solar design | $135–$259 per user/mo; free | Free ceiling for solar |
| RoofScope | Manual reports | $89–$279/mo | Manual |
| FenceCloud | Fence CRM | About $220–545/mo plus $99 GeoDraw | No native satellite measure |
| QuoteIQ | MapMeasure Pro bundled | From $29.99/mo | Generic accuracy |

### Pricing model
Flat $99 a month per firm with unlimited reports; fence tier at $49.

### Path to profitability
At $120 ARPU you need 42 firms for $5k MRR and 84 for $10k. Imagery is free or cheap, so gross margin is high. Fence quoting from parcel lines is the simplest, least-contested wedge and needs no vision model. Distribution: roofing and fence supply distributors, contractor associations, Jobber and Housecall Pro marketplaces. Residential solar is contracting after the 2025 federal policy changes, so treat solar as a later addition.

### Where AI is used
- **In the product:** roof-facet segmentation and pitch from orthophoto plus the 3DEP elevation model, material take-off, proposal drafting. Fence measurement from cadastral parcel lines is geometry, not AI. For solar, Google's data already returns segments.
- **To build it:** map tiles, geometry and PDFs are standard; a roof-segmentation model is the one piece of real machine-learning work in this list, so start with Google's data and county lidar before training anything.

### MVP
- **Doing:** address lookup, parcel polygon from Regrid or county GIS with fence-line measurement, Google Solar API building insights with manual facet drawing on NAIP imagery as fallback, pitch and area, material calculator with the firm's price list, proposal PDF.
- **Not doing:** 3D models, drone imagery, solar production modelling, CRM.
- **Effort:** 8 weeks.
- **Dependencies:** Google Maps Platform, USGS 3DEP, NAIP, Regrid API (2,000 parcel records included on entry plans), PDF, e-sign; patent clearance advisable.
- **Hardest part:** measurement accuracy against a 2–5% bar and EagleView's patent portfolio.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 2 · WTP 4 · Reach 3 = **19/30**. High willingness to pay and free public data, against entrenched, litigious incumbents. Start with fences, where nobody serious plays.

---

## 10. Subcontractor certificate-of-insurance and compliance tracker for small general contractors

**One-liner.** A portal where subcontractors upload insurance certificates, licences, OSHA cards and W-9s once; AI extracts limits, endorsements and expiry dates, matches them to contract requirements, and chases renewals, priced for a contractor with 5–50 subs.

### Problem statement
General contractors carry the liability when a subcontractor's insurance lapses mid-project, and certificate tracking is mostly done in spreadsheets. Vendor-claimed statistics say seven in ten certificates arrive non-compliant in at least one area. The US category is mature but priced for enterprises: myCOI (now illumend) $1,500–3,000 minimum, CertFocus $7,500 minimum plus implementation, C2COI $800–2,000 minimum; TrustLayer's free tier stops at 50 vendors and its paid tiers are custom. Nothing is published for a $30–100 a month self-serve tool. Licence verification has no clean national API: California publishes PDFs, Florida free weekly CSVs; OSHA runs no national card database.

### Who experiences the problem
254,630 employer GC establishments (87% under ten employees), 135,337 residential remodelers, 919,062 non-employer builders. The buyer is the owner or office manager; the users are the office manager and the subcontractors uploading documents.

### Value of solving it
Uninsured-subcontractor liability, workers'-compensation premium audits, and an hour a week of certificate chasing; incumbents' minimums price small GCs out entirely.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| TrustLayer | Free to 50 vendors with AI classification; Pro custom | Free tier caps the low end |
| myCOI (illumend), CertFocus, C2COI, SmartCompliance | $30–60 per vendor/yr with $800–10,000 minimums | Minimums |
| bcs | About $6–21 per vendor/yr, managed | Service model |
| Jones, Billy | Enterprise real estate and construction | Hidden pricing |
| Procore, Avetta, ISNetworld | Platforms and supplier-pays networks | Enterprise |

### Pricing model
$49 a month for 25 subcontractors, $129 for 100; subcontractors upload free.

### Path to profitability
At $99 ARPU you need 51 GCs for $5k MRR and 101 for $10k. Compliance records churn slowly. Costs are small. Sales to contractors are slow and relationship-driven; the channel is insurance agents and brokers (who field the certificate requests), construction accountants, and QuickBooks and Buildertrend marketplaces.

### Where AI is used
- **In the product:** extracting limits, dates and the additional-insured, waiver and primary-non-contributory endorsements from ACORD 25 forms and state certificates, gap letters, expiry chasing, licence and OSHA-card OCR. Exactly the document-extraction task current models do reliably.
- **To build it:** portal, document store, reminders and audit export are standard; state licence lookups are scrapers.

### MVP
- **Doing:** contractor workspace, per-project requirement templates, subcontractor upload links, AI extraction with confirm, expiry chasing, W-9 capture, one-click compliance report per project, Florida and California licence checks.
- **Not doing:** daily site attendance, E-Verify (needs a memorandum), prequalification networks, payments.
- **Effort:** 7 weeks.
- **Dependencies:** LLM extraction, email ingestion, state licence data, QuickBooks and Buildertrend APIs.
- **Hardest part:** selling to contractors who buy slowly and through people they know, and TrustLayer's free tier.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 2 = **18/30**. A real price gap under enterprise minimums and an AI task that works today, held back by a slow buyer and no statutory driver.

---

## 11. Home inspection report generator with AI photo-to-defect narration

**One-liner.** An inspector photographs and dictates on site; the app drafts each finding from the inspector's own comment library, checks the report against the state standard of practice, and delivers a client-friendly report the same day.

### Problem statement
About 4.06 million existing homes sold in 2025 and roughly three quarters were inspected, so inspectors write around 3 million reports a year, mostly in solo or two-person firms doing 250–600 a year. Same-day delivery is the currency of agent referrals, which bring 78% of business. Spectora launched AI Report Assist and an API in June 2026 claiming about 25% time saved, and now owns HomeGauge; 71% of inspectors already use AI somewhere. About 34 states license inspectors and some prescribe report forms; the rest follow association standards. Unlike Europe, the US market is not locked to one association system, so an independent AI-first tool can coexist with Spectora through its API.

### Who experiences the problem
InterNACHI's 27,386 members, ASHI's 8,000+, over 30,000 active inspectors in total. The buyer and user are the inspector.

### Value of solving it
25% of report time on 250–600 inspections a year is 60–300 hours; consistency reduces errors-and-omissions exposure.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Spectora | $109/mo plus $99 per extra inspector; $4 per inspection add-ons; AI Report Assist | Now owns HomeGauge; per-inspection fees |
| HomeGauge | $89/mo | Legacy |
| Inspector Nexus | $50–$55/mo; $4.99 pay-as-you-go | No AI |
| Home Inspector Pro, Horizon | $67–$89/mo | Desktop heritage |
| ISN | $3.75–$7.25 per inspection | Back-office, not reports |
| Property Inspect | $49–$275/mo; Inspect AI | Generalist |

### Pricing model
$79 a month per inspector, AI included, no per-inspection fees.

### Path to profitability
At $89 ARPU you need 56 inspectors for $5k MRR and 112 for $10k, from a population of 30,000 that already pays $89–109 a month. Distribution: InterNACHI forums and events, state associations, inspector Facebook groups, YouTube. Sales are one inspector at a time; the ceiling for the whole category is about $35–40 million a year, so this is a good business, not a large one.

### Where AI is used
- **In the product:** photo and voice to defect narrative using the inspector's comment library, completeness checks against the state standard, plain-English summary for buyers. Auto-assigning severity without sign-off is the errors-and-omissions risk.
- **To build it:** offline mobile capture and PDF generation are standard; state templates (Texas prescribes a form) are content work.

### MVP
- **Doing:** offline capture, comment library import, AI finding drafts with confirm, standard-of-practice checklist, branded PDF, client summary, ISN and Spectora API coexistence.
- **Not doing:** scheduling, payments, websites, agreements.
- **Effort:** 8 weeks.
- **Dependencies:** mobile app, state templates, PDF, Spectora and ISN APIs.
- **Hardest part:** Spectora's consolidation and head start.

### Score and verdict
Pain 3 · Solo 3 · AI 5 · Gap 1 · WTP 4 · Reach 3 = **19/30**. One of the best AI fits in the list, in an open US market that the leader is consolidating. Worth it as a focused, AI-first alternative if you can get early adopters from the associations.

---

## 12. Small fleet daily vehicle inspection and defect workflow

**One-liner.** A driver walk-around app with photo defect capture, repair routing and the three-month records that federal regulations require.

### Problem statement
Federal rules require every driver to report safety defects at the end of each day per vehicle, with repairs certified before dispatch and records kept three months; failing to keep required records costs $1,544 per day up to $15,445. Enforcement is intense: one in five roadside inspections in 2025 ended in an out-of-service order, and "operating without inspection documentation" drew 158,057 citations. The category is mature: Fleetio, Whip Around and Simply Fleet charge $2–10 per vehicle with free tiers, and the telematics vendors (Motive, Samsara) bundle inspections with electronic logging at $25–45 per vehicle on multi-year contracts.

### Who experiences the problem
About 580,000 active registered carriers, 91.5% with ten or fewer trucks and 70% single-truck, plus non-regulated trades fleets. The buyer is the owner or operations manager; the users are drivers.

### Value of solving it
Avoided daily penalties and out-of-service orders; provable records.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Fleetio | $4–$10 per vehicle/mo | Bands of five |
| Whip Around | Free 1 asset; $5–$10 per asset | Billing complaints |
| Simply Fleet | Free to 5 vehicles; $2–$4 | The floor |
| AUTOsist, Driveroo | $5–$7 with minimums or contracts | Minimums |
| Motive, Samsara | $25–$45 per vehicle bundled with ELD, contracts | Bundling |

### Pricing model
Per vehicle, $3–5 a month with a $25 minimum.

### Path to profitability
At $40 ARPU (ten vehicles) you need 125 fleets for $5k MRR and 250 for $10k, against free tiers and bundles. Not attractive.

### Where AI is used
Photo defect detection, severity triage, voice reporting, maintenance prediction. Incumbents can add the same.

### MVP
- **Doing / not doing:** not recommended.
- **Effort:** 5 weeks.
- **Dependencies:** offline app, VIN decoding (free), telematics APIs.
- **Hardest part:** a $2 price floor and free bundling.

### Score and verdict
Pain 4 · Solo 4 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **17/30**. Strong mandate, saturated market. Skip.

---

## 13. Move-in and move-out inspections with AI photo comparison and state-deadline compliance

**One-liner.** Guided check-in and check-out photo capture per room, AI change detection and wear-versus-damage classification, and an itemised statement generated against the right state deadline, including the photo pack California now requires.

### Problem statement
California's AB 2801 requires landlords, from 1 April 2025, to photograph units after move-out before any repair charged to the deposit and again after the work, and from 1 July 2025 to photograph at the start of every tenancy, delivering the photos with the itemised statement; bad-faith claims carry statutory damages up to twice the deposit. New York requires a pre-move-in inspection offer and return within 14 days or the landlord forfeits the deduction right; Texas presumes bad faith after 30 days with $100 plus treble damages; Georgia and Massachusetts impose treble damages; six states forfeit deductions when the deadline is missed. Only 42% of movers get their full deposit back and 41% had a move-out dispute. Incumbents are adding AI (RentCheck "AI Damage Assist"), but HappyCo requires a 500-unit minimum and the property-management suites sell inspections as $40–95 add-ons, leaving small managers with 10–500 units under-served.

### Who experiences the problem
19.3 million rental properties and 49.5 million units, 70% of properties owned by individual investors; 252,918 non-employer property managers; NARPM's 6,000+ members. The buyer is the small property-management company or landlord; users are staff and tenants doing self-inspections.

### Value of solving it
A missed deadline or missing photo forfeits the whole claim or doubles or triples exposure; timestamped photo pairs decide disputes.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| RentCheck | $1–$1.75 per unit/mo; AI Damage Assist on top tier | PM-scale focus |
| zInspector | $15–$115/mo by units | No AI |
| HappyCo | $1 per unit with 500-unit minimum | Excludes small PMs |
| Property Inspect | $49–$275/mo | Generalist |
| Buildium, AppFolio | $40–95/mo add-on; 50-unit minimum | Bundled |

### Pricing model
$1.50 per unit per month with a $29 minimum, or $5 per report for landlords.

### Path to profitability
At $75 ARPU (a 50-unit manager) you need 67 customers for $5k MRR and 134 for $10k. Distribution: NARPM chapters, California apartment associations (AB 2801 is a live topic), Buildium and AppFolio marketplaces, landlord Facebook groups. Churn is low once inspection history accumulates.

### Where AI is used
- **In the product:** photo pairing per item, change detection, wear-versus-damage classification, and drafting the itemised statement with the right state deadline and the AB 2801 photo pack. Real, and the state-rules layer is the differentiator.
- **To build it:** guided capture, image alignment and vision-LLM comparison, a 50-state deadline table, e-sign.

### MVP
- **Doing:** guided shot lists, check-in and check-out pairing, AI diff with confirm, itemised statement generator with state deadlines and penalties, AB 2801 delivery by link, tenant self-inspection links.
- **Not doing:** 360° capture, full property-management features, PM integrations beyond CSV at launch.
- **Effort:** 6 weeks.
- **Dependencies:** vision LLM, e-sign, mobile capture, state rules table.
- **Hardest part:** RentCheck at $1 per unit and the suites' bundling.

### Score and verdict
Pain 4 · Solo 4 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **20/30**. A 2025 California mandate, forfeiture and treble-damage rules in other states, and a small-manager segment the incumbents price out. Solid.

---

## 14. Small private landlord manager (1–10 units)

**One-liner.** Rent collection, deposit compliance, maintenance, state-specific leases and a Schedule E export for landlords with a handful of units.

### Problem statement
Individual investors own 13.5 million rental properties, 86% single-unit, and only 16% track maintenance digitally, but the category is free: TurboTenant (nearly 900,000 landlords, up 22% in 2025), Avail (over one million), Innago and Baselane ($44 million raised) monetise renter fees, payments and interchange rather than subscriptions; Stessa and Landlord Studio charge $12–28 a month. Deposit laws (California's photo rules, New York's 14 days, Texas's treble damages) are the only pain that is growing.

### Who experiences the problem
1.3 million non-employer lessors and 13.5 million individually owned properties. The buyer is the landlord.

### Value of solving it
Compliance without an accountant, avoided penalties, tax-time bookkeeping; Baselane claims 150 hours a year saved.

### Main competitors
| Product | Published pricing | Monetisation |
|---|---|---|
| TurboTenant | Free; $149–$999/yr; AI lease audit | Renter fees, payments |
| Avail, Innago | Free | Fees |
| Baselane | Free; AI bookkeeping subscription | Interchange |
| Stessa, Landlord Studio | $12–$28/mo | Subscription |
| RentRedi, DoorLoop, Hemlane | $12–$209/mo | Subscription |

### Pricing model
Freemium with $9–15 a month paid tiers; the money is in payments and screening, which need scale.

### Path to profitability
At $12 ARPU you need 417 landlords for $5k MRR and 833 for $10k, against three free incumbents with a million users each. Not attractive.

### Where AI is used
Bank-feed categorisation to Schedule E lines, state lease and notice drafting, deposit-deadline reminders, receipt reading. Every incumbent has it.

### MVP
- **Doing / not doing:** not recommended; the deposit-compliance feature belongs in idea 13.
- **Effort:** 8 weeks.
- **Dependencies:** Plaid, Stripe Connect, FCRA-compliant screening partner, 50-state templates.
- **Hardest part:** free incumbents.

### Score and verdict
Pain 3 · Solo 3 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **15/30**. Free everywhere. Skip.

---

## 15. Short-term rental turnover operations

**One-liner.** Cleaner scheduling from booking calendars, photo checklists, damage reporting, supply tracking and city registration fields for hosts with 1–20 units.

### Problem statement
US short-term rental supply still grows 2.7–4.6% a year, but cities are formalising it: New York's Local Law 18 has approved only 3,522 hosts against 40,000 pre-law listings, and Los Angeles fines $500 a day or double the nightly rate for non-compliant ads. Turnover is the operational pain, and every property-management system bundles task management; Turno charges $8–10 per property, Hospitable and Breezeway have free tiers.

### Who experiences the problem
Hosts and small managers with 1–20 units and their cleaners; absolute US counts were not retrievable. The buyer is the host; the user is the cleaner.

### Value of solving it
Fewer missed cleans, better damage evidence, per-day fines avoided in regulated cities. Not quantified.

### Main competitors
| Product | Published pricing |
|---|---|
| Turno | $8–$10 per property/mo; free single property |
| Breezeway | Free 1 property; from $19 per unit |
| Hospitable | Free; $29–$99/mo |
| Guesty, Lodgify, Properly | $9–$62/mo; $13–$15 per property |
| Hostaway, Operto | Quote |

### Pricing model
$10–19 per property per month is the band.

### Path to profitability
At $15 ARPU you need 333 hosts for $5k MRR against free tiers, with seasonal churn. Not attractive.

### Where AI is used
Photo QA against a reference set, damage diff, bilingual cleaner instructions. Real but small.

### MVP
- **Doing / not doing:** not recommended standalone; the photo-QA feature could be sold to cleaning companies.
- **Effort:** 5 weeks.
- **Dependencies:** iCal feeds, Stripe Connect and 1099 filing for cleaners, SMS consent.
- **Hardest part:** every PMS bundles this.

### Score and verdict
Pain 2 · Solo 4 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **15/30**. Crowded and bundled. Skip.

---

## 16. HOA and condo board management with reserve-study and filing compliance

**One-liner.** A workspace for volunteer boards of self-managed associations: documents, meetings with AI minutes, dues, violations, e-voting, and a compliance calendar that tracks Florida's structural reserve studies and milestone inspections, California's three-year reserve inspections and the state filing deadlines that now carry personal liability.

### Problem statement
Boards are volunteers who rotate annually and inherit a shoebox of documents. The legal stakes rose after Surfside: Florida requires every condominium of three or more storeys to complete a Structural Integrity Reserve Study (first study by 31 December 2025, or 2026 with a milestone inspection), bans waiving reserves for structural items in budgets adopted from December 2024, treats wilful failure as a breach of a director's fiduciary duty, and since HB 913 requires every association to open a state online account and file the study within 45 days. Florida has 27,537 condo associations and 1.53 million condo units, three quarters of the small buildings built before 1990. California requires visual reserve inspections every three years; Hawaii, Nevada, Utah, Virginia and Maryland have their own cycles. Nationally there are about 373,000 associations with 2.5 million volunteer board members, 30–40% self-managed. The incumbents are cheap but thin (PayHOA from $54 a month, TownSq $90 plus add-ons) or built for management companies (CINC, Vantaca, AppFolio with a 50-unit minimum), and none tracks statutory deadlines with AI minutes and bylaw search.

### Who experiences the problem
373,000 associations (377,000 by end-2026), 78 million residents, 9–10,000 management companies. The buyer is the board president or treasurer of a self-managed association, or a small management company.

### Value of solving it
Personal fiduciary exposure for missed studies and filings, special assessments from reserve shortfalls, and continuity at handover. Not quantified.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| PayHOA | $54–$275/mo by units | Accounting-first |
| TownSq | $90–$435/mo plus $20–250 add-ons | Add-on stacking |
| HOALife | From $199/mo; AI features | Price floor |
| Condo Control | Quote; AI assistant add-on | Hidden |
| Buildium, AppFolio | $62–$400/mo; 50-unit minimum | PM-oriented |
| CINC, Vantaca, FRONTSTEPS, Enumerate | Management-company platforms | Channel-locked |
| Effortless HOA (new) | $3 per home/mo | Unproven |

### Pricing model
Per association per year, banded by units: $588 (under 50 units), $1,188 (50–150), $1,988 (150+); management-company tier per door.

### Path to profitability
At $79 ARPU you need 63 associations for $5k MRR and 127 for $10k, out of 100,000+ self-managed associations. Boards decide once a year, so sales are lumpy around budget season. Churn is low. Distribution: Florida's public condo registrations (every association and its officers are on file), CAI chapters, reserve-study firms and condo attorneys as referrers.

### Where AI is used
- **In the product:** meeting minutes from recordings, Q&A over bylaws and CC&Rs and past decisions, violation letters, deadline tracking with filing prompts, board handover briefs. The reserve study itself must be done by a licensed engineer or reserve specialist; the tool tracks it.
- **To build it:** documents, meetings, voting and dues are standard; Florida and California statute rules are a content layer; Stripe and QuickBooks integrations are documented.

### MVP
- **Doing:** Florida first. Document archive with AI search, meeting recorder with AI minutes and decision log, compliance calendar (SIRS, milestone inspections, state account and filings, website rule), e-voting, dues via Stripe ACH, violation and architectural-request workflow, handover brief.
- **Not doing:** full accounting (QuickBooks integration), management-company features, other states' rules until v2.
- **Effort:** 8 weeks.
- **Dependencies:** Stripe ACH, QuickBooks Online, Florida statute rules, e-sign, speech-to-text.
- **Hardest part:** management companies own most relationships; the market is the self-managed third.

### Score and verdict
Pain 4 · Solo 4 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **20/30**. Statutory deadlines with personal liability for 27,537 Florida boards, reachable buyers, sticky data and a clear AI differentiator. Slow to sell, solid once sold.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 13 | Move-in/out inspections with state-deadline compliance | **20** | 75 | 134 | 6 |
| 16 | HOA and condo board management with compliance calendar | **20** | 79 | 127 | 8 |
| 8 | AI trades quoting from photos and voice | **19** | 59 | 170 | 8 |
| 9 | Aerial roof/fence measurement quotes | **19** | 120 | 84 | 8 |
| 11 | Home inspection report generator | **19** | 89 | 112 | 8 |
| 10 | Subcontractor COI tracker | **18** | 99 | 101 | 7 |
| 12 | Small fleet vehicle inspections | **17** | 40 | 250 | 5 |
| 14 | Small private landlord manager | **15** | 12 | 833 | 8 |
| 15 | Short-term rental turnover ops | **15** | 15 | 667 | 5 |

## Sources
- https://www.getjobber.com/home-service-trends-report/
- https://www.prnewswire.com/news-releases/70-of-home-service-professionals-now-use-ai-to-cut-admin-work-not-field-jobs-housecall-pro-report-finds-302468294.html
- https://www2.census.gov/programs-surveys/cbp/datasets/2023/cbp23us.zip
- https://www2.census.gov/programs-surveys/nonemployer-statistics/datasets/2022/historical-datasets/nonemp22us.zip
- https://www.cpwr.com/wp-content/uploads/DataBulletin-April2026.pdf
- https://myquoteiq.com/pricing/
- https://contractorplus.app/pricing
- https://airquote.co/faq
- https://getjobber.com/pricing/
- https://www.housecallpro.com/pricing/
- https://www.joist.com/pricing/
- https://www.roofr.com/pricing
- https://www.globenewswire.com/news-release/2026/05/29/3303611/0/en/eagleview-and-nearmap-reach-settlement-in-patent-dispute.html
- https://www.usgs.gov/3d-elevation-program
- https://developers.google.com/maps/documentation/solar/usage-and-billing
- https://support.regrid.com/changelog/self-serve-api-plans
- https://fervorstudio.ca/news/fence-cloud-review-pricing-alternatives/
- https://irecusa.org/census-about/
- https://www.vertikalrms.com/article/how-much-does-coi-tracking-software-cost-2026-pricing-guide/
- https://www.trustlayer.io/plans
- https://getjones.com/pricing/
- https://www.cslb.ca.gov/consumers/data.aspx
- https://www2.myfloridalicense.com/instant-public-records/
- https://inspectordata.com/blog/home-inspector-license-requirements-by-state.html
- https://www.nachi.org/
- https://www.spectora.com/pricing
- https://www.spectora.com/r/the-home-inspection-industry-is-changing-what-it-means-for-your-business
- https://www.inspectionsupport.com/october-2025-housing-forecasts-for-home-inspectors/
- https://www.inspectornexus.com/pricing
- https://www.law.cornell.edu/cfr/text/49/396.11
- https://www.federalregister.gov/documents/2024/12/30/2024-30608/revisions-to-civil-penalty-amounts-2025
- https://uscomplianceservices.org/1-in-5-roadside-inspections-put-motor-carriers-out-of-service-in-2025/
- https://www.freightwaves.com/news/there-are-292000-shippers-in-america-and-97-of-carriers-have-10-trucks-or-less-the-match-has-been-right-in-front-of-you-the-whole-time
- https://www.fleetio.com/pricing
- https://www.simplyfleet.app/pricing-plan
- https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202320240AB2801
- https://www.nysenate.gov/legislation/laws/GOB/7-108
- https://texas.public.law/statutes/tex._prop._code_section_92.109
- https://www.depositdeadline.com/security-deposit-return-by-state
- https://www.zillow.com/research/renters-housing-trends-report-2024-34387/
- https://archives.hud.gov/news/2022/pr22-242.cfm
- https://www.getrentcheck.com/pricing
- https://happy.co/pricing/inspections/
- https://www.buildium.com/pricing/
- https://www.rentledger.org/blog/small-landlord-statistics-2026/
- https://www.turbotenant.com/pricing/
- https://www.prnewswire.com/news-releases/turbotenant-wraps-2025-with-nearly-900-000-landlords-and-3b-in-rent-processed-302647408.html
- https://www.prnewswire.com/news-releases/baselane-announces-34m-in-new-funding-debuts-ai-powered-tools-to-automate-banking-and-bookkeeping-for-real-estate-investors-302572023.html
- https://www.nyc.gov/site/specialenforcement/news/new-yorkers-registered-to-host-surpassed-3500-for-first-time.page
- https://www.minut.com/blog/los-angeles-short-term-rental-laws
- https://www.prnewswire.com/news-releases/steady-demand-and-slower-new-supply-define-us-short-term-rentals-in-2026-airdna-finds-302820776.html
- https://help.turno.com/en/articles/5607345-how-do-paid-subscriptions-work-for-hosts-on-turno
- https://www.breezeway.io/pricing
- https://help.hospitable.com/en/articles/4596748-hospitable-pricing-subscription-costs
- http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0700-0799/0718/Sections/0718.112.html
- http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0500-0599/0553/Sections/0553.899.html
- https://condos.myfloridalicense.com/inspections/
- https://www.caionline.org/getmedia/bfa0f496-1d0d-45c2-88ef-30948da996cb/Florida-Condominium-Datarevised.pdf
- https://castlegroup.com/blog/floridas-new-sirs-law-hb-913-the-key-2025-deadline-extension-reserve-rule-changes-you-need-to-know/
- https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=5550
- https://hoastart.com/hoa-reserve-study-requirements-by-state/
- https://nowackhoward.com/fincen-permanently-ends-corporate-transparency-act/
- https://foundation.caionline.org/research/industry-data/
- https://ipropertymanagement.com/research/hoa-statistics
- https://www.payhoa.com/pricing/
- https://townsq.io/pricing/
- https://www.hoalife.com/pricing
- https://www.condocontrol.com/pricing/
- https://effortlesshoa.com/blog/hoa-software-pricing-guide
