# 04 — Compliance, finance, legal & HR admin (ideas 26–35)

Ten ideas where a law, a regulator or a plaintiffs' bar creates the buyer. The US differs from Europe in two ways that matter for a solo founder. First, enforcement is often privatised: Prop 65 produced 1,545 settlements worth $66 million in 2025 through private notices, web-accessibility suits ran past 5,000, and TCPA carries $500–1,500 per text; a private litigation regime creates urgency without waiting for a regulator. Second, the deadlines move: the CMMC certification phase was suspended in July 2026, the HIPAA Security Rule final rule slipped to 2027, ADA Title II web deadlines moved a year, and the FTC's click-to-cancel rule was vacated, so a product should be anchored on duties that already exist (risk analyses, written security plans, warnings, certificates) rather than on a date. The baseline population is 561,160 US employer firms with 20–99 employees and 1.03 million with 5–9, plus 30 million non-employer businesses.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 26. Product regulatory compliance screening for small consumer brands

**One-liner.** Upload a bill of materials or ingredient list per product; the tool screens it against the Prop 65 chemical list and state PFAS bans, generates the correct short-form or long-form warning for labels and Amazon listings, tracks the 2028 short-form transition, and keeps the MoCRA cosmetics registration and children's-product certificate calendar.

### Problem statement
California's Prop 65 is enforced by private plaintiffs: roughly 5,000 60-day notices a year, 1,545 settlements totalling $66.3 million in 2025, and a median settlement of about $19,500 of which about $18,000 is the plaintiff's attorney fees. The short-form warning rules changed on 1 January 2025 (a listed chemical must now be named), with a sell-through transition ending 1 January 2028, so every brand using the old two-line warning must re-artwork labels and online listings. Cosmetics brands over $1 million in sales must register facilities and list products with FDA under MoCRA (16,398 facilities and 1.3 million listings by June 2026) with biennial renewal; children's products need a certificate based on third-party testing; Minnesota banned intentionally added PFAS in eleven product categories from January 2025 with manufacturer reporting due in 2026. The affordable tools are alert feeds and document checkers (Compliance Gate from $199 a year, Sustalium at €10 per document); the substance-management platforms start at $500–1,400 a month; the AI-native entrant (Certivo) deliberately skipped small brands.

### Who experiences the problem
Small consumer brands and importers selling on Amazon and Shopify (about 1 million active North American Amazon sellers on the last available count) and 16,398 FDA-registered cosmetics facilities. The buyer is the founder or operations lead of a 1–50 person brand; the user is whoever answers Amazon's compliance-document requests and re-does labels.

### Value of solving it
One avoided notice is a $19,500 median settlement plus defence counsel; avoided Amazon listing suppression; one label reprint cycle instead of two.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Compliance Gate | Regulation alerts and requirement lists for Amazon sellers | From $199/yr | Alerts, not screening |
| Sustalium | Per-document declarations | €10 per document/mo | No warning generator or Amazon output |
| Source Intelligence, Regilient, ComplyMarket | Prop 65 modules and services | Quote | Mid-market |
| Certivo | AI-native compliance platform | Quote; mid-market and enterprise only | Skipped SMBs |
| Toxnot, Stendard, iPoint, Texbase | Substance management | $195–$1,400/mo | Price |
| Assent, 3E, UL WERCS, Compliance & Risks | Enterprise | Quote | Enterprise |

### Pricing model
$49/mo for 25 products, $149/mo for 150, $399/mo for agencies and importers; per-product screening credits for one-offs.

### Path to profitability
At $99 ARPU you need 51 brands for $5k MRR and 101 for $10k. Costs: extraction is cents per document; the chemical lists are public. Distribution: the Shopify App Store (100% of the first $1 million), Amazon seller communities and consultants, testing labs that see the notices first, the 2028 transition as a content hook. The label-change pain is episodic, so the calendar features (MoCRA renewals, PFAS reporting, new notices in your category) carry retention.

### Where AI is used
- **In the product:** extracting materials and ingredients from supplier documents and screening them against the roughly 900-chemical Prop 65 list and state PFAS lists, drafting compliant warning text per product, generating MoCRA listing payloads, classifying products into CPSC rule sets, monitoring new 60-day notices to flag "your category is being targeted". "AI guarantees compliance" is the gimmick; exposure questions need testing.
- **To build it:** the lists and notice search are public; Amazon's Selling Partner API and Shopify's product API carry the attributes.

### MVP
- **Doing:** product and BOM import, Prop 65 and PFAS screening with confirm, warning generator (label and listing text), 2028 transition tracker, 60-day notice monitor by category, MoCRA and CPC calendar, Shopify app.
- **Not doing:** lab testing coordination, EU REACH, full substance management, autonomous Amazon listing edits.
- **Effort:** 7 weeks.
- **Dependencies:** OEHHA list, California AG notice database (scrapeable), FDA Cosmetics Direct formats, CPSC rules, Amazon SP-API, Shopify API, errors-and-omissions cover.
- **Hardest part:** plaintiffs move to new theories, and Amazon could ship its own workflow.

### Score and verdict
Pain 4 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 4 = **21/30**. A privately enforced regime with 5,000 notices a year, a hard 2028 label transition, an empty SMB price band and a Shopify-shaped channel. Strong.

---

## 27. Written information security plan and Safeguards Rule compliance for tax preparers, accountants and small financial firms

**One-liner.** A 20-minute interview produces the written information security plan the IRS requires every tax preparer to attest to at PTIN renewal, mapped to the FTC Safeguards Rule's nine elements, with evidence checks from Google Workspace or Microsoft 365 and an annual refresh, at a price a one-person preparer will pay.

### Problem statement
The FTC Safeguards Rule (in full effect since June 2023) applies to non-bank "financial institutions" including tax-preparation firms, auto dealers that arrange financing and mortgage brokers, and requires a written security programme with a qualified individual, risk assessment, MFA, encryption, training, vendor oversight and an incident plan; a breach affecting 500+ consumers must be notified to the FTC within 30 days (since May 2024). IRS Publication 5708 states that a written, accessible plan is required and PTIN renewal involves attesting to one. There are 879,698 active PTIN holders, most in firms of one to ten people. The market is bimodal: free templates from the IRS and tax-software vendors, $999 done-for-you documents (Verito), and $45–129 per user per month security stacks (Rightworks, which absorbed Practice Protect and Tech 4 Accountants); ComplyAuto sells the same compliance to 10,000+ auto dealers through 44 state dealer associations. No enforcement action against a tax preparer was found; the pressure is attestation and cyber-insurance questionnaires.

### Who experiences the problem
879,698 PTIN holders (208,519 CPAs, 68,548 enrolled agents), about 46,000 CPA firms, 16,990 franchised new-car dealers plus independents, mortgage brokers. The buyer is the firm owner during renewal season (mid-October to December) or after a dealer-association push; the user is the owner or office manager.

### Value of solving it
Replacing a $999 consultant document and 5–10 hours of owner time, an honest attestation, a passed insurance questionnaire, and a breach-notification form that can be completed within 30 days because the inventory exists.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| IRS Publication 5708, Drake, Thomson Reuters, Intuit templates | Free | Static Word files |
| Verito | WISP $999/yr; hosting from $69 per user/mo | Done-for-you, expensive |
| Rightworks (Practice Protect, Tech 4 Accountants) | From $45–$129 per user/mo | Security stack upsell |
| Bellator Cyber and template micro-sites | Free templates plus services | Static |
| ComplyAuto (auto dealers) | Quote; 10,000+ dealers | Dealer-only, sales-led |

### Pricing model
$29/mo or $249/yr per firm with unlimited staff; dealer and multi-office tier at $99/mo.

### Path to profitability
At $29 ARPU you need 172 firms for $5k MRR and 345 for $10k, from 880,000 reachable buyers with an annual forcing event and no data in the tool (document-only design). Costs are negligible. Distribution: tax-professional Facebook groups and forums, state CPA societies, enrolled-agent associations, tax-software marketplaces, and the October-to-December renewal window as the launch. Churn risk is the one-time-document pattern; the annual refresh, training log and admin-console checks are what make it a subscription.

### Where AI is used
- **In the product:** interview to a firm-specific plan mapped to each Safeguards element, annual risk-assessment refresh, read-only checks of Google Workspace and Microsoft 365 settings to evidence MFA and encryption, training-log generation, drafting the FTC notification form. "AI security officer" monitoring claims are the gimmick.
- **To build it:** questionnaire, document generator, admin-API reads and e-sign are a four-week build.

### MVP
- **Doing:** guided interview, plan generator mapped to the nine elements, admin-console evidence checks, training acknowledgement log, annual refresh reminders, breach-notification drafter, PDF and e-sign.
- **Not doing:** hosting, endpoint security, managed IT, holding any client tax data.
- **Effort:** 4 weeks.
- **Dependencies:** Publication 5708 and 4557, 16 CFR 314 mapping, Google Admin SDK and Microsoft Graph read scopes, e-sign.
- **Hardest part:** seasonality (Q4 spike, quiet summers) and free templates.

### Score and verdict
Pain 3 · Solo 5 · AI 4 · Gap 3 · WTP 2 · Reach 4 = **21/30**. The cheapest build in this chapter, aimed at 880,000 reachable buyers with an annual attestation, in an empty $19–49 band. Low ARPU and seasonality cap it; a very good first product.

---

## 28. CMMC Level 1 and Level 2 readiness for small defense subcontractors

**One-liner.** A documentation workspace for the "accidental security officer" at a 5–100 person machine shop or engineering firm: interview-driven system security plan and policies per NIST 800-171 objective, evidence mapping from Microsoft 365 or Google Workspace, SPRS score and plan of action, and the annual affirmation, without ever storing controlled information.

### Problem statement
The CMMC programme rule took effect 16 December 2024 and the acquisition rule on 10 November 2025, starting Phase 1 (Level 1 and Level 2 self-assessments in selected solicitations) with an annual affirmation in SPRS. The Department's own analysis counts 337,968 affected entities, 229,818 of them small, and prices a Level 1 self-assessment at about $6,000 a year, a Level 2 self-assessment at about $37,000 per three-year cycle and a certified Level 2 assessment at about $105,000. Then, on 13 July 2026, the Department suspended Phase 2 (the certified-assessment wave due November 2026) pending a reform task force, with no end date; the acquisition rule and the self-assessment phase remain in force. The tools are either GRC suites priced for funded startups (Vanta, Drata, Secureframe's "Defense" tier, all quote-only), enclaves that solve hosting but not paperwork (PreVeil $30 per user, Cuick Trac), or FutureFeed, the one transparent SMB workspace at $99 a month.

### Who experiences the problem
229,818 small defense-industrial-base entities, most needing Level 1 (federal contract information only) and a large minority Level 2 (controlled unclassified information). The buyer is the owner; the user is the office manager or outsourced IT provider.

### Value of solving it
Contract eligibility (no status in SPRS means no award in selected solicitations), avoided $10–40k consultant gap assessments, a cut in the $37,000 self-assessment effort, and reduced False Claims Act exposure on the affirmation.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| FutureFeed | $99/mo (under 25 staff); Level 2 add-on $1,008/yr | Document-centric; the transparent incumbent |
| PreVeil | $30 per user/mo; "Pass" bundle $450/mo | Enclave plus support, not paperwork |
| Secureframe Defense, Vanta, Drata | Quote | Priced for funded companies |
| Cuick Trac, Totem, Summit 7 | Enclaves, workshops, managed detection; quote | Different job |
| Consultants | $10–40k gap assessments | Expensive, one-off |

### Pricing model
$79/mo Level 1, $199/mo Level 2 workspace, annual prepay; MSP tier for IT providers managing several clients.

### Path to profitability
At $199 ARPU you need 25 customers for $5k MRR and 50 for $10k. Compliance documentation churns slowly; the annual affirmation renews the need. Distribution: SAM.gov lists every registered contractor by NAICS, Procurement Technical Assistance Centres (now APEX Accelerators) run free CMMC workshops and want tools to point to, and the managed IT providers serving machine shops resell. Timing: Level 1 and Level 2 self-assessment is live now; plan for the certified wave to restart in 2027, not 2026.

### Where AI is used
- **In the product:** interview-driven system security plan and policy drafting per assessment objective, evidence mapping from admin exports, SPRS score calculation and plan-of-action generation, plain-English explanations of each objective for non-IT owners, assessor-readiness Q&A. "AI passes your assessment" is the gimmick; assessors interview humans.
- **To build it:** the 800-171 catalogue and scoring methodology are public; the design constraint is never to store controlled information, which keeps the tool outside the FedRAMP-equivalent hosting requirement.

### MVP
- **Doing:** Level 1 and Level 2 control catalogue with interview flows, generated system security plan and policies, evidence checklist with Microsoft 365 and Google Workspace read-only checks, SPRS score and plan of action, affirmation-ready export.
- **Not doing:** storing controlled unclassified information, enclave hosting, certified-assessor services, Level 3.
- **Effort:** 8 weeks.
- **Dependencies:** NIST 800-171 and 171A catalogues, DoD scoring methodology, Microsoft Graph and Google Admin APIs, e-sign; SOC 2 will be asked for by primes.
- **Hardest part:** FutureFeed already occupies the $99 slot, and the certification timeline has slipped repeatedly.

### Score and verdict
Pain 4 · Solo 3 · AI 4 · Gap 2 · WTP 4 · Reach 3 = **20/30**. Hard statutory dates and 229,818 small entities, tempered by the July 2026 suspension of the certification phase and a transparent incumbent. Build the Level 1 and self-assessment product now and be ready for the 2027 restart.

---

## 29. HIPAA Security Rule compliance kit for small practices and health-tech vendors

**One-liner.** The annual risk analysis, policies, business-associate register and incident playbook a dental, therapy or small medical practice needs today, drafted from an asset inventory and a questionnaire, with a "what changes for you" view of the pending Security Rule update, designed to hold no patient data.

### Problem statement
The existing Security Rule requires a risk analysis, and the Office for Civil Rights is enforcing it hard: a Risk Analysis Initiative produced 16 resolution agreements between January and August 2025 and continued into 2026 (including a dental software vendor), plus 19 completed ransomware investigations with settlements over $1 million in April 2026. The January 2025 proposed rule would make MFA, encryption, asset inventories, annual audits, 72-hour restoration, six-monthly scans and annual penetration tests mandatory, at an estimated $9 billion first-year cost; but the final rule has slipped to a July 2027 target, so vendors marketing "2026 HIPAA update" are ahead of the law. Separately, HHS's Section 504 rule requires HHS-funded providers' websites to meet WCAG 2.1 AA from 11 May 2026. The transparent SMB tool (Accountable HQ) starts at $169 a month; the rest are quote-only.

### Who experiences the problem
Every covered entity and business associate: 120,488 dental firms, 165,423 other health-practitioner firms (physical therapy, chiropractic, mental health), physician offices, and every health-tech startup asked to sign a business-associate agreement. The buyer is the practice owner or office manager, or the health-tech founder; the user is the designated security officer.

### Value of solving it
Replacing $2–10k consultant risk analyses, passing hospital and insurer vendor questionnaires, avoiding six-figure settlements.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Accountable HQ | $169–$799/mo plus per seat; "Compliance Copilot" | Above what a two-dentist office wants |
| Abyde | Calculator by locations and employees, 12-month term | No list prices |
| Compliancy Group, MedTrainer, HIPAA One, Clearwater | Quote | Sales-led |
| Vanta, Drata, Secureframe HIPAA modules | Quote | Startup-priced |
| Paubox | Per-sender email encryption | Email only |

### Pricing model
$49/mo for practices under ten staff, $99/mo to 50, $249/mo for health-tech vendors with the business-associate register; annual prepay.

### Path to profitability
At $79 ARPU you need 63 customers for $5k MRR and 127 for $10k. Compliance documents churn slowly; the annual risk analysis renews the need. Distribution: dental and therapy practice-management communities, state dental associations, dental consultants, health-tech founder communities where a first BAA request is the trigger. Design for zero PHI so the tool itself needs no BAA; health-tech customers will expect SOC 2 within 12–18 months.

### Where AI is used
- **In the product:** drafting the risk analysis from an asset inventory and questionnaire, policy generation mapped to NIST 800-66, business-associate agreement review and vendor-verification letters, incident triage against the 60-day breach-notification clock, explaining what the proposed rule changes. "AI certification" is the gimmick; HIPAA has no certification.
- **To build it:** the OCR risk-assessment tool logic and NIST crosswalk are public; admin-API checks for MFA and encryption reuse idea 27's connectors.

### MVP
- **Doing:** asset inventory, guided risk analysis with AI drafting, policy set, business-associate register with agreement extraction, training log, incident playbook with notification timers, Microsoft 365 and Google Workspace checks, proposed-rule readiness view.
- **Not doing:** vulnerability scanning and penetration testing (partner referral), email encryption, storing any patient data.
- **Effort:** 7 weeks.
- **Dependencies:** OCR SRA tool logic, NIST 800-66, 45 CFR 164 text, e-sign, admin APIs; zero-PHI architecture.
- **Hardest part:** the final rule's slip removes the deadline; the sale rests on current enforcement and vendor questionnaires.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **19/30**. An evergreen duty with live enforcement, an open $49–99 band under Accountable, and connectors shared with ideas 27 and 28. The 2027 slip is why it is not higher.

---

## 30. Web accessibility monitor with AI-generated fix pull requests

**One-liner.** Crawl a site with axe-core, rank the failures by traffic and litigation risk, open pull requests that fix the six error classes making up 96% of failures, and generate the accessibility statement and conformance report that public-sector and healthcare buyers now require, sold per site to agencies and Shopify merchants.

### Problem statement
In the US the driver is litigation: 3,117 federal website-accessibility suits in 2025 (up 27%), over 5,000 across federal and state courts, 64% of the sued companies under $25 million in revenue, and one in five top-500 e-commerce retailers sued. Public deadlines exist too: HHS-funded providers' sites must meet WCAG 2.1 AA from 11 May 2026, and the DOJ's Title II rule now bites state and local governments (91,438 of them) on 26 April 2027 and 2028 after a one-year extension. WebAIM's 2026 survey found 95.9% of home pages failing, and six error types (contrast, alt text, form labels, empty links, empty buttons, language attribute) make up 96% of errors, which are mechanical. The overlay vendors are legally toxic (the FTC's $1 million order against accessiBe); the scanners (Pope Tech, Equally AI, Equalize Digital) detect but do not fix; nobody ships fix PRs at SMB prices.

### Who experiences the problem
US e-commerce and service sites (millions of Shopify merchants), HHS-funded providers, 91,438 local governments, and the agencies managing their sites. The buyer is the marketing or e-commerce lead, city IT director or agency owner; the user is the developer.

### Value of solving it
Demand-letter settlements of $5–20k plus counsel (unverified), public-sector audits at $3–10k per site, and agency resale.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| accessiBe, UserWay, iubenda | Overlays | $59–$479/mo | FTC order; do not fix code |
| AudioEye, Level Access, Siteimprove, Deque, Silktide, TPGi, Allyant | Enterprise scanning and services | Quote | Enterprise |
| Equally AI | Scanner with AI | $38–$115/mo | No PRs |
| Pope Tech | Scanner | $25–$400/mo | No fixes |
| Equalize Digital (WordPress) | Plugin | $190–$2,250/yr | WordPress only |
| WAVE, Lighthouse, axe DevTools | Free scanners | Free | Detection only |

### Pricing model
Per site: $39/mo for one, $149/mo for ten (agency), $399/mo for fifty, including fix PRs and the statement and conformance-report generator.

### Path to profitability
At $99 ARPU you need 51 customers for $5k MRR and 101 for $10k; agencies at $149–399 get there faster. Distribution: a free scanner as lead magnet (the proven play), the Shopify App Store, web-agency partnerships, the May 2026 and April 2027 deadlines as content. Monitoring is recurring and the statement must be maintained.

### Where AI is used
- **In the product:** generating fix PRs for the mechanical error classes (alt-text drafts with review, label associations, contrast token changes, language attributes), prioritising by traffic and litigation patterns, drafting the accessibility statement and a conformance report for Section 508 buyers. Client-side "AI overlays" are the thing not to build.
- **To build it:** axe-core, Playwright, sitemap ingestion and a GitHub app are standard; PR generation needs framework detection and a conservative diff policy; a Shopify theme-app variant reaches merchants.

### MVP
- **Doing:** crawl with axe-core, dashboard by site, traffic-weighted priority, GitHub app opening fix PRs for the six error classes on React, Next.js, WordPress themes and plain HTML, Shopify theme fixes, accessibility statement and conformance-report generator, weekly regression email.
- **Not doing:** manual audits, PDF accessibility, mobile apps, overlays.
- **Effort:** 7 weeks.
- **Dependencies:** axe-core, Playwright, GitHub app, Shopify theme API, analytics APIs, LLM.
- **Hardest part:** PRs that reviewers trust on unfamiliar codebases, and the plaintiffs' bar targeting whoever is easiest regardless of tooling.

### Score and verdict
Pain 4 · Solo 4 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **21/30**. Five thousand suits a year, a bottomless backlog, discredited incumbents, hard public deadlines and a "scan and fix" wedge nobody sells at agency prices. Strong.

---

## 31. Sales-tax exemption certificate management for small B2B and e-commerce sellers

**One-liner.** Collect resale and exemption certificates at checkout or by request link, validate them against each state's rules with OCR, track state-specific expiries, and assemble the audit pack, for the wholesalers and B2B merchants that filing tools treat as an afterthought.

### Problem statement
Since the 2018 Wayfair decision every sales-tax state has economic nexus, so a remote seller must hold a valid certificate for every exempt sale in every state where it collects. Rules differ: Florida's resale certificate expires every 31 December, Washington's last four years, California's until revoked; the multistate uniform certificate is accepted by 36 states. Auditors extrapolate a sample's error rate across all exempt sales (a vendor illustration: $450,000 assessed on $3 million of exempt sales). The standalone tool (EXEMPTAX) costs $250 a month on an annual term; the AI-native filing platforms bundle certificates as a loss-leader (Numeral's first 50 free, TaxJar's Professional tier); Avalara's module requires its tax engine.

### Who experiences the problem
Wholesalers, manufacturers, distributors and Shopify or marketplace sellers with B2B customers, plus suppliers to nonprofits. The buyer is the controller or owner; the user is the accounts-receivable or customer-service staff who chase certificates.

### Value of solving it
Six-figure audit assessments at scale, staff hours chasing renewals, faster B2B customer onboarding.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| EXEMPTAX | $250/mo, 12-month term, 1,000 certificates | Price and term |
| Numeral | Certificates included, first 50 free; $75 per filing | Bundled with filing |
| TaxJar (Stripe) | $39–$99/mo with certificate storage | Storage, not validation |
| TaxCloud, Zamp, Kintsugi | Bundled or quote | Filing-first |
| Avalara ECM, Sovos, Vertex | Quote; requires the tax engine | Enterprise |
| Shopify B2B, Amazon exemption programme | Inside the marketplace | Marketplace only |

### Pricing model
$49/mo for 200 certificates, $129/mo for 1,000, no annual term; Shopify app.

### Path to profitability
At $99 ARPU you need 51 customers for $5k MRR and 101 for $10k. Distribution: Shopify App Store (B2B merchants), wholesale communities, sales-tax accountants. Audits are rare, so urgency is episodic; the checkout capture and renewal calendar are what keep it in use.

### Where AI is used
OCR and field validation of certificates against each state's form rules (ID formats, exemption reasons, signatures), expiry calendars per state, drafting request and renewal campaigns, drop-ship exemption logic, audit-pack assembly. Good fit.

### MVP
- **Doing:** certificate capture by link and Shopify checkout, OCR validation per state, expiry tracking, renewal campaigns, customer exemption status synced to Shopify and Stripe, audit pack export.
- **Not doing:** tax calculation and filing, Avalara integration at launch.
- **Effort:** 6 weeks.
- **Dependencies:** a 51-jurisdiction rule matrix, state permit lookups (mostly web, few APIs), Shopify and Stripe APIs, e-sign.
- **Hardest part:** the filing platforms give certificates away.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **18/30**. A real, well-priced niche being absorbed as a free feature by funded filing tools. Viable only as a Shopify B2B app.

---

## 32. State privacy-law compliance for small businesses

**One-liner.** Scan a site's tags and SaaS stack, generate the notices each of the 24 state laws requires, verify that the Global Privacy Control signal is honoured, run the consumer-request portal, and keep the data-broker registration calendar, priced for the marketing lead of a mid-size business.

### Problem statement
Twenty comprehensive state privacy laws were in force by January 2026 (Indiana, Kentucky and Rhode Island joined that day) and four more were enacted in 2026, with thresholds as low as 35,000 consumers in Rhode Island and Connecticut. California's regulator has escalated: Honda $632,500, Todd Snyder $345,178, Tractor Supply $1.35 million, a data-broker sweep under the Delete Act, and the first combined CCPA and Delete Act action in August 2026; California's regulations on risk assessments, cybersecurity audits and automated decision-making took effect 1 January 2026 with phased deadlines to 2030. The tools are cookie-banner-first and cheap (Termly $10–20, Enzuzo $7–79, CookieYes $10–55, Osano $199) with thin coverage of state-specific notices, opt-out signal verification and data-broker calendars; wiretap class actions over pixels and chat widgets hit businesses of any size.

### Who experiences the problem
Legally, businesses above the 35,000–100,000 consumer thresholds; practically, any US site facing pixel litigation or platform consent requirements. The buyer is the marketing lead or founder; the user is the web developer.

### Value of solving it
Avoiding five-figure wiretap settlements and six-figure regulator fines, replacing $2–5k policy drafting, unblocking ad-platform features that require consent signals.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Termly | $10–$20/mo | Banner-first |
| Enzuzo | $7–$79/mo | Closest SMB bundle |
| CookieYes, Secure Privacy, Usercentrics, iubenda | $5–$249/mo | Consent tools |
| Osano | $199/mo with a fines guarantee | Mid-market |
| OneTrust, Transcend, DataGrail, Ketch | Quote | Enterprise |

### Pricing model
$39/mo per domain with state notices and GPC verification, $99/mo with the request portal and broker calendar.

### Path to profitability
At $39 ARPU you need 128 customers for $5k MRR and 256 for $10k, in a crowded $7–60 band where every tool bundles everything. Content maintenance across 24 states is a treadmill. Ceiling low.

### Where AI is used
Mapping tags and SaaS tools to data flows, drafting state-specific notices, synthetic-browser verification that opt-out signals are honoured, request drafting, registration reminders. Useful; "AI privacy officer" sign-off is the gimmick.

### MVP
- **Doing / not doing:** not recommended standalone; the opt-out verification and pixel-risk scan could be a feature of idea 30's crawler.
- **Effort:** 6 weeks.
- **Dependencies:** Playwright scanner, consent script, state-law matrix, Shopify and WordPress distribution.
- **Hardest part:** crowded, cheap, and most SMBs sit below the thresholds.

### Score and verdict
Pain 3 · Solo 4 · AI 4 · Gap 2 · WTP 2 · Reach 3 = **18/30**. A live and growing regime served by a crowd of $7–60 tools. Skip as a standalone.

---

## 33. Vendor contract and SaaS renewal tracker with AI clause extraction

**One-liner.** Forward every vendor contract and invoice to one inbox; the tool extracts renewal date, term, notice period, auto-renewal, price escalators and seat counts, warns before the notice window closes, shows spend by vendor from QuickBooks, and cites the state auto-renewal right that applies to each subscription.

### Problem statement
Companies average 305 SaaS applications and auto-renewals with 30–90 day notice periods are where money leaks. Federal protection is absent: the FTC's click-to-cancel rule was vacated by the Eighth Circuit on 8 July 2025 and rulemaking restarted in 2026, so a patchwork of state auto-renewal laws governs (California's amended law from July 2025, New York from November 2025, Colorado from February 2026 with penalties to $20,000 per violation). The category is consolidating upward (Vendr into Vertice, Trelica into 1Password; procurement platforms from $3,083 a month) and commoditising downward: Ramp's free tier now includes automated vendor tracking and contract extraction, and its $15 per user plan adds AI compliance reviews. The SMB survivors (Cledara £100, Substly from $105) prove a sub-$300 market; the contract-lifecycle tools start at $499.

### Who experiences the problem
US firms of 20–250 employees without a procurement function (561,160 firms with 20–99 employees). The buyer is the finance lead or COO; users are finance and the IT admin.

### Value of solving it
Catching renewals before notice windows close, cutting unused seats; 10% of a $1–3k per employee software bill is $10–30k a year for a 100-person firm.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Ramp | Free vendor tracking and contract extraction; Plus $15 per user | Sees card spend, not ACH and invoice contracts |
| Cledara, Substly | £100/mo; from $105/mo | Card-led; no QuickBooks depth |
| Concord, ContractSafe, Juro | $499–$1,299/mo; quote | CLM price |
| Tropic, Sastrify, Vertice, Zluri, Torii, Zylo | $3k/mo; €12.5k+/yr; quote | Enterprise |

### Pricing model
$79/mo for 50 contracts, $199/mo for 200, unlimited users, annual prepay.

### Path to profitability
At $120 ARPU you need 42 customers for $5k MRR and 84 for $10k. Costs: extraction is cents per contract. Distribution: accountants and fractional CFOs (they see the invoices), the QuickBooks app store, Slack integration. The defensible slot is integration depth (QuickBooks plus email plus contracts) for firms that pay vendors by ACH and invoice, which Ramp's card-based view misses; the risk is episodic pain and Ramp's free tier.

### Where AI is used
- **In the product:** extracting terms from contract PDFs and renewal emails, parsing invoices into spend by vendor, drafting cancellation and negotiation emails, matching each subscription to the customer's state cancellation rights. Cheap, reliable, and the whole wedge; autonomous negotiation is a gimmick.
- **To build it:** email ingestion (Gmail and Microsoft 365), QuickBooks Online, Slack and calendar alerts, structured extraction. Entirely standard.

### MVP
- **Doing:** upload and email-forward intake, AI extraction with confirm, renewal calendar with notice-window alerts, QuickBooks spend by vendor, vendor list with owner, state auto-renewal rights lookup, Slack and email digests.
- **Not doing:** app discovery via SSO logs (v2), procurement workflows, negotiation services, cards.
- **Effort:** 5 weeks.
- **Dependencies:** Gmail and Microsoft 365 APIs, QuickBooks Online API, LLM.
- **Hardest part:** Ramp giving it away, and episodic pain.

### Score and verdict
Pain 3 · Solo 4 · AI 5 · Gap 2 · WTP 3 · Reach 3 = **20/30**. The clearest AI-extraction product in the chapter, now facing a free tier from a well-funded card company. Still a good, fast first product for the ACH-and-invoice segment.

---

## 34. Employee handbook and policy generator with acknowledgement tracking (50 states)

**One-liner.** Answer a questionnaire about your company; get an attorney-reviewed handbook and the state-specific policies (paid sick leave in 18 states, pay-transparency, harassment training, lawful work rules after the NLRB's 2023 standard), with e-signed acknowledgements, versioning and alerts when a state law changes.

### Problem statement
Handbook law churns: the NLRB's Stericycle decision (August 2023) made work rules presumptively unlawful if they could chill organising, forcing rewrites; 18 states plus DC have paid-sick-time laws (Alaska and Nebraska joined in 2025); pay-range posting laws reached Illinois, Minnesota, New Jersey, Vermont and Massachusetts in 2025 with Virginia in July 2026 and Delaware in 2027; California, New York, Illinois, Connecticut, Delaware and Maine mandate harassment training. Dedicated handbook tools cost $999–4,188 a year (AirMason, Blissbook) or are quote-based (SixFifty, Mineral through payroll partners); payroll suites include e-signing but generic content; nobody sells a $29–79 a month 50-state generator with change alerts to firms under 20 employees.

### Who experiences the problem
Employers with 5–99 employees and no HR function: about 1.03 million US firms with 5–9 employees, 657,000 with 10–19, 561,160 with 20–99. The buyer is the founder, office manager or bookkeeper; the users are employees acknowledging.

### Value of solving it
Avoided wrongful-termination and wage-claim exposure where policies are missing, evidence of acknowledgement in disputes, replacement of $1.5–5k attorney-drafted handbooks.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| AirMason, Blissbook | $999–$4,188/yr | Price |
| SixFifty | Quote by employees and states; AI drafting | Mid-market |
| Mineral (via payroll and PEO partners), SHRM builder | Quote; about $400/yr | Content, dated delivery |
| Bambee | $99–$1,299/mo with a dedicated HR manager | Service |
| BambooHR, Rippling, Gusto, Paychex, ADP | E-sign bundled; generic content | No state-specific drafting |
| Trainual | Hidden | Process docs, not law |

### Pricing model
$49/mo to 25 employees, $99/mo to 100, annual; includes the legal-change feed.

### Path to profitability
At $79 ARPU you need 63 firms for $5k MRR and 127 for $10k. The moat and the cost are the same: an attorney partner who reviews templates and the change feed for 50 states. Distribution: bookkeepers and accountants, payroll app marketplaces (Gusto, QuickBooks), state small-business associations, and bundling with idea 27 for the same buyer.

### Where AI is used
Drafting state-specific policies from the questionnaire, diffing existing handbooks against the change feed, employee Q&A over the handbook. The LLM drafts; attorney-reviewed templates are the product. Anything that starts evaluating employees drifts toward state automated-decision laws (Colorado from January 2027, Illinois from January 2026) and should be avoided.

### MVP
- **Doing:** questionnaire, template library for the 15 largest states reviewed by a partner attorney, AI tailoring, e-sign acknowledgement, versioning, change alerts, Gusto and QuickBooks payroll sync for the employee list.
- **Not doing:** HRIS features, payroll, the remaining states until v2, legal advice.
- **Effort:** 6 weeks plus the legal partnership.
- **Dependencies:** attorney partner, e-sign, payroll APIs, LLM.
- **Hardest part:** the 50-state content treadmill and payroll bundling.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **19/30**. An empty sub-$100 band with 2.2 million reachable firms, a real legal treadmill, and a natural bundle with 27 and 29. Good with a lawyer partner.

---

## 35. Business licence and permit renewal tracker for multi-location businesses and franchises

**One-liner.** A per-location vault and calendar for business licences, health, alcohol, signage and fire permits across 91,438 local governments, with renewal notices extracted from email, new-location requirement research with citations, and a franchisor roll-up, at a per-location price the incumbents do not offer.

### Problem statement
A typical retail or restaurant location holds half a dozen licences and permits with different renewal cadences across 91,438 US local governments (40,199 special districts among them); Avalara maintains licence data across 23,000+ jurisdictions and bought the category leader in 2020. The incumbents (Avalara, Harbor Compliance, CT Corporation, CSC) are quote-only and sell managed filing to enterprise finance teams; the only transparent price is Certemy's per-person credential tracking at $2.40–6 a month. Franchising adds about 12,000 units a year (845,000 establishments forecast for 2026), and franchisors want visibility across units. No penalty statistics exist; the pain is closure orders, late fees and repeated research.

### Who experiences the problem
Multi-location operators (restaurants, gyms, clinics, salons, auto services) and franchisees and franchisors. The buyer is the franchisor compliance lead, multi-unit owner or the CFO of a 5–100 location chain; the user is the operations manager keeping the spreadsheet.

### Value of solving it
Avoided closure orders and late penalties, avoided $500–2,000 per location of filing-service fees (unverified), franchisor visibility.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Avalara License Management | Quote; enterprise | Data moat, enterprise pricing |
| Harbor Compliance, CT Corporation, CSC, LicenseLogix | Quote; managed services | Enterprise |
| Certemy | $2.40–$6 per person/mo | Credentials, not permits |
| FranConnect | Quote | Franchise ops suite |
| Spreadsheets | Free | The real incumbent |

### Pricing model
$15 per location per month with a $49 minimum; franchisor roll-up at $499/mo.

### Path to profitability
At $149 ARPU (a ten-location operator) you need 34 customers for $5k MRR and 67 for $10k. The requirements database is the moat and the cost; start with a vault and calendar (which needs no database) and add researched requirements for the 50 states and 100 largest cities over time. Distribution: franchise associations and consultants, multi-unit restaurant groups, the FranConnect ecosystem.

### Where AI is used
Extracting licence numbers and dates from PDFs and renewal emails, researching requirements for a new location from official sites with citations and human review, pre-filling renewal forms, explaining what a new unit needs. "Autonomous filing across 91,000 jurisdictions" is the gimmick.

### MVP
- **Doing:** per-location licence vault, renewal calendar with email-ingested notices, document extraction, franchisor dashboard, seed requirements database for 50 states plus federal (FDA food facility, alcohol, transport).
- **Not doing:** filing on the customer's behalf, city-level requirements beyond the top 100 at launch.
- **Effort:** 6 weeks.
- **Dependencies:** email ingestion, calendar APIs, LLM, a maintained requirements table.
- **Hardest part:** tracking-only willingness to pay and the incumbents' data moat.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **19/30**. A transparent per-location SaaS is unproven in a category served by managed services; the franchise channel and the email-extraction wedge make it worth a test.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 26 | Product compliance screening (Prop 65, MoCRA, PFAS) | **21** | 99 | 101 | 7 |
| 27 | Written security plan for tax preparers (IRS/FTC Safeguards) | **21** | 29 | 345 | 4 |
| 30 | Accessibility monitor with fix PRs | **21** | 99 | 101 | 7 |
| 28 | CMMC readiness for small defense subcontractors | **20** | 199 | 50 | 8 |
| 33 | Vendor contract and renewal tracker | **20** | 120 | 84 | 5 |
| 29 | HIPAA Security Rule kit | **19** | 79 | 127 | 7 |
| 34 | 50-state employee handbook generator | **19** | 79 | 127 | 6 |
| 35 | Business licence and permit tracker | **19** | 149 | 67 | 6 |
| 31 | Sales-tax exemption certificates | **18** | 99 | 101 | 6 |
| 32 | State privacy-law compliance | **18** | 39 | 256 | 6 |

## Sources
- https://www.sidley.com/en/insights/newsupdates/2025/02/new-changes-to-californias-proposition-65-shortform-warning-labels
- https://www.intertek.com/products-retail/insight-bulletins/2024/u.s.-california-proposition-65-oehha-amendments-to-short-form-warning-regulations
- https://www.intertek.com/products-retail/insight-bulletins/2025/1487-june-2025-california-proposition-65-analysis/
- https://www.prop65clearinghouse.com/
- https://apify.com/malekh/prop-65-60-day-notice-settlement-benchmark
- https://oag.ca.gov/prop65
- https://www.fda.gov/cosmetics/registration-listing-cosmetic-product-facilities-and-products
- https://www.registrarcorp.com/blog/cosmetics/mocra/mocra-exemptions/
- https://www.cpsc.gov/Business--Manufacturing/Testing-Certification/Childrens-Product-Certificate-CPC
- https://www.fredlaw.com/alert-minnesota-set-to-implement-nations-most-extensive-pfas-product-ban
- https://pfas.pillsburylaw.com/minnesota-pfas-reporting-requirements-delayed/
- https://www.compliancegate.com/product-compliance-software/
- https://sustalium.com/blog/prop-65-compliance-software-california-warnings/
- https://www.certivo.com/pricing
- https://www.ftc.gov/business-guidance/resources/ftc-safeguards-rule-what-your-business-needs-know
- https://www.irs.gov/pub/irs-pdf/p5708.pdf
- https://www.irs.gov/tax-professionals/return-preparer-office-federal-tax-return-preparer-statistics
- https://accountants.intuit.com/taxprocenter/practice-management/completing-your-wisp-for-ptin-renewal/
- https://verito.com/pricing/
- https://www.rightworks.com/plans/cloud-plans-accounting-firms/
- https://www.complyauto.com/
- https://www.nada.org/nada/nada-data
- https://www.govinfo.gov/content/pkg/FR-2024-10-15/html/2024-22905.htm
- https://www.govinfo.gov/content/pkg/FR-2025-09-10/html/2025-17359.htm
- https://www.wiley.law/alert-DOD-Issues-Final-DFARS-Rule-for-Cybersecurity-Maturity-Model-Certification-Program
- https://defensescoop.com/2023/12/28/cmmc-implementation-cost-estimates/
- https://www.cmmcoperator.com/cmmc-key-dates/
- https://www.futurefeed.co/pricing
- https://www.preveil.com/pricing/
- https://secureframe.com/pricing
- https://www.federalregister.gov/documents/2025/01/06/2024-30983/hipaa-security-rule-to-strengthen-the-cybersecurity-of-electronic-protected-health-information
- https://www.alston.com/en/insights/publications/2025/01/new-year-new-hipaa-security-rule
- https://www.hipaajournal.com/hipaa-security-rule-update-postponed/
- https://www.mcdonaldhopkins.com/insights/news/ocr-announces-risk-analysis-initiative-enforcement-actions
- https://www.nixonpeabody.com/insights/articles/2026/04/30/ransomware-enforcement-update-19-investigations-completed-by-ocr-four-settlements-added
- https://www.accountablehq.com/pricing
- https://abyde.com/pricing/
- https://www.adatitleiii.com/2026/02/ada-title-iii-federal-lawsuit-filings-fall-slightly-to-8667-in-2025/
- https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/
- https://info.usablenet.com/2025-year-end-report-on-web-accessibility-lawsuits
- https://www.ada.gov/resources/2024-03-08-web-rule/
- https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web
- https://www.jacksonlewis.com/insights/doj-extends-public-entities-compliance-deadline-ada-related-website-accessibility-hhss-may-2026-deadline-still-looms
- https://webaim.org/projects/million/
- https://accessibe.com/pricing
- https://equally.ai/pricing
- https://equalizedigital.com/accessibility-checker/pricing/
- https://pope.tech/pricing
- https://www.mtc.gov/resources/uniform-sales-use-tax-exemption-certificate/
- https://www.galvix.com/article/sales-tax-exemption-certificate-guide/
- https://sales.tax/expert-articles/exemption-certificate-management-what-auditors-actually-look-for/
- https://www.exemptax.com/pricing
- https://www.numeral.com/pricing
- https://www.taxjar.com/pricing
- https://taxcloud.com/pricing/
- https://www.avalara.com/us/en/products/exemption-certificate-management-essentials.html
- https://www.clym.io/blog/us-privacy-law-comparison-map
- https://www.multistate.us/insider/2026/2/4/all-of-the-comprehensive-privacy-laws-that-take-effect-in-2026
- https://www.bytebacklaw.com/2026/06/u-s-state-privacy-law-landscape-expands-to-24-states-what-the-latest-legislative-wave-means-for-businesses/
- https://cppa.ca.gov/announcements/
- https://www.hklaw.com/en/insights/publications/2025/10/california-privacy-protection-agency-fines-tractor-supply
- https://cppa.ca.gov/regulations/ccpa_updates.html
- https://termly.io/pricing/
- https://www.enzuzo.com/pricing
- https://www.cookieyes.com/pricing/
- https://www.osano.com/plans/cookie-consent
- https://zylo.com/saas-management-index/
- https://www.sidley.com/en/insights/newsupdates/2025/07/us-ftc-click-to-cancel-rule-struck-down
- https://www.crowell.com/en/insights/client-alerts/clicking-all-the-right-boxes-ftc-moves-to-revive-click-to-cancel-rule-following-eighth-circuit-vacatur
- https://www.cooley.com/news/insight/2025/2025-06-04-california-automatic-renewal-law-amendments-take-effect-on-july-1-2025
- https://churnkey.co/guides/state-automatic-renewal-laws
- https://ramp.com/pricing
- https://www.cledara.com/pricing
- https://www.substly.com/pricing
- https://www.concord.app/pricing
- https://www.nlrb.gov/news-outreach/news-story/board-adopts-new-standard-for-assessing-lawfulness-of-work-rules
- https://www.abetterbalance.org/paid-sick-time-laws/
- https://www.govdocs.com/pay-transparency-laws/
- https://www.sixfifty.com/resource-library/pay-transparency-laws-by-state/
- https://www.airmason.com/pricing
- https://blissbook.com/pricing
- https://www.bamboohr.com/pricing
- https://www.census.gov/content/dam/Census/library/publications/2025/econ/govtorg2225.pdf
- https://www.franchise.org/2026/02/ifa-predicts-steady-growth-for-franchising-in-2026-economic-outlook/
- https://www.avalara.com/us/en/products/business-licenses.html
- https://www.harborcompliance.com/license-manager-software
- https://www.certemy.com/pricing/
- https://www2.census.gov/programs-surveys/susb/tables/2022/us_state_naics_detailedsizes_2022.txt
