# 01 — Agriculture, rural & land (ideas 1–7)

Seven ideas rooted in the founder's stated interest (this repository is named after farming). US agriculture has 1.9 million farms, but 74% have under $50,000 of sales, so the paying customers are the specialty-crop growers who face audits (69,452 vegetable farms, 97,343 fruit, nut and berry farms, 17,048 certified organic operations), the livestock operations that sell into packers, and the contractors and packers that are businesses first. Two things distinguish the US picture from a generic one: the compliance calendar is real and layered (federal restricted-use pesticide records, EPA worker-protection records, FSMA produce-safety water assessments through 2027, the 2026 dicamba label that requires weather screenshots, FSMA 204 traceability from July 2028), and the well-funded farm-finance startups (FarmRaise, Ambrook) have shown that grant-finding does not monetise on its own but compliance records inside a paid tool do.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 1. Farm compliance record-keeper

**One-liner.** A mobile-first farm journal where the crew lead speaks or photographs what they did ("sprayed block 7 with Bravo, 2 pints an acre, done at ten"); the app attaches the weather at that time and place, checks the label, and produces the records that federal, state, FSMA and organic rules require, plus the audit pack for a GAP, PrimusGFS or organic inspection.

### Problem statement
The record-keeping burden on US farms is federal, state and buyer-driven at once. Certified applicators must record every restricted-use application within 14 days and keep it two years (7 CFR 110), with FIFRA penalties up to $24,885 per violation for commercial applicators; the EPA Worker Protection Standard requires two-year training records and posted application information. States layer stricter rules: Washington requires same-day records with wind and temperature kept seven years, New York three years plus an annual electronic report, California monthly reporting of nearly all agricultural use. FSMA's Produce Safety Rule adds written pre-harvest water assessments with compliance dates of April 2025, 2026 and 2027 by farm size, training records and two-year retention (FDA estimates a $366 million annual domestic cost); organic operations must keep five years of records that "fully disclose all activities". The 2026–27 dicamba label requires weather screenshots in the application record. The tools are either generalists without state formats (Farmbrite $29–109), food-safety compliance suites without agronomy or AI (HeavyConnect $99–299), enterprise packages ($3,300 a year at Croptracker) or free OEM platforms that do not produce audit packs.

### Who experiences the problem
Specialty-crop and organic farms facing audits and the certified applicators who serve them. The buyer is the owner or food-safety manager; users are crew leads, the pest-control adviser and the auditor.

### Value of solving it
Avoided penalties, a passed audit that keeps a buyer, and the paperwork behind FDA's $366 million annual cost estimate. No incumbent publishes hours saved.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| HeavyConnect | Food-safety and worker-protection compliance for produce | $99/mo (100 acres) to $299/mo (500 acres) | Acre caps, no agronomy, no AI |
| Farmbrite | Generalist farm management | $29–$109/mo | No state formats, no AI |
| Croptracker | Spray, harvest, packing, GAP modules | From $3,300/yr | Too costly under $250k sales |
| Bushel Farm (ex-FarmLogs) | Row-crop records | $75–$599/yr | Not compliance-oriented |
| Climate FieldView | Bayer's data platform | Free; Plus $649/yr | No audit packs |
| Tend | Crop planning with compliance reporting and AI credits | Free; $30–$75/mo | Market-garden scale |
| Agworld, FarmQA | Agronomist-first records | About $1,495/yr; $100–$800 per user/yr | Priced for advisers |
| John Deere Operations Center, farmOS | OEM and open source | Free | No compliance workflow |

### Pricing model
Per farm, flat, banded by acres: $49/mo under 100 acres, $99/mo to 500, $199/mo above; annual billing before the season; an adviser tier for pest-control advisers and food-safety consultants who manage many farms.

### Path to profitability
At $79 ARPU you need 63 farms for $5k MRR and 127 for $10k, from more than 160,000 specialty-crop farms with internet access. Churn is low once audit history lives in the app. Costs are small (speech-to-text and extraction are cents per record; NWS weather is free). Distribution: food-safety auditors and consultants, produce associations (Western Growers, state fruit and vegetable associations), extension services, and the dicamba and FSMA water-assessment deadlines as content hooks. One state first (Washington's same-day rule and seven-year retention make it the most painful and best-defined).

### Where AI is used
- **In the product:** voice or photo to a structured record that satisfies federal and state formats, automatic weather attachment from the free NWS API at the time and place of application, label OCR into re-entry and pre-harvest intervals and restricted-use flags, missing-element checks (certification number, EPA registration number), worker-training record generation, and assembling GAP, PrimusGFS and organic inspection packs from the same data. Yield prediction and chat are gimmicks.
- **To build it:** the data model and PDF outputs are standard. The agent should be pointed at the federal and state rule texts and the EPA label repository to generate parsers and validation rules, which a certified crop adviser then checks against real records.

### MVP
- **Doing:** Washington and California first. Field import, product lookup against EPA labels, voice-to-record spray and fertiliser logging with a confirm screen and automatic NWS weather snapshot, offline capture, WPS training log, FSMA water-assessment template, state report exports (Washington record format, California use report), and a GAP or organic audit pack PDF.
- **Not doing:** machine telematics, agronomy advice, accounting, direct submission to state systems (CalAgPermits has no public API; the grower submits), other states until the first two work.
- **Effort:** 10 weeks.
- **Dependencies:** NWS API (free), EPA label PDFs, state record formats, a speech-to-text service that handles Spanish for crews, LLM extraction, QuickBooks export.
- **Hardest part:** fifty state formats and three retention regimes; keep to two states until the adviser channel works.

### Score and verdict
Pain 4 · Solo 3 · AI 5 · Gap 3 · WTP 3 · Reach 3 = **21/30**. The strongest agriculture idea: a layered, dated compliance burden on farms that already pay $99–299 a month for weaker tools, with a voice-and-weather record workflow that is a genuine AI product and that no incumbent has.

---

## 2. Small-farm direct sales and CSA manager

**One-liner.** Ordering, payment, subscriptions and pickup logistics for farm stands, box schemes and farmers'-market vendors, with SNAP/EBT online.

### Problem statement
116,617 US farms sold direct to consumers ($3.3 billion) in 2022, about 7,240 through CSAs, and 60,332 to retail and institutions. The tooling is mature and price-compressed: Local Line now starts at $79 a month and claims 100,000 farms and food businesses, Farmhand charges $80–200 plus a 3% fee, GrazeCart $89–199, Tend $30 with order handling, and Harvie shut down at the end of 2024 after charging $500 setup plus 7%. One vendor blog notes a $79 minimum "eats 4–10% of gross" for micro-vendors. Online SNAP acceptance requires USDA authorisation and an approved processor.

### Who experiences the problem
Farm stands, CSAs, market vendors and food hubs; 69,452 vegetable farms of which 79% have under $100k of sales. The buyer is the farm owner.

### Value of solving it
Commission avoidance and hours of order collation; Local Line claims 12 hours a week saved (unaudited).

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Local Line | From $79/mo plus processing | Costly for micro-vendors |
| Farmhand | $80–$200/mo plus 3% plus processing; routing, SMS, SNAP | Fees stack to about 7% |
| Barn2Door | $99–$299/mo plus $399–599 setup plus 1–3% | Opaque, sales-led |
| GrazeCart | $89–$199/mo; 600+ businesses | Meat-centric |
| CSAware, Farmigo | 2% with $100–150 floor | Dated |
| Tend | Free; $30/mo with orders and lot traceability | Planning-first |
| Shopify, Square | $29–$399/mo; free POS | No pickup cycles or CSA logic |

### Pricing model
Flat $29–$79 a month with payments at cost.

### Path to profitability
At $45 ARPU you need 111 farms for $5k MRR and 222 for $10k, against incumbents already at $79–80 and a $30 planning tool with orders. Seasonal churn is severe. Not attractive.

### Where AI is used
Parsing email, text and social-media comment orders, box composition from harvest forecasts, newsletter drafting, delivery routing (Farmhand already ships it). Useful, not decisive.

### MVP
- **Doing / not doing:** not recommended as a business; a community project at best.
- **Effort:** 6 weeks.
- **Dependencies:** Stripe or Square, Twilio with 10DLC and TCPA consent, USDA SNAP authorisation for EBT.
- **Hardest part:** willingness to pay and winter churn.

### Score and verdict
Pain 2 · Solo 4 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **15/30**. Validated, crowded, price-compressed. Skip.

---

## 3. Livestock treatment, withdrawal and movement records

**One-liner.** Chute-side voice logging of treatments that computes the "do not ship before" date from the drug label, keeps the Veterinary Feed Directive and extra-label records the FDA requires, reconciles electronic ear tags, and produces the movement and quality-assurance paperwork packers and auditors ask for.

### Problem statement
Producers must keep every Veterinary Feed Directive for two years, and extra-label drug use records with the withdrawal time for meat, milk or eggs for two years or longer where state law requires; a residue violation means packer refusal and a public FSIS listing. Since 5 November 2024 every official ear tag for cattle and bison moving interstate must be electronically readable, adding tag bookkeeping for every dairy and breeding animal, with movement documents kept five years. Feedlots pay well for this (Performance Beef at $195 a month has 4,500 customers and 96% retention, about $9.5 million in implied annual revenue), while small herds have cheap, non-AI tools (CattleMax $30, Farmbrite $29–79) and Herdwatch is entering with opaque pricing.

### Who experiences the problem
732,123 farms with cattle, 24,470 dairy farms (87% with over $100k sales, 70% with internet), 56,265 hog farms. The buyer is the producer; users are the producer, the vet, the feedlot crew and the packer's auditor.

### Value of solving it
Avoided residue violations and packer refusal, EID compliance for interstate movement, and less evening paperwork. Performance Beef's retention is the best proxy for value.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Performance Beef (Zoetis) | $195/mo or $2,106/yr; 4,500 customers | Feedlot-priced |
| CattleMax | $30–$41/mo to 250 head | Head cap, no withdrawal feature named |
| Herdwatch (US launch) | From $49–$79 promo; quote by farm size | Opaque, built for Irish registers |
| AgriWebb, Breedr | Per head; $2–$235/mo | No US prices shown; beef only |
| Farmbrite Livestock | $29–$79/mo | Generalist |
| Ranchr | Free app with subscription; 731 ratings | Small team |
| HerdDogg, Allflex SenseHub | Sensor tags bundled with software | Hardware-led |

### Pricing model
Per farm banded by head count: $29/mo to 100 head, $59/mo to 500, $129/mo above; annual billing; EID reader support included.

### Path to profitability
At $49 ARPU you need 102 farms for $5k MRR and 204 for $10k. The dairy and cow-calf operations that ship interstate are the beachhead (the EID rule created a fresh chore in late 2024). Distribution: state cattlemen's associations, Beef Quality Assurance trainers, vets, sale barns. Costs are minimal.

### Where AI is used
- **In the product:** voice logging with animal-ID confirmation while hands are busy, drug label and insert OCR into withdrawal days so the countdown is automatic, VFD PDF parsing, mortality and treatment anomaly alerts, and audit packs for quality-assurance programmes and movement certificates. Photo diagnosis is a gimmick and a liability.
- **To build it:** mobile-first CRUD with offline sync; Bluetooth EID reader support needs a real device to test.

### MVP
- **Doing:** cattle first. Animal list with EID reconciliation, voice treatment logging with confirmation, withdrawal countdown from a label-derived product table, VFD and extra-label record store, mortality and movement log with certificate export, quality-assurance audit PDF, offline mode.
- **Not doing:** feed management and closeouts (Performance Beef's territory), hogs and poultry (v2), sensor hardware.
- **Effort:** 8 weeks.
- **Dependencies:** FDA animal drug label data, FARAD withdrawal database, Bluetooth EID readers, QuickBooks export.
- **Hardest part:** the tag makers bundle software with hardware, and 622,000 beef farms average $67,000 in sales.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **18/30**. A real chute-side AI workflow and a fresh federal chore, in a market where the feedlot end is taken and the small end is cheap.

---

## 4. Custom applicator and custom harvester scheduling, field mapping and billing

**One-liner.** Field-service software for aerial and ground applicators and custom harvest crews: jobs on customer fields, operator and machine hours, automatic compliant application records with weather, per-acre billing from as-applied files, invoices out to QuickBooks.

### Problem statement
The record duties fall on the commercial applicator: same-day records with wind and temperature in Washington, three years plus an annual state report in New York, federal restricted-use records within 14 days, and the 2026 dicamba label's weather screenshots. The aerial sector alone has about 1,560 businesses treating 127 million acres a year (28% of cropland); the custom harvesters' association has 450+ crews and runs its own job board with no software vendor. Ag retailers run enterprise systems (Ever.Ag FieldAlytics); independent operators use Jobber, which does not know what an acre is, or agronomy tools priced per adviser seat.

### Who experiences the problem
1,560 aerial businesses, 450+ harvest crews, and an uncounted number of ground custom applicators. The buyer is the owner-operator; users are pilots and operators, the office, and the farmer customers.

### Value of solving it
Per-acre billing accuracy from as-applied data (unbilled acres are the classic leak), same-day compliant records, invoices out the same week. Not quantified.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Jobber, Tradify | Horizontal field service | $29–$199/mo; $47–$61 per user | No fields, acres or telematics |
| FarmQA | Adviser records | $100–$800 per user/yr | Agronomy-first |
| Ag Leader AgFiniti, Bushel Farm | Farmer tools with work orders | $420–$599/yr | Farmer-oriented |
| Agworld | Work orders for staff | Quote | Opaque |
| Ever.Ag FieldAlytics, CropTrak | Retail applicator enterprise systems | Quote | Not for independents |
| Harvest (getharvest) | Generic time and invoicing | $11–$14 per user | No fields |

### Pricing model
Per business with operator seats: $149/mo for 3 operators, $349/mo for 10; annual prepay before the season.

### Path to profitability
At $150 ARPU you need 34 businesses for $5k MRR and 67 for $10k, from a small, dense market of businesses that bill real money. Distribution: the National Agricultural Aviation Association (1,800+ members), the custom harvesters' association, state applicator associations. Churn is low; invoicing history is sticky. The market is small, so the ceiling is around $10–15k MRR.

### Where AI is used
- **In the product:** voice job logs from the cab or cockpit, automatic NWS weather at job time and location (which satisfies Washington and dicamba), parsing as-applied files (ISOXML, shapefiles) into invoice lines per field, label-constraint checks per job, delivery-note and fuel-receipt OCR.
- **To build it:** scheduling and invoicing are standard; the as-applied-to-invoice step is a geospatial join the agent can write with PostGIS.

### MVP
- **Doing:** customers and their fields (drawn or imported from Regrid parcels), jobs with operator and aircraft or machine, mobile hour and product logging with voice and automatic weather, compliant record export per state, per-acre price lists, invoices to QuickBooks Online, working-time export.
- **Not doing:** telematics integration (v2 after file import), payroll, inventory, agronomy.
- **Effort:** 8 weeks.
- **Dependencies:** NWS API, Regrid or county parcel data, QuickBooks Online API, as-applied file parsers, later OEM APIs.
- **Hardest part:** the market is small and seasonal; reaching $10k MRR probably needs both aerial and ground segments.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 4 · Reach 2 = **19/30**. The agriculture idea with business-grade willingness to pay and no specific tool for independents; a small market a solo founder does not need to be big.

---

## 5. Spray-window and label-constraint assistant

**One-liner.** "Can I spray this field with this product now?" answered from the label's constraints, the NWS forecast, sunrise and sunset times, buffer distances to water and registered sensitive sites, with the compliant record and weather snapshot written automatically if you go ahead.

### Problem statement
EPA's 2026–27 dicamba label is the most restrictive in the agency's history: wind 3–10 mph, no application in an inversion, none within 48 hours of forecast rain, none in the first hour after sunrise or last two before sunset, a 240-foot downwind buffer, no application above 95°F, and weather screenshots in the record. Washington requires wind and temperature in every record. The free tools are abandoned or minimal (Farm Spray Pro last updated in 2021; Spraybook small), FieldWatch's registry of sensitive sites is free but has no public API, and the OEM platforms have weather without a label engine.

### Who experiences the problem
Every commercial and private applicator; counts not found. The buyer is the farmer or applicator.

### Value of solving it
Avoided penalties, drift liability and re-spray costs. Not quantified.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Farm Spray Pro | Free, abandoned since 2021 | Dead |
| Spraybook | Free with in-app purchases | Tiny |
| FieldWatch FieldCheck | Free registry | No yes/no answer |
| Climate FieldView Plus | $649/yr | No label engine |
| Agworld | Label and SDS library | Quote |
| xarvio | Per acre | Input-maker |

### Pricing model
A module of idea 1 at $19 a month; nobody pays standalone.

### Path to profitability
At $20 ARPU standalone you need 250 users for $5k MRR; not realistic alone. As a module it lifts idea 1's retention.

### Where AI is used
Turning label PDFs into structured constraints (the hard data problem, well suited to an LLM with human review) and explaining a deterministic rules-plus-weather engine in plain language. "AI predicts the perfect window" is marketing.

### MVP
- **Doing:** label constraint extraction for the 100 most-used products, NWS forecast per field, sunrise and sunset, water-body buffers from USGS hydrography, a yes/no/wait answer with reasons, automatic record with weather snapshot.
- **Not doing:** inversion detection (no NWS product; needs sensors), sprayer integration, disease models.
- **Effort:** 4 weeks as a module on idea 1.
- **Dependencies:** EPA labels, NWS API, USGS NHD, field polygons.
- **Hardest part:** liability. Frame it as a checklist, not advice.

### Score and verdict
Pain 3 · Solo 2 · AI 3 · Gap 3 · WTP 2 · Reach 3 = **16/30**. Not a product; a strong module for idea 1, made timely by the dicamba label.

---

## 6. FSMA 204 food-traceability records for small produce growers, packers and food hubs

**One-liner.** Lot codes, key data elements and critical tracking events captured from labels, bills of lading and packing lines by photo and OCR, a traceability plan, and the sortable spreadsheet FDA can demand within 24 hours, for the growers and packers whose retail customers already require it.

### Problem statement
FDA's Food Traceability Rule requires lot codes and key data elements at seven tracking events (harvesting, cooling, packing, receiving, shipping, transformation), records kept two years and produced within 24 hours as a sortable spreadsheet, for foods on the Food Traceability List (leafy greens, herbs, tomatoes, peppers, cucumbers, melons, fresh-cut produce, shell eggs, soft cheeses, seafood, deli salads). The compliance date was extended to 20 July 2028, and Congress barred earlier enforcement; but retailers are pulling early (ReposiTrak says produce suppliers are "responding to customer requirements that are already here"). FDA's own estimate of the annual industry cost is $570 million. The tools are enterprise networks with hidden pricing (Trustwell, ReposiTrak, iFoodDS), a $3,300 a year specialist (Croptracker), or food-safety suites where traceability is a side feature; no SMB-priced, KDE-native tool with AI capture exists. Farms under $25,000 of produce sales are exempt; entities under $250,000 to $1 million skip the spreadsheet requirement but not the records.

### Who experiences the problem
60,332 farms selling to retail and institutions, most of the 64,075 fresh-market vegetable farms and the fruit growers on the list, plus packers and food hubs (counts not found). The buyer is the grower-shipper, packer or food-hub operations manager; users are harvest crews, the packing line and the office.

### Value of solving it
Keeping retail and foodservice accounts that now demand the data, a share of the $570 million annual cost, and narrower recalls.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Trustwell FoodLogiQ | Quote; 2,500+ brands; AI assistant | Enterprise |
| ReposiTrak, iFoodDS | Retailer-driven networks, quote | Supplier lock-in, opaque |
| Wholechain | Tiers by events per month, prices hidden | Opaque |
| Croptracker | From $3,300/yr | Price |
| HeavyConnect | $99–$299/mo with traceability listed | Food-safety first |
| Tend, Farmbrite | $29–$109/mo with lot traceability | Not KDE-native |
| FreshByte | Distributor ERP | Distributors only |

### Pricing model
Per site: $99/mo for growers, $249/mo for packers and hubs with label printing and buyer exports; annual before the season.

### Path to profitability
At $149 ARPU you need 34 customers for $5k MRR and 67 for $10k. Distribution: produce associations, the Produce Traceability Initiative community, retailers' supplier onboarding lists (a retailer can push a tool to hundreds of suppliers), food-safety consultants. The date has slipped twice, so the buyer is the supplier whose retailer demands it now, not the one waiting for FDA.

### Where AI is used
- **In the product:** photo and label OCR into lot codes and key data elements, bill-of-lading and invoice parsing into shipping and receiving events, traceability-plan drafting, gap checks against the seven events, instant sortable spreadsheet. Blockchain is the gimmick.
- **To build it:** the event model (GS1 EPCIS 2.0) is documented; label printing and buyer-portal exports are integration work.

### MVP
- **Doing:** product and lot setup with GS1 identifiers, harvest and packing event capture by photo and voice, bill-of-lading OCR for shipping and receiving, traceability plan generator, FDA sortable spreadsheet export, retailer export formats for two networks.
- **Not doing:** full ERP, packing-line hardware, retailer-network membership on the customer's behalf.
- **Effort:** 8 weeks.
- **Dependencies:** GS1 membership for identifiers, PTI label formats, Zebra printing, QuickBooks, retailer portal specifications.
- **Hardest part:** retailers pushing their own networks with free supplier tiers, and a 2028 date that gives everyone an excuse to wait.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **19/30**. A dated federal rule, a $570 million cost pool, retailers enforcing early, and no SMB-priced tool. The slipping date is the risk; sell to suppliers whose buyers already demand it.

---

## 7. Farm grant and cost-share finder with AI eligibility screening and drafting

**One-liner.** Enter the farm profile once; the tool screens NRCS, FSA, state and foundation programmes, tracks batching dates, pre-fills forms and drafts narratives, sold to technical service providers and programme administrators rather than to farmers.

### Problem statement
The money is large and fragmented: EQIP $1.74 billion, CSP $839 million, CRP $2.1 billion in fiscal 2025, about 42,800 EQIP contracts a year with a $450,000 cap and 75–90% cost share, plus SARE, value-added producer grants and state block grants; GrantWatch lists 65,386 grants. The two funded startups that started here have both moved on: FarmRaise ($7.2 million raised, 20,000 farmers) now sells accounting and payroll at $40 a month with the funding library as a bundled feature, and Ambrook ($29 million raised, 8,000 businesses) gives its funding library away and charges $29–49 for accounting. Pure grant-finding for farmers does not monetise; it works as a feature of a finance tool or as a service to the advisers and nonprofits who run programmes (FarmRaise's newest product administers a $25 million regenerative programme).

### Who experiences the problem
1.9 million farms, technical service providers and consultants, nonprofits and co-ops administering programmes. The realistic buyer is the adviser or programme administrator.

### Value of solving it
Cost share up to 90% and $450,000 caps; average government payment per farm was $21,599 in 2022. Adviser hours per application are the sellable unit.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| FarmRaise | $40/mo bundled with accounting | Pivoted away from grants |
| Ambrook | $29–$49/mo accounting; funding library free | Funding is a free lead magnet |
| Grantable | Free; $50–$150/mo AI drafting | No agricultural database |
| Instrumentl | $299–$999/mo | Nonprofits |
| GrantWatch | Listings; price not found | Listings only |
| farmers.gov, NRCS Conservation Desktop | Free | No cross-programme eligibility |

### Pricing model
Adviser seat at $99/mo with unlimited client profiles; programme-administrator tier at $499/mo.

### Path to profitability
At $40 blended ARPU you need 125 customers for $5k MRR and 250 for $10k, and the two best-funded companies in the space concluded farmers will not pay for this alone. Only the adviser and administrator tiers have a path, and that is a services-adjacent business.

### Where AI is used
Eligibility screening of a farm profile against programme rules and state ranking criteria, batching-date extraction from NRCS state pages, narrative drafting, form pre-fill, reimbursement tracking. Good fit; "approval probability" is a gimmick.

### MVP
- **Doing / not doing:** not recommended standalone; if pursued, an adviser workspace for EQIP and CSP applications with pre-fill and narrative drafting, tested with five technical service providers first.
- **Effort:** 8 weeks.
- **Dependencies:** NRCS state pages (scraping), Grants.gov API, farmers.gov (no API; applicant submits), SAM.gov.
- **Hardest part:** the market has already voted that this is a feature.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 1 · WTP 2 · Reach 2 = **15/30**. Two well-funded companies pivoted away from exactly this. Skip, or fold the drafting into idea 1's adviser tier.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 1 | Farm compliance record-keeper | **21** | 79 | 127 | 10 |
| 4 | Custom applicator and harvester scheduling and billing | **19** | 150 | 67 | 8 |
| 6 | FSMA 204 traceability records | **19** | 149 | 67 | 8 |
| 3 | Livestock treatment and movement records | **18** | 49 | 204 | 8 |
| 5 | Spray-window assistant | **16** | 20 | 500 | 4 (module) |
| 2 | Farm direct sales and CSA | **15** | 45 | 222 | 6 |
| 7 | Farm grant finder | **15** | 40 | 250 | 8 |

## Sources
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_FarmsFarmland.pdf
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_FarmEconomics_FINAL.pdf
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_Cattle%20and%20Cattle%20on%20Feed_final.pdf
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_Dairy.pdf
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_Hogs_Pigs.pdf
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_Vegetable.pdf
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_FruitNutBerry.pdf
- https://www.nass.usda.gov/Publications/Highlights/2024/Census22_HL_Organic.pdf
- https://www.ers.usda.gov/data-products/charts-of-note/108821
- https://www.law.cornell.edu/cfr/text/7/110.3
- https://www.law.cornell.edu/cfr/text/40/19.4
- https://www.law.cornell.edu/cfr/text/40/170.401
- https://www.epa.gov/pesticide-worker-safety/agricultural-worker-protection-standard-wps
- https://app.leg.wa.gov/wac/default.aspx?cite=16-228-1320
- https://www.law.cornell.edu/regulations/new-york/6-NYCRR-325.25
- https://dec.ny.gov/environmental-protection/pesticides/pesticide-reporting-law
- https://www.cdpr.ca.gov/pesticide-use-in-california/pesticide-use-reporting/
- https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-compliance-dates
- https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-pre-harvest-agricultural-water
- https://www.law.cornell.edu/cfr/text/21/112.164
- https://www.law.cornell.edu/cfr/text/7/205.103
- https://www.law.cornell.edu/cfr/text/21/558.6
- https://www.law.cornell.edu/cfr/text/21/530.5
- https://www.law.cornell.edu/cfr/text/9/86.4
- https://www.law.cornell.edu/cfr/text/9/86.5
- https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods
- https://www.govinfo.gov/content/pkg/FR-2025-08-07/html/2025-14967.htm
- https://www.law.cornell.edu/cfr/text/21/1.1305
- https://www.fda.gov/food/food-safety-modernization-act-fsma/food-traceability-list
- https://www.aces.edu/blog/topics/crop-production/updated-epa-requirements-for-2026-over-the-top-dicamba-applications/
- https://www.fieldwatch.com/
- https://www.weather.gov/documentation/services-web-api
- https://www.agaviation.org/about/about-ag-aviation/industry-facts-faqs/
- https://uschi.com/
- https://www.heavyconnect.com/pricing
- https://www.farmbrite.com/pricing
- https://www.croptracker.com/pricing.html
- https://www.bushelpowered.com/farmers/oldpricing
- https://climate.com/en-us/pricing.html
- https://www.agworld.com/us/pricing/
- https://farmqa.com/pricing
- https://www.tend.com/pricing
- https://www.agleader.com/farm-management/agfiniti/
- https://www.localline.co/
- https://www.farmhand.partners/pricing
- https://www.grazecart.com/
- https://www.barn2door.com/seller-faqs
- https://findhomegrown.com/blog/local-line-alternative-for-small-vendors
- https://www.cattlemax.com/pricing
- https://www.performancelivestockanalytics.com/performance-beef
- https://herdwatch.com/en-us/price/
- https://www.agriwebb.com/us/pricing/
- https://herddogg.com/
- https://www.trustwell.com/foodlogiq/
- https://www.repositrak.com/traceability/
- https://www.wholechain.com/pricing
- https://www.ers.usda.gov/topics/natural-resources-environment/conservation-programs
- https://sustainableagriculture.net/publications/grassrootsguide/conservation-environment/environmental-quality-incentives-program/
- https://www.grantwatch.com/
- https://www.farmraise.com/pricing
- https://ambrook.com/pricing
- https://fortune.com/2025/07/01/exclusive-ambrook-raises-26-1-million-series-a-to-provide-farmers-and-ranchers-with-better-accounting-software/
- https://www.grantable.co/pricing
- https://www.instrumentl.com/pricing
