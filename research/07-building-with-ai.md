# 07 — Building with AI: stack, workflow, costs, and the MVP playbook

This chapter answers "where can AI be used to *build* the product" and "what does it take to reach an MVP" generically. Each idea's write-up then only lists what is specific to it.

## 1. Where AI is used in the build

There are two different uses of AI, and each idea's write-up separates them:

- **AI to build the product** (this chapter): coding agents, generated tests, generated UI, generated docs, synthetic test data, generated marketing pages. This applies to all 50 ideas roughly equally.
- **AI inside the product** (per idea): extraction from documents and photos, drafting text, classification, transcription, forecasting. This is where ideas differ and where the ongoing cost per customer lives.

### 1.1 What a coding agent does well in a solo SaaS build (September 2026)

| Build task | AI leverage | How to use it | Watch out for |
|---|---|---|---|
| Scaffolding (auth, billing, org/tenant model, settings, email) | Very high | Start from a known template (e.g. Next.js + Supabase + Stripe starter), let the agent adapt it to your domain model | Agents happily generate a second auth flow or a second billing table if you do not point them to the existing one. Keep a `CLAUDE.md`/`AGENTS.md` that describes the architecture. |
| CRUD screens and forms | Very high | Describe the entity and validation rules; ask for the migration, RLS policy, server action, form and list view together | Row-level security is the most common security hole in agent-built Supabase apps. Test every policy with a second tenant. |
| Database migrations and RLS policies | High | Generate, then run the agent against a test that logs in as two different tenants | See above; also generated indexes are often missing. |
| Integrations against documented APIs (Stripe, Google, Twilio, Peppol access points) | High | Paste the docs page URL into the prompt; ask for a thin client with retries and typed responses | Agents invent endpoints for less-documented APIs (Nordic public registers, small vendors). Verify with a real call before building on top. |
| Test generation | High | Ask for unit tests per module and one end-to-end happy path (Playwright) | Generated tests are often tautological. Ask for tests that would fail if a specific bug were introduced. |
| PDF/report generation | High | React-PDF or HTML-to-PDF; agents produce serviceable templates fast | Multi-page layouts and page-break control need manual polish. |
| Prompt engineering for the in-product AI feature | High | Iterate on prompts and structured-output schemas with the agent, evaluate against 20–50 real samples | You need real samples from real customers early; synthetic data hides failure modes. |
| Landing page, docs, onboarding emails, help centre | Very high | Generate first drafts from the product spec; edit voice by hand | Generic copy; the value proposition must be written by you. |
| Localisation (nb, da, sv, de) | High | Agent-driven translation of UI strings with a glossary | Legal and domain terms need a native check. |
| Debugging production issues | Medium–high | Feed logs and traces to the agent | It will propose plausible but wrong fixes for concurrency and timezone bugs; reproduce first. |
| Architecture decisions | Low–medium | Use it to enumerate options, not to decide | Agents favour whatever is most common in training data, which is often more complex than a solo product needs. |
| Security review | Medium | Ask for a threat model of each feature; run a dependency scan | Not a substitute for one external pentest before selling to companies with security questionnaires. |

Practical rule: a solo developer with an agent gets roughly a **3–5x throughput gain on well-specified, well-trodden work** (CRUD, integrations, tests, docs) and **little to no gain on the novel 10%** (the domain logic that makes the product valuable, the data model that fits the domain, and the judgement calls). Plan the MVP so that novel 10% is small and well understood before you start.

### 1.2 Where AI-built products go wrong

- **Security by omission.** Missing RLS, unvalidated webhooks, secrets in client bundles. Mitigation: a written checklist run before every release; test as a second tenant; use the platform's advisors (e.g. Supabase security advisor).
- **Sprawl.** Agents add code faster than you can read it. Mitigation: keep the codebase small enough to read in a day; delete generated code you do not understand.
- **Fragile prompts in production.** The in-product AI feature works on your 10 samples and fails on customer number 12's PDF. Mitigation: log every AI input/output, build an eval set from real failures, and design the UI as "AI drafts, human confirms" so failures are annoying rather than dangerous.
- **Timezones, dates, and tax.** These are the most common class of bugs in agent-generated business apps (DST across four US time zones, fiscal years, sales-tax rules by state, date formats for international customers). Test them explicitly.

## 2. Reference stack for a solo SaaS

The stack below is the default for all 50 ideas unless an idea says otherwise. It is chosen for: one language end to end, managed everything, generous free tiers, US regions by default with EU regions available for exporters, and strong coding-agent familiarity.

| Layer | Default | Alternatives | Notes |
|---|---|---|---|
| App framework | Next.js (App Router) on Vercel | SvelteKit, Remix, Rails | Agents know Next.js best. |
| Database, auth, storage | Supabase (Postgres, US East) | Neon + Clerk, PlanetScale, Turso | RLS gives multi-tenant isolation in the database itself. HIPAA products need Supabase's HIPAA add-on and a BAA. |
| Background jobs | Inngest, Trigger.dev, or Supabase cron + edge functions | Temporal (overkill), a worker on Railway/Fly | Needed for any idea with polling, scheduled reports or long AI jobs. |
| Payments and sales tax | Stripe + Stripe Tax (US seller) | Paddle, Lemon Squeezy or Polar as merchant of record | About 20 states tax SaaS; Stripe Tax computes it, a merchant of record also files it. See section 4.4. |
| Transactional email | Resend or Postmark | AWS SES | Set up SPF/DKIM/DMARC on day one (also an idea in this list). |
| SMS/voice | Twilio or Telnyx | Bird, Sinch | US A2P 10DLC brand and campaign registration is required before sending business SMS; TCPA consent rules apply to marketing texts. |
| LLM | Claude (Sonnet/Haiku tier) or OpenAI/Gemini equivalents | Local models for privacy-sensitive verticals | Use structured outputs; cache; batch where latency does not matter. |
| Document/OCR | LLM vision directly, or Azure Document Intelligence / Google Document AI for tables | Textract, Mistral OCR | Vision LLMs are enough for most receipts, forms and photos. |
| PDF | React-PDF or Playwright HTML-to-PDF | Gotenberg | |
| Monitoring | Sentry + Better Stack/Axiom | Highlight, OpenTelemetry | |
| Analytics | PostHog (EU cloud) | Plausible | |
| E-signature | Documenso (open source) or embedded via Dropbox Sign | DocuSign eSignature API | ESIGN/UETA make click-wrap and e-signatures valid for most business documents; notarised documents are the exception. |
| i18n | next-intl + AI-assisted translation | | Spanish is the second language that matters for US service-business products. |

Running-cost tables at 0, 100 and 1,000 customers are in section 4, from the cross-cutting research pass.

## 3. The generic MVP playbook (12 weeks)

Every idea's "MVP" section assumes this playbook and only states what is special.

| Week | Milestone | Output |
|---|---|---|
| 0 | **Problem interviews.** 10–20 conversations with the target user. Kill the idea if fewer than 5 describe the problem unprompted and say what they do today. | Interview notes; a one-page positioning statement; a list of the 3 workflows that matter |
| 1 | **Landing page + waitlist**, with the price on it. | Landing page; 20+ sign-ups from the interviewees' channels |
| 2–3 | **Walking skeleton.** Auth, tenant, billing, the one core object (e.g. field, property, contract), one core screen. | Deployable app with a paid plan |
| 4–6 | **The wedge feature.** The single workflow the product is bought for, including the AI step and the human confirm step. | 3–5 design partners using it on real data |
| 7–8 | **Output that leaves the app.** The PDF, export, email, or integration that the buyer shows to someone else (auditor, client, board). This is what they pay for. | Design partners produce a real deliverable |
| 9–10 | **Hardening.** RLS test as second tenant, error handling, logging of AI inputs/outputs, backup, GDPR data-processing agreement, privacy policy, terms. | Ready to charge strangers |
| 11–12 | **Launch to the channel.** Convert design partners to paid, launch to the community/marketplace/association identified in the idea's distribution plan. | First 10 paying customers |

Effort estimates in the idea write-ups are in **solo developer weeks with AI assistance**, and assume this playbook. "8 weeks" means the walking skeleton plus wedge feature plus output plus hardening is about 8 weeks of building, excluding interviews and marketing.

## 4. Costs and benchmarks

### 4.1 Evidence on what one person ships with AI tools (2026)

- **First-hand case.** The most detailed public account is a multi-tenant Rails SaaS ("OnboardingHub", February 2026) with two-factor auth, workspaces and roles, a content editor, media processing, email, Stripe billing with trials, CSV import, analytics and a documentation site: 38,632 lines across 657 files and 713 commits, built between 15 December 2025 and 8 February 2026. The author estimates 25–45 hours of human effort for what would have been roughly 800 hours of hand-coding; the coding agent authored over 95% of commits. The launch then cascaded through twelve linked production failures (a wrong migration command, a missing environment variable silently breaking trials, an undersized connection pool, out-of-memory on a small dyno) that took 80 commits to untangle. The model wrote the code; nobody had operated it.
- **Controlled evidence is weaker than the anecdotes.** METR's 2025 randomised study of experienced open-source maintainers found them 19% slower with early-2025 tools while believing they were 20% faster. Its February 2026 update with 57 developers and 800+ tasks found an 18% speed-up in the original cohort and 4% among new recruits, with both confidence intervals crossing zero.
- **Security is where AI-built products actually die.** An August 2026 scan of 30,998 deployed "vibe-coded" apps found 57% of reachable Supabase-backed apps allowing unauthenticated table reads and one in 23 with hard-coded secrets in public bundles; a separate measurement found 4.4 times as many vulnerabilities per AI-assisted repository as per human-only one. For a US buyer this maps onto procurement gates: HIPAA business associates, FTC Safeguards-covered firms and defense subcontractors will ask for a SOC 2 report or a security questionnaire, and the cheapest way to pass is RLS by default, secret scanning, a staging environment and an incident plan from day one.

The practical conclusion: a billing-ready B2B MVP in 2–6 calendar weeks is realistic; the edge is not build speed but domain rules, integrations, security posture and operating discipline.

### 4.2 Reference stack, list prices (fetched 6–8 September 2026)

| Component | Free tier | Paid entry | Overage and notes |
|---|---|---|---|
| Vercel | Hobby $0, non-commercial | Pro $20/mo, 1 TB transfer | $0.15/GB beyond |
| Supabase | Free: 500 MB DB, 50k MAU | Pro $25/mo: 8 GB DB, 100k MAU, $10 compute credit | $0.125/GB DB, $0.09/GB egress; compute add-ons from $10/mo; HIPAA add-on and BAA available |
| Resend | 3,000 emails/mo | Pro $20/mo for 50k | $0.90 per 1,000 |
| Postmark | 100/mo | $15/mo for 10k | $1.20–1.80 per 1,000 |
| Clerk | Free to 50,000 monthly users | Pro $25/mo | B2B organisations add-on $100/mo plus $1 per retained organisation above 100; use Supabase Auth for multi-tenant SMB products |
| Stripe | | 2.9% + 30¢ domestic cards; Billing 0.7%; Tax 0.5% per transaction where registered | Disputes $15 |

Total infrastructure: about $0–45 at launch, $45–65 at 100 customers, $150–300 at 1,000.

### 4.3 Monthly running cost at three sizes

Assumes a US B2B product at $49/mo, three users per customer, light transactional email and light LLM use.

| | 0 customers | 100 customers (~$4.9k MRR) | 1,000 customers (~$49k MRR) |
|---|---|---|---|
| Hosting, DB, email, auth | $0–25 | $45–65 | $150–300 |
| Monitoring, analytics | $0 | $0–26 | $26–100 |
| Payments via Stripe + Billing, no registrations | $0 | about $206 | about $2,064 |
| Payments via Stripe + Billing + Stripe Tax (registered) | $0 | about $231 | about $2,309 plus filings ($125–200/mo) |
| Payments via a merchant of record (Paddle, Polar) | $0 | about $295 | about $2,950 |
| Payments via Stripe Managed Payments | $0 | about $378 | about $3,779 |
| **Total (Stripe path)** | **$0–45** | **about $250–300** | **about $2,300–2,500 (about 5% of MRR)** |

Add the in-product AI cost from 4.5; for document-extraction products it is usually under $50/mo at 100 customers.

### 4.4 US sales tax, payments and entity

**Sales tax.** There is no federal sales tax; about 22 states plus DC tax SaaS in some form (among them Texas at 80% of the charge, New York, Pennsylvania, Washington, Ohio for business use, Maryland at 3% for business use since July 2025, Connecticut at 1% for business use), while California, Florida, Illinois, Georgia, Virginia and New Jersey do not at state level. Economic nexus starts at $100,000 of sales into a state ($500,000 in California, New York and Texas), so a SaaS at about $1.2 million ARR spread like the US population sells roughly $140k into California, $110k into Texas and under $100k everywhere else, and crosses no threshold except possibly Washington, Pennsylvania, Ohio or Massachusetts. A US-resident founder registers in the home state on day one if that state taxes SaaS and nowhere else until roughly $1–2 million ARR; a non-resident with a Wyoming or Delaware LLC and no US presence typically has zero registrations until then. Stripe Tax monitors thresholds for free and computes tax where you are registered (product tax code for business-use SaaS); Numeral files at $75 per filing and $150 per registration; Anrok charges $100 per state per month; TaxJar starts at $39. US sales tax is a far smaller early burden than EU VAT.

**Stripe versus a merchant of record.** For a US-focused B2B product, Stripe plus Billing plus free threshold monitoring costs about 3.6% and needs no registrations early. The merchant-of-record premium (Paddle and Polar at 5% + 50¢, Stripe Managed Payments at 3.5 points on top of normal fees, about 6.4–7.1% all-in) buys global VAT and GST remittance, chargeback handling and consumer-law compliance, which is worth it for global B2C or prosumer products and rarely for US B2B. Stripe Managed Payments accepts digital products only and refuses any human-delivered component, so a SaaS bundled with onboarding or consulting cannot use it.

**Entity (not legal advice).** A Delaware C-corp owes $400 minimum franchise tax (assumed-par method) plus a $50 annual report by 1 March; a Delaware LLC a flat $300 by 1 June; a Wyoming LLC $100 to form and $60 minimum a year. Stripe Atlas forms either for $500 plus $100 a year for the registered agent and serves founders in 175+ countries. A non-resident owning a single-member US LLC files Form 5472 with a pro forma 1120 every year ($25,000 penalty per missed filing) and needs a US accountant to settle whether the income is US-taxable. Rule of thumb: US-resident bootstrapper, home-state or Wyoming LLC taxed as a pass-through, S-corp election above about $80–100k profit; anyone planning to raise, Delaware C-corp; non-resident bootstrapper, Wyoming or Delaware LLC with a US accountant from year one. Since the July 2025 tax act, domestic research and development spend (including AI-assisted development) is expensed in year one again.

### 4.5 In-product AI costs (September 2026 list prices)

Text models, USD per million tokens (input / output); cached input is about 10% of input, batch is half price. Anthropic models are given by tier.

| Tier | Anthropic | OpenAI | Google |
|---|---|---|---|
| Frontier | $10 / $50 (1M context); large tier $5 / $25 | gpt-6-astra $10 / $50; gpt-5.6-sol $4 / $20 | Gemini 3.1 Pro about $2 / $12 |
| Mid | Mid tier $2 / $10 | gpt-5.6-terra $2 / $12 | Gemini 3.8 Flash $0.75 / $3.75 (promo to end 2026) |
| Cheap | Small tier $1 / $5 | gpt-5.6-luna $0.20 / $1.20 (cut 80% in July 2026); gpt-5-nano $0.05 / $0.40 | Gemini 3.5 Flash-Lite $0.30 / $2.50; 2.5 Flash-Lite $0.10 / $0.40 |

What that means per feature:

| Feature | Typical cost | Which tier |
|---|---|---|
| Extract a 3-page invoice, certificate, label or form to JSON | $0.0006–0.0065 (cheap tier); $0.013 (mid tier) | Cheap tier; mid tier only for messy scans or bilingual legal text |
| Extract a 20-page contract | $0.005 (cheap) to $0.045 (mid) | Mid tier for clause extraction |
| Transcribe one hour of audio | $0.10 (Microsoft MAI-Transcribe-2) to $0.36 (OpenAI); Deepgram Nova-3 $0.26–0.31; about $0.035 via Gemini Flash-Lite audio | Deepgram Nova-3 multilingual for English-Spanish switching |
| Summarise a 5-minute call after transcription | about $0.003 | Cheap tier |
| Voice agent, all-in per minute (STT + LLM + TTS + telephony) | $0.07–0.31 on Retell, Vapi or Bland; realistic self-assembled US bilingual stack $0.10–0.18 | 500 three-minute calls a month is about $150–275 of cost; Deepgram's voice-agent price rises 34% on 12 September 2026 |
| Translate a PR's changed UI strings | under $0.01 | Cheap or mid tier |

At 10,000 documents a month the extraction bill is $6–65. In every idea in this research, in-product AI is a rounding error next to payment fees; the exception is voice (43), where it is 15–30% of revenue. Budget LLM cost at 2–5% of subscription revenue for extraction and drafting products, cap AI usage per plan, and keep a second provider wired in because cheap-tier prices moved by minus 80% (OpenAI) and plus 34% (Deepgram) within one quarter.

**Spanish speech for US products.** Deepgram Nova-3 multilingual handles English-Spanish code-switching mid-sentence in one model; ElevenLabs places Spanish in its top accuracy tier and offers Mexican and Latin American voices; Azure has 19 Mexican Spanish voices but only two US-Spanish ones. No 2026 benchmark publishes Spanish-specific error rates for current models; plan on 3–6% word error on clean speech and two to three times worse on noisy phone audio with regional accents. Three pitfalls: code-switching (use a multilingual model or per-utterance language detection), entities (addresses and part numbers inside Spanish speech need keyword boosting and LLM post-processing), and voice choice (Castilian voices sound foreign to most US Hispanics; use es-MX, es-US or es-419 voices and decide the tú/usted register). Spanish adds no per-minute surcharge anywhere; the cost is evaluation and prompt work.

### 4.6 Pricing model taxonomy and 2025–26 trends

| Model | Where it fits in this list | Trend |
|---|---|---|
| Flat subscription | Micro-SMB verticals (ideas 20, 24, 25, 27, 37) | Simple, low expansion |
| Per seat | Trades and dev tools where incumbents use it | Declining: pure per-seat is the primary model for only about 29% of larger B2B companies in a 2026 survey of 230, and unlimited seats is table stakes in dev tools |
| Per unit (vertical) | Per farm, property, location, employee, product, site (ideas 1, 13, 16, 26, 30, 35, 36, 46) | The natural analogue to seats for SMB verticals; Jobber, Housecall Pro, Buildium and Weave all price this way |
| Usage or metered | Per document, minute, message (ideas 43, 22, 31) | Usage-based adoption 38% in 2026 vs 27% in 2023 |
| Credits | Prepaid usage abstraction | 29% of companies sell AI credits, 33% more plan to |
| Outcome-based | Per resolved ticket or booked job | Not for a new solo product: 78% of vendors succeeding with it had 5+ years on the market and it lengthens sales cycles 20–30% |
| Hybrid (platform fee plus usage) | The 2026 default: 37% use a hybrid as their primary model | 75% of companies changed pricing or packaging in the last year |

Two facts should shape every idea's pricing: the median target gross margin on AI features is only 50%, and 78% of IT buyers saw unexpected AI or consumption charges in the past year. For small businesses, a flat or per-unit price with a generous included AI allowance and a visible hard cap beats metered billing. Annual prepay is a retention lever, not just cash flow: companies under $300k ARR convert only 9% of monthly customers to annual. Keep human services (onboarding, consulting) as separate line items; they are usually exempt from sales tax and excluded from Stripe Managed Payments.

### 4.7 Benchmarks for bootstrapped SaaS

- **Time to revenue.** No public dataset isolates solo bootstrapped time to $1k or $10k MRR. The population anchor is ChartMogul's 2025 report on 6,525 companies: 3.3% reach $1M ARR within 12 months of first revenue, 13.4% within three years, about half within ten. The working heuristic among bootstrappers, unsourced, is $1k MRR in 3–9 months in a validated niche and $10k MRR in 18–36 months without paid acquisition.
- **Churn is driven by price more than industry.** For average revenue per account under $25, even top-quartile annual retention is only 64.7% (about 3.5% monthly churn for a good product); above $1,000 it is 85.8%. Stripe's data shows a 25-point spread in annual churn by price versus 15 points by industry. Target 3% monthly logo churn or less at $30–150 a month; treat 2% as excellent. Records the customer must keep for a regulator (chapter 08 is a list of such records) are the strongest lock-in.
- **Customer acquisition cost.** 2026 SMB-segment CAC ranges $303–1,450 by vertical; paid search runs about $800 per customer versus $141–200 for referrals, and home-services and legal keywords cost $20–80 per click. At $49 a month and 3% churn, gross lifetime value is about $1,600, which caps paid CAC at $400–500 and rules out paid search in competitive verticals. Solo founders grow on SEO, marketplaces, associations and partners.
- **Trial conversion.** Opt-in trials (no card) convert 4–6% median; card-required trials 25–35% median and 50–60% top quartile; freemium 3–5%. A 14-day card-required trial with an onboarding sequence beats freemium on revenue per signup, and must honour state auto-renewal laws (clear disclosure, easy cancellation) even though the federal click-to-cancel rule was vacated.

### 4.8 US distribution channels and how many buyers there are

**Marketplaces with checkout.** Shopify pays 100% of the first $1 million per year and 85% above (2.9% processing); Atlassian pays 100% of gross revenue up to $1 million lifetime on new Forge apps, then 83–84%; GitHub pays 95% but requires 100 installs before a paid plan can be listed; Microsoft's commercial marketplace charges 3% and lets enterprise buyers spend Azure commitments. Google Workspace, Zapier, Slack, HubSpot and QuickBooks give discovery only (you bill); Salesforce AppExchange historically takes 15%; ADP's marketplace is application-only. The vertical platforms these ideas plug into (Jobber, Housecall Pro, ServiceTitan, Toast, Open Dental, NexHealth, AppFolio, Buildium) run partner directories with their own certification fees and relationship managers.

**How many buyers.** Census counts 6.4 million US employer firms: 5.72 million (89.4%) under 20 employees, 561,160 with 20–99 employees (the band that reliably pays $50–500 a month), 93,341 with 100–499; plus 30.4 million non-employer businesses. A vertical with 100,000 employer firms at 1% penetration is 1,000 customers, enough for a solo business at $50–150 a month, which is why the per-idea counts matter more than market-size slides. Segment counts used in the chapters: 500,271 specialty-trade contractor firms (1.93 million non-employers), 247,651 builders, 340,797 real-estate firms, 120,085 accounting and tax firms, 120,488 dental firms, 165,423 other health-practitioner firms, 516,506 food-service firms.

**Associations and franchise networks.** 832,521 US franchise establishments in 2025 (845,000 forecast for 2026); a franchisor's approved-vendor list turns one sale into hundreds of rollouts but expects multi-location roles and consolidated billing. Associations with member-benefit programmes (NAR 1.5 million members, NAHB 140,000, AVMA 105,000) typically want a 10–25% revenue share or a $5–50k sponsorship and take 6–12 months to land; they convert best when already messaging the deadline your product solves (Safeguards for tax-preparer groups, ADA Title II for municipal leagues, CMMC for defense-industry associations).

**Search and outbound.** Organic click-through on queries with an AI Overview fell from 1.41% to 0.64% in one study; transactional and tool queries are far less displaced than explainers; programmatic pages survive only with unique data or a working tool. Cold email replies at 0.45% (0.51% in the US); at a solo founder's volume that is a handful of replies a month, useful for validation interviews or with a trigger, not as a growth engine. US small businesses buy through peers, franchisors, associations and the accountant and bookkeeper channel (QuickBooks ProAdvisors, payroll marketplaces) rather than launches.

### 4.9 Sources for this chapter
- https://world.hey.com/cpinto/building-a-complete-saas-product-with-only-claude-code-cca13895
- https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
- https://metr.org/blog/2026-02-24-uplift-update/
- https://vibe-eval.com/updates/vibe-coding-security-monthly-aug-2026/
- https://vibeappscanner.com/lovable-security
- https://getautonoma.com/blog/vibe-coding-failures
- https://chartmogul.com/reports/saas-growth-the-odds-of-making-it/
- https://chartmogul.com/reports/saas-benchmarks-report/
- https://chartmogul.com/reports/saas-retention-report/
- https://www.subjolt.com/guides/churn-rate-benchmarks/
- https://www.lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion
- https://userpilot.com/blog/free-trial-conversion-rate/
- https://userpilot.com/blog/average-customer-acquisition-cost/
- https://www.growthunhinged.com/p/the-state-of-b2b-monetization-in-2026
- https://valueaddvc.com/blog/the-death-of-the-annual-saas-contract-how-usage-based-pricing-is-taking-over
- https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models
- https://vercel.com/pricing
- https://supabase.com/pricing
- https://resend.com/pricing
- https://postmarkapp.com/pricing
- https://clerk.com/pricing
- https://stripe.com/pricing
- https://stripe.com/tax/pricing
- https://docs.stripe.com/payments/managed-payments/eligibility.md
- https://www.paddle.com/pricing
- https://polar.sh/docs/merchant-of-record/fees
- https://dodopayments.com/pricing
- https://www.taxjar.com/blog/saas-sales-tax
- https://www.salestaxinstitute.com/resources/economic-nexus-state-guide
- https://www.numeral.com/pricing
- https://www.anrok.com/pricing
- https://www.taxjar.com/pricing
- https://corp.delaware.gov/frtaxcalc/
- https://sos.wyo.gov/Business/Docs/BusinessFees.pdf
- https://stripe.com/atlas
- https://www.irs.gov/newsroom/one-big-beautiful-bill-provisions
- https://developers.openai.com/api/docs/pricing
- https://ai.google.dev/gemini-api/docs/pricing
- https://www.cloudzero.com/blog/llm-api-pricing-comparison/
- https://deepgram.com/pricing
- https://developers.deepgram.com/docs/models-languages-overview
- https://developers.deepgram.com/docs/tts-models
- https://www.assemblyai.com/pricing
- https://elevenlabs.io/pricing/api
- https://elevenlabs.io/speech-to-text
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
- https://artificialanalysis.ai/speech-to-text
- https://vapi.ai/pricing
- https://www.retellai.com/pricing
- https://www.bland.ai/pricing
- https://help.shopify.com/en/partners/how-to-earn
- https://developer.atlassian.com/platform/marketplace/pricing-payment-and-billing/
- https://docs.github.com/en/apps/github-marketplace/selling-your-app-on-github-marketplace/receiving-payment-for-app-purchases
- https://learn.microsoft.com/en-us/partner-center/marketplace-offers/marketplace-commercial-transaction-capabilities-and-considerations
- https://developers.google.com/workspace/marketplace/overview
- https://docs.zapier.com/platform/publish/public-integration
- https://www2.census.gov/programs-surveys/susb/tables/2022/us_state_naics_detailedsizes_2022.txt
- https://www2.census.gov/programs-surveys/nonemployer-statistics/datasets/2023/historical-datasets/nonemp23us.zip
- https://www.franchise.org/franchising-economic-outlook/
- https://www.seerinteractive.com/insights/ctr-aio
- https://developers.google.com/search/docs/essentials/spam-policies
- https://belkins.io/blog/cold-email-response-rates
