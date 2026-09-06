# 04 — Compliance, finance, legal & HR admin (ideas 26–35)

Ten ideas where a law creates the buyer. The baseline population for most of them is the "medium" company of 50–249 employees, which in 2023 numbered 248,817 in the EU, 4,871 in Denmark, 6,611 in Sweden, 3,969 in Norway and 65,185 in Germany (Eurostat); the 10–49 band is roughly six times larger. Compliance buyers pay annually, churn slowly, and are reachable through public registers, accountants and lawyers. The caveat is timing: the whistleblower market was largely bought in 2023–24, and the CSRD forcing function was gutted by the 2025 Omnibus, so the best ideas here are the ones where the deadline is still ahead (28, 30) or where the pain recurs every month (32, 33).

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 26. Whistleblower reporting channel for 50–249 employee companies

**One-liner.** An anonymous, encrypted, multilingual reporting channel with case handling that enforces the 7-day acknowledgement and 3-month feedback deadlines, plus the written policy the law requires, priced monthly instead of annually.

### Problem statement
Directive 2019/1937 has required private companies with 50–249 workers to run an internal reporting channel since 17 December 2023, with acknowledgement within seven days and feedback within three months. Denmark fines the absence of a written whistleblower policy; Germany fines up to €20,000 for not operating a channel and €50,000 for retaliation; Sweden's work environment authority ran a dedicated inspection campaign of private employers' channels from December 2025 to March 2026. Norway is outside the directive but requires written whistleblowing routines from five employees, a population of 60,000+ firms with no software requirement. Denmark's national external scheme received 282 reports in 2025, up 51%.

### Who experiences the problem
About 249,000 EU companies with 50–249 employees (4,900 in Denmark, 6,600 in Sweden, 65,000 in Germany), plus 4,000 in Norway with 50+ and 60,000+ with five or more. The buyer is the CFO, HR lead or the external lawyer or accountant acting as the whistleblower unit; users are HR and the reporting employee.

### Value of solving it
Avoided fines and a documented, deadline-compliant process. Most SMEs receive zero to three reports a year, so the value is "compliance proof at the lowest cost", not hours saved.

### Main competitors
| Product | Published pricing (50–249 band) | Gap |
|---|---|---|
| Whistleblower Software (Formalize, Denmark) | From €99/mo Core, €149 Advanced; annual | "Could be more cost-effective for smaller companies" (reviews) |
| Whistlelink (Sweden) | €99/mo (50–149), €149 (150–249); annual; ISO 27001; AI case summaries | Annual only |
| Walor (Denmark) | €87/mo (50–249); annual | Annual only |
| Hintbox (Germany) | From €99/mo | German focus |
| WeMoral, EthicsPortal | €60–99/mo | Similar |
| FaceUp, Voxwel | $1–3 per employee/mo | Per employee |
| NAVEX, EQS | Quote; $1–25k setup | Enterprise |
| Varslingssystem.no (Norway) | NOK 120/yr | The price floor |

### Pricing model
Monthly billing at €69/mo for 50–249 employees (undercutting the annual-only incumbents), and a Norwegian "routines and inbox" tier at NOK 149/mo for the 5–49 employee firms nobody serves.

### Path to profitability
At €100 ARPU you need 50 companies for €5k MRR and 100 for €10k, out of 15,000 in scope in the Nordics alone. Churn is low but switching happens only at renewal, and most of the market already bought in 2023–24, so growth comes from the Swedish inspection wave, from replacing expensive tools at renewal, and from the Norwegian small-firm tier. Costs: EU hosting, encryption, translation (cents). Distribution: every in-scope company is listed in the business register by employee count; accountants and law firms resell.

### Where AI is used
Auto-translation of reports for multi-country SMEs, summarisation and categorisation, drafting the acknowledgement and feedback letters, redacting identifying details before forwarding, deadline nudges. "AI investigation" or credibility scoring is a legal and ethical risk.

### MVP
- **Doing:** anonymous two-way inbox with no IP logging, end-to-end encryption, case handling with deadline tracking, policy generator from the Danish data protection authority's template, multilingual intake, audit log, GDPR records.
- **Not doing:** voice hotline, external case-handling service, integrations with HR suites at launch.
- **Effort:** 5 weeks.
- **Dependencies:** EU hosting, encryption library, translation API, SSO.
- **Hardest part:** differentiation in a market of near-identical products; ISO 27001 is increasingly asked for.

### Score and verdict
Pain 4 · Solo 4 · AI 3 · Gap 2 · WTP 3 · Reach 4 = **20/30**. The cheapest possible compliance SaaS to build, in a market that already bought. Worth it only with the monthly-billing and Norwegian small-firm wedges, and as a first product to learn compliance selling.

---

## 27. Working-time registration compliance for SMEs

**One-liner.** Daily time registration that satisfies the Danish 2024 law and Norwegian working-time rules, with automatic checks of rest periods and overtime caps and exports to payroll.

### Problem statement
Since 1 July 2024 every Danish employer must run an "objective, reliable and accessible" system recording each employee's daily working time, keep the records about five years and give employees access; the root is the 2019 CJEU ruling in CCOO v Deutsche Bank. Norway requires a written overview of every employee's hours available to the labour inspectorate. Germany's federal labour court made recording mandatory in 2022 and a June 2026 draft law would make electronic recording the default. The Danish mandate produced a vendor land-grab: payroll providers give time registration away (Danløn's app is free with its payroll), Excel is legally acceptable, and the category is crowded from €2.50 to €18 per user per month.

### Who experiences the problem
Every employer: Denmark has about 26,000 firms with 10–49 employees and 352,000 micro firms; Norway similar. The buyer is the owner, bookkeeper or HR; the user is every employee daily. Accountants and trade associations are the channel (a Danish craft association resells Intempus at DKK 89 instead of 109).

### Value of solving it
Avoided compensation claims and fines and 48-hour-rule breaches; minutes per day per employee. Bounded by free alternatives.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Danløn (Denmark) | Time app free with payroll | Only with Danløn payroll |
| Zenegy, Intempus (Denmark) | DKK 62–139 per user/mo | Per user |
| Planday, Tamigo | £2.99 per user; €15–30 per location | Shift scheduling first |
| Toggl, Clockify, Timely | Free to $18 per user/mo | No Danish/Norwegian rule checks or payroll export |
| Personio, Factorial, Sesame | $3.75–$8 per employee; quote | HR suites |

### Pricing model
DKK 29 per employee per month, minimum DKK 149; flat for micro firms.

### Path to profitability
At €40 ARPU (a ten-person firm) you need 125 firms for €5k MRR and 250 for €10k, against free tools. Only the pending German law (a market of 2.7 million businesses) could change the economics, and its timing is uncertain.

### Where AI is used
Rule engine and anomaly flags (11-hour daily rest, 48-hour average, Norwegian overtime caps), pre-filling entries from calendar and login events with employee confirmation, natural-language edits. "AI timesheets" from app tracking is privacy-hostile in the Nordics.

### MVP
- **Doing / not doing:** not recommended standalone. The rule-check engine is a feature to sell to existing time-tracking vendors or to bundle into idea 34.
- **Effort:** 5 weeks.
- **Dependencies:** payroll exports (Danløn, DataLøn, Zenegy, Visma, Tripletex, Fiken), SSO.
- **Hardest part:** free incumbents.

### Score and verdict
Pain 4 · Solo 4 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **17/30**. Real mandate, saturated market. Watch Germany.

---

## 28. NIS2-ready supplier profile and cyber-hygiene tracker for small suppliers

**One-liner.** Not a full ISMS: a guided control checklist mapped to NIS2 Article 21's ten measures, policy templates in Danish, Norwegian and Swedish, evidence collection from Google Workspace and Microsoft 365, and a shareable "supplier security profile" that answers the questionnaires large customers now send.

### Problem statement
NIS2 applies to medium and large entities in 18 sectors and, through its supply-chain duties, cascades security questionnaires down to their suppliers of any size. Transposition is now real: Denmark's law took effect 1 July 2025, Germany's on 6 December 2025 (about 30,000 entities, registration within three months), Sweden's on 15 January 2026 with fines to 2% of turnover; the Commission referred Ireland, Spain, France and the Netherlands to the Court of Justice in July 2026 for not transposing. Norway's 2025 digital security law implements the older NIS1 and its NIS2 status could not be verified. Fines reach €7–10 million or 1.4–2% of turnover, with management liability. The SME tooling slot is occupied by Cyberday (Finland) at €2,500 a year for under 20 employees, with Vanta, Drata and Secfix moving down-market; but all of them sell a full ISMS, and a 15-person supplier that just received a questionnaire from a hospital or a utility does not want one.

### Who experiences the problem
Directly, tens of thousands of essential and important entities. Indirectly and far larger, their suppliers: any 5–50 person software, engineering or service firm that sells to a regulated customer. The buyer is the CEO or IT lead; the user is the IT lead plus policy owners.

### Value of solving it
Keeping large customers (a questionnaire is a gate on the next contract), avoiding a consultant-built ISMS (typically €10–40k, unverified), and management liability cover. A €2–5k a year tool against a €10k+ consultant is the pitch.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Cyberday (Finland) | Full ISMS for SMEs, 30+ frameworks, AI assistant | €2,500/yr (under 20 staff) to €9,900 (200–499) | Full ISMS; sized for entities, not suppliers |
| Hicomply (UK) | ISMS | £5,300–£10,600/yr | No NIS2 listed |
| Secfix (Germany) | ISO 27001, NIS2, DORA with "CISO AI" | Quote | Sales-led |
| Vanta, Drata, Sprinto, Thoropass | Compliance automation | Quote | US frameworks first, NIS2 absent from pricing pages |
| ISMS.online | ISMS | Quote | Enterprise |
| D-mærket (Denmark) | Free self-assessment, paid audit | Free | Denmark only, no evidence tooling |

### Pricing model
€99/mo for the supplier profile (checklist, policies, questionnaire answers), €249/mo with evidence connectors, annual prepay. Priced well under Cyberday for the supplier who is not an entity.

### Path to profitability
At €250 ARPU (blended, about €3k a year) you need 20 customers for €5k MRR and 40 for €10k. Compliance tools churn at 1–2% a month. Costs: evidence connectors have API costs near zero; policy drafting is cents. Distribution: content on "NIS2 for suppliers", partnerships with IT-service providers and accountants, and the entities themselves, who can push a tool to their supplier base. The risk is that Cyberday adds a cheap supplier tier.

### Where AI is used
- **In the product:** drafting policies from a company profile, mapping uploaded evidence to controls, answering supplier questionnaires from the control set, gap analysis against Article 21. Auditors will not accept unverified AI evidence, so the AI drafts and a human attests.
- **To build it:** control library, evidence connectors (Google Workspace, Microsoft 365 and Intune, GitHub, AWS/Azure), policy templates and a questionnaire portal are standard integration work.

### MVP
- **Doing:** Article 21 control checklist with maturity scoring, policy templates in three Nordic languages with AI tailoring, Google Workspace and Microsoft 365 evidence connectors (MFA, device encryption, backups), supplier security profile page, questionnaire answer bank.
- **Not doing:** ISO 27001 certification workflow, risk register beyond basics, incident reporting to authorities, DORA and CRA modules (v2).
- **Effort:** 8 weeks.
- **Dependencies:** Google and Microsoft admin APIs, NIS2 text and national guidance (Danish SAMSIK self-check, Norwegian NSM principles), LLM; the vendor itself should hold ISO 27001 or equivalent evidence.
- **Hardest part:** looking trustworthy enough to hold security evidence as a one-person company (same gate as idea 42).

### Score and verdict
Pain 4 · Solo 3 · AI 4 · Gap 2 · WTP 4 · Reach 3 = **20/30**. A live, expanding legal driver with high willingness to pay and an under-served supplier segment. Cyberday is the shadow; the supplier profile is the wedge.

---

## 29. VSME sustainability report and supplier ESG questionnaire responder for SMEs

**One-liner.** Pull spend from the accounting system, classify it into emission categories, extract kWh and litres from utility invoices, and produce a VSME Basic report that answers every customer's ESG questionnaire once.

### Problem statement
The 2025 Omnibus removed most of the forcing function: the stop-the-clock directive delayed wave 2 to financial year 2027 and the December 2025 political agreement limits CSRD to companies with over 1,000 employees. What remains is the value chain: Commission Recommendation 2025/1710 (July 2025) tells large companies and banks to cap supplier data requests at the VSME standard's content, with a delegated act on the cap adopted 3 July 2026. EcoVadis has rated 150,000+ suppliers, so supplier questionnaires are already an industry. The Nordic incumbents (Normative, Worldfavor, Position Green) are well funded, quote-only and have free tiers; Zevero (UK) publishes £1,500–7,500 a year; Coolset has a VSME module with AI autofill.

### Who experiences the problem
SMEs supplying large EU companies and banks: about 249,000 with 50–249 employees plus 1.57 million with 10–49. The buyer is the CFO or the sales lead who lost a tender over ESG.

### Value of solving it
Winning or keeping large-customer contracts and bank financing; a consultant's first carbon footprint costs €5–20k (unverified).

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Normative, Worldfavor, Position Green (Nordics) | Quote; free tiers | Funded, sales-led |
| Greenly, Sweep, Plan A | Quote | Mid-market |
| Coolset (Netherlands) | Quote; VSME module with AI autofill | Closest |
| Zevero (UK) | £1,500–£7,500/yr | UK |
| Climatiq | API from €2,000/yr | Factor data, not a product |
| EcoVadis | By company size | The questionnaire itself |

### Pricing model
€149/mo per legal entity, annual, with accounting integration.

### Path to profitability
At €150 ARPU you need 34 customers for €5k MRR and 67 for €10k. Distribution through accountants (who hold the ledger) is plausible. But the urgency has been legislated away and the incumbents have free tiers; sales cycles will be long.

### Where AI is used
Classifying ledger spend into emission categories, extracting quantities from invoices, answering questionnaires from one dataset, drafting narrative sections. Good fit; "AI net-zero roadmaps" are gimmicks.

### MVP
- **Doing:** accounting connectors (e-conomic, Dinero, Fiken, Tripletex), spend-based Scope 1–3 with Climatiq factors, invoice extraction for Scope 1–2, VSME Basic datapoints, PDF report, questionnaire answer library.
- **Not doing:** Comprehensive module, product carbon footprints, targets and roadmaps, XBRL until EFRAG's template is stable.
- **Effort:** 8 weeks.
- **Dependencies:** Climatiq or public factor sets, accounting APIs, VSME datapoint model.
- **Hardest part:** selling urgency that regulation no longer provides.

### Score and verdict
Pain 2 · Solo 3 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **17/30**. The wave that was supposed to arrive in 2026 was cancelled. Revisit if the value-chain cap generates real supplier demand in 2027.

---

## 30. Web accessibility monitor with AI-generated fix pull requests

**One-liner.** Crawl a site with axe-core, rank the failures by traffic, open pull requests that fix the six error classes making up 96% of all failures, and generate the accessibility statement the European Accessibility Act requires, sold to agencies per site.

### Problem statement
The European Accessibility Act has applied since 28 June 2025 to e-commerce, banking, e-books, ticketing, telecoms and software; micro-enterprises are exempt for services but their customers are not; Germany fines up to €100,000. WebAIM's February 2026 survey found 95.9% of home pages failing WCAG 2 with 56 errors per page, rising 10% a year, and six error types (low contrast, missing alt text, missing form labels, empty links, empty buttons, missing language attribute) make up 96% of errors. Those six are mechanical, which is exactly what an LLM can fix in a pull request. The overlay vendors are discredited: the FTC ordered accessiBe to pay $1 million in January 2025 for claiming its overlay made sites compliant, and 67% of practitioners rate overlays ineffective. The scanners (Pope Tech, Silktide, Equalize Digital) find problems but do not fix them.

### Who experiences the problem
EU e-commerce and service sites with ten or more employees (about 1.57 million firms with 10–49 employees; 26,000 in Denmark, 35,000 in Sweden, 26,000 in Norway), banks and publishers, and above all the web agencies that manage many client sites. Norway already required WCAG for private websites before the Act. The buyer is the marketing or e-commerce lead or the agency; the user is the developer.

### Value of solving it
Avoided fines and litigation, eligibility for public tenders, conversion uplift. A manual audit costs €3–10k per site (unverified); automation finds 30–50% of issues and, with fix PRs, resolves most of the mechanical ones.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| accessiBe, UserWay, iubenda accessibility | Overlays | $59–$479/mo; €6–50/mo | FTC order; do not fix code |
| AudioEye, Level Access, Siteimprove, axe Monitor, Silktide | Enterprise scanning and services | Quote, 12-month minimums | Enterprise |
| Equally AI | Scanner with AI | $38–$115/mo | No PRs |
| Pope Tech | Scanner | $25–$400/mo by pages | No fixes |
| Equalize Digital (WordPress) | Plugin | $190–$2,250/yr | WordPress only |
| WAVE, Lighthouse, axe DevTools | Free scanners | Free | Detection only |

### Pricing model
Per site: €39/mo for one site, €149/mo for ten (agency), €399/mo for fifty, including fix PRs and the statement generator.

### Path to profitability
At €80 ARPU you need 63 customers for €5k MRR and 125 for €10k; agencies at €149–399 get there faster. Costs: crawling compute and LLM fixes (cents per page). Distribution: a free scanner as SEO lead magnet (proven in this category), agency partnerships, GitHub Marketplace, "EAA compliance" content in Nordic languages. Churn is moderate; monitoring is recurring, and the statement must be maintained.

### Where AI is used
- **In the product:** generating fix PRs for the mechanical error classes (alt text drafts with human review, label associations, contrast token adjustments, language attributes), prioritising by traffic, and drafting the accessibility statement per EN 301 549. Client-side "AI overlays" are the thing not to build.
- **To build it:** axe-core, Playwright crawling, sitemap ingestion and a GitHub app are standard; the PR generation needs the repo's framework detected and a conservative diff policy.

### MVP
- **Doing:** crawl with axe-core, dashboard by site, traffic-weighted priority (Google Analytics or Plausible import), GitHub app that opens fix PRs for the six error classes on React, Next.js, WordPress themes and plain HTML, accessibility statement generator, weekly regression email.
- **Not doing:** manual audit services, PDF accessibility, mobile apps, overlays.
- **Effort:** 7 weeks.
- **Dependencies:** axe-core, Playwright, GitHub app, analytics APIs, LLM.
- **Hardest part:** PRs that reviewers trust on unfamiliar codebases, and weak Nordic enforcement lowering urgency.

### Score and verdict
Pain 3 · Solo 4 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **20/30**. A live regulation, a bottomless backlog (96% non-compliance), discredited incumbents and a clear "scan and fix" wedge nobody sells at agency prices. The enforcement question is the only drag.

---

## 31. E-invoicing gateway for freelancers and micro-businesses

**One-liner.** Send and receive Peppol, XRechnung, Factur-X and KSeF invoices from tools that do not support them (Stripe, Notion, Airtable, spreadsheets), validate before sending, archive for the statutory period.

### Problem statement
E-invoicing mandates are arriving in a wave: Belgium (all B2B via Peppol from 1 January 2026), Poland (all from April 2026), France (receive from September 2026, SMEs issue from September 2027), Germany (issue from 2027 for over €800k, 2028 for all), Norway (issue from 1 January 2027, approved by the Storting in June 2026), Denmark (Bookkeeping Act phases), and EU-wide cross-border reporting from July 2030. The accounting suites bundle it (Fiken NOK 219 a month with EHF, Dinero and Billy with NemHandel on all plans, sevDesk from €4.45), and nobody serves the cross-border freelancer who faces three formats. But the infrastructure has gates: becoming a Peppol access point requires OpenPeppol membership and per-country certification; France requires accredited platforms; Poland's KSeF is its own API.

### Who experiences the problem
Micro firms: 31 million in the EU with 0–9 employees. The buyer is the freelancer or their accountant. Value per user is €5–15 a month.

### Value of solving it
Being able to bill at all after the mandate; avoided rejected invoices.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Fiken, Tripletex (Norway) | NOK 199–219/mo incl. EHF | Bundled |
| Dinero, Billy (Denmark) | Free to DKK 595/mo incl. NemHandel | Bundled |
| sevDesk, Lexware (Germany) | €4.45–€32.90/mo incl. XRechnung | Bundled |
| Storecove, Unimaze, Sproom, ecosio | Access-point APIs; pricing not retrievable | Per document plus base |
| Pagero, Basware, Banqup | Enterprise | Quote |

### Pricing model
€9/mo plus €0.20 per document beyond 50.

### Path to profitability
At €12 ARPU you need 417 customers for €5k MRR and 833 for €10k, reselling an access-point API with thin margins, against suites that include it. The certification gates add months. Not a solo business.

### Where AI is used
Converting PDF and email invoices to EN 16931 structured form for inbound legacy invoices, explaining validator errors in plain language. Secondary.

### MVP
- **Doing / not doing:** not recommended. The one viable wedge is an inbound converter (PDF to structured invoice) sold to micro firms that must *receive* e-invoices, which is idea 33's extraction feature pointed at invoices.
- **Effort:** 8 weeks plus certification.
- **Dependencies:** access-point partner, validators, national rails.
- **Hardest part:** gates and bundling.

### Score and verdict
Pain 4 · Solo 2 · AI 2 · Gap 2 · WTP 2 · Reach 3 = **15/30**. The strongest regulatory wave in this list and the worst place for a solo founder to stand in it.

---

## 32. GDPR records-of-processing and data-subject-request automation for small companies

**One-liner.** Describe your business and connect your SaaS stack; the tool drafts the Article 30 records of processing, maintains the vendor and data-processing-agreement register, runs an intake portal for access requests with identity checks and one-month deadline tracking, and drafts the responses.

### Problem statement
Every company with employees needs Article 30 records (the under-250-employee exemption rarely applies because employee data processing is not occasional), and must answer access requests within one month. GDPR fines reached 3,215 cases and €6.31 billion by September 2026, and the European Data Protection Board's 2024 coordinated enforcement focused on the right of access. The market is bimodal: $5–80 a month policy and consent generators (Termly, iubenda) with token DSAR forms, and €300–500 a month records suites (GDPR Register at €350–450, Privacy Nexus at €77–465) aimed at mid-market. Draftit Privacy (Visma) claims 2,700+ Nordic organisations, mostly mid-size and quote-only. Nordic-language records-and-requests tooling under €100 a month is thin.

### Who experiences the problem
SMEs of 20–250 employees that get audited or asked by customers: roughly 31,000 in Denmark, 41,000 in Sweden and 30,000 in Norway in the 10–249 bands. The buyer is the CFO, COO or external data protection officer; the user is the office manager.

### Value of solving it
Passing customer and vendor due diligence, audit readiness, DPO hours. Request volumes at SMEs are low, so the recurring value is the register, not the requests.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| GDPR Register (Estonia) | €350–€450/mo, annual | Mid-market price |
| Privacy Nexus (Netherlands) | €77.50–€465/mo | Dutch focus |
| Termly, iubenda | $10–$80/mo | Consent tools with a DSAR form |
| Draftit Privacy (Visma, Sweden) | Quote; 2,700+ Nordic orgs | Mid-size, sales-led |
| OneTrust, Transcend, DataGrail, Osano | Quote | Enterprise |
| Vera (ex-Privasee) | $200 per questionnaire | Pay per use |

### Pricing model
€69/mo per legal entity (records, vendor register, DSAR portal), €149/mo with connectors and multi-entity. Annual prepay.

### Path to profitability
At €90 ARPU you need 56 customers for €5k MRR and 111 for €10k. The register is a living document if the product nags about new vendors, which keeps churn down; the risk is customers treating it as a one-off. Distribution: accountants and IT-service providers who get asked "do you have a GDPR tool for us", Nordic-language content, and the DPO-as-a-service consultants who need a client portal.

### Where AI is used
Generating a draft records register from a described business and its SaaS stack, classifying data categories and legal bases, drafting request responses and redactions, extracting terms from vendor DPAs. Good fit. An "AI DPO" that signs off compliance is the gimmick.

### MVP
- **Doing:** guided business questionnaire, AI-drafted records of processing with human edit, vendor register with DPA upload and extraction, DSAR intake portal with email identity check and deadline tracking, response drafting, export to the national authorities' templates.
- **Not doing:** automated data discovery across SaaS connectors (v2, heavy), cookie consent, DPIA workflows beyond a template.
- **Effort:** 6 weeks.
- **Dependencies:** LLM, email, optional BankID/MitID identity check via a broker.
- **Hardest part:** convincing SMEs that the register needs to live somewhere other than a forgotten spreadsheet.

### Score and verdict
Pain 3 · Solo 4 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **20/30**. Evergreen regulation, a clear price gap under €100 in Nordic languages, and document-generation AI at the core. Steady rather than explosive.

---

## 33. Vendor contract and SaaS renewal tracker with AI clause extraction

**One-liner.** Forward every vendor contract and invoice to one inbox; the tool extracts renewal date, term, notice period, auto-renewal, price escalators and seat counts, warns you before the notice window closes, and shows what you spend on which tools.

### Problem statement
Companies average 305 SaaS applications in Zylo's 2026 index (enterprise-weighted, but sprawl scales down too), and auto-renewals with 30–90 day notice periods are where money leaks. The category is consolidating upward: Vendr's site now redirects to Vertice, Trelica's to 1Password, and the procurement platforms start at €12,500 a year (Sastrify) or $3,083 a month (Tropic). Contract-lifecycle tools ship AI extraction as standard but start at $499 a month (Concord). The SMB survivors, Cledara (£100 a month, free with its cards) and Substly (from $105 a month), prove there is a sub-$300 market, and none of them integrates with Nordic accounting systems.

### Who experiences the problem
Companies of 20–250 employees without a procurement function: about 1.8 million in the EU with 10–249 employees, 30,000 each in Denmark and Norway, 41,000 in Sweden. The buyer is the finance lead or COO; users are finance and the IT admin.

### Value of solving it
Catching renewals before notice periods close, cutting unused seats, consolidating overlaps. For a 100-person firm spending €1–3k per employee a year on software (unverified), a 10% saving is €10–30k a year, against a €1–2k tool. Vendors claim 20–30% savings.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Cledara (UK) | £100/mo (20 apps), free if paying via its cards | UK, card-led |
| Substly (Sweden) | $105–$260/mo | Closest Nordic; no accounting integration |
| Concord, ContractSafe, Juro | $499–$1,299/mo; quote | CLM price |
| Tropic, Sastrify, Vertice, Zluri, Torii, Zylo | $3k/mo; €12.5k+/yr; quote | Enterprise |

### Pricing model
€99/mo for up to 50 contracts, €249/mo for 200, unlimited users. Annual prepay.

### Path to profitability
At €120 ARPU you need 42 customers for €5k MRR and 84 for €10k. Costs: extraction is cents per contract. Distribution: accountants (they see the invoices), integrations with e-conomic, Dinero, Fiken and Tripletex so spend appears automatically, and card providers like Pleo. Churn risk: the pain is episodic (a clean-up, then quiet), so the product must keep earning its place with the renewal calendar and monthly spend digest.

### Where AI is used
- **In the product:** extracting terms from contract PDFs and renewal emails, parsing invoices into spend by vendor, drafting cancellation and negotiation emails. This is cheap, reliable, and the entire wedge. Autonomous "negotiation agents" for SMBs are a gimmick.
- **To build it:** email ingestion (Gmail and Microsoft 365 APIs), accounting connectors, calendar and Slack alerts, extraction with structured output. Entirely standard.

### MVP
- **Doing:** upload and email-forward intake, AI extraction with confirm, renewal calendar with notice-window alerts, spend dashboard from accounting-system invoices, vendor list with owner, Slack and email digests.
- **Not doing:** app discovery via SSO logs (v2), procurement workflows, negotiation services, cards.
- **Effort:** 5 weeks.
- **Dependencies:** Gmail/Microsoft 365 APIs, accounting APIs, LLM.
- **Hardest part:** adjacent bundling (password managers, spend cards, accounting suites) and episodic pain.

### Score and verdict
Pain 3 · Solo 4 · AI 5 · Gap 3 · WTP 3 · Reach 3 = **21/30**. The cheapest, clearest AI-extraction product in this cluster, with a real SMB price gap and Nordic accounting integrations as the moat. A strong second-tier pick and a good first product.

---

## 34. Employee policy and handbook generator with acknowledgement tracking

**One-liner.** Answer a questionnaire about your company; get a lawyer-reviewed, jurisdiction-specific handbook and the mandatory policies (whistleblowing routines, working-time, smoking, IT use) in Norwegian, Danish or Swedish, with e-signed acknowledgements, versioning and alerts when the law changes.

### Problem statement
Norway's July 2024 changes require written employment contracts within seven days listing twelve or more items, and written whistleblowing routines from five employees. Denmark's 2023 employment-statement law carries compensation for missing statements. US handbook tools sustain $999–4,188 a year (AirMason, Blissbook), and SixFifty sells jurisdiction-aware drafting by employees times states. In the Nordics the incumbent is Simployer's lawyer-maintained handbook (quote), Contractbook starts at €399 a month, and the Norwegian SME legal-docs player Lexolve has just rebranded to Lavli, which suggests the market is still being shaped. HR suites (BambooHR from $10 per employee) bundle e-signing but not content.

### Who experiences the problem
Firms of 5–250 employees without HR: about 70,000 in Norway (30,000 with 10–249 plus 40,000 with 5–9), 30,000 in Denmark, 41,000 in Sweden. The buyer is the founder, office manager or accountant; the users are employees acknowledging.

### Value of solving it
Avoided compensation claims and labour-inspectorate orders, onboarding time, evidence of acknowledgement in disputes. A lawyer-drafted handbook costs NOK/DKK 10–30k (unverified).

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| AirMason, Blissbook (US) | $999–$4,188/yr | US law |
| SixFifty (US) | Quote by employees and states | US |
| Trainual | Hidden | Process docs, not law |
| BambooHR, Personio, Rippling | $10–$25 per employee; quote | E-sign without content |
| Simployer (Norway) | Quote | Lawyer content, dated delivery |
| Contractbook (Denmark) | €399–€3,499/mo | Contract-centric, expensive |
| Lavli (ex-Lexolve, Norway) | Not retrieved | Being shaped |

### Pricing model
NOK 490/mo to 25 employees, NOK 990/mo to 100, annual; includes legal-update feed.

### Path to profitability
At €90 ARPU you need 56 firms for €5k MRR and 111 for €10k. The moat and the cost are the same thing: a lawyer partner who reviews templates and the update feed for three jurisdictions. Start with Norway only. Distribution: accountants (who are asked "do you have a handbook template"), and bundling the whistleblowing routine from idea 26.

### Where AI is used
Drafting jurisdiction-specific policies from the questionnaire, diffing existing policies against a curated legal-change feed, translation, employee Q&A over the handbook. The LLM drafts; lawyer-reviewed templates are the product. Unreviewed legal text is the risk, and HR use cases become high-risk under the AI Act from December 2027 if the tool starts screening or evaluating employees, which it should not.

### MVP
- **Doing:** Norway. Questionnaire, template library (contract, handbook, whistleblowing routines, working-time, IT and privacy policies) reviewed by a partner lawyer, AI tailoring, e-sign acknowledgement (click-wrap; BankID optional), versioning, change alerts.
- **Not doing:** HRIS features, payroll, Denmark and Sweden until v2, legal advice.
- **Effort:** 6 weeks plus the legal partnership.
- **Dependencies:** a lawyer partner, e-sign, LLM.
- **Hardest part:** content maintenance across jurisdictions, and ChatGPT as the free substitute for a first draft.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **19/30**. Good economics if a lawyer partner is found; the content treadmill is the real cost. Pairs naturally with 26 and 32 into a "Nordic SME compliance kit".

---

## 35. Cap table, convertible and option-plan manager for Nordic early-stage startups

**One-liner.** Cap table, convertible and SAFE-style instrument tracking, option plans with Norwegian, Swedish and Danish tax rules, and the annual shareholder-register filing to Altinn, for startups whose lawyers still use Excel.

### Problem statement
US tools (Carta, Pulley, Cake) ignore the Nordic specifics: Norway's annual shareholder-register filing to Altinn and statutory share register, Denmark's ownership register, and the three national option-tax schemes. Swedish standard templates (StartupTools, now AllShares) include a free SAFE-like "WISE convertible", which shows the instrument layer is being standardised locally. The global category is validated with published SME pricing ($1,000–3,500 a year for 25–40 stakeholders) and free tiers. Unlisted (Norway) already does cap tables, equity programmes and Altinn filing for "thousands" of Nordic entrepreneurs.

### Who experiences the problem
Pre-seed to Series A startups in the Nordics (count not found), their lawyers and accountants, angel syndicates. The buyer is the founder or CFO.

### Value of solving it
Avoided cap-table errors surfacing in due diligence, correct option-tax reporting, faster round modelling; replaces NOK/DKK 5–20k of lawyer time per round (unverified).

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Pulley, Cake Equity | $1,000–$3,500/yr; Cake free to 5 stakeholders | US law and 409A |
| Eqvista | Free under 20 stakeholders; $2 per stakeholder/mo | US |
| Vestd (UK) | £250–£4,200/yr | UK schemes |
| Carta, Ledgy | Not retrieved; Carta Launch free tier | Enterprise-leaning; Ledgy is EU-native |
| Unlisted (Norway) | Not shown; Altinn filing | Nordic-native incumbent |
| AllShares (Sweden) | Free templates | Templates, not a ledger |

### Pricing model
€99/mo to 25 stakeholders, €249/mo to 100; free for pre-incorporation modelling.

### Path to profitability
At €120 ARPU you need 42 startups for €5k MRR and 84 for €10k, from a small population that churns through company death, against a Nordic-native incumbent and free US tiers. Three legal regimes to maintain alone.

### Where AI is used
Extracting terms from convertibles and shareholder agreements into the model, plain-language dilution explanations for employees, drafting board resolutions and general-meeting minutes in the local language. Modest.

### MVP
- **Doing / not doing:** not recommended unless the founder has a startup-ecosystem network; if pursued, Norway only, with Altinn filing and the option-tax scheme as the wedge.
- **Effort:** 8 weeks.
- **Dependencies:** Brønnøysund API, Altinn (Maskinporten access), BankID e-sign, lawyer-verified tax rules.
- **Hardest part:** small market, Unlisted.

### Score and verdict
Pain 3 · Solo 3 · AI 3 · Gap 2 · WTP 3 · Reach 2 = **16/30**. Validated globally, occupied locally. Skip.

---

## Cluster summary

| # | Idea | Score | ARPU € | Customers to €10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 33 | Vendor contract and renewal tracker | **21** | 120 | 84 | 5 |
| 26 | Whistleblower channel | **20** | 100 | 100 | 5 |
| 28 | NIS2 supplier profile | **20** | 250 | 40 | 8 |
| 30 | Accessibility monitor with fix PRs | **20** | 80 | 125 | 7 |
| 32 | GDPR records and DSAR automation | **20** | 90 | 111 | 6 |
| 34 | Employee handbook generator | **19** | 90 | 111 | 6 |
| 27 | Working-time registration | **17** | 40 | 250 | 5 |
| 29 | VSME sustainability reporting | **17** | 150 | 67 | 8 |
| 35 | Nordic cap table | **16** | 120 | 84 | 8 |
| 31 | E-invoicing gateway | **15** | 12 | 833 | 8+ |

## Sources
- https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sbs_sc_ovw
- https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251209-2
- https://www.dst.dk/da/Statistik/udgivelser/NytHtml?cid=50010
- https://www.ssb.no/virksomheter-foretak-og-regnskap/virksomheter-og-foretak/statistikk/virksomheter
- https://eur-lex.europa.eu/eli/dir/2019/1937/oj
- https://www.seyfarth.com/news-insights/eu-whistleblower-directive-where-are-we-now.html
- https://www.lovguiden.dk/praksisoversigt/gdpr-og-compliance/whistleblowerpolitik
- https://www.datatilsynet.dk/presse-og-nyheder/nyhedsarkiv/2026/mar/aaret-2025-i-den-nationale-whistleblowerordning
- https://www.ihk.de/berlin/service-und-beratung/recht-und-steuern/rechtsaenderungen-hinweisgeberschutzgesetz-5657404
- https://www.teknikforetagen.se/nyhetscenter/nyheter/2025/arbetsmiljoverket-inleder-tillsyn-av-visselblasarkanaler/
- https://lovdata.no/dokument/NL/lov/2005-06-17-62/KAPITTEL_3
- https://www.capterra.com/p/218226/Whistleblower-Software/pricing/
- https://www.whistlelink.com/pricing/
- https://www.walor.io/pricing
- https://www.hintbox.de/preise/
- https://wemoral.com/pricing
- https://voxwel.com/blogs/whistleblowing-software-pricing-comparison
- https://www.varslingssystem.no/nb/
- https://www.beierholm.dk/viden-og-indsigt/nyheder-og-artikler/tidsregistrering-lovkrav
- https://www.twobirds.com/da/insights/2024/denmark/nye-krav-om-registrering-af-arbejdstid-i-danmark
- https://curia.europa.eu/jcms/upload/docs/application/pdf/2019-05/cp190061en.pdf
- https://www.arbeidstilsynet.no/arbeidsforhold/arbeidstid/
- https://www.ihk.de/rhein-neckar/recht/arbeitsrecht/arbeitszeiterfassung-5631422
- https://www.danlon.dk/tidsregistrering/
- https://zenegy.com/prisoversigt-for-zenegys-produkter/
- https://www.intempus.com/prices/
- https://www.planday.com/pricing
- https://www.tamigo.com/pricing
- https://toggl.com/track/pricing/
- https://clockify.me/pricing
- https://digital-strategy.ec.europa.eu/en/policies/nis2-directive
- https://samsik.dk/nis2/
- https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/cybersakerhetslag-20251506_sfs-2025-1506/
- https://www.openkritis.de/it-sicherheitsgesetz/nis2-umsetzung-gesetz-cybersicherheit.html
- https://lovdata.no/dokument/NL/lov/2023-12-20-108
- https://www.cyberday.ai/pricing
- https://www.hicomply.com/pricing
- https://www.secfix.com/
- https://www.vanta.com/pricing
- https://d-maerket.dk/
- https://eur-lex.europa.eu/eli/dir/2025/794/oj
- https://eur-lex.europa.eu/eli/reco/2025/1710/oj
- https://finance.ec.europa.eu/capital-markets-union-and-financial-markets/company-reporting-and-auditing/company-reporting/corporate-sustainability-reporting_en
- https://worldfavor.com/pricing
- https://normative.io/pricing
- https://www.coolset.com/pricing
- https://www.climatiq.io/pricing
- https://www.zevero.earth/pricing
- https://ecovadis.com/plans-pricing/
- https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en
- https://webaim.org/projects/million/
- https://overlayfactsheet.com/en/
- https://accessibe.com/pricing
- https://equally.ai/pricing
- https://equalizedigital.com/accessibility-checker/pricing/
- https://pope.tech/pricing
- https://www.iubenda.com/en/pricing
- https://www.bundesfinanzministerium.de/Content/DE/FAQ/e-rechnung.html
- https://einvoice.belgium.be/en
- http://ksef.podatki.gov.pl/etapy-wdrozenia-ksef/
- https://taxation-customs.ec.europa.eu/taxation/vat/vat-digital-age-vida_en
- https://europe.thomsonreuters.com/compliance/regulatory-updates/norway
- https://dinero.dk/priser
- https://www.billy.dk/priser/
- https://fiken.no/priser
- https://www.tripletex.no/priser/
- https://sevdesk.de/preise/
- https://www.lexware.de/preise/
- https://www.enforcementtracker.com/?insights
- https://www.gdprregister.eu/pricing/
- https://privacynexus.io/pricing
- https://termly.io/pricing/
- https://draftit.se/
- https://zylo.com/saas-management-index/
- https://www.vertice.one/pricing
- https://tropicapp.io/pricing
- https://www.concord.app/pricing
- https://www.cledara.com/pricing
- https://www.sastrify.com/pricing
- https://www.substly.com/pricing
- https://www.arbeidstilsynet.no/arbeidsforhold/arbeidsavtale/
- https://www.airmason.com/pricing
- https://blissbook.com/pricing
- https://www.sixfifty.com/pricing/
- https://www.bamboohr.com/pricing
- https://contractbook.com/pricing
- https://pulley.com/pricing
- https://www.cakeequity.com/pricing
- https://www.vestd.com/pricing
- https://eqvista.com/pricing/
- https://www.unlisted.ai/
- https://allshares.app/free-templates
