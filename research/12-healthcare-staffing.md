# 12 — Healthcare staffing, US (ideas 61–65)

Five ideas where the buyer is a healthcare staffing agency, the facility that hires one, or the clinician caught between them. None of these tools touch patient records: they hold a clinician's employment, licensing, pay and credential data, not a patient's protected health information. **None of the five requires the vendor to sign a HIPAA business-associate agreement**, and each idea says so again below. The staffing agencies themselves are usually business associates of the facilities they place clinicians into, because their clinicians touch PHI on-site — but that relationship is between the agency and the facility, not between the agency and a compliance-software vendor whose database never stores a patient record. A founder should still expect security questionnaires that borrow HIPAA language from health-system buyers regardless of what data is actually in scope.

Of the five candidates named in the research brief, idea 65 (multi-state licence, compact and continuing-education renewal tracking) overlapped too closely with idea 61's Nursys e-Notify and licence-monitoring scope to stand alone, so its content — compact status, CE-requirement tracking, CE Broker and Certemy as named competitors — is folded into 61, and the fifth slot goes to a reserve candidate instead: a credential-packet manager for locum tenens physicians. That reaches a different clinician type (physicians, not nurses) and a different buyer (an individual locum or a small locum agency, not a nurse-staffing back office) than anything else in the cluster, which is why it earns the slot over the other three reserve candidates.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 61. Credentialing and multi-state licence tracker for small healthcare staffing agencies

**One-liner.** Upload a clinician's file once; the tool extracts licences, certifications and immunization records, runs the monthly OIG and SAM exclusion checks nobody has time to do by hand, watches every state licence and interstate-compact status through Nursys e-Notify, tracks continuing-education due dates by state, and produces the quarterly performance-measure report a staffing firm needs to keep its Joint Commission certification.

### Problem statement
The Joint Commission's Health Care Staffing Services (HCSS) certification requires a firm to have placed at least 10 clinical staff and to present four months of data on four standardized performance measures by its on-site review, then to keep filing that data quarterly within 45 days of each calendar quarter's end to maintain certification; reviewers pull a minimum of 20 personnel files per review. Separately, federal guidance says employers should screen every employee, contractor and vendor against the OIG's List of Excluded Individuals/Entities monthly, because the list updates monthly and continuing to place an excluded clinician exposes the agency to civil monetary penalties and False Claims Act risk on every claim the facility later bills for that clinician's work. Nursys e-Notify gives employers free real-time alerts on licence status and discipline for nurses they employ or receive from a staffing vendor, but it only covers RNs and LPN/VNs, is opt-in per employer, and is one of several separate systems a compliance coordinator must watch alongside individual state boards for every other licence type. Compact membership keeps widening that surface: the Interstate Medical Licensure Compact reached 44 states plus DC and Guam by mid-2026, and nursing, physical-therapy, psychology and other compacts add jurisdictions most years, each with its own renewal and continuing-education cadence.

### Who experiences the problem
The 91 largest US healthcare staffing firms generated $33 billion of the roughly $47.3 billion 2026 healthcare-staffing segment, an 86% share, which leaves a long tail below them; IBISWorld counts roughly 2,927 healthcare staff-recruitment businesses in the US. The buyer is the compliance or credentialing coordinator at a small-to-mid agency, often one or two people managing hundreds of clinician files; the user is that coordinator plus the recruiters who need to know a candidate is placeable today.

### Value of solving it
Avoiding one placed-then-excluded clinician (potential False Claims Act exposure on every claim the facility billed for that clinician's work), keeping the HCSS certification that hospital systems increasingly require of their staffing vendors, and cutting the hours a coordinator spends cross-referencing spreadsheets against LEIE, SAM and state board sites by hand every month.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Kamana | Free clinician "digital wallet"; agency side by quote | No published agency pricing; primarily a clinician-facing wallet |
| Medallion, Verifiable | Provider-network credentialing platforms and APIs | Quote-only | Built for payers and large provider networks, not staffing-agency workflows |
| MedTrainer | Compliance, credentialing and training suite | Quote; roughly $70–120 per provider/mo (third-party estimate) | Facility-first, not staffing-agency-specific |
| Modio Health (OneView) | Cloud credentialing for healthcare organizations | Quote; roughly $75–125 per provider/mo (third-party estimate) | Facility and provider-network focus |
| Credentially | Onboarding and compliance monitoring, UK and US | Quote-only | UK-rooted, enterprise sales motion |
| Ceipal | ATS/VMS with credentialing and compliance modules | From roughly $24/user/mo (IT-staffing tier; healthcare tier unpublished) | A full ATS replacement, not a lightweight compliance layer |
| Bullhorn | ATS/CRM with no dedicated healthcare compliance layer | Quote; third-party estimates $99–315/user/mo | General staffing CRM, not healthcare-specific |
| CE Broker (Propelus) | State CE compliance tracking, 2M+ nurses on the platform | Free basic tier; paid Pro+ (price unpublished) | CE only, not a full credential file or exclusion screening |

### Pricing model
$99/mo for up to 50 clinician files, $249/mo up to 250, $499/mo unlimited with multi-state licence and compact monitoring bundled in; blended ARPU around $149.

### Path to profitability
At $149 ARPU you need 34 agencies for $5k MRR and 67 for $10k. Costs: Nursys e-Notify is free to institutions, LEIE and SAM data are public downloads, and document extraction runs cents per file. Distribution: NALTO and ASA's healthcare-staffing members, Staffing World and similar industry conferences, LinkedIn groups for travel-nurse and allied recruiters, and direct outreach to the long tail below the 91 largest firms.

### Where AI is used
- **In the product:** extracting licence, certification and immunization data from uploaded documents into structured fields with a confirm step; fuzzy-matching the clinician roster against the monthly LEIE and SAM exclusion files and flagging near-matches for human review; drafting the HCSS quarterly performance-measure submission; watching Nursys and compact renewal dates and alerting before lapse.
- **To build it:** document OCR plus an LLM extraction step, a scheduled job against the public LEIE and SAM files, and a Nursys e-Notify institutional integration are all standard; the hard piece is a maintained 50-state continuing-education requirement matrix, since no single feed covers every licence type the way Nursys covers nursing.

### MVP
- **Doing:** clinician file vault with OCR extraction of licences, certifications, BLS/ACLS and immunizations; monthly automated LEIE and SAM matching; Nursys e-Notify integration for RN/LPN status; a licence and compact expiration calendar; an HCSS quarterly measure report generator; a seed 50-state CE matrix for the largest licence types.
- **Not doing:** primary-source verification as a service, competency testing, non-nursing board integrations beyond a manual seed matrix at launch, replacing a full ATS.
- **Effort:** 8 weeks.
- **Dependencies:** Nursys e-Notify institutional enrollment, the public OIG LEIE monthly file and a SAM.gov exclusion-data feed, a maintained CE-requirement matrix, e-sign and PDF generation.
- **Hardest part:** keeping the state-by-state CE and compact-renewal matrix current as more compacts and states change rules, without a single authoritative feed to lean on the way Nursys exists for nursing licences alone.

### Score and verdict
Pain 4 · Solo 4 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **21/30**. A Joint Commission certification a hospital contract can depend on, a monthly exclusion-screening duty with real False Claims Act teeth, and a long tail of thousands of agencies below the 91 giants that funded credentialing platforms mostly ignore. The strongest idea in this cluster.

---

## 62. Pay-package builder, stipend compliance and facility invoicing for small travel and per-diem nurse agencies

**One-liner.** Turn a facility's bill rate and shift pattern into a GSA-benchmarked, IRS-accountable-plan-compliant pay package — taxable hourly plus tax-free housing and meal stipends — and generate the client invoice against the signed timesheet once the assignment runs, for the agency too small to have a dedicated back-office system.

### Problem statement
Stipends are tax-free only under an IRS accountable plan and only up to the GSA's published per-diem benchmark for the assignment's location; the FY2026 standard CONUS rate is $178/day ($110 lodging, $68 meals and incidentals), with roughly 298 higher-cost localities set above that, effective October 1, 2025 through September 30, 2026. Any package built above the local GSA rate turns the excess into taxable wages, and the clinician's "tax home" test in IRS Publication 463 requires a genuinely temporary assignment — generally 12 months or less in one location — or the whole stipend becomes taxable. The IRS also raised the Form 1099-NEC reporting threshold from $600 to $2,000 for payments made after December 31, 2025, under the One Big Beautiful Bill Act, which changes an agency's contractor-reporting workload for any 1099 clinicians on its roster. None of this is exotic to a large agency's back office, but a five-to-fifty-person agency runs it in spreadsheets today.

### Who experiences the problem
Agencies under roughly 100 clinicians on assignment at a time — the same long tail described in idea 61, below the 91 firms that hold 86% of the $47.3 billion 2026 healthcare-staffing market. The buyer is the agency owner or back-office lead; the user is payroll and billing staff and the recruiter who quotes a package to a candidate.

### Value of solving it
Avoiding an IRS reclassification of stipends as wages across an entire roster (back taxes and penalties, not just for one clinician), faster and more accurate quotes that win candidates in a market where clinicians compare packages across marketplaces like Vivian Health, and invoices that match the facility's rate sheet the first time instead of after a client dispute.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Bullhorn Time & Expense | Time and billing add-on | Quote; third-party estimates $99–315/user/mo | General staffing time/billing, no stipend-compliance logic |
| Ceipal, LaborEdge, Avionté, TempWorks | Full ATS/VMS/back-office suites | Ceipal from roughly $24/user/mo (IT-staffing tier); others quote-only | Buys a whole platform to get one workflow; healthcare-specific pricing unpublished |
| Nomad Health | Marketplace; pivoted toward a technology platform for agencies from May 2026 | Quote-only | Marketplace-first, not a pay-package calculator for a third party's own roster |
| TravelTax | Accountant serving travel clinicians directly | Quote, per-return | Fixes packages after the fact rather than at build time; not agency software |
| Spreadsheets | Free | The real incumbent |

### Pricing model
$149/mo for agencies running up to 25 active travelers, $299/mo up to 100, with a per-traveler add-on above that; blended ARPU around $199.

### Path to profitability
At $199 ARPU you need 26 agencies for $5k MRR and 51 for $10k. Costs: the GSA per-diem table is a public data feed with no licence fee; document generation and payroll-style exports are standard. Distribution: NALTO, ASA's Healthcare Staffing Council, travel-nurse recruiter Facebook and LinkedIn groups, and staffing-payroll-factoring companies that already see these agencies' cash-flow pain and would refer.

### Where AI is used
- **In the product:** parsing a facility's rate sheet into structured line items; auto-populating the GSA per-diem lookup by assignment ZIP code and flagging any proposed package that exceeds the local benchmark; matching approved, signed timesheets to rate-sheet line items to generate the client invoice; explaining in plain language why a package is or isn't compliant. "AI guarantees IRS compliance" is the gimmick to avoid — the tool checks against published benchmarks, it doesn't opine on an individual clinician's tax home.
- **To build it:** the GSA per-diem table download, a rules engine for the taxable/non-taxable split, and export to a payroll processor or QuickBooks are all standard; there is no novel AI research problem here, mostly reliable extraction plus a rules engine.

### MVP
- **Doing:** a pay-package calculator (bill rate in, GSA lookup by location, taxable/stipend split, margin display), a tax-home eligibility questionnaire per traveler, timesheet capture, an invoice generator matched to the facility's rate sheet, and export to a payroll processor or QuickBooks.
- **Not doing:** running payroll or filing taxes directly (partner with an EOR or payroll processor), a full ATS/VMS, workers'-compensation administration.
- **Effort:** 7 weeks.
- **Dependencies:** the GSA per-diem data feed, a payroll-processor export or partner integration, e-sign for timesheets. No PHI is handled — pay and tax data describe the clinician as an employee, not a patient — so **no BAA is needed** for this product, even though the agency itself may sign BAAs with the facilities where its clinicians work.
- **Hardest part:** state-by-state overtime and wage-payment-timing rules for 8-, 12- and 13-week contracts, which change independently of the federal stipend rules and must be layered on top without drifting into legal advice.

### Score and verdict
Pain 4 · Solo 4 · AI 3 · Gap 3 · WTP 3 · Reach 3 = **20/30**. A concrete, dollar-denominated compliance risk — misclassified stipends across a whole roster — that today's ATS/VMS suites treat as a minor feature rather than the product. Strong, but the AI here is a rules engine more than an extraction problem, which caps it just under idea 61.

---

## 63. Payroll-Based Journal (PBJ) submission builder for skilled nursing facilities

**One-liner.** Turn agency invoices and facility payroll exports into the CMS Payroll-Based Journal quarterly file and a preview of the resulting Five-Star staffing score before you submit, for the independent skilled nursing facility without a chain's dedicated PBJ analyst.

### Problem statement
PBJ staffing-data submission is due 45 days after each fiscal quarter ends — the July–September 2026 quarter, the first fully on CMS's iQIES system after an April 1, 2026 file-specification update (v4.10.0), is due November 14, 2026 — and a missed or late submission triggers an automatic one-star staffing rating regardless of the facility's actual staffing levels. CMS is also adding four new measures to the Five-Star staffing calculation: weekend nurse hours per resident day, and nursing, RN and administrator turnover, all still computed from PBJ data. This is separate from, and unaffected by, the fate of the 2024 federal minimum-staffing mandate: a Texas court vacated its core 24/7-RN and hours-per-resident-day requirements in April 2025, the One Big Beautiful Bill Act imposed a 10-year moratorium on enforcing the rule through September 30, 2034 when it was signed on July 4, 2025, HHS withdrew its defense of the rule in September 2025, and CMS proposed formally repealing it in a December 3, 2025 Federal Register notice. The minimum-staffing *standard* is effectively dead for a decade; the quarterly PBJ *reporting* duty, which predates that rule and drives the public Five-Star rating every referral source and state surveyor sees, is untouched and remains fully mandatory.

### Who experiences the problem
Roughly 14,700–15,400 CMS-certified skilled nursing facilities (KFF counted 14,742 as of July 2025; Definitive Healthcare put the 2026 figure near 15,400). The buyer is the administrator or business-office manager at an independent facility or small chain without a dedicated PBJ analyst; the user is the same person, plus whoever reconciles agency-staffing invoices each quarter.

### Value of solving it
Avoiding an automatic one-star staffing rating (with real referral and, in some states, Medicaid rate-setting consequences), and cutting the staff hours spent manually reconciling agency invoices into PBJ job categories every quarter.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| SimplePBJ (SimpleLTC, a Netsmart solution) | Free Essentials benchmarking tier; Pro $119/mo per facility; bundled MDS+PBJ Analytics Suite $319/mo per facility | The closest transparent incumbent — sets the price ceiling to undercut |
| PointClickCare, SmartLinx, UKG | EHR and workforce-management suites with PBJ modules bundled | Quote-only | Bundled into a much larger platform purchase |
| Inovalon | Payroll-Based Journal reporting software | Quote-only | Enterprise-oriented |
| ProCern (PBJSNAP) | Cloud PBJ application built for SNFs | Quote-only | — |
| Prime Care Technologies | LTC data and analytics, including PBJ | Quote-only | — |

### Pricing model
$99/mo flat per facility, undercutting SimplePBJ's $119 Pro tier, with a multi-facility discount for small chains.

### Path to profitability
At $99 ARPU you need 51 facilities for $5k MRR and 101 for $10k, out of roughly 15,000 certified SNFs. Costs are negligible — this is a quarterly batch job. Distribution: state AHCA/NCAL and LeadingAge affiliates, SNF administrator LinkedIn and Facebook groups, referrals from independent long-term-care consultants, and the public CMS Care Compare facility list as a targeting source.

### Where AI is used
- **In the product:** extracting agency-invoice line items (name, hours, job classification) into PBJ-format records; reconciling them against facility payroll exports and flagging missing or duplicate hours; mapping non-standard agency job titles to CMS's staffing categories; drafting a pre-submission Five-Star staffing preview. "AI guarantees a five-star rating" is the gimmick to avoid — CMS's formula and case-mix adjustment are fixed and public, not something AI can influence.
- **To build it:** CSV/PDF ingestion, a job-title mapping table and a quarterly file generator are standard; there is no exotic build here beyond keeping the mapping table and file format current.

### MVP
- **Doing:** payroll and agency-invoice import, job-title-to-PBJ-category mapping, a quarterly file generator formatted for iQIES upload, a deadline calendar with reminders, a Five-Star staffing score preview, and pre-submission validation for missing data.
- **Not doing:** direct API submission to iQIES (CMS does not offer one to third parties), MDS clinical assessment data, scheduling or rostering.
- **Effort:** 6 weeks.
- **Dependencies:** the CMS PBJ Policy Manual and the iQIES file-layout specification, plus agency-invoice ingestion. A PBJ file contains staff hours by job category, not resident-identified data, so **no PHI is involved and no BAA is needed**.
- **Hardest part:** mapping non-standard agency invoice job titles and units to the exact PBJ job-classification codes CMS expects, and tracking system changes like the April 2026 QIES-to-iQIES cutover as they land.

### Score and verdict
Pain 3 · Solo 4 · AI 3 · Gap 2 · WTP 3 · Reach 3 = **18/30**. The quarterly deadline and one-star penalty are real and untouched by the staffing mandate's repeal, but SimplePBJ already sells almost exactly this at a similar price with a free benchmarking funnel — win on price and a friendlier invoice-reconciliation workflow, not on being first.

---

## 64. Facility-side agency vendor management lite for independent SNFs, rural hospitals and home care

**One-liner.** For a facility juggling five or six contract-staffing agencies off email and fax, broadcast a shift order to all of them at once, audit every agency invoice against the signed timesheet and the state's rate cap before paying it, and flag an agency whose state registration has lapsed — without the enterprise MSP contract AMN and Aya sell to large health systems.

### Problem statement
State laws increasingly require nurse-staffing agencies themselves to register and, in some states, cap their rates — creating a compliance duty for the facility that hires them too, since paying above a capped rate or through an unregistered agency carries its own exposure. Illinois's 2022 amendments to the Nurse Agency Licensing Act added quarterly reporting to the Department of Labor (average rates charged and paid, by county and provider type) and barred non-compete and buy-out fees. Minnesota caps agency rates at 150% of the weighted average wage plus a payroll-tax factor and requires state registration; Massachusetts sets maximum hourly prices for temporary nursing services by health-service area and shift under 101 CMR 345.00, with a 150% holiday cap and a 19.7% travel-nurse factor above the limit. Connecticut has required temporary nursing-services agencies to register and pay an annual fee since January 1, 2023, with the state evaluating and capping the rates they may charge nursing homes; Iowa has required "health care employment agencies" to register with its Department of Inspections and Appeals for a $500 annual fee since July 1, 2022; Indiana enacted its own Temporary Health Care Services Agency Law in 2023; Pennsylvania has a similar registration bill pending, not yet law. We found no comparable New Jersey statute in this pass; treat that state as **unverified** rather than assume one exists.

### Who experiences the problem
Roughly 1,350–1,390 critical-access hospitals (Rural Health Information Hub counted 1,388 as of July 2026; Ampliz put the figure at 1,356), most of the roughly 14,700–15,400 certified SNFs described in idea 63, and somewhere between about 9,960 and 12,090 Medicare-certified home health agencies depending on year and source. The buyer is the director of nursing, administrator or CFO at an independent facility or small chain; the user is whoever currently phones and faxes several agencies to fill a shift and reconciles their invoices by hand.

### Value of solving it
Avoiding an overbilled or rate-cap-violating agency invoice, avoiding use of an agency whose registration has lapsed, and cutting the hours spent broadcasting the same shift request to several agencies separately and reconciling their invoices in different formats.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Qualivis | Vendor-neutral MSP for healthcare staffing (Aya-affiliated) | Quote-only | Enterprise health-system MSP, not sized for one independent facility |
| Medefis, ShiftWise Flex (AMN Healthcare) | VMS platforms; AMN is consolidating around ShiftWise Flex | Quote-only | Same — large-system MSP/VMS, enterprise sales cycle |
| Prolucent | Combined VMS/MSP platform | Quote-only | Same |
| Vizient | Group purchasing organization with workforce solutions | Quote-only | GPO-scale, not a single-facility tool |
| Spreadsheets, email and fax | Free | The real incumbent |

### Pricing model
$299/mo per facility flat for shift broadcast, invoice audit and agency-registration tracking, with a discounted multi-facility tier for small chains.

### Path to profitability
At $299 ARPU you need 17 facilities for $5k MRR and 34 for $10k, against roughly 1,350 critical-access hospitals plus thousands of independent SNFs and home-care agencies. Distribution: state rural-health and hospital associations, the National Rural Health Association, state AHCA/NCAL and LeadingAge affiliates, and direct outreach from the public CMS facility lists.

### Where AI is used
- **In the product:** extracting rate and hours data from PDF or faxed agency invoices; matching invoices against signed timesheets and the facility's applicable state rate cap and flagging overbilling before payment; checking an agency's registration status against the handful of state registries that publish one and flagging lapses; drafting the multi-agency shift-order broadcast with fill-tracking. "AI negotiates your agency rates" is the gimmick to avoid — a facility still needs a human decision on which agency to use.
- **To build it:** invoice OCR, an email/SMS broadcast layer and a rules engine for rate-cap matching are all standard; the state-law matrix behind the rules engine is the maintained asset, not a novel AI problem.

### MVP
- **Doing:** an agency roster with a registration-status field, shift-order broadcast by email and SMS to selected agencies with response tracking, invoice upload with OCR matched against the timesheet and the facility's state rate-cap rule, an exception report before payment approval, and a basic multi-facility view for small chains.
- **Not doing:** a full MSP or negotiated-rate marketplace, credentialing the agency's own clinicians (link out to idea 61's product instead), payroll.
- **Effort:** 8 weeks.
- **Dependencies:** a maintained matrix of the states with registration or rate-cap laws (currently at least Illinois, Minnesota, Massachusetts, Connecticut, Iowa and Indiana, with Pennsylvania pending), and invoice OCR. No PHI is in scope — agency, invoice and rate data, not resident records — so **no BAA is needed**.
- **Hardest part:** the state rate-cap and registration matrix keeps growing as more states legislate, which is an ongoing legal-monitoring cost the founder must budget for rather than a one-time build.

### Score and verdict
Pain 3 · Solo 4 · AI 3 · Gap 3 · WTP 3 · Reach 2 = **18/30**. A genuine gap — the enterprise MSP vendors ignore facilities this size entirely — but the buyer is scattered across three different facility types with no single association covering all of them, which makes reach the binding constraint rather than the product.

---

## 65. Locum tenens contract and credential-packet manager for independent physicians

**One-liner.** Keep one physician credential packet current — state licences, DEA, board certifications, malpractice history, IMLC letters of qualification — and export it instantly in whatever format the next locum agency, hospital or telehealth platform asks for, so a physician working with two or three agencies at once never re-answers the same forty questions, and a small locum agency's credentialing coordinator isn't rebuilding files from scratch for every physician.

### Problem statement
A first-time CAQH profile takes a physician 3–5 business days to complete thoroughly, and full payer or hospital credentialing commonly takes 60–90 days depending on how ready the documentation is — figures reported industry-wide by credentialing-service blogs rather than a regulator, so treat them as directional, not authoritative. The Interstate Medical Licensure Compact, which cuts a follow-on state licence application to roughly 7–21 days once a physician holds a Letter of Qualification, reached 44 states plus DC and Guam by mid-2026, with the letter itself averaging 38 days (55% completed in under a month) and nearly 11,000 letters issued in the 12 months to March 31, 2026 — but a physician working several states still separately re-supplies the same documents to every new agency and hospital medical-staff office, because no shared packet format exists between them. The locum tenens workforce is large and growing: estimates cluster around 52,000–57,000 physicians working locum assignments annually, roughly 8% of the physician workforce and up over 100% since the mid-2010s, though exact counts vary by source and methodology. Staffing Industry Analysts sizes the US locum tenens market at roughly $9.1 billion in 2024 rising toward $9.9 billion in 2026, while other market-research estimates run as high as $13.5 billion depending on scope — flag that spread as inconsistent rather than a single authoritative number.

### Who experiences the problem
Independent physicians working through two or more locum agencies at once, and the credentialing coordinators at small locum tenens agencies. NALTO, the trade association for locum tenens agencies, counts roughly 90 member firms, most of them small relative to the two or three giants (CHG's CompHealth and Weatherby, Jackson's LocumTenens.com, AMN) that dominate headline volume. The buyer is typically the physician (self-pay) or the small agency's credentialing coordinator managing a roster; the user is the same physician re-supplying documents on every new engagement.

### Value of solving it
Cutting days to weeks off a 60–90 day credentialing cycle by auto-filling from one maintained profile instead of re-typing it per agency, and avoiding a delayed start date that leaves both the physician and the facility short. We found no verified, sourced figure for the dollar cost of a delayed locum start and do not invent one; the case here rests on time saved, not a specific dollar claim.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Modio Health (OneView) | Cloud credentialing, physician-designed | Quote; roughly $75–125 per provider/mo (third-party estimate) | Facility/provider-network pricing, not a physician self-serve packet |
| Medallion | Provider-network credentialing platform | Quote-only | Built for payers and networks buying at scale, not one physician |
| CredentialMyDoc | Marketed as affordable for small practices | Price not published | Small-practice framing, not a packet built to be portable across agencies |
| ProCredEx | Provider-data exchange between credentialing organizations | Quote-only | Infrastructure between institutions, not a physician-facing tool |
| CAQH ProView | The free national profile physicians already maintain | Free | A profile, not an exportable packet tailored to a specific agency's format |
| Spreadsheets and email folders | Free | The real incumbent |

### Pricing model
$39/mo per physician self-pay, with a $19/physician/mo volume tier for small agencies managing a roster; annual prepay discount.

### Path to profitability
At $39 ARPU you need 129 physicians or agency seats for $5k MRR and 257 for $10k, against a workforce of roughly 52,000–57,000 active locum physicians nationally — a small conversion fraction is enough. Distribution: referral partnerships with NALTO's roughly 90 member agencies, locum tenens subreddits and physician-only Facebook and Sermo groups, the physician-recruiter association AAPPR, and content built around IMLC renewal dates.

### Where AI is used
- **In the product:** extracting licence, DEA, board-certification and malpractice-history data from uploaded documents into one structured profile; auto-filling that profile into a generic universal packet, a CAQH-style export, and agency-specific formats; tracking every state licence and IMLC Letter of Qualification status with renewal alerts. "AI credentialing officer" claiming to replace primary-source verification is the gimmick to avoid — agencies and hospitals must still verify sources themselves; this tool only keeps the underlying data current and portable.
- **To build it:** OCR and LLM extraction plus a template-mapping layer for different export formats are standard; the one hard piece is that, unlike Nursys for nursing, no unified machine-readable feed covers all 50 state medical boards, so status tracking starts as manual date entry with automated lookups added state by state.

### MVP
- **Doing:** a physician credential vault with OCR extraction, an IMLC and state-licence status tracker with renewal alerts, exports in three or four common formats (a generic universal packet, a CAQH-style export, an agency-specific template), and a malpractice/claims-history log with DEA and board-certification expiry tracking.
- **Not doing:** primary-source verification itself, payer enrollment (a materially slower, separate process), and matching physicians to open locum jobs.
- **Effort:** 6 weeks.
- **Dependencies:** IMLC public status lookups where available, and state medical board licence lookups (mostly manual/web, no unified API). No PHI is stored — this is the physician's own career and credential data, not a patient's — so **no BAA is needed**, even though the physician's eventual work involves PHI at the client site.
- **Hardest part:** the absence of any Nursys-equivalent for physicians means licence-status tracking depends on scraping fragmented, inconsistent state medical board websites rather than one clean feed.

### Score and verdict
Pain 3 · Solo 4 · AI 4 · Gap 3 · WTP 2 · Reach 2 = **18/30**. A real, LLM-shaped extraction-and-reformatting problem in a growing workforce, held back by a self-pay physician's modest willingness to pay and a smaller, harder-to-reach buyer population than nursing's much larger numbers.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 61 | Credentialing and multi-state licence tracker for staffing agencies | **21** | 149 | 67 | 8 |
| 62 | Pay-package builder and facility invoicing for travel/per-diem agencies | **20** | 199 | 51 | 7 |
| 63 | PBJ submission builder for skilled nursing facilities | **18** | 99 | 101 | 6 |
| 64 | Facility-side agency vendor management lite | **18** | 299 | 34 | 8 |
| 65 | Locum tenens credential-packet manager for physicians | **18** | 39 | 257 | 6 |

## Sources
- https://www.jointcommission.org/en-us/certification/health-care-staffing-services
- https://www.jointcommission.org/en-us/knowledge-library/support-center/measurement/health-care-staffing-services-measures-faqs
- https://streamlineverify.com/compliance/leie-faqs/
- https://www.accountablehq.com/post/oig-and-gsa-exclusion-lists-how-to-check-sam-gov-and-the-leie-for-excluded-parties
- https://www.ncsbn.org/nursing-regulation/licensure/license-verification.page
- https://www.nursys.com/EN/ENDefault.aspx
- https://www.imlcc.com/
- https://weatherbyhealthcare.com/blog/interstate-medical-licensure-compact
- https://comphealth.com/resources/interstate-medical-licensure-compact
- https://www.staffingindustry.com/research/research-reports/americas/largest-healthcare-staffing-firms-in-the-united-states-2026-update
- https://www.staffingindustry.com/news/global-daily-news/largest-us-healthcare-staffing-firms-generate-33b-in-revenue
- https://img2.ibisworld.com/united-states/industry/healthcare-staff-recruitment-agencies/4956
- https://digitalhealth.folio3.com/blog/best-credentialing-software/
- https://www.credentially.io/en-us
- https://www.noon.ai/blog/articles/144-staffing-agency-software
- https://www.pin.com/blog/staffing-agency-software/
- https://cebroker.com/plans
- https://propelus.com/resources/article/ce-broker-nurses-education-nationwide
- https://www.kamana.com/index.html
- https://www.modiohealth.com/hco
- https://verifiable.com/credentialing-software
- https://www.gsa.gov/policy-regulations/regulations/federal-travel-regulation/ftr-and-related-files/gsa-per-diem-bulletin-ftr-2601
- https://www.federalregister.gov/documents/2025/08/19/2025-15771/maximum-per-diem-reimbursement-rates-for-the-continental-united-states-conus
- https://perdiemworld.com/gsa/fy2026/
- https://www.irs.gov/pub/irs-pdf/p463.pdf
- https://onpay.com/insights/1099-reporting-threshold-updates/
- https://www.avalara.com/blog/en/north-america/2025/07/one-big-beautiful-bill-act-1099-reporting-threshold.html
- https://www.cms.gov/medicare/quality/nursing-home-improvement/staffing-data-submission
- https://www.leadingageny.org/providers/nursing-homes/reimbursement1/medicare/next-quarterly-payroll-based-journal-data-submission-due-by-may-15th/
- https://empeon.com/blog/scheduling_decisions_tanking_cms_five-star_rating/
- https://www.bonadio.com/article/cms-updates-the-five-star-staffing-calculation-and-adds-new-measures/
- https://www.faegredrinker.com/en/insights/publications/2025/4/federal-court-strikes-down-cms-nursing-home-staffing-mandate
- https://www.aarp.org/advocacy/one-big-beautiful-bill-nursing-homes/
- https://skillednursingnews.com/2025/09/hhs-withdraws-nursing-home-staffing-mandate-legal-appeals/
- https://www.federalregister.gov/documents/2025/12/03/2025-21792/medicare-and-medicaid-programs-repeal-of-minimum-staffing-standards-for-long-term-care-facilities
- https://www.definitivehc.com/resources/healthcare-insights/skilled-nursing-facilities-us
- https://www.kff.org/medicaid/a-look-at-nursing-facility-characteristics/
- https://simple.health/solutions/skilled-nursing/simplepbj/simplepbj-pro/
- https://www.ruralhealthinfo.org/topics/critical-access-hospitals
- https://www.ampliz.com/resources/list-of-critical-access-hospitals-in-the-us/
- https://www.statista.com/statistics/1550572/number-of-home-health-agencies-in-the-us/
- https://carelistings.com/find/home-health-agencies
- https://ogletree.com/insights-resources/blog-posts/illinois-amends-nurse-agency-licensing-act-to-prohibit-noncompetes-and-add-new-reporting-requirements/
- https://sourceonhealthcare.org/provider-rate-regulation/cap-on-all-prices-rates/
- https://www.ascen.com/blog/health-care-staffing-agencies-which-states-require-a-license
- https://www.multibriefs.com/briefs/nalto/StateHealthCareStaffingLawGuide.pdf
- https://thecredentialing.com/blogs/physician-credentialing-time-usa
- https://medicotechllc.com/caqh-physician-credentialing/
- https://www.abstaffing.com/locum-tenens-staffing-statistics-2026/
- https://www.definitivehc.com/resources/healthcare-insights/number-of-locum-tenens-by-state
- https://www.staffingindustry.com/research/research-reports/americas/us-locum-tenens-market-growth-assessment-2025
- https://www.researchnester.com/reports/locum-tenens-staffing-market/7366
- https://www.nalto.org/about-us/
- https://travelhealthcarepay.com/2026/04/29/nomad-health-review-2026-what-travel-nurses-need-to-know-after-the-may-1-pivot/
