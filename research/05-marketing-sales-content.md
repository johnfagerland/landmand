# 05 — Marketing, sales & content (ideas 36–43)

Eight ideas where the buyer is a marketer, founder or owner trying to win customers. These categories have the most public founder revenue (Senja at about $1M ARR, Testimonial.to at $2.4M, Swapstack at $25k a month before its exit), which proves demand and also proves the categories are crowded. What changed with a US lens: the FTC's Consumer Reviews and Testimonials Rule (in force since 21 October 2024, up to $53,088 per violation, first enforcement in December 2025 aimed at local service businesses) creates a compliance angle for review and testimonial tools; state cottage-food laws expanded sharply in 2025–26; and bilingual AI answering turned out to be a $25–49 checkbox rather than a moat.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 36. Google Business Profile automation for multi-location businesses and agencies

**One-liner.** One inbox for reviews across all locations with AI-drafted replies in the reviewer's language, scheduled posts, weekly performance digests, and a compliance guard that keeps review requests inside the FTC rule, priced per location for franchises and agencies.

### Problem statement
Local businesses live and die by their Google profile, and franchise marketers and agencies manage dozens of them by hand. The platform is hostile to builders: Google discontinued the Business Profile Q&A API on 3 November 2025 with six weeks' notice, new API projects start with zero quota until a manual approval that takes four days to six weeks, and per-profile edit quotas "cannot be increased". What still works is the Reviews API (list and reply), Local Posts, Performance and Notifications. A new legal driver arrived with the FTC's Consumer Reviews and Testimonials Rule: its first enforcement step in December 2025 was ten warning letters to local businesses (property managers, personal-injury firms, an accountant) for lease discounts and gift cards tied to positive reviews, which is exactly the flow review-request tools automate. The incumbents have gaps: Merchynt's AI agent at about $99 per profile draws complaints of bugs and ghosted support; Birdeye locks customers into 12-month contracts with an 8% renewal fee.

### Who experiences the problem
832,521 US franchise establishments in 2025 (845,000 forecast for 2026), about 11,500 advertising agencies, and multi-location dental, veterinary, HVAC and restaurant groups. The buyer is the franchise marketing manager, multi-unit owner or agency; the franchisor's approved-vendor list is the channel.

### Value of solving it
Visible in what people pay ($8–449 per location per month) rather than in sourced hour savings; avoided FTC exposure is now nominally $53,088 per violation, though no small business has yet been fined under the rule.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Birdeye | Reputation suite | $299–$449+ per location/mo, annual | Contracts, renewal fee |
| Synup | Listings, reviews, AI agents | $18–$49 per location/mo | Credit gating |
| LocalClarity | Reviews inbox with AI replies | $8–$20 per location/mo | Google-only tier limited |
| Localo | Single-business local SEO | $39–$169/mo | Seat caps for agencies |
| Merchynt Paige | AI agent that posts and replies | About $99 per profile/mo | Bugs, billing, support complaints |
| BrightLocal, Yext, Uberall, SOCi, Podium | Rank tracking and enterprise listings | Quote or on request | Sales-led |

### Pricing model
Per location per month, $9 for the first ten locations and $6 beyond, sold to franchisors and agencies with white-label reports.

### Path to profitability
At $60 ARPU (an agency or franchisee with ten locations) you need 84 customers for $5k MRR and 167 for $10k. Costs are low; the API is free once approved. The real risk is the platform: quota and access policies change with weeks of notice and Google discourages exactly this business model. Distribution: franchisor vendor programmes, local-marketing agencies, dental and vet groups.

### Where AI is used
Review-reply drafting in the reviewer's language (Spanish matters in Sun Belt markets), sentiment and topic classification, weekly digests, and a compliance guard that blocks sentiment-conditioned review requests and flags insider reviewers. Auto-generated posts are spam risk; rank tracking is not an AI problem.

### MVP
- **Doing:** OAuth connect, multi-location review inbox, AI reply drafts with one-click approve, scheduled posts, weekly digest, agency workspace, FTC-compliant review-request templates with a consent and incentive log.
- **Not doing:** Q&A (impossible), rank tracking, listings sync to other directories, Yelp and Facebook at launch.
- **Effort:** 5 weeks plus the API approval wait.
- **Dependencies:** Google Cloud project, OAuth, Basic API Access approval, Reviews and Local Posts APIs, Pub/Sub, A2P 10DLC registration for SMS requests.
- **Hardest part:** getting and keeping API access as a multi-tenant SaaS.

### Score and verdict
Pain 3 · Solo 2 · AI 4 · Gap 2 · WTP 3 · Reach 3 = **17/30**. A validated market on a platform that does not want you there. Skip unless you already hold API access.

---

## 37. Testimonial capture, case-study generation and FTC-compliant social proof

**One-liner.** Collect video and text testimonials with one link, turn transcripts into case studies, and publish a wall of proof that records consent, discloses incentives and flags insiders and atypical claims, so the page survives the FTC rule.

### Problem statement
Social proof sells, and the category has two public indie successes (Senja at about $1M ARR by November 2025 with two founders; Testimonial.to at $100k ARR nine months after launch). The FTC's Consumer Reviews and Testimonials Rule (16 CFR Part 465, effective 21 October 2024) now bans fake or AI-generated testimonials, incentives conditioned on sentiment, undisclosed insider testimonials and review suppression, and it explicitly covers testimonials on a company's own website. Penalties reach $53,088 per violation; TruHeight took a $4 million judgment in April 2026 for employee-written reviews and free products for five stars, and a home-services firm was sued in May 2026. The Endorsement Guides add that atypical-results testimonials must disclose typical results. Every incumbent ships AI case-study generation; none found on pricing pages markets rule-compliance features (consent capture, material-connection disclosure, insider flagging).

### Who experiences the problem
SaaS founders, agencies, coaches, B2B marketers, and now the local-service businesses the FTC targeted first (property management, law, accounting, home services). Segment size not found; the buyer is the marketer.

### Value of solving it
Conversion lift (unquantified), high margins (Testimonial.to's infrastructure was 15–20% of revenue), and one avoided violation at $53,088 nominal exposure.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Senja | Free (15); $29–$59/mo | Owns the low end and SEO |
| Testimonial.to | Free (2 videos); $25–$95/mo per space | Per-space pricing |
| Famewall | $12–$125/mo | Video limits |
| Vocal Video | $99–$249/mo | Hours metering |
| Trustmary, Endorsal, Shoutout | $15–$463/mo; lifetime deals | Undercutting |

### Pricing model
Freemium plus $29–$79 flat; the compliance features sit in the paid tiers.

### Path to profitability
At $35 ARPU you need 143 customers for $5k MRR and 286 for $10k, against eight funded or profitable incumbents that own the search results. The compliance angle is copyable in a sprint, so the durable wedge is a vertical (the FTC's own target list) and the case-study output.

### Where AI is used
Transcript to case study with an approval trail, captions and English-Spanish translation, highlight clipping, and atypical-claim detection that prompts for a typical-results disclosure. AI-written testimonials are a violation, not a feature.

### MVP
- **Doing:** collection link with browser recording, transcription, AI case-study draft, consent and material-connection capture per testimonial, insider flag, embeddable wall with disclosure stamps and schema markup.
- **Not doing:** review-site imports at launch, video editing.
- **Effort:** 4 weeks.
- **Dependencies:** MediaRecorder, video hosting (Mux; the dominant cost), speech-to-text, LLM, widget.
- **Hardest part:** distribution against incumbents.

### Score and verdict
Pain 3 · Solo 5 · AI 3 · Gap 2 · WTP 2 · Reach 4 = **19/30**. Proven demand, saturated supply, plus a real 2024–26 compliance driver nobody has productised. Viable as a vertical play; not a general one.

---

## 38. Competitor pricing-page and feature-change monitor with structured AI diffs

**One-liner.** Track competitors' pricing pages, changelogs and app-store listings; get a weekly digest of what changed as structured pricing tables and feature diffs, priced per competitor.

### Problem statement
Enterprise competitive-intelligence suites cost $15–100k a year and are sales-led (Klue, Crayon, which raised prices about 15% in 2026; Kompyte inside Semrush, now Adobe's). Generic change monitors are cheap and now include AI summaries (Visualping from $14) but have no notion of "competitor", "plan" or "price". Nothing sits between roughly $350 a month of page monitoring and $15k a year of suites that outputs structured diffs for a small SaaS marketing team.

### Who experiences the problem
Product marketers and founders at 20–500-person SaaS companies, agencies. Count not found.

### Value of solving it
Replaces the weekly analyst sweep; vendors themselves note the analyst's salary exceeds the licence.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Visualping | Free; $14–$350/mo; AI summaries on all plans | Page-centric |
| Distill.io, ChangeTower, changedetection.io | $9–$80/mo | No competitor model |
| Competitors.app | $15–$40/mo with AI reports | Thin |
| Fluxguard | About $100–$550/mo | Pricey per site |
| Klue, Crayon, Kompyte | $10–100k/yr | Enterprise, sales-led |

### Pricing model
Per competitor tracked: $49/mo for 5 competitors, $149/mo for 20.

### Path to profitability
At $60 ARPU you need 84 customers for $5k MRR and 167 for $10k. Costs: headless-browser time and proxies (the real cost), LLM extraction (cents). Distribution: SEO, product-marketing communities, Slack integration, Product Hunt. Churn risk when the competitor set is stable.

### Where AI is used
Extracting pricing tables to structured JSON and diffing them, classifying importance, drafting the digest and battlecard updates with citations. Good fit for structured extraction.

### MVP
- **Doing:** competitor profiles, pricing page and changelog tracking, structured extraction and diff, importance classification, weekly email and Slack digest.
- **Not doing:** app-store and social tracking (v2), battlecards, win-loss.
- **Effort:** 5 weeks.
- **Dependencies:** Playwright, proxy service, LLM, Slack API.
- **Hardest part:** scraping reliability and target-site terms of service.

### Score and verdict
Pain 2 · Solo 4 · AI 4 · Gap 3 · WTP 3 · Reach 3 = **19/30**. A clear price gap and a structured-extraction product that works today; nice-to-have pain caps the ceiling.

---

## 39. Newsletter sponsorship operations for independent newsletters

**One-liner.** Sponsor CRM, slot calendar, insertion orders, creative approval, click tracking and reporting for newsletters that sell their own ads, without a marketplace commission.

### Problem statement
Newsletter advertising adoption rose from 15% in 2019 to 77% in 2025 and sponsorships now exceed paid subscriptions as the dominant model. Marketplaces take large cuts (Paved 30–50%, Passionfroot 15%), so a creator closing $15k a month in direct deals pays about $750 a month to Passionfroot versus $79–109 for a flat tool like Sponsy. Swapstack reached $25k a month in revenue with 2,500 newsletters before selling to beehiiv in 2023; beehiiv now pays over $1M a month to publishers and bundles direct sponsorships at $10 per placement, the bundling threat. Sponsored placements are endorsements under the FTC's Endorsement Guides and need clear labelling.

### Who experiences the problem
Independent newsletters with 5,000–100,000 subscribers; beehiiv alone has about 20,000 active publishers, only 20–25% of whom monetise. The buyer is the operator, usually solo.

### Value of solving it
CPMs of $30–150; fee avoidance versus marketplaces of hundreds of dollars a month.

### Main competitors
| Product | Model | Gap |
|---|---|---|
| Paved | 30–50% commission | High take |
| Passionfroot | 5–15% commission | Scales badly |
| Sponsy | $79–$109/mo flat | Ad-count caps |
| SponsorGap | $39–$199/mo | Lead database only |
| beehiiv Direct Sponsorships | $10 per placement | Platform-locked |
| SparkLoop, Letterwell, Who Sponsors Stuff | Growth, marketplace, sales data | Different jobs |

### Pricing model
Flat $49–$99/mo by active sponsors, no commission.

### Path to profitability
At $75 ARPU you need 67 newsletters for $5k MRR and 133 for $10k. Newsletters are unusually findable. Risk: beehiiv keeps bundling and Substack has no API. Ceiling around $10k MRR.

### Where AI is used
Drafting outreach and proposals from past performance, parsing insertion orders and creatives from email threads, auto media kits, post-campaign reports. Useful; "AI sponsor matching" without a demand side is a gimmick.

### MVP
- **Doing:** sponsor CRM, slot calendar per issue, proposal and insertion-order PDF, Stripe invoicing, tracking links, sponsor portal for creative approval with an FTC-compliant "Sponsored" label, campaign report.
- **Not doing:** marketplace, ad network, ESP-specific insertion automation at launch.
- **Effort:** 5 weeks.
- **Dependencies:** beehiiv and Kit APIs, Stripe invoicing with Stripe Tax, redirect tracking.
- **Hardest part:** beehiiv bundling.

### Score and verdict
Pain 3 · Solo 4 · AI 3 · Gap 2 · WTP 3 · Reach 4 = **19/30**. A proven niche with a modest ceiling and a platform that wants it.

---

## 40. Recipe costing, batch tracking and label compliance for small food producers and cottage-food businesses

**One-liner.** Enter recipes once; the tool costs them, tracks batches and lots, generates an FDA-format Nutrition Facts panel and allergen statement when required, and prints the exact state-specific cottage-food label with the mandated disclaimer, so a home baker or micro-manufacturer never reprints or pays a lab.

### Problem statement
Packaged food needs a Nutrition Facts panel unless the maker qualifies for the small-business exemption (under 10 employees and 10,000 units needs no filing; the larger tier must file an annual notice), and any claim such as "high protein" or "keto" voids the exemption, at which point a lab panel costs $800–2,000 per product. The nine major allergens (sesame since January 2023 under the FASTER Act) must be declared by everyone, exempt or not. Cottage-food law exists in all 50 states and 2025–26 was the largest expansion year on record: Texas tripled its cap to $150,000 and legalised refrigerated foods (September 2025), Michigan doubled to $50,000 with online sales (March 2026), Nevada went to $100,000, North Dakota allowed out-of-state sales, while labels remain state-specific with verbatim disclaimers. The label tools (ReciPal at $29 per label or $59 a month, Food Label Maker at $49–199) do FDA formats but not state rules; the home-baker apps (Bakesy at $9.99) do orders, not compliance; the marketplace model failed (Castiron raised $6 million, was acquired in November 2024 and wound down).

### Who experiences the problem
43,277 US food-manufacturing establishments, plus an uncounted population of cottage-food operators (no national registry; the only national dataset is a 775-producer survey). The buyer is the owner-operator: home baker, jam or sauce maker, microbakery, craft chocolatier; shared-kitchen operators are a second buyer.

### Value of solving it
$800–2,000 per SKU of avoided lab cost when the exemption does not apply, avoided reprints, and cap tracking (a producer crossing $150,000 in Texas or $78,000 in Minnesota loses cottage status).

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| ReciPal | $29 per label; $59–$129/mo | FDA formats only, no state rules |
| Food Label Maker | $49–$199/mo | Same |
| LabelCalc (Datacor), Genesis R&D (Trustwell) | Ambiguous; quote, multi-thousand seats | Mid-market and enterprise |
| Recipe Cost Calculator | $24/mo plus $12.50 labels add-on | Costing first |
| Stocksmith (ex-Craftybase), Katana | $49–$349/mo; from $299 | Inventory first |
| Bakesy, Hotplate | $9.99–$17.99/mo; transaction fees | Orders, not compliance |
| Castiron (now Nourysh) | Wound down | Marketplace model failed |

### Pricing model
$19 a month for cottage operators (costing, allergens, state label), $59 a month for small manufacturers (Nutrition Facts, batches and lots, claims checker).

### Path to profitability
At $40 blended ARPU you need 125 producers for $5k MRR and 250 for $10k. Distribution: state cottage-food Facebook groups (very large), farmers'-market associations, shared kitchens and incubators, extension services. Steady rather than fast; the 50-state rules table is both the moat and the maintenance cost (5–10 states change each session).

### Where AI is used
- **In the product:** extracting ingredients and prices from supplier invoices and spec sheets, allergen detection including hidden sources (lecithin to soy, "natural flavours"), the state rules engine emitting the exact disclaimer and address or registration format, and a claims detector that warns when "high protein" would void the exemption. Nutrient math and FDA rounding are deterministic, not AI.
- **To build it:** recipe and batch ledger are standard; the label renderer and state table need careful reading of the rules, which the agent can draft and a food-safety consultant should check.

### MVP
- **Doing:** ingredient library linked to USDA FoodData Central, recipe costing, allergen statement, FDA Nutrition Facts renderer with rounding rules and the exemption checker, 50-state cottage label generator with cap tracking, batch and lot log.
- **Not doing:** HACCP plans, inventory purchasing, e-commerce, front-of-package labels until the FDA rule is final.
- **Effort:** 7 weeks.
- **Dependencies:** USDA FoodData Central API (free), FDA label rules, a maintained state-law table, invoice OCR, label-printer formats, errors-and-omissions cover.
- **Hardest part:** low willingness to pay at the cottage end, where $9.99 is the anchor.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 2 · Reach 3 = **18/30**. A genuine gap (nobody does state cottage rules) in a large, friendly, uncounted community with a lab-cost price umbrella. Small money per customer, low churn, a clear path.

---

## 41. Programmatic SEO page factory for niche directories and comparison sites

**One-liner.** Turn a dataset into thousands of indexable pages with unique structured data, schema markup, sitemaps and index monitoring.

### Problem statement
Directories still make money (OpenAlternative did $57k in 2025 and $6k MRR by December; a directory boilerplate sold $22k), but Google's spam policy on "scaled content abuse" explicitly targets AI-generated pages "without adding value", with enforcement updates in August 2025 and March 2026. The Indexing API cannot be used for directory pages, and Webflow's 2026 repricing removed the CMS-limit bottleneck. The tool market is credit-metered (SEOmatic $99–699).

### Who experiences the problem
Indie makers, SaaS content teams, agencies. Count not found.

### Value of solving it
Speed to launch and staying indexed under enforcement.

### Main competitors
| Product | Published pricing |
|---|---|
| SEOmatic | Free; $99–$699/mo by pages |
| Byword | $99–$999/mo by articles |
| Whalesync | $40/mo by records |
| AirOps | Usage-based |
| Webflow, Framer CMS plus boilerplates | $25–$39/mo |

### Pricing model
$29–$99/mo by pages.

### Path to profitability
At $80 ARPU you need 63 customers for $5k MRR, but the customer base is indie makers with low willingness to pay and the product's reputation depends on Google not zeroing their traffic.

### Where AI is used
Entity extraction and enrichment, dedupe, schema generation, per-page unique data summaries. Bulk prose generation is the thing to avoid.

### MVP
- **Doing / not doing:** if pursued, a Next.js template plus a hosted enrichment and index-monitoring service rather than a page factory.
- **Effort:** 5 weeks.
- **Dependencies:** Search Console API, IndexNow, LLM.
- **Hardest part:** Google.

### Score and verdict
Pain 2 · Solo 4 · AI 3 · Gap 2 · WTP 2 · Reach 3 = **16/30**. Skip.

---

## 42. RFP and security-questionnaire auto-responder for small vendors

**One-liner.** Upload past questionnaires, policies and evidence once; when the next 300-row spreadsheet arrives, the tool drafts every answer with a citation and a confidence score, and a human reviews the ones it is unsure about.

### Problem statement
Among regulated B2B vendors that use tooling, the median company received 410 security questionnaires in the year to October 2025; mid-market firms see 50–150. A manual questionnaire takes 10–40 hours, costs about $930 fully loaded, and adds 8–12 business days to an enterprise deal. CMMC and HIPAA flow-downs now push questionnaires to small subcontractors (see chapter 04). The tools are enterprise-priced: Loopio about $20k a year, Conveyor's paid tier $9,600 a year, Arphie $36–60k. A sub-$300 tier is almost empty; 1up launched a $50 a month pay-per-question tier, which shows the market moving down. SOC 2 Type II is the de-facto gate for selling to US mid-market and enterprise, and the tool vendor will be asked for it before holding a customer's security documents.

### Who experiences the problem
SaaS and IT vendors with 10–200 staff selling to enterprise, healthcare and public-sector buyers. The buyer is the founder, head of sales or security lead; the users are sales engineers.

### Value of solving it
$700–2,000 of labour per questionnaire and 8–12 days of sales cycle; one vendor's example puts $400–800k of contract value at risk across 80 gated deals a year.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Loopio | About $1,440 per user/yr; entry about $20k/yr | Per seat, enterprise |
| Responsive (ex-RFPIO) | Quote, about $299 per user/mo | Sales-led |
| Conveyor | Free trust centre; $9,600/yr for 20 questionnaires | Credit model |
| 1up | Free 50 answers/mo; $50/mo plus $0.05 per question; $300–$1,000/mo | New, moving down |
| AutoRFP.ai, Arphie, Tribble | $899–$1,299/mo; $30–60k/yr | Volume tiers |
| Vanta, Drata, Whistic questionnaire automation | Bundled with compliance suites | Bundling threat |

### Pricing model
Flat $199/mo for 10 questionnaires a month, $499/mo for 40, unlimited seats.

### Path to profitability
At $250 ARPU you need 20 customers for $5k MRR and 40 for $10k, the best ratio in this cluster. Costs: embeddings and generation per questionnaire are a few dollars. The gate is trust: a vendor asking customers to upload security policies needs its own SOC 2 Type II, a $10–20k, 6–12 month project for a solo founder. Distribution: SaaS founder communities, compliance consultants, CMMC and HIPAA content, integrations with the compliance suites that lack an SMB tier.

### Where AI is used
- **In the product:** retrieval over past answers and policies with citations and confidence, spreadsheet and portal parsing, evidence lookup. Retrieval-augmented drafting with a human review loop is the right design; answering "from scratch" is the failure mode.
- **To build it:** parsers for Excel, Word and PDF, a vector index, a review UI and Drive/SharePoint connectors are all agent-friendly.

### MVP
- **Doing:** knowledge-base import, Excel and Word questionnaire parsing, AI drafts with citation and confidence, review and approve UI, export back into the original spreadsheet, answer-library maintenance.
- **Not doing:** trust-centre portal, browser extension for buyer portals (v2), RFP prose proposals, compliance automation.
- **Effort:** 7 weeks.
- **Dependencies:** LLM and embeddings, document parsers, Google Drive and SharePoint connectors, the founder's own SOC 2 evidence.
- **Hardest part:** being trusted with security documents as a one-person company.

### Score and verdict
Pain 4 · Solo 3 · AI 5 · Gap 3 · WTP 4 · Reach 3 = **22/30**. High pain, high price, AI-native, an empty SMB tier, and the same buyer as the compliance ideas in chapter 04. The trust gate is the only thing between this and the top.

---

## 43. Bilingual (English/Spanish) AI phone receptionist for home-service trades

**One-liner.** An AI that answers a plumber's or HVAC contractor's phone in English or Spanish, switches language mid-call, triages emergencies, books the job straight into Jobber or Housecall Pro, texts a bilingual confirmation, and discloses that it is an AI as the FCC and California require.

### Problem statement
Home-service businesses miss about 27% of inbound calls and lose about $1,200 per missed call by one vendor's estimate; Jobber's 2026 survey of 1,050 owners found 55% of customers expect a reply within the hour while only 20% of pros manage it. Spanish demand is structural: about 41 million US residents speak Spanish at home, Hispanic households reached 10.2 million homeowners in 2025 with the largest one-year gain on record, and Hispanics are a third of the construction workforce. The incumbents have gaps: Housecall Pro's receptionist is English-only ("Spanish coming soon"), Jobber's does not confirm Spanish, Sameday offers multilingual only on its enterprise tier, ServiceTitan's does not mention it. But the generic SMB receptionists (Rosie at $49, Dialzara at $29, Aira at $25) already include Spanish at parity, Jobber bundles its receptionist at $29, and Avoca raised $125 million at a $1 billion valuation in April 2026 to sell to larger shops. The FCC's February 2024 ruling makes AI voices "artificial" under the TCPA, so outbound AI calls need prior express consent ($500–1,500 per call in damages); California's AB 2905 (January 2025) and Maine's chatbot law (September 2025) require disclosure.

### Who experiences the problem
597,918 specialty-trade payroll establishments (90% under 20 employees) plus about 1.9 million one-person trade contractors. The buyer is the owner or office manager of a 1–20 person HVAC, plumbing, electrical, landscaping or cleaning firm; users are callers, increasingly Spanish-first, and the dispatcher.

### Value of solving it
Human answering costs $10–11.50 per call; AI infrastructure about $0.10–0.20 per minute. Trade-specific incumbents charge $449–789 a month (Sameday) and $1,000–3,000 (Avoca); Jobber's $29 is the floor.

### Main competitors
| Product | Published pricing | Spanish | Gap |
|---|---|---|---|
| Jobber Receptionist | $29/mo for 30 conversations, $0.79 each after | Not confirmed | Jobber-only |
| Housecall Pro CSR AI | Quote, about $200–500/mo | English only | HCP-only |
| ServiceTitan voice agents | Per-call fee, unpublished | Not stated | Enterprise stack |
| Sameday AI | $449–$789/mo | Enterprise tier only | Price |
| Avoca AI | About $1,000–3,000/mo; $125M raised | Not stated | Mid-market only |
| Rosie, Dialzara, Aira, Goodcall | $25–$349/mo | Yes, at parity | Generic, no FSM booking |
| Smith.ai | $300–$2,100/mo | Bilingual humans plus AI | Cost |
| Retell, Vapi, Bland, ElevenLabs Agents | $0.05–0.16/min | Yes | Infrastructure |

### Pricing model
Monthly bundle with included minutes and overage: $99 for 300 minutes, $199 for 800, Spanish at parity, which is the format the market has set.

### Path to profitability
At $149 ARPU you need 34 customers for $5k MRR and 67 for $10k, with gross margin around 70% at these prices. The wedge is narrow but real: a trade-specific, bilingual, FSM-integrated agent for the 1–20 person shop on Jobber or Housecall Pro that is too small for Avoca and wants more than Jobber's $29 add-on. Distribution: Jobber's app marketplace, Spanish-language contractor associations and Facebook groups, HVAC and plumbing supply houses in Sun Belt metros.

### Where AI is used
The pipeline is the product: Deepgram Nova-3 multilingual handles English-Spanish code-switching in one model, ElevenLabs offers Mexican and Latin American voices, and the LLM drives the dialogue with booking tools. Differentiators are language detection and mid-call switching, address and gate-code capture in Spanish, emergency triage, FSM-native booking, and the mandated AI self-disclosure in both languages. Cloning the owner's voice is a gimmick.

### MVP
- **Doing:** inbound number, bilingual greeting with disclosure, FAQ from the business profile, emergency triage script, booking into Jobber via its public API, message-taking with bilingual SMS to owner and caller, call log with transcripts.
- **Not doing:** outbound calls (TCPA), Housecall Pro and ServiceTitan until partner access is granted, payments, multi-agent routing.
- **Effort:** 6 weeks.
- **Dependencies:** Twilio or Telnyx US numbers, A2P 10DLC registration, Retell or Vapi, Deepgram Nova-3 multilingual, ElevenLabs, Jobber API and app listing, call-recording consent handling in all-party-consent states.
- **Hardest part:** standing out when bilingual is a $25 checkbox and the FSM platforms bundle their own.

### Score and verdict
Pain 3 · Solo 3 · AI 5 · Gap 1 · WTP 4 · Reach 3 = **19/30**. Excellent unit economics and a real demographic driver, but the bilingual angle is already priced at parity by generic tools and the platforms bundle their own. Win only with trade-specific depth and FSM booking.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 42 | Security questionnaire auto-responder | **22** | 250 | 40 | 7 |
| 37 | FTC-compliant testimonials and case studies | **19** | 35 | 286 | 4 |
| 38 | Competitor pricing monitor | **19** | 60 | 167 | 5 |
| 39 | Newsletter sponsorship ops | **19** | 75 | 133 | 5 |
| 43 | Bilingual AI receptionist for trades | **19** | 149 | 67 | 6 |
| 40 | Food producer costing and cottage labels | **18** | 40 | 250 | 7 |
| 36 | Google Business Profile automation | **17** | 60 | 167 | 5 |
| 41 | Programmatic SEO factory | **16** | 80 | 125 | 5 |

## Sources
- https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials
- https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers
- https://www.ftc.gov/business-guidance/blog/2025/12/warning-letter-or-ten-businesses-comply-ftcs-consumer-review-rule
- https://www.dlapiper.com/en-us/insights/publications/2026/07/ftcs-2026-enforcement-approach-to-fake-reviews-takes-shape-takeaways-for-companies
- https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking
- https://www.franchise.org/2026/02/ifa-predicts-steady-growth-for-franchising-in-2026-economic-outlook/
- https://developers.google.com/my-business/content/prereqs
- https://developers.google.com/my-business/content/qanda/change-log
- https://ppc.land/google-discontinues-business-profile-q-a-api-effective-november-3/
- https://xovionlabs.com/blog/google-business-profile-api-hidden-gate/
- https://www.synup.com/en/pricing
- https://www.localclarity.com/pricing
- https://localo.com/pricing
- https://wiserreview.com/blog/birdeye-pricing/
- https://senja.io/pricing
- https://testimonial.to/pricing
- https://famewall.io/pricing
- https://vocalvideo.com/pricing
- https://www.arr.club/signal/senja-hit-65k-mrr
- https://visualping.io/pricing
- https://distill.io/pricing
- https://competitors.app/pricing
- https://parano.ai/blog/klue-pricing
- https://www.paved.com/help/articles/8124389-paved-s-pricing-for-publishers
- https://help.passionfroot.me/en/articles/11552638-pricing
- https://getsponsy.com/pricing
- https://sponsorgap.com/blog/newsletter-sponsorship-rates-2026
- https://ppc.land/beehiiv-doubles-ad-sales-team-as-newsletter-monetization-heats-up/
- https://theygotacquired.com/platform/swapstack-acquired-by-beehiiv/
- https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/food-allergies
- https://www.fda.gov/media/81606/download
- https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/front-package-nutrition-labeling
- https://nationalaglawcenter.org/cottage-food-laws-recent-trends-and-major-state-changes/
- https://texascottagefoodlaw.com/sb541/
- https://www.mda.state.mn.us/food-feed/cottage-food-producer-registration
- https://foodbusinesspros.com/cottage-food-laws-by-state/
- https://ij.org/report/cottage-foods-survey/
- https://www.medallionlabs.com/blog/testing-cost-fda-nutrition-facts-panel/
- https://fdc.nal.usda.gov/api-guide/
- https://www.bls.gov/iag/tgs/iag311.htm
- https://www.recipal.com/pricing
- https://foodlabelmaker.com/pricing/
- https://www.bakesy.app/pricing
- https://www.hotplate.com/pricing
- https://findhomegrown.com/blog/castiron-alternative-food-vendors
- https://developers.google.com/search/docs/essentials/spam-policies
- https://www.indiehackers.com/post/79k-from-side-projects-in-2025-my-year-in-review-e145b2fa95
- https://seomatic.ai/pricing
- https://pursuitagent.com/resources/blog/security-questionnaire-volume-2025
- https://wolfia.com/blog/the-real-cost-of-manual-security-questionnaire-responses
- https://www.conveyor.com/pricing
- https://1up.ai/pricing
- https://autorfp.ai/pricing
- https://autorfp.ai/blog/loopio-pricing
- https://www.housecallpro.com/resources/missed-calls/
- https://www.getjobber.com/home-service-trends-report/
- https://help.getjobber.com/hc/en-us/articles/25315927533847-Receptionist-powered-by-Jobber-AI
- https://help.housecallpro.com/en/articles/9740104-csr-ai-overview
- https://www.servicetitan.com/features/pro/contact-center/voice-agents
- https://sameday.ai/pricing
- https://www.idlen.io/news/avoca-ai-1-billion-valuation-kleiner-perkins-services-economy-voice-agents-april-2026/
- https://heyrosie.com/pricing
- https://dialzara.com/pricing
- https://www.getaira.io/blog/bilingual-ai-receptionist
- https://www.fcc.gov/document/fcc-confirms-tcpa-applies-ai-technologies-generate-human-voices
- https://www.fcc.gov/document/fcc-proposes-first-ai-generated-robocall-robotext-rules-0
- https://leginfo.legislature.ca.gov/faces/billNavClient.xhtml?bill_id=202320240AB2905
- https://www.orrick.com/en/Insights/2026/04/2026-State-Chatbot-Laws-Key-Provisions-and-Regulatory-Trends
- https://www.bls.gov/iag/tgs/iag238.htm
- https://www.cpwr.com/wp-content/uploads/DataBulletin-April2026.pdf
- https://nahrep.org/press-releases/2026/03/23/us-census-bureau-hispanics-reach-10-2-million-homeowners/
- https://eyeonhousing.org/2025/10/hispanics-comprise-nearly-one-third-of-the-construction-labor-force/
- https://www.census.gov/topics/population/language-use/data.html
- https://deepgram.com/learn/nova-3-multilingual-major-wer-improvements-across-languages
- https://elevenlabs.io/text-to-speech/mexican-accent
- https://www.retellai.com/pricing
- https://vapi.ai/pricing
