# 02 — Trades, field service & property (ideas 8–16)

Nine ideas where the buyer is a small business that does physical work or owns physical assets. The common thread is that these buyers pay business prices (per-seat $30–60 a month is normal in trades software) and drown in paperwork that phones can now capture. The common obstacle is that every one of these categories already has funded US incumbents, so the wedge must be a Nordic regulation, a Nordic data source, or a workflow the incumbents have not built yet.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 8. AI estimating and quoting for small trades from photos and voice

**One-liner.** An electrician or plumber walks the job, takes five photos and talks for two minutes; the app produces an itemised quote from their own price list, in Norwegian or Danish, ready to send and e-sign.

### Problem statement
UK surveys in 2026 put a tradesperson's business admin (quoting, invoicing, chasing payment) at 5 hours 20 minutes a week, mostly evenings and weekends, and 93% say running the business stresses them. One trade publication values 8 hours a week of admin for a self-employed electrician at over £17,000 a year of non-billable time. The incumbents have shipped AI text drafting (Jobber Copilot since October 2024, Tradify's SmartWrite on its top plan) but none does photo-and-voice site capture, and none is localised for Nordic VAT, e-invoicing and wholesaler price books. A wave of AI-native quoting apps launched in 2025–26 (QuoteIQ, VoxTrade, Trade Agent, AirQuote), all US, UK or Australian.

### Who experiences the problem
The EU has 3.4 million construction enterprises, 63% of construction employment in specialised trades (electricians, plumbers, roofers, painters), and 99% are micro or small. Norway has about 40,000 construction enterprises; NHO Elektro alone has 1,950 member firms and Rørentreprenørene Norge 623. The buyer is the owner-operator of a 1–10 person firm; an office manager appears at about five staff.

### Value of solving it
Reclaiming two of the five to eight weekly admin hours at £45–60 an hour is £4,700–6,200 a year, ten to twenty times the price of any tool in the category. Faster quotes also win more jobs; vendor claims of conversion lifting from 30–40% to 45–55% are weakly evidenced but directionally right.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Jobber | Home-services field service | $29–$299/mo; AI Receptionist add-on $29/mo | Copilot quotes from text only; no Nordic localisation |
| Housecall Pro | Field service with "AI Team" | $59–$329/mo plus per-user fees | No photo or voice estimating |
| Tradify | Trades job management | $47–$61 per user/mo; AI only on Plus | Per seat, AI gated |
| Fergus, Joist | Trades, solo contractors | $12–$100/mo | No site-walk capture |
| Minuba (Denmark) | Craftsman order management | Free to 2 users; DKK 29–289 per user/mo | No AI quoting |
| Ordrestyring.dk (Denmark) | Order management with e-conomic | DKK 237–339 per user/mo | No AI |
| SmartDok (Norway) | Time, HSE, projects | About NOK 499–799/mo plus per user (third party) | Not a quoting tool |
| QuoteIQ, VoxTrade, AirQuote, Trade Agent | AI-native photo/voice quoting | Not captured; US/UK/AU | None Nordic |

### Pricing model
Per firm, not per seat: NOK 590 a month for one user, NOK 990 for up to five, unlimited quotes. Buyers already accept $29–49 a month AI add-ons, so an AI line item is not a barrier. An optional e-signature and deposit-collection tier.

### Path to profitability
At €70 ARPU you need 72 firms for €5k MRR and 143 for €10k. That is a rounding error in a market of tens of thousands of Nordic trade firms, and the value story is easy. Costs: speech-to-text and vision extraction are cents per quote. The hard part is distribution: trade firms do not search for software, they hear about it from their accountant, their wholesaler or a trade association. A referral deal with two accounting firms that serve craftsmen, or a listing in Tripletex/Fiken/e-conomic app marketplaces, is the realistic channel. Churn is moderate; quotes are not compliance records.

### Where AI is used
- **In the product:** multimodal extraction (photos plus voice memo to structured scope and quantities), matching to the firm's price book, drafting quote text in the customer's language, follow-up nudges. The trap: LLM-guessed unit prices are unusable; prices must come from the firm's list or wholesaler catalogues (EFObasen for electrical, NRF-databasen for plumbing in Norway; access terms unverified).
- **To build it:** the app itself is standard (CRUD, PDF, e-sign, accounting hand-off). The agent should be used heavily to iterate on the extraction prompt against 50 real site walks, which you need to collect from design partners before writing much code.

### MVP
- **Doing:** price-list import (CSV and from Tripletex/Fiken/e-conomic), photo-plus-voice capture, AI draft quote with line-by-line confirm, PDF in Norwegian/Danish, send and e-sign, push accepted quote to the accounting system as an order/invoice draft.
- **Not doing:** scheduling, dispatch, timesheets, inventory, payments (accounting systems do these), wholesaler catalogue integration at launch.
- **Effort:** 8 weeks.
- **Dependencies:** Nordic-quality speech-to-text, vision LLM, Tripletex/Fiken/e-conomic/Dinero APIs, BankID/MitID e-sign via a broker (Criipto, Signicat) or a simple checkbox signature.
- **Hardest part:** extraction accuracy on messy sites and the distribution channel. Incumbents are one release away, so the Nordic localisation and accounting integrations are the moat.

### Score and verdict
Pain 4 · Solo 3 · AI 5 · Gap 2 · WTP 4 · Reach 3 = **21/30**. A big, validated pain with a workflow AI made possible this year. Crowded globally, empty in the Nordics. Strong candidate if the founder can get two accounting-firm partners.

---

## 9. Roof, fence and solar measurement with instant quotes from aerial imagery

**One-liner.** Type an address; get roof facets, pitch and area (or the fence line from the cadastre), a material take-off and a customer-ready proposal, with no per-report fee.

### Problem statement
Roofing measurement reports cost $13–105 each (EagleView, Roofr, Hover) and take hours to days; a contractor doing ten quotes a month spends $130–1,000 on measurements alone, and competitors advertise "no per-report fees" as a selling point, which shows the pain. Google's Solar API now covers Denmark, Norway and Sweden at 10 cm resolution and prices Building Insights at $10 per 1,000 requests, but from July 2025 accounts billed in the EEA "no longer receive certain content". National orthophotos and height models are free and open in Norway (Norge i bilder, 25 cm) and Denmark (GeoDanmark, 12.5 cm), so a Nordic entrant can build on public data.

### Who experiences the problem
Roofing, fencing and solar contractors. The EU solar workforce was 865,000 in 2024, 84% in installation, with the residential segment weakening in 2025. Per-country roofer counts were not found. The buyer is the owner or sales lead; the user is the estimator.

### Value of solving it
$13–105 saved per report, 2 hours to 2 days of turnaround, and the ability to quote on the first call. Accuracy of the incumbents is 2–5%, which sets the bar.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| EagleView | Gold-standard aerial reports | $24–105 per report; subscription quote-only | Cost |
| Roofr | Roofing CRM plus reports | $109–$349/mo plus $13–19 per report | US-centric, per-report fees |
| Hover | Photo-to-3D | $29–139 per job; Pro $999/yr | Needs on-site photos |
| Nearmap | Imagery plus AI layers | About $2,000+/yr | US, AU, NZ, CA only |
| Aurora Solar | Solar design | $135–$259 per user/mo | Per seat |
| OpenSolar | Free solar design | Free, 28,000+ pros | Sets the price of solar design at zero |
| RoofScope | Reports and plans | $89–$279/mo plus reports | Manual-drawn |

### Pricing model
Flat subscription with unlimited reports: NOK 990 a month per firm. The absence of a per-report fee is the pitch.

### Path to profitability
At €120 ARPU you need 42 firms for €5k MRR and 84 for €10k. Imagery is free (public data) or cheap (Google), so gross margin is high. The Nordic roofing and solar market is small and seasonal, and the residential solar segment is contracting, so the ceiling in the Nordics is perhaps €10k MRR; expansion means Germany or the UK, where imagery licensing changes. Distribution: roofing supplier partnerships, solar installer associations, trade shows.

### Where AI is used
- **In the product:** roof-facet segmentation and pitch from orthophoto plus the digital surface model, material take-off, proposal drafting. For solar, Google already returns segments and pitch, so the AI is a wrapper; the genuine model work is roof segmentation on national imagery. Fence measurement from cadastral parcel lines is a simpler, under-served variant that needs no vision model at all.
- **To build it:** map tiles, geometry and PDF proposals are standard. Training or fine-tuning a segmentation model is the one piece of real machine-learning work in this list, and a solo founder should start with Google's data and only build their own model if EEA restrictions bite.

### MVP
- **Doing:** Norway and Denmark. Address lookup, Google Solar API building insights with a fallback to manual facet drawing on the national orthophoto, pitch and area, a material calculator with the firm's price list, a proposal PDF.
- **Not doing:** 3D models, drone imagery, solar production modelling (link to OpenSolar), CRM.
- **Effort:** 8 weeks.
- **Dependencies:** Google Maps Platform account under EEA terms (verify what is withheld), Kartverket and Dataforsyningen WMTS, national height models, cadastre APIs for parcel lines.
- **Hardest part:** what Google withholds in the EEA, and whether accuracy on Nordic roofs (snow, steep pitches, complex forms) reaches the 2–5% bar.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 2 · WTP 4 · Reach 3 = **19/30**. High willingness to pay and free public data, but a small, seasonal Nordic market and platform risk from Google. Worth a two-week feasibility spike on the imagery before deciding.

---

## 10. Subcontractor compliance tracker for small general contractors

**One-liner.** A portal where subcontractors upload insurance certificates, HSE cards and wage documentation once; AI extracts limits and expiry dates, matches them to contract requirements, and chases renewals, so the main contractor can prove compliance when the inspector arrives.

### Problem statement
Nordic main contractors carry legal duties for their subcontractors' paperwork. In Norway, byggherreforskriften requires electronic daily lists of everyone on site with HSE-card number and organisation number, kept six months after completion, and the påseplikt regulation requires systems to verify that subcontractors pay the generally applicable wage, with employment contracts, payslips and timesheets as evidence. In Sweden, sites above about SEK 232,000 need an electronic personnel ledger; Skatteverket charges SEK 12,500–25,000 per control failure, and since 2019 the main contractor is liable for a subcontractor's unpaid wages. In the US, certificate-of-insurance tracking is a mature category where Excel is the real incumbent and software costs $3–30 per insured per year. In the Nordics the supplier side is served by registries that the supplier pays for (StartBANK, Achilles) rather than by a tool for the contractor's office manager.

### Who experiences the problem
General contractors with 5–50 subcontractors, within the EU's 3.4 million construction enterprises and Norway's roughly 40,000. The buyer is the owner or HSE lead; the user is the office manager and the subcontractors uploading documents.

### Value of solving it
Avoided Swedish control fees, Norwegian stop-work orders and wage liability, uninsured-subcontractor exposure, and a weekly hour of certificate chasing per office manager.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| TrustLayer (US) | AI certificate tracking | Free to 50 vendors; paid tiers hidden | Free tier caps the low end; US forms |
| myCOI, Jones, Billy | US certificate tracking | Quote-only, about $1,500–3,000/yr | Hidden pricing, US |
| Procore | Construction platform | Quote-only | Enterprise |
| Avetta, ISNetworld | Supplier-paid prequalification networks | Hidden, supplier pays | Resented model |
| StartBANK (Norway) | Supplier register | Supplier pays about NOK 2,700 | Not a contractor workflow |
| Excel | The incumbent | Free | |

### Pricing model
Per contractor: NOK 1,290 a month for 25 subcontractors, NOK 2,990 for 100. Subcontractors upload free. Never charge the supplier; that is the model the market resents.

### Path to profitability
At €120 ARPU you need 42 contractors for €5k MRR and 84 for €10k. Compliance records churn slowly. Costs are small (document extraction is cents per certificate). Sales cycles to contractors are slow and relationship-driven; the channel is HSE consultants, trade associations (BNL, EBA in Norway; Byggföretagen in Sweden) and accounting firms serving contractors.

### Where AI is used
- **In the product:** extracting coverage limits and dates from highly variable insurance PDFs and Nordic certificates, matching to per-contract requirements, reading HSE card and ID06 photos, drafting the chase email. This is exactly the document-extraction task that current models do reliably.
- **To build it:** portal, document store, reminders and audit export are standard. Verification lookups against Brønnøysund (free API) and the ID06 API are documented.

### MVP
- **Doing:** Norway first. Contractor workspace, per-project requirement templates (insurance, HSE card, wage documentation), subcontractor upload links, AI extraction with a confirm step, expiry chasing, a one-click compliance report per project.
- **Not doing:** the daily site attendance list itself (existing check-in apps do this; integrate later), Sweden's personnel-ledger integration (v2), payment or prequalification networks.
- **Effort:** 7 weeks.
- **Dependencies:** LLM extraction, Brønnøysund Enhetsregisteret API, HSE-card validity lookup, email ingestion, GDPR handling for worker data.
- **Hardest part:** selling to contractors, who buy slowly and through people they know.

### Score and verdict
Pain 4 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 2 = **19/30**. A Nordic-specific legal duty with no contractor-side tool, and an AI task that works today. The slow sales cycle is the drag; a founder with construction contacts should rank this higher.

---

## 11. Home inspection report generator with AI photo-to-defect narration

**One-liner.** An inspector photographs and dictates on site; the app classifies findings against the standard checkpoint library, drafts the narrative, checks coverage, and outputs the report in the legally required structure.

### Problem statement
Norway's 2022 regulation under the sale-of-property act sets minimum content and a required machine-readable structure for condition reports (SN-NSPEK 3477); about 107,000 reports were produced in 2022, 89% by members of Norsk takst, and 92.6% of sampled reports contained at least one TG2 finding. Denmark produced 84,017 condition reports and 76,552 electrical reports in 2024, filed through an official system, with the regulator doubling its audits. In the US, Spectora bought HomeGauge and in June 2026 launched AI Report Assist claiming 25% time savings per inspection, the strongest quantified AI benefit found in this cluster.

### Who experiences the problem
Norway has about 1,400 inspection engineers in 900 firms; the US about 30,000 inspectors doing 250–600 inspections a year; Denmark's count of authorised surveyors was not found. The buyer and user are the inspector; in Norway the estate agent often steers the choice of inspector.

### Value of solving it
25% of inspection time on 250–600 inspections a year is 60–300 hours; in Norway a complete, well-worded report limits liability for both seller and inspector.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Spectora (US) | Cloud inspection software with AI | $109/mo plus $99 per extra inspector; AI Report Assist | Per-inspection add-ons; US |
| HomeGauge | Desktop, now part of Spectora | $89/mo | Legacy |
| GoReport (UK) | Surveyor reporting with AI | £149–£210/mo | UK only |
| Property Inspect | Inspections with "Inspect AI" | $49–$275/mo | Generalist |
| iVerdi (Norway) | "Most used" system for inspection engineers, tied to Norsk takst | Hidden | Closed ecosystem, 89% share |
| Danish official huseftersyn system | Mandatory filing | | Third-party tools are pre-drafting only |

### Pricing model
NOK 990 per inspector per month. Inspectors bill NOK 8,000–15,000 per report, so the price is trivial if it saves an hour per report.

### Path to profitability
At €100 ARPU you need 50 inspectors for €5k MRR and 100 for €10k. The Norwegian population is only 1,400 and locked into iVerdi; Denmark requires filing through the official system; the US is Spectora's. The numbers work only if you can take 7% of Norway's inspectors from a system their association owns, which is unlikely.

### Where AI is used
- **In the product:** an excellent fit. The standardised checkpoint library, TG grades and cost intervals make photo-and-voice-to-finding classification tractable and auditable; consistency checks catch missed rooms; narrative drafting turns terse findings into consumer-readable text. Auto-assigning grades without inspector sign-off is the one thing not to do.
- **To build it:** standard mobile capture and PDF generation; the structured export must conform to the regulation's data structure.

### MVP
- **Doing / not doing:** if pursued, a pre-drafting layer that exports into iVerdi or the Danish system, sold to independent inspectors outside Norsk takst. Not a standalone report system.
- **Effort:** 8 weeks.
- **Dependencies:** licence for the NS 3600 / SN-NSPEK 3477 standard from Standard Norge, Matrikkel data, being a certified surveyor to issue reports (the tool cannot).
- **Hardest part:** the market is locked and tiny.

### Score and verdict
Pain 3 · Solo 2 · AI 5 · Gap 1 · WTP 4 · Reach 2 = **17/30**. One of the best AI fits in the whole list attached to one of the worst markets for a newcomer.

---

## 12. Small fleet daily vehicle inspection and defect workflow

**One-liner.** A driver walk-around app with photo defect capture, repair routing and the records a roadside inspector asks for.

### Problem statement
US regulations require a written driver vehicle inspection report per vehicle per day with records kept three months; the UK requires daily walk-around checks with written defect reports kept 15 months and expects electronic records for its Earned Recognition scheme. Norway only requires that the vehicle be in proper condition, with no written-report mandate for vans, so the compliance pull in the Nordics is weak. The category is mature with free tiers.

### Who experiences the problem
The US has about 580,000 registered carriers, 91.5% with ten or fewer trucks; EU van and truck fleet counts were not retrieved. The buyer is the owner or operations manager of a 3–50 vehicle fleet (trades, delivery, plant hire); the users are drivers.

### Value of solving it
Avoided out-of-service orders and fines, provable records, faster defect-to-repair. Whip Around reports 50,000+ inspections a day across its base.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Fleetio | Fleet maintenance | $4–$10 per vehicle/mo | Bands of five vehicles |
| Whip Around | Inspections-first | Free 1 asset; $5–$10 per asset | Billing complaints |
| Simply Fleet | Cheap fleet app | Free to 5 vehicles; $2–$4 per vehicle | Sets the floor |
| AUTOsist, Driveroo | Maintenance, inspections | $5–$7 per asset with minimums | Contracts |
| CheckProof (Sweden) | Checklists for heavy industry | $18–$49 per user/mo | Per user |
| Samsara, Motive | Telematics with bundled DVIR | Quote, hardware | Bundling undercuts standalone |

### Pricing model
Per vehicle, $3–5 a month with a $25 minimum. The floor is $2.

### Path to profitability
At €40 ARPU (a ten-vehicle fleet) you need 125 fleets for €5k MRR and 250 for €10k, competing against free tiers and telematics bundles. Not attractive.

### Where AI is used
Photo-based defect detection (tyres, lights, damage), severity triage, voice reporting, maintenance prediction from defect history. Useful, but the incumbents can add the same.

### MVP
- **Doing / not doing:** not recommended. If pursued, the Nordic wedge is a plant-hire and trades-van variant integrated with the Norwegian vehicle register for automatic vehicle data.
- **Effort:** 5 weeks.
- **Dependencies:** offline mobile app, national vehicle data APIs (Statens vegvesen, DMR), telematics APIs.
- **Hardest part:** no compliance driver in the home market and a $2 price floor.

### Score and verdict
Pain 3 · Solo 4 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **16/30**. Mature, crowded, cheap. Skip.

---

## 13. Property inventory and condition reports with AI photo comparison

**One-liner.** Guided check-in and check-out photo capture per room, AI change detection and wear-versus-damage classification, and a signed report that survives a deposit dispute.

### Problem statement
In Denmark a landlord with more than one dwelling must hold a move-in inspection and hand over the report within two weeks, and a move-out inspection within two weeks with a week's notice; failing to do so forfeits the entire repair claim. In the UK, cleaning has been the main cause of deposit deductions for five years running and the Renters' Rights Act reshaped tenancies from 1 May 2026. Norway's tenancy tribunal has a ten-month waiting time. But Norwegian landlord platforms (Husleie.no, Hybel) and Denmark's BoligPortal bundle the handover protocol for free, and the UK incumbents are adding AI (RentCheck "AI Damage Assist", Property Inspect "Inspect AI").

### Who experiences the problem
England has about 513,000 landlords registering deposits directly, 52% self-managing and 83% with four or fewer properties, plus letting agents and inventory clerks. Danish landlords with more than one dwelling were not counted. The buyer is the letting agent, inventory clerk or small landlord.

### Value of solving it
In Denmark a missed inspection wipes out the claim; in the UK a time-stamped photo pair is the decisive evidence in adjudication.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Inventory Hive (UK) | Inventory plus 360° | £30/mo | No AI |
| InventoryBase (UK) | Clerks and agents | £35–£349/mo; human transcription 35p/min | Human, not AI |
| RentCheck (US) | Tenant self-inspections | $1–$1.75 per unit/mo; AI Damage Assist | US |
| Property Inspect | Generalist inspections | $49–$275/mo | Generalist |
| Husleie.no, Hybel (Norway), BoligPortal (Denmark) | Landlord platforms | Handover protocol free | Bundled |

### Pricing model
Per report for small landlords (€5), per month for agents and clerks (€39–99).

### Path to profitability
At €40 ARPU you need 125 customers for €5k MRR and 250 for €10k, from UK clerks and Danish multi-unit landlords. The Nordic bundling makes the home market hard; the UK is the real market and it is crowded. Ceiling around €5k MRR.

### Where AI is used
Photo pairing per item, change detection, wear-versus-damage classification, dictation to report. Genuinely useful and technically achievable; the incumbents are doing it too.

### MVP
- **Doing:** guided shot lists, check-in/check-out pairing, AI diff with human confirm, PDF with e-signature, Danish deadline reminders.
- **Not doing:** 360° capture, property-management integrations at launch.
- **Effort:** 6 weeks.
- **Dependencies:** image alignment and vision LLM, e-sign, mobile capture.
- **Hardest part:** free bundling in the Nordics and AI parity in the UK.

### Score and verdict
Pain 3 · Solo 4 · AI 4 · Gap 2 · WTP 2 · Reach 3 = **18/30**. Good product, wrong market timing; the feature will be table stakes in every landlord platform within two years.

---

## 14. Small private landlord manager (1–10 units)

**One-liner.** Rent collection, deposit handling, maintenance, compliant leases and notices, and a tax export for landlords with a handful of units.

### Problem statement
The UK's Making Tax Digital for Income Tax became mandatory on 6 April 2026 for landlords with over £50,000 of qualifying income, and extends to £30,000 in 2027 and £20,000 in 2028, requiring digital records and quarterly updates via recognised software; the Renters' Rights Act adds a landlord database with penalties up to £7,000. Norway and Denmark have deposit-account, rent-increase and inspection rules but no comparable software mandate. The category is freemium everywhere: TurboTenant, Avail, Stessa and Baselane are free or near-free in the US, Husleie.no and Hybel charge NOK 79–199 per tenancy per month in Norway and give the basics away, BoligPortal's landlord tools are free in Denmark.

### Who experiences the problem
England's 513,000 direct-deposit landlords; US individual investors owning 14.3 million rental properties; Nordic counts not found. The buyer is the landlord.

### Value of solving it
Compliance without an accountant, avoided penalties, preserved deposit claims, correctly indexed rent increases.

### Main competitors
| Product | Published pricing |
|---|---|
| Landlord Studio (US/UK) | Free to 3 units; $12–$28/mo; AI bookkeeping |
| Stessa, TurboTenant, Avail, Hemlane, Baselane (US) | Free tiers; $9–$36/mo paid; monetised via payments and interchange |
| RentRedi | $12–$30/mo |
| Husleie.no (Norway) | Free basics; NOK 99–199 per tenancy/mo |
| Hybel (Norway) | NOK 79 per tenancy/mo, deposit account via bank partner |
| BoligPortal (Denmark) | Free landlord tools |

### Pricing model
Freemium with paid tiers at €9–15 a month; in the Nordics the real money is deposit accounts, rent-default insurance and payments, which need bank and insurer partners.

### Path to profitability
At €12 ARPU you need 417 landlords for €5k MRR and 833 for €10k, against free competitors. The UK MTD angle is the only hard driver, and it requires HMRC software recognition. Not attractive for a solo founder without a bank partner.

### Where AI is used
Bank-feed categorisation, jurisdiction-aware lease and notice drafting, quarterly tax summaries, receipt reading. Useful but every incumbent has it.

### MVP
- **Doing / not doing:** not recommended. The narrowest test is a UK MTD-for-landlords quarterly filing tool, which is a different, accountant-adjacent product.
- **Effort:** 8 weeks.
- **Dependencies:** open banking (TrueLayer, Neonomics, Tink), HMRC MTD API recognition, BankID/MitID, bank partner for deposit accounts; holding client money may need a payment-institution licence.
- **Hardest part:** free incumbents and the partnerships needed for the features Nordic landlords value.

### Score and verdict
Pain 3 · Solo 3 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **15/30**. Free everywhere. Skip.

---

## 15. Short-term rental turnover operations

**One-liner.** Cleaner scheduling from booking calendars, photo checklists, damage reporting and supply tracking for hosts with 1–20 units.

### Problem statement
Guest nights booked through Airbnb, Booking and Expedia in the EU reached 952 million in 2025, up 11%. EU Regulation 2024/1028 brings host registration numbers and monthly platform data-sharing from spring 2026. Turnover is the operational pain: a missed clean costs a refund and a review, damage must be documented immediately, supplies run out. But every property-management system bundles task management, and the specialists have free tiers.

### Who experiences the problem
Hosts and small managers with 1–20 units and their cleaners. EU host counts were not retrieved. The buyer is the host or manager; the user is the cleaner.

### Value of solving it
Fewer missed cleans, better damage evidence, less coordination. Not quantified.

### Main competitors
| Product | Published pricing |
|---|---|
| Turno | Free single property; $10/mo unlimited with own cleaners |
| Breezeway | Freemium; from $19 per unit/mo |
| Hospitable | Free tier; paid tiers plus $10–15 per extra property |
| Guesty | $9 per listing/mo entry |
| Lodgify | $14–$62/mo, tasks only on top tier |
| Properly | $13–$15 per property/mo |
| Hostaway, Operto, Doinn | Quote or hidden |

### Pricing model
$10–19 per property per month is the band; freemium is expected.

### Path to profitability
At €15 ARPU you need 333 hosts for €5k MRR, against free tiers, with seasonal churn. Not attractive.

### Where AI is used
Photo QA against a reference set (bed made, amenities present), damage diff, multilingual cleaner instructions. Real but small.

### MVP
- **Doing / not doing:** not recommended as a standalone; the photo-QA feature could be sold to cleaning companies rather than hosts.
- **Effort:** 5 weeks.
- **Dependencies:** iCal feeds (free), PMS partner APIs, Stripe Connect.
- **Hardest part:** every PMS bundles this.

### Score and verdict
Pain 2 · Solo 4 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **15/30**. Crowded and bundled. Skip.

---

## 16. Housing cooperative and condominium board management

**One-liner.** A workspace for volunteer boards of housing co-ops and condominiums (borettslag, sameie, andelsboligforening, bostadsrättsförening): documents, annual meeting with digital voting, dues, maintenance plan, and a handover brief for the next board, with AI minutes and bylaw Q&A.

### Problem statement
Boards are volunteers who rotate annually and inherit a shoebox of documents. Sweden has required every housing co-op to hold a 50-year technical maintenance plan since 1 January 2023. Norway's building co-op federation NBBL manages over 17,500 housing companies and 650,000 dwellings; Denmark has roughly 10,000 co-ops; the US has 373,000 community associations. Statutory deliverables (annual meeting, accounts, maintenance plan) recur every year. Nordic tools exist (Styreportalen at NOK 175 a month, Boappa at SEK 3,900–13,900 a year, ProBo with 200,000 users, OBOS's Vibbo) but none has AI minutes, decision search or maintenance-plan drafting, and the managing-agent portals lock boards into the agent.

### Who experiences the problem
At least 17,500 housing companies in Norway, over 10,000 co-ops in Sweden's largest association alone, about 10,000 in Denmark. The buyer is the board chair; the decision is often shared with the managing agent. Every one of them is listed in the national business register with the chair's name, which makes them unusually reachable.

### Value of solving it
Statutory compliance, fewer paid managing-agent hours, continuity at handover. Not quantified.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Styreportalen (Norway) | Board portal | NOK 175/mo plus NOK 49–309 add-ons | No AI |
| Boappa (Sweden) | Resident communication | SEK 3,900–13,900/yr by units | Communication-first |
| ProBo (Denmark) | Co-op platform, 200,000 users | Hidden | |
| Vibbo (OBOS, Norway), Nabo (Sweden) | Managing-agent portals | Hidden or unreachable | Lock-in to the agent |
| Buildium, AppFolio, HOALife, Condo Control (US) | Association management | $62–$400/mo or quote | US |

### Pricing model
Per association per year, banded by units: NOK 2,990 (under 30 units), NOK 5,990 (30–100), NOK 9,990 (100+). Annual billing matches how boards budget.

### Path to profitability
At €40 ARPU (about NOK 5,000 a year) you need 125 associations for €5k MRR and 250 for €10k, out of tens of thousands in Norway and Sweden. Boards decide once a year, so the sales calendar is lumpy (before the annual meeting season, March to May). Churn is low: documents and decisions accumulate. Distribution: the business register gives you every association and its chair; direct mail and LinkedIn to chairs, plus partnerships with independent (non-OBOS) accountants and managing agents who want a modern portal.

### Where AI is used
- **In the product:** minutes from recorded meetings, Q&A over bylaws and past decisions, drafting the 50-year maintenance plan from building data and inspection photos, handover briefs, dues chasing letters. Real and differentiating; none of the Nordic incumbents has it.
- **To build it:** documents, meetings, voting and dues are standard; BankID/MitID for digital voting via a broker; accounting integrations later.

### MVP
- **Doing:** Norway first. Document archive with AI search, meeting recorder with AI minutes and decision log, annual meeting module with digital voting (BankID via Criipto or Signicat), maintenance plan template with AI drafting, handover brief, resident notice board.
- **Not doing:** accounting and dues invoicing (integrate with Fiken/Tripletex/Visma in v2), managing-agent features, Sweden's specific requirements until v2.
- **Effort:** 8 weeks.
- **Dependencies:** Brønnøysund register API (free), BankID broker, speech-to-text with Norwegian, LLM.
- **Hardest part:** the managing agents (OBOS, USBL) control most relationships; the market is the independent associations and the agents who compete with OBOS.

### Score and verdict
Pain 3 · Solo 4 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **19/30**. Reachable buyers, recurring statutory needs, sticky data and a clear AI differentiator. Slower to sell than a business product, but a solid Nordic candidate.

---

## Cluster summary

| # | Idea | Score | ARPU € | Customers to €10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 8 | AI trades quoting from photos and voice | **21** | 70 | 143 | 8 |
| 9 | Aerial roof/fence/solar measurement quotes | **19** | 120 | 84 | 8 |
| 10 | Subcontractor compliance tracker | **19** | 120 | 84 | 7 |
| 16 | Housing co-op board management | **19** | 40 | 250 | 8 |
| 13 | Property inventory with AI photo comparison | **18** | 40 | 250 | 6 |
| 11 | Home inspection report generator | **17** | 100 | 100 | 8 |
| 12 | Small fleet vehicle inspections | **16** | 40 | 250 | 5 |
| 14 | Small private landlord manager | **15** | 12 | 833 | 8 |
| 15 | Short-term rental turnover ops | **15** | 15 | 667 | 5 |

## Sources
- https://www.installeronline.co.uk/news/93-of-uk-tradespeople-say-running-their-business-is-stressing-them-out-new-national-report-finds/
- https://phamnews.co.uk/nine-in-ten-tradespeople-stressed-by-running-their-business-survey-finds/
- https://www.electricaltimes.co.uk/uk-tradespeople-losing-ten-working-weeks-a-year-to-admin-they-could-automate-survey-finds/
- https://powerednow.com/powered-now-admin-calculator/
- https://www.simplybusiness.co.uk/knowledge/trades/unpaid-tasks-costing-uk-tradespeople/
- https://www.prnewswire.com/news-releases/jobber-launches-copilot-the-first-of-several-ai-powered-products-aimed-at-making-home-service-business-ownership-simpler-than-ever-before-302264047.html
- https://contractortoolstack.com/software/housecall-pro/
- https://getjobber.com/pricing/
- https://www.housecallpro.com/pricing/
- https://www.tradifyhq.com/pricing
- https://fergus.com/pricing/
- https://www.joist.com/pricing/
- https://minuba.dk/pris/
- https://ordrestyring.dk/priser/
- https://drifti.no/cms/comparisons/sammenligning-av-programvaresystem-svenn-smartdok-og-dextro
- https://myquoteiq.com/ai-estimator/
- https://voxtrade.app/blog/best-quoting-apps-tradespeople
- https://airquote.co/ai-quoting
- https://ec.europa.eu/eurostat/cache/htmlpub/key-figures-on-european-business-2022/construction.html
- https://www.nhoelektro.no/om-oss/om-nho-elektro/medlemmene/
- https://www.rornorge.no/om-oss/
- https://squarecount.io/eagleview-pricing
- https://roofingsoftwareguide.com/reviews/eagleview-review/
- https://roofr.com/pricing
- https://developers.google.com/maps/documentation/solar/usage-and-billing
- https://developers.google.com/maps/documentation/solar/coverage
- https://developers.google.com/maps/documentation/solar/release-notes
- https://kartkatalog.geonorge.no/metadata/norge-i-bilder-wms-ortofoto/dcee8bf4-fdf3-4433-a91b-209c7d9b0b0f
- https://datafordeler.dk/dataoversigt/geodanmark-ortofoto/ortofoto-foraar-wmts/
- https://www.solarpowereurope.org/press-releases/new-report-eu-solar-workforce-reaches-record-heights-in-2024-but-growth-expected-to-stall-in-2025
- https://aurorasolar.com/pricing/
- https://www.opensolar.com/
- https://roofscope.com/page/pricing
- https://www.arbeidstilsynet.no/hms/hms-kort/
- https://www.arbeidstilsynet.no/hms/hms-i-bygg-og-anlegg/byggherreforskriften/elektroniske-oversiktslister/
- https://lovdata.no/dokument/SF/forskrift/2007-03-30-366
- https://lovdata.no/dokument/SF/forskrift/2008-02-22-166
- https://www.skatteverket.se/foretag/arbetsgivare/personalliggare/personalliggarebyggbranschen.4.7be5268414bea0646949797.html
- https://id06.se/support/vad-hander-om-lagen-om-personalliggare-inte-foljs/
- https://lagen.nu/2018:1472
- https://www.vertikalrms.com/article/how-much-does-coi-tracking-software-cost-2026-pricing-guide/
- https://www.trustlayer.io/plans
- https://www.achilles.com/app/uploads/2024/12/StartBank_Krav-til-registrering.pdf
- https://lovdata.no/dokument/SF/forskrift/2021-06-08-1850/KAPITTEL_2
- https://www.ssb.no/bygg-bolig-og-eiendom/bolig-og-boforhold/artikler/tilstandsrapporter/_/attachment/inline/c677d4a3-8852-4bb8-b6a7-3808bb529215:8162103592713896ffde0689f8844e90ebe62e65/NOT2023-52.pdf
- https://www.sik.dk/erhverv/huseftersynsordningen/nyheder-statistik-og-informationsmoeder/statistik/statistik-over-bygningseftersyn
- https://www.spectora.com/pricing
- https://www.businesswire.com/news/home/20260609736918/en/Spectora-Introduces-New-AI-Tools-Reimagining-How-a-Home-Inspection-Gets-Done
- https://www.goreport.com/pricing/
- https://propertyinspect.com/pricing/
- https://www.iverdi.no/
- https://www.law.cornell.edu/cfr/text/49/396.11
- https://www.gov.uk/government/publications/guide-to-maintaining-roadworthiness/guide-to-maintaining-roadworthiness-commercial-goods-and-passenger-carrying-vehicles
- https://www.trucking.org/economics-and-industry-data
- https://www.fleetio.com/pricing
- https://www.softwareadvice.com/inspection/whip-around-profile/
- https://www.simplyfleet.app/pricing-plan
- https://www.autosist.com/pricing/
- https://www.checkproof.com/pricing
- https://danskelove.dk/lejeloven
- https://housinghub.campaign.gov.uk/renting-is-changing/
- https://www.gov.uk/government/publications/guide-to-the-renters-rights-act/guide-to-the-renters-rights-act
- https://www.depositprotection.com/
- https://lovdata.no/dokument/NL/lov/1999-03-26-17
- https://www.htu.no/
- https://www.gov.uk/government/statistics/english-private-landlord-survey-2024-main-report/english-private-landlord-survey-2024-main-report
- https://www.inventoryhive.co.uk/pricing/
- https://inventorybase.co.uk/pricing/
- https://getrentcheck.com/pricing
- https://www.gov.uk/guidance/check-if-youre-eligible-for-making-tax-digital-for-income-tax
- https://www.landlordstudio.com/pricing
- https://www.stessa.com/pricing/
- https://www.turbotenant.com/pricing/
- https://www.husleie.no/utleier
- https://hybel.no/premium
- https://www.boligportal.dk/
- https://eur-lex.europa.eu/eli/reg/2024/1028/oj
- https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Short-stay_accommodation_offered_via_online_collaborative_economy_platforms
- https://www.breezeway.io/pricing
- https://hospitable.com/pricing/
- https://www.guesty.com/pricing/
- https://www.getproperly.com/pricing
- https://lagen.nu/1991:614
- https://www.nbbl.no/om-oss/
- https://www.abf-rep.dk/om-abf/
- https://foundation.caionline.org/publications/statistical-review/
- https://www.buildium.com/pricing/
- https://hoalife.com/pricing/
- https://www.styreportalen.no/priser/
- https://www.probo.dk/
- https://boappa.se/priser
