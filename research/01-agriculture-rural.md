# 01 — Agriculture, rural & land (ideas 1–7)

Seven ideas rooted in the founder's context (this repository is named *landmand*, Danish for farmer). Agriculture has two things a solo founder wants, a captive regulatory calendar and a fragmented set of pre-AI incumbents, and one thing they do not, low willingness to pay: fieldmargin, the best-known independent farm-records app, is still under $1M revenue after twelve years, and the largest platforms are free because a co-op, an advisory body or an equipment maker subsidises them. The ideas that survive here are the ones where a legal deadline forces a purchase (1, 3) or where the buyer is a business rather than a household (4, 7).

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 1. Farm compliance and subsidy record-keeper

**One-liner.** A mobile-first farm journal where the farmer speaks or photographs what they did ("sprayed field 7 with Proline, 0.6 litres per hectare, done at ten") and the app produces the legally required electronic pesticide record, fertiliser journal, and audit pack for CAP conditionality, KSL, or the Danish fertiliser accounts.

### Problem statement
Three regulatory changes landed at once. EU Implementing Regulation 2023/564 requires every professional pesticide user to keep records in machine-readable electronic form from 1 January 2026, with product and authorisation number, date and time, dose, treated area, crop as an EPPO code and growth stage as a BBCH code. Norway moved fertiliser-plan rules into the fertiliser regulation from 1 January 2026 and added a new fertiliser-journal duty; a missing or deficient spray journal reduces production subsidies. Denmark's fertiliser accounts for the 2024/25 planning period were due 31 March 2026 through landbrugsindberetning.dk. Under CAP conditionality a non-intentional breach costs 1–10% of direct payments, an intentional one 15–100%. In Norway, farms outside the KSL quality scheme take a 40% price deduction at every slaughterhouse, and from autumn 2026 closure of KSL deviations is externally audited. The incumbents are desktop-era advisory suites (SEGES Mark Online from DKK 3,150 a year, Skifteplan from NOK 1,795), and one large platform, 365FarmNet, is shutting down on 30 November 2026.

### Who experiences the problem
Every CAP beneficiary: 9.1 million EU farms (2020 census), 36,627 in Norway (2025) and 27,024 in Denmark (2025). The buyer is the owner-operator; the users are the farmer, the advisor (Norwegian NLR or Danish DLBR/SEGES consultants often key records for the farmer) and the auditor. Farm counts fall 2–3% a year, but the compliance burden per farm rises.

### Value of solving it
Avoided subsidy reductions of 1–10% of direct payments, avoided 40% slaughter deductions, and up to £100k a year in the UK's Sustainable Farming Incentive where evidence is required. A 200-hectare Danish farm's direct payments are on the order of €40–50k, so a 3% reduction is €1,200–1,500. No incumbent publishes an hours-saved number.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| fieldmargin (UK) | Simple per-farm records and maps | £11.99–£53.99/mo | No Nordic compliance forms; tiny company after 12 years |
| Farmable (Norway) | Orchard and vineyard app, 2,100+ farms | Free to 5 spray records; Pro NOK 3,990/yr; modules NOK 199–2,990 | Horticulture only, no accounting |
| Skifteplan (Agromatic, Norway) | Fertiliser plan and journals, KSL documents | From NOK 1,795/yr | Desktop-era UX, sold through advisors |
| Agrilogg (Norway) | Web farm diary and KSL document store | NOK 79/mo | Small team, no AI |
| SEGES Mark Online + CropManager (Denmark) | Advisory-owned standard | DKK 3,150–7,975/yr by hectares plus setup | Expensive under 50 ha, Denmark only |
| Næsgaard Mark (Datalogisk, Denmark) | Field maps and plans | DKK 750–5,100/yr plus setup | Windows-centric |
| Agrivi, xarvio, Climate FieldView | Enterprise or input-maker platforms | Quote-only or per hectare; FieldView Prime free | Not compliance-oriented; input-maker bias |
| 365FarmNet (CLAAS) | Farm management platform | Shutting down 30 Nov 2026 | Market gap opening |
| AI-native entrants | FarmInSync (Norway), Agron plantevernjournal (Norway), Spraybook (US) | Early, small | Prove the direction |

### Pricing model
Per farm, flat, banded by hectares: NOK/DKK 1,500 a year for under 50 ha, 3,000 for 50–200 ha, 6,000 above. Annual billing before the season. An advisor tier where an NLR or DLBR consultant manages 30 farms for one price.

### Path to profitability
At €20 ARPU (about NOK 2,400 a year) you need 250 farms for €5k MRR and 500 for €10k. That is 1.4% of Norwegian farms, which is realistic in three seasons only through the advisor channel; direct-to-farmer sales are slow and seasonal. Churn is low once a farm's history lives in the app and the auditor has seen it. Costs are small (speech-to-text and extraction cost a few øre per record). The credible path: sign two or three NLR or DLBR advisory units as distribution partners, sell the advisor tier at €150–300 a month, and let farmers come in through them.

### Where AI is used
- **In the product:** the whole wedge. Voice or photo becomes a structured record that satisfies Regulation 2023/564 (product lookup against the national label database, dose, EPPO crop, BBCH stage from date and crop), invoice and label OCR, rule checks (buffer zones, maximum dose per season, nitrogen and phosphorus balance against the fertiliser plan), and drafting the audit pack. Yield prediction and chat are gimmicks here.
- **To build it:** the data model (farm, parcel, crop, operation, product) and the PDF outputs are standard. The agent should be pointed at the regulation text, the national portals and the label database formats to generate parsers and validation rules, which a human then checks against real records.

### MVP
- **Doing:** Norway first. Parcel import from NIBIO Gårdskart, product lookup against Mattilsynet's pesticide database, voice-to-record spray and fertiliser logging with a confirm screen, offline capture, BBCH and EPPO coding, the fertiliser journal, and a KSL/regulation-compliant PDF export. Advisor multi-farm view.
- **Not doing:** Denmark (season two, requires the licensed SEGES Middeldatabasen), machine telematics, agronomy advice, accounting, direct submission to Altinn or landbrugsindberetning.dk (no public APIs exist; the farmer still submits).
- **Effort:** 10 weeks.
- **Dependencies:** NIBIO Gårdskart/AR5 parcel data, Mattilsynet pesticide database (site returned errors during research; verify access), met.no weather (free, attribution required), a speech-to-text service with good Norwegian, LLM for extraction.
- **Hardest part:** per-country rule sets. Every market added is a new label database, parcel source and portal. Keep to one country until the advisor channel works.

### Score and verdict
Pain 4 · Solo 3 · AI 5 · Gap 3 · WTP 2 · Reach 3 = **20/30**. The strongest agriculture idea because the 2026 electronic-records rules are a forcing function and the voice-to-record workflow is a genuine AI product. Low farmer willingness to pay is the constraint; the advisor channel is the answer.

---

## 2. Small-farm direct sales and box-scheme manager

**One-liner.** Ordering, payment and pickup logistics for farm shops, box schemes and REKO-ring producers, replacing comment-thread orders on Facebook, with Vipps and MobilePay built in.

### Problem statement
Direct farm sales are growing in value while the tooling is either American and expensive or a Facebook group. Norwegian local-food sales reached NOK 13.55 billion in 2025, with direct channels (farm shops, farmers' markets, REKO) at NOK 938 million. Over 130 REKO rings run on volunteer admins collecting orders from Facebook comments, and REKO Norway itself reports that sales through the rings are declining. The US tools charge $89–399 a month plus card fees, which one vendor blog notes eats 4–10% of a micro-vendor's gross; Harvie shut down at the end of 2024 after charging $500 setup plus 7% of sales. In the US, 116,617 farms sell direct to consumers, down 10% since 2017, while direct marketing revenue rose 25% in real terms, meaning fewer, larger direct sellers.

### Who experiences the problem
Farm shops, box schemes and REKO producers (roughly 500 producers in Norway on older figures), 7,240 US farms selling via CSA. The buyer is the farm owner; the users are the farmer, packers and customers. No Nordic paid tool for REKO or farm shops was found.

### Value of solving it
Avoiding 2–7% commissions, and hours per week of collating comment orders and chasing payments. Local Line's pitch is "keep every dollar".

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Local Line (Canada) | Multi-channel farm e-commerce | $99–$399/mo plus card fees and add-ons | Too big for micro vendors |
| Barn2Door (US) | Sales-led all-in-one | $99–$299/mo plus $399–599 setup plus 1–3% merchant fee | Opaque pricing, churn allegations from ex-staff |
| GrazeCart (US) | Meat-farm storefront | $89–$199/mo | US-centric |
| CSAware, Farmigo | CSA specialists | 2% of revenue with $100–150/mo minimum | Dated, US only |
| Open Food Network UK | Platform co-op | Free to £500/mo sales; 2.4% above | Low velocity |
| Shopify | Generic | $29–$399/mo plus card fees | No order cycles or pickup logic |
| Facebook groups | Free | | Comment ordering, no payments |

### Pricing model
Flat per farm: NOK 199 a month for a shop with pickup points, NOK 499 with subscriptions and routes; payment processing at cost through Stripe, Vipps and MobilePay. Free tier for REKO ring admins to seed the network.

### Path to profitability
At €40 ARPU you need 125 farms for €5k MRR and 250 for €10k. Seasonal churn is brutal (many producers stop in winter), so annual billing with a seasonal pause option matters. Distribution: REKO ring admins (one admin brings 20 producers), farmers' market associations, Bondens marked, Norsk Mat. This will be a slow, community-driven grind; a realistic ceiling in the Nordics is €5k MRR, and the US market has entrenched competitors.

### Where AI is used
- **In the product:** parsing pasted REKO comment threads into structured orders (the migration path from Facebook), product descriptions from photos, box composition from harvest estimates, customer message drafting. Useful but not the reason to buy.
- **To build it:** a standard commerce app with pickup-slot and subscription logic; agents produce it quickly. Vipps and MobilePay integrations are well documented.

### MVP
- **Doing:** product catalogue, order cycles with a deadline, pickup points, Vipps/MobilePay/card payment, packing lists, customer SMS, paste-in import of Facebook comment orders.
- **Not doing:** delivery routing, marketplace discovery, POS hardware, wholesale to retailers (v2), accounting integration beyond CSV.
- **Effort:** 6 weeks.
- **Dependencies:** Stripe, Vipps, MobilePay, Twilio or 46elks for SMS, Facebook Groups API is effectively closed so import is manual paste or a browser extension.
- **Hardest part:** willingness to pay from producers who currently pay nothing, and winter churn.

### Score and verdict
Pain 2 · Solo 4 · AI 3 · Gap 3 · WTP 2 · Reach 3 = **17/30**. A real Nordic gap, but a shrinking channel and price-sensitive customers. Good community project, weak business.

---

## 3. Livestock health, medication and withdrawal-period records

**One-liner.** Hands-free treatment logging in the barn ("treated ewe 4471 with Baycox, 5 ml") that tracks withdrawal periods, mortality and movements and produces the record an auditor or slaughterhouse asks for.

### Problem statement
EU Regulation 2019/6 has required keepers of food-producing animals to record veterinary medicine use since January 2022; the UK requires records kept for five years and available for inspection. In Norway the KSL scheme has 99.8% participation because non-KSL animals take a 40% slaughter-price deduction, and from autumn 2026 external auditors verify that deviations are closed. Sheep farmers pay NOK 1,100–1,300 a year for Sauekontrollen, which demands lambing, weight and death registrations. The official systems (Dyrehelseportalen, Sauekontrollen, Kukontrollen in Norway; CHR in Denmark) are registers with data-entry interfaces, not workflow tools, and there is no AI-native livestock-records product in the Nordics.

### Who experiences the problem
Norway has 10,743 holdings with dairy cows, 12,821 with sheep and 1,745 with pigs (2025); Denmark 13,406 farms with animals. The EU holds 132 million pigs, 72 million bovines and 67 million sheep and goats. The buyer is the farmer; the users are the farmer, the vet, the auditor and the slaughterhouse.

### Value of solving it
Avoiding the 40% KSL deduction and subsidy reductions, avoiding residue violations (a withdrawal-period breach can condemn a carcass), and less evening paperwork. Herdwatch, the UK and Irish leader with 22,000 farmers, markets "less paperwork" without a number.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Herdwatch (UK/Ireland) | 22,000 farmers, syncs with national cattle registers | Priced by farm size, effectively quote; promo £99 for 9 months | No Nordic registers |
| Breedr (UK/US) | Cattle performance and trading | $2–$235/mo by head count | Beef-centric |
| AgriWebb | Enterprise grazing | Quote plus $300–1,000/yr modules | Overkill for small flocks |
| CattleMax (US) | Herd records | $30–$41/mo | US only |
| Sauekontrollen, Kukontrollen (Animalia, TINE) | Official co-op systems | NOK 1,100–1,300/yr | Data-entry UX, co-op lock-in |
| Dyrehelseportalen, CHR | Official registers | Free | Registers, not workflow |

### Pricing model
Per farm, banded by head count: NOK 990 a year to 100 animals, NOK 1,990 to 500, NOK 3,990 above. Sold alongside, not instead of, the official co-op systems, with export to them.

### Path to profitability
At €20 ARPU you need 250 farms for €5k MRR and 500 for €10k. As with idea 1, the direct channel is slow; the sheep sector (12,800 Norwegian holdings, an engaged community, a hard KSL driver) is the beachhead. Costs are minimal. Expansion means new species and new countries, each with its own registers.

### Where AI is used
- **In the product:** voice logging with animal-ID confirmation while hands are dirty; extraction of withdrawal periods from product SPC documents (EMA Union Product Database, national PDFs) so the countdown is automatic; anomaly alerts on mortality or treatment frequency; drafting vet and audit exports. Photo diagnosis is a gimmick and a liability.
- **To build it:** standard mobile-first CRUD with offline sync; Bluetooth EID reader support needs a real device to test.

### MVP
- **Doing:** Norwegian sheep and cattle. Animal list import from Sauekontrollen/Kukontrollen exports, voice treatment logging with confirmation, withdrawal-period countdown from an SPC-derived product table, mortality and movement log, KSL-ready PDF, offline mode.
- **Not doing:** direct writes to official registers (no public API found; export instead), pigs and poultry (v2), breeding and performance analytics, Denmark.
- **Effort:** 8 weeks.
- **Dependencies:** Sauekontrollen/Kukontrollen export formats, EMA product database, Norwegian speech-to-text, Bluetooth EID readers.
- **Hardest part:** co-op systems are near-free and own the official record; the product must be clearly faster in the barn to justify a second subscription.

### Score and verdict
Pain 4 · Solo 3 · AI 4 · Gap 2 · WTP 2 · Reach 3 = **18/30**. Real pain and a real AI workflow, held back by co-op incumbents and farmer price sensitivity.

---

## 4. Agricultural contractor job scheduling, machine hours and invoicing

**One-liner.** Field-service software for agricultural contractors (Danish maskinstationer, Norwegian leiekjørere, German Lohnunternehmer): jobs on customer parcels, operator and machine hours, fuel, per-hectare or per-hour billing, e-invoices out.

### Problem statement
Contractors do most of the field work in northern Europe (the UK association says 91% of farmers use one) but the software choice is a horizontal field-service tool that does not know what a hectare is (Jobber, Tradify at $29–61 per user per month) or an agronomy platform priced from about $1,500 a year (Agworld). The Danish contractor-specific tool, Næsgaard TID, is a Windows-era per-user licence. 365FarmNet, used by many German and Nordic contractors, shuts down on 30 November 2026, forcing a re-tooling decision. Denmark's 2024 working-time registration law adds a duty to log operator hours.

### Who experiences the problem
Contracting businesses with 2–30 operators. Member counts for the UK (NAAC), Danish (DM&E) and Norwegian (NLT) associations were not found; this is a small, dense market of businesses that bill real money. The buyer is the contractor owner; the users are operators in the cab and the bookkeeper.

### Value of solving it
Accurate per-hectare and per-hour billing (unbilled hours are the classic leak), invoices out the same week instead of month-end, and hour logs that satisfy the working-time law. No published quantification.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Jobber | Horizontal field service | $29–$499/mo, per user beyond included seats | No parcels, no telematics |
| Tradify | Trades field service, AI read/write | $47–$61 per user/mo | Same |
| Agworld | Agronomy-first with contractor records | From about $1,495/yr | Costly, agronomy-first |
| Næsgaard TID (Datalogisk, Denmark) | Contractor time and machine costing | Setup DKK 3,290; DKK 1,660 per user/yr; modules DKK 1,100–3,125/yr | Windows-era |
| 365FarmNet (CLAAS) | Farm and contractor platform | Discontinued 30 Nov 2026 | Switching moment |
| Trimble Ag, CLAAS connect, John Deere Ops Center | OEM platforms | Quote or free with machines | Hardware-led, single-brand |

### Pricing model
Per business with operator seats: DKK 799 a month for 3 operators, DKK 1,999 for 10, plus DKK 99 per extra operator. Contractors are businesses and will pay business prices.

### Path to profitability
At €90 ARPU you need 56 contractors for €5k MRR and 111 for €10k. That is achievable in Denmark and Norway alone if the associations (DM&E, NLT) can be used as channels, and the 365FarmNet sunset gives a concrete reason to switch this winter. Churn is low: invoicing history is sticky. Costs are small; telematics API access may carry developer fees.

### Where AI is used
- **In the product:** voice job logs from the cab, delivery-note and fuel-receipt OCR, and the real prize: matching machine GPS tracks (from John Deere, CLAAS or a phone) to customer parcels to build the invoice automatically. Weather-aware scheduling is a nice extra.
- **To build it:** CRUD, scheduling and invoicing are standard; the track-to-parcel matching is a geospatial join the agent can write with PostGIS; e-invoicing (NemHandel/Peppol in Denmark, EHF in Norway) via an access-point provider.

### MVP
- **Doing:** customers and their parcels (imported from Danish IMK or Norwegian Gårdskart), jobs with operator and machine, mobile hour and fuel logging with voice, per-hectare and per-hour price lists, invoice generation with e-invoice out via an access point, working-time export.
- **Not doing:** telematics integration (v2, after phone-GPS track capture), payroll, inventory, agronomy.
- **Effort:** 8 weeks.
- **Dependencies:** IMK/Gårdskart parcel data, a Peppol/NemHandel access point (e.g. via the accounting system or a provider), e-conomic/Dinero/Fiken/Tripletex export, OEM APIs later.
- **Hardest part:** the market is small and national; reaching €10k MRR probably needs Germany, which means a German partner.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 4 · Reach 3 = **20/30**. The agriculture idea with business-grade willingness to pay and a dated incumbent exiting. Small market, but a solo founder does not need a big one.

---

## 5. Spray-window and field-operation decision assistant

**One-liner.** "Can I spray field 7 with this product today?" answered from the label's constraints, the forecast, buffer-zone maps and the legal record requirements, with the record written automatically if you go ahead.

### Problem statement
Spraying decisions combine label rules (maximum dose, interval, pre-harvest interval, wind and temperature limits), buffer zones to watercourses, weather windows and, since January 2026, mandatory electronic records with BBCH stage. Norway's Plantevernguiden decision tool has been discontinued and its replacement is a product database, not a decision aid; VIPS provides free disease models but no "can I spray" answer. Weather data is free and excellent (met.no, DMI).

### Who experiences the problem
All professional pesticide users: arable and horticultural farms and spray contractors. Certificate-holder counts were not found. The buyer is the farmer or contractor.

### Value of solving it
Avoided wasted applications (re-spraying after rain), avoided subsidy reductions for missing records, and reduced drift liability. Not quantified anywhere.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| xarvio Field Manager (BASF) | Application windows | Per hectare, exact price not found | Input-maker bias |
| Climate FieldView | Weather and scouting | Prime free | Not label-aware |
| Agrio | AI disease alerts | Not published | Not legal-aware |
| VIPS (Norway), PlanteværnOnline (SEGES, Denmark) | Public or advisory models | Free or bundled | No per-field yes/no |
| Farmable Safe Spraying | Module | NOK 199 | Orchards only |
| Spraybook, Farm Spray Pro (US) | Auto-weather records | App-store pricing | US labels |

### Pricing model
Add-on module to idea 1 at NOK 490 a year, or included in the higher tier. Standalone pricing has no benchmark because nobody sells it standalone.

### Path to profitability
At €15 ARPU standalone you need 333 farms for €5k MRR; not realistic alone. As a module it lifts idea 1's ARPU and retention. Treat it as a feature.

### Where AI is used
- **In the product:** turning label PDFs into structured constraints (this is the hard data problem, and an LLM does it well with human review), and explaining the deterministic rules-plus-weather engine in plain language. "AI predicts the perfect window" is marketing.
- **To build it:** rules engine and map layers are standard; label extraction needs an eval set of real labels.

### MVP
- **Doing:** label constraint extraction for the 100 most-used Norwegian products, forecast lookup per parcel, buffer-zone check against NVE watercourse layers, a yes/no/wait answer with reasons, and automatic record creation.
- **Not doing:** disease and pest models (link to VIPS), drone or sprayer integration, Denmark's licensed label database.
- **Effort:** 4 weeks as a module on top of idea 1.
- **Dependencies:** Mattilsynet product database, met.no, NVE/FKB water layers, parcel polygons.
- **Hardest part:** liability. Wrong advice that causes drift damage is the farmer's legal problem, and yours reputationally. Frame it as a checklist, not advice.

### Score and verdict
Pain 3 · Solo 2 · AI 3 · Gap 3 · WTP 2 · Reach 3 = **16/30**. Not a product; a strong module for idea 1.

---

## 6. Small forest owner management

**One-liner.** A portal for small, often absentee forest owners: stand register from the forestry plan PDF, harvest and timber-sale planning, forestry-fund (skogfond) and grant claims, and EU deforestation-regulation paperwork.

### Problem statement
Norway has 126,034 forest properties over 25 decares, 60% of them under 250 decares; Denmark about 24,000, where 80% of owners hold under 10 hectares. Norway's skogfond rules are valuable and confusing: 4–40% of timber revenue must be set aside, and withdrawals for approved investments are 85% tax-free if claimed within a year. The EU Deforestation Regulation reaches small operators from mid-2027. But the tools are free: Allma is free for Allskog co-op members, Finland's Metsään.fi and Sweden's Skogsstyrelsen portal are state-run and free.

### Who experiences the problem
Owners, many of them heirs living elsewhere, plus forest-owner association advisors. Swedish and Finnish counts were not verified.

### Value of solving it
Correct skogfond use (on NOK 100k invested through the fund, only NOK 15k is taxable), timely grant claims and better sale timing. Owners act every few years, so the value is real but rare.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Allma (Allskog, Norway) | Plan on web and app | Free for members | Co-op gated |
| Metsään.fi (Finland), Mina sidor (Sweden) | Official | Free | National only |
| MinSkov (Skovdyrkerne, Denmark) | Member portal | Membership | Member only |
| Trimble Forestry | Enterprise | Quote | Not for small owners |
| Timbeter | Photo log measurement | Not found | Measurement only |

### Pricing model
NOK 490 a year per property; any price must beat free.

### Path to profitability
At €8 ARPU you need 625 properties for €5k MRR. With owners who log in twice a year and free alternatives, this does not reach profitability as a standalone product.

### Where AI is used
Extracting stand tables from forestry-plan PDFs, drafting skogfond and grant claims, satellite change detection for storm and bark-beetle damage, EUDR due-diligence statements. Interesting, but the buyers are not there.

### MVP
- **Doing / not doing:** not recommended for MVP. If pursued, the smallest test is a skogfond claim assistant sold to accountants who serve forest owners.
- **Effort:** 6 weeks.
- **Dependencies:** NIBIO SR16 forest maps, Altinn (no API), forestry-plan PDFs.
- **Hardest part:** free incumbents and low engagement.

### Score and verdict
Pain 2 · Solo 3 · AI 3 · Gap 2 · WTP 1 · Reach 2 = **13/30**. Included for completeness given the founder's context; not a business.

---

## 7. Rural and agricultural grant finder with AI eligibility screening and drafting

**One-liner.** Enter the farm or rural business profile once; the tool screens every relevant national, regional and EU scheme, flags deadlines, and drafts the application narrative from the facts. Sold to advisors first, farmers second.

### Problem statement
The CAP budget for 2021–27 is €387 billion across 28 national strategic plans, plus national schemes (Innovation Norway's regional agricultural grants, Denmark's Landbrugsstyrelsen schemes, the UK's SFI with 71 actions and a £100k cap). Norway's Tilskuddsportalen lists 2,700 grants but sells to municipalities and associations, not farmers. GrantMatch reports that 60% of Canadian small businesses have never applied for a government grant. The official portals list schemes; none screens eligibility across schemes against a profile, and none drafts.

### Who experiences the problem
Farmers (36,600 in Norway, 27,000 in Denmark, 9.1 million in the EU), rural SMEs and, crucially, advisors (NLR, DLBR) and accountants who prepare applications for them. The advisor is the realistic buyer.

### Value of solving it
Grants of NOK 50k to several hundred thousand per application for investments; SFI up to £100k a year. Grantify (UK) claims 7x faster preparation than DIY. Advisor time saved per application is hours, and advisors bill by the hour.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Instrumentl (US) | Nonprofit grant discovery and lifecycle | $299–$999/mo | US nonprofits only |
| Grantable | AI drafting | Free; $50–$150/mo | No agricultural scheme database |
| Grantify (UK) | Consultancy plus AI matching | Undisclosed; £200M+ secured | Innovate UK focus |
| GrantMatch (Canada) | AI matching, joined BDO Canada Jan 2026 | Quote | North America |
| Tilskuddsportalen (Norway) | 2,700+ grants | Quote, sold to municipalities | Not farmer-facing |
| Official portals | Innovation Norway, Tast selv, EU Funding & Tenders | Free | No cross-scheme eligibility |

### Pricing model
Advisor seat at NOK 990 a month with unlimited client profiles; farmer self-serve at NOK 149 a month; optional success-fee partnerships with consultants.

### Path to profitability
At €60 blended ARPU you need 84 customers for €5k MRR and 167 for €10k. Ten advisory offices with three seats each gets you to €5k. Scheme database maintenance is the recurring cost (scraping and reviewing portals each season), and it is also the moat. Distribution: NLR and DLBR units, agricultural accountants, Innovation Norway's regional offices as referrers.

### Where AI is used
- **In the product:** eligibility screening of a structured profile against scheme rules extracted from portal text, deadline and requirement extraction, and narrative drafting from farm facts. "Approval probability" is a gimmick.
- **To build it:** scrapers and extraction pipelines against the portals; the agent can write scrapers fast but scheme rules need human verification each season.

### MVP
- **Doing:** Norway: Innovation Norway agricultural schemes, Landbruksdirektoratet schemes, regional environmental programme (RMP) and SMIL, plus a curated 50-scheme database with structured eligibility; profile-based screening; deadline calendar; narrative draft export to Word.
- **Not doing:** submission (applicants submit via Altinn/Min side themselves), EU-wide coverage, success fees at launch.
- **Effort:** 8 weeks.
- **Dependencies:** portal scraping, Landbruksdirektoratet open subsidy data for pre-filling, LLM extraction, Word export.
- **Hardest part:** advisors already do this by hand and may see the tool as a threat; position it as their tool.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 2 = **18/30**. No agricultural paid finder exists, which is either a gap or a warning. Test with five advisory offices before building.

---

## Cluster summary

| # | Idea | Score | ARPU € | Customers to €10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 1 | Farm compliance record-keeper | **20** | 20 | 500 | 10 |
| 4 | Agricultural contractor scheduling and invoicing | **20** | 90 | 111 | 8 |
| 3 | Livestock treatment records | **18** | 20 | 500 | 8 |
| 7 | Agricultural grant finder | **18** | 60 | 167 | 8 |
| 2 | Farm direct sales and box schemes | **17** | 40 | 250 | 6 |
| 5 | Spray-window assistant | **16** | 15 | 667 | 4 (module) |
| 6 | Small forest owner management | **13** | 8 | 1,250 | 6 |

## Sources
- https://agriculture.ec.europa.eu/common-agricultural-policy/income-support/conditionality_en
- https://teagasc.ie/wp-content/uploads/2025/05/DAFM-Explanatory-Handbook-for-Conditionality-Requirements.pdf
- https://eur-lex.europa.eu/eli/reg_del/2022/1172/oj
- https://eur-lex.europa.eu/eli/reg_impl/2023/564/oj
- https://lbst.dk/planter/goedning/goedningsregnskab
- https://sgav.dk/alle-nyheder/nyheder/2026/feb/husk-at-indberette-dit-goedningsregnskab-for-planperiode-20242025-rettidigt
- https://landbrugsindberetning.dk/
- https://www.statsforvalteren.no/vestland/landbruk-og-mat/miljotiltak/gjodsel-og-pressaft/nye-krav-til-gjodslingsplan-og-gjodseljournal-fra-2026/
- https://www.landbruksdirektoratet.no/nb/jordbruk/miljo-og-klima/husdyrgjodsel-og-gjodsling/forskrift-om-lagring-og-bruk-av-gjodsel-mv.-kommentarer-til-regelverk/-26.krav-til-gjodslingsplan
- https://www.landbruksdirektoratet.no/nb/jordbruk/ordninger-for-jordbruk/produksjonstilskudd-og-avlosertilskudd-i-jordbruket/produksjonstilskudd-og-avlosertilskudd-sokeveiledning/11.egenerklaeringer
- https://www.landbruksdirektoratet.no/nb/norsk-landbruk-tall-og-fakta
- https://www.ssb.no/jord-skog-jakt-og-fiskeri/jordbruk/statistikk/gardsbruk-jordbruksareal-og-husdyr
- https://www.dst.dk/da/Statistik/emner/erhvervsliv/landbrug-gartneri-og-skovbrug/bedrifter-og-arbejdskraft-i-landbrug-og-gartneri
- https://www.dst.dk/da/Statistik/emner/erhvervsliv/landbrug-gartneri-og-skovbrug/landbrug-med-dyr
- https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20230403-2
- https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Agricultural_production_-_livestock_and_meat
- https://www.fwi.co.uk/business/payments-schemes/environmental-schemes/defra-sets-outs-two-window-sfi-return-in-2026
- https://defrafarming.blog.gov.uk/2026/06/30/sfi26-window-1-now-open/
- https://medlem.nortura.no/aktuelt/99-8-oppslutning-om-kvalitetssystem-i-landbruket-ksl-article43230-11810.html
- https://medlem.nortura.no/organisasjon/ksl/
- https://support.fieldmargin.com/en/articles/2964675-plans-and-pricing
- https://leadiq.com/c/fieldmargin/5a1dac632300005400a1a2ee
- https://apps.apple.com/no/app/farmable-farm-management-app/id1456760199
- https://www.capterra.com/p/266008/Farmable/
- https://farmable.tech/about
- https://www.skifteplan.no/
- https://www.nlr.no/kunnskap/fagartikler/grovfor/default/skifteplan-mobil-din-digitale-notisbok
- https://agrilogg.no/
- https://segesinnovation.dk/produkter-og-ydelser/digitale-loesninger/priser/
- https://datalogisk.dk/priser/
- https://datalogisk.dk/naesgaard-markkort/markkort/
- https://datalogisk.dk/naesgaard-tid/naesgaard-tid-2/
- https://www.capterra.com/p/136084/Agrivi/
- https://ag.xarvio.com/germany/field-manager/preise
- https://climate.com/en-us/pricing.html
- https://www.365farmnet.com/en/
- https://www.eurofins-agro.com/de-de/farmfacts
- https://www.landbrukspartner.com/en
- https://agron.no/plantevernjournal-info
- https://www.capterra.com/farm-management-software/
- https://www.ers.usda.gov/data-products/charts-of-note/108821
- https://www.nal.usda.gov/farms-and-agricultural-production-systems/community-supported-agriculture
- https://kommunikasjon.ntb.no/pressemelding/18739053/lokalmat-i-kraftig-vekst-ny-rekord-med-1355-milliarder-kroner?publisherId=9442021&lang=no
- https://www.rekonorge.no/
- https://www.smabrukarlaget.no/politikk/mat-og-produksjon/reko-ringen/
- https://www.localline.co/suppliers/pricing
- https://www.barn2door.com/seller-faqs
- https://farmzz.com/en/blog/barn2door-pricing-review
- https://www.glassdoor.com/Reviews/Barn2Door-Reviews-E3002876.htm
- https://www.grazecart.com/pricing
- https://mygardenspot.com/articles/best-csa-management-software-farms
- https://csaware.com/
- https://www.farmigo.com/
- https://about.openfoodnetwork.org.uk/pricing/
- https://www.shopify.com/pricing
- https://findhomegrown.com/blog/local-line-alternative-for-small-vendors
- https://www.gov.uk/guidance/record-keeping-requirements-for-veterinary-medicines
- https://eur-lex.europa.eu/eli/reg/2019/6/oj
- https://www.animalia.no/no/Dyr/dyrehelseportalen/
- https://www.animalia.no/no/Dyr/husdyrkontrollene/sauekontrollen/
- https://herdwatch.com/en-uk/price/
- https://www.breedr.co/pricing
- https://www.agriwebb.com/pricing/
- https://www.cattlemax.com/pricing
- https://www.getjobber.com/pricing/
- https://www.tradifyhq.com/pricing
- https://www.agworld.com/pricing/
- https://www.naac.co.uk/
- https://www.dmoge.dk/
- https://www.landbrukstenester.no/
- https://www.vips-landbruk.no/
- https://www.plantevernguiden.no/
- https://api.met.no/doc/TermsOfService
- https://www.dmi.dk/frie-data
- https://agrio.app/
- https://www.spraywisedecisions.com.au/
- https://www.landbruksdirektoratet.no/nb/skogbruk/skogfond
- https://www.ssb.no/jord-skog-jakt-og-fiskeri/skogbruk/statistikk/skogeiendommer
- https://www.danskskovforening.dk/skovbrug/fakta-om-danmarks-skove/
- https://environment.ec.europa.eu/topics/forests/deforestation/regulation-deforestation-free-products_en
- https://allma.no/
- https://allskog.no/allma
- https://www.skovdyrkerne.dk/
- https://www.metsakeskus.fi/fi/node/736
- https://www.trimble.com/en/industries/forestry
- https://agriculture.ec.europa.eu/common-agricultural-policy/cap-overview/cap-2023-27_en
- https://www.innovasjonnorge.no/landbruk
- https://lbst.dk/tilskud
- https://www.tilskuddsportalen.no/
- https://www.instrumentl.com/pricing
- https://www.grantable.co/pricing
- https://www.grantify.io/
- https://www.grantmatch.com/
- https://fundingbox.com/
- https://www.capterra.com/grant-management-software/
