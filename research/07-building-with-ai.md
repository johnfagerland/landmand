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

- **First-hand case.** The most detailed public account is a multi-tenant Rails SaaS ("OnboardingHub", February 2026) with two-factor auth, workspaces and roles, a content editor, media processing, email, Stripe billing with trials, CSV import, analytics and a documentation site: 38,632 lines across 657 files and 713 commits, built between 15 December 2025 and 8 February 2026. The author estimates 25–45 hours of human effort for what would have been roughly 800 hours of hand-coding; the coding agent authored over 95% of commits, and by mid-project several agent sessions ran in parallel against a ticket queue with 85% minimum test coverage. The launch then cascaded through twelve linked production failures (wrong migration command, a missing environment variable silently breaking trials, cache tables absent, an SDK checksum change rejected by object storage, an undersized connection pool, out-of-memory on a small dyno) that took 80 commits to untangle. The model wrote the code; nobody had operated it.
- **Controlled evidence is weaker than the anecdotes.** METR's 2025 randomised study of experienced open-source maintainers found them 19% slower with early-2025 tools while believing they were 20% faster. Its February 2026 update with 57 developers and 800+ tasks found an 18% speed-up in the original cohort and 4% among new recruits, with both confidence intervals crossing zero and a warning about selection effects.
- **Security is where AI-built products actually die.** A passive scan of 30,998 deployed "vibe-coded" apps in August 2026 found 57% of reachable Supabase-backed apps allowing unauthenticated table reads and one in 23 with hard-coded secrets in public bundles; a separate measurement found 4.4 times as many vulnerabilities per AI-assisted repository as per human-only one. Section 1.2 above is the mitigation list.

The practical conclusion for this founder: a billing-ready B2B MVP in 2–6 calendar weeks is realistic; the edge is not build speed (everyone has it) but domain rules, integrations, security posture and operating discipline.

### 4.2 Reference stack, list prices (fetched 6 September 2026)

| Component | Free tier | Paid entry | Overage and notes |
|---|---|---|---|
| Vercel | Hobby $0, non-commercial | Pro $20/mo, 1 TB transfer | $0.15/GB transfer beyond |
| Supabase | Free: 500 MB DB, 50k MAU | Pro $25/mo: 8 GB DB, 100k MAU, $10 compute credit | $0.125/GB DB, $0.09/GB egress; compute add-ons from $10/mo |
| Resend | 3,000 emails/mo | Pro $20/mo for 50k | $0.90 per 1,000 |
| Postmark | 100/mo | $15/mo for 10k | $1.20–1.80 per 1,000 |
| Clerk | Free to 50,000 monthly users | Pro $25/mo | B2B organisations add-on $100/mo plus $1 per retained organisation above 100, which makes Clerk expensive for multi-tenant B2B; Supabase Auth is the usual solo choice |
| Stripe | | 2.9% + 30¢ (US list; EU cards are cheaper on EU accounts), Billing 0.7%, Tax 0.5% per transaction | Disputes $15 |

### 4.3 Monthly running cost at three sizes

Assumes a B2B product at about $49/mo, three users per customer, light transactional email and light LLM use.

| | 0 customers | 100 customers (~$4.9k MRR) | 1,000 customers (~$49k MRR) |
|---|---|---|---|
| Hosting, DB, email, auth | $0–25 | $45–65 | $150–300 |
| Monitoring, analytics | $0 | $0–26 | $26–100 |
| Payments via Stripe direct + Billing + Tax | $0 | about $230 | about $2,300 |
| Payments via merchant of record (5% + 50¢) | $0 | about $295 | about $2,950 |
| **Total (Stripe path)** | **$0–45** | **about $300–320** | **about $2,500–2,700 (about 5% of MRR)** |

Add the in-product AI cost from 4.5 for each idea; for document-extraction products it is usually under $50/mo at 100 customers.

### 4.4 Merchant of record and EU VAT

| Provider | Fee | Notes |
|---|---|---|
| Paddle | 5% + 50¢ | No monthly fee; custom for sub-$10 products |
| Lemon Squeezy | 5% + 50¢ | Acquired by Stripe (2024); migrating to "Stripe Managed Payments" (Stripe as MoR, shipped April 2026, Checkout and Payment Links only) |
| Polar | 5% + 50¢ (Starter) down to 3.4% + 30¢ with a $400/mo plan; +1.5% international cards | Stripe payout costs passed through |
| Dodo Payments | 4% + 40¢ US, +1.5% non-US cards, +0.5% subscriptions | Effectively about 6% for a Nordic seller with EU customers |

VAT rules for a Nordic seller: B2B sales to EU businesses use reverse charge (validate the VAT number in VIES). B2C sales to EU consumers carry destination-country VAT; an EU-established seller (Denmark) may charge home VAT until cross-border B2C digital sales exceed €10,000 a year, then registers in the Union One Stop Shop and files quarterly. A Norway-established seller is outside the EU and has no €10,000 threshold: destination VAT from the first euro via the non-Union OSS. Foreign sellers into Norway use the VOEC scheme. ViDA extends the single VAT registration from 1 July 2028. Decision rule: below about €5k MRR, a merchant of record costs 1–2 points more than Stripe plus Tax but removes OSS filings, VIES checks, B2C invoice rules and chargebacks; above about €20k MRR the 1–2 points pay for an accountant.

### 4.5 In-product AI costs (September 2026 list prices)

Text models, USD per million tokens (input / output); cached input is about 10% of input, batch is half price.

| Tier | Anthropic | OpenAI | Google |
|---|---|---|---|
| Frontier | $10 / $50 (1M context); $5 / $25 | gpt-6-astra $10 / $50; gpt-5.6-sol $4 / $20 | Gemini 3.1 Pro about $2 / $12 |
| Mid | Sonnet tier $2 / $10 | gpt-5.6-terra $2 / $12 | Gemini 3.8 Flash $0.75 / $3.75 (promo to end 2026) |
| Cheap | Haiku tier $1 / $5 | gpt-5.6-luna $0.20 / $1.20; gpt-5-nano $0.05 / $0.40 | Gemini 3.5 Flash-Lite $0.30 / $2.50; 2.5 Flash-Lite $0.10 / $0.40 |

What that means per feature:

| Feature | Typical cost | Which tier |
|---|---|---|
| Extract a 3-page invoice, form or certificate to JSON | $0.0006–0.0065 (cheap tier); $0.013 (mid tier) | Cheap tier; mid tier only for messy scans or multilingual legal text |
| Extract a 20-page contract | $0.005 (cheap) to $0.045 (mid) | Mid tier for clause extraction |
| Transcribe one hour of audio | $0.15–0.36 (AssemblyAI, Deepgram, OpenAI); about $0.035 via Gemini Flash-Lite audio input | Deepgram Nova-3 for Nordic languages |
| Summarise a 5-minute call after transcription | about $0.003 | Cheap tier |
| Voice agent, all-in per minute (STT + LLM + TTS + telephony) | $0.07–0.31 on Retell/Vapi/Bland; realistic Nordic stack $0.12–0.20 | 500 three-minute calls a month is about $200–300 of cost |
| Translate a PR's changed UI strings | under $0.01 | Cheap or mid tier |

At 10,000 documents a month the extraction bill is $6–65. In every idea in this research, in-product AI is a rounding error next to payment fees; the exception is voice (43), where it is 20–30% of revenue.

Nordic-language speech notes: Deepgram Nova-3 supports Danish, Norwegian, Swedish and Finnish (its newer Flux model does not); ElevenLabs covers all four for both transcription and low-latency speech; Azure has only a few standard neural voices and no HD voices for these locales. Vendor claims of under 5% word-error-rate hold for clean read speech, not for phone audio with dialects: Danish conversational speech scores 28% error on Whisper large-v3 versus 15% on read speech. The National Library of Norway's NB-Whisper (open, trained on about 66,000 hours of Norwegian) is the strongest open option and can be self-hosted. Budget for a post-processing LLM pass and keyword boosting of domain terms.

### 4.6 Pricing model taxonomy and 2025–26 trends

| Model | Where it fits in this list | Trend |
|---|---|---|
| Flat subscription | Micro-SMB verticals (ideas 2, 20, 24, 25, 37) | Simple, low expansion |
| Per seat | Trades and dev tools where incumbents use it | Declining: pure per-seat is the primary model for only about 29% of larger B2B companies in a 2026 survey of 230 companies, and unlimited seats is now table stakes in dev tools |
| Per unit (vertical) | Per farm, property, location, employee, association, product (ideas 1, 3, 12, 16, 23, 26, 36, 40) | The natural analogue to seats for SMB verticals; the unit tracks the customer's size |
| Usage or metered | Per document, minute, message (ideas 43, 22) | Usage-based adoption 38% in 2026 vs 27% in 2023 |
| Credits | Prepaid usage abstraction | 29% of companies sell AI credits, 33% more plan to |
| Outcome-based | Per resolved ticket or booked meeting | Not for a new solo product: 78% of vendors succeeding with it had 5+ years on the market and it lengthens sales cycles 20–30% |
| Hybrid (platform fee plus usage) | The 2026 default: 37% use a hybrid as their primary model | 75% of companies changed pricing or packaging in the last year |

Two facts that should shape every idea's pricing: the median target gross margin on AI features is only 50%, and 78% of IT buyers saw unexpected AI or consumption charges in the past year. For micro-businesses, a flat or per-unit price with a generous included AI allowance and a visible hard cap beats metered billing. Annual prepay is a retention lever, not just cash flow: companies under $300k ARR convert only 9% of monthly customers to annual.

### 4.7 Benchmarks for bootstrapped SaaS

- **Time to revenue.** No public dataset isolates solo bootstrapped time to $1k or $10k MRR (MicroConf's report is gated; Indie Hackers data is self-reported). The population anchor is ChartMogul's 2025 report on 6,525 companies: 3.3% reach $1M ARR within 12 months of first revenue, 13.4% within three years, about half within ten. The working heuristic among bootstrappers, unsourced, is $1k MRR in 3–9 months in a validated niche and $10k MRR in 18–36 months without paid acquisition. The milestones in section 5 of the overview use that heuristic.
- **Churn is driven by price more than industry.** ChartMogul (2,100+ businesses): for average revenue per account under $25, even top-quartile annual retention is only 64.7%, meaning about 3.5% monthly churn for a good product; above $1,000 it is 85.8%. Stripe's 2024–25 data shows a 25-point spread in annual churn by price versus 15 points by industry. Rule of thumb for SMB SaaS at $30–150 a month: target 3% monthly logo churn or less, and treat 2% as excellent. Compliance records, annual plans and per-unit pricing are the levers.
- **Customer acquisition cost.** 2026 SMB-segment CAC ranges $303–1,450 depending on vertical; paid search runs about $800 per customer versus $141–200 for referrals. At $49 a month and 3% churn, gross lifetime value is about $1,600, which caps paid CAC at $400–500 and rules out paid search in competitive verticals. Solo founders grow on SEO, marketplaces and partners.
- **Trial conversion.** Opt-in trials (no card) convert 4–6% median; card-required trials 25–35% median and 50–60% top quartile; freemium 3–5%. A 14-day card-required trial with an onboarding sequence beats freemium on revenue per signup unless the free tier is itself the distribution engine (widgets, public pages).

### 4.8 Distribution channels in 2026

- **SEO after AI Overviews.** Organic click-through on queries with an AI Overview fell from 1.41% to 0.64% in one 10,000-keyword study; position-one CTR fell 18% and position-two 39%. Transactional and tool queries ("X calculator", "software for Y", comparison pages) are far less displaced than explainers, and pages cited inside the AI Overview gain clicks. Programmatic pages survive only when each carries unique structured data or a working tool; Google's spam policy explicitly names AI-generated pages "without adding value". Being cited by AI answers now matters as much as ranking first.
- **Marketplaces.** Shopify pays 100% of the first $1M per year and 85% above (2.9% processing); Atlassian pays 100% of gross revenue up to $1M lifetime on new Forge apps, then 83–84%; GitHub Marketplace lists flat and per-unit plans for verified publishers; Slack gives discovery but no checkout. Shopify and Atlassian are the two ecosystems where a solo developer gets both checkout and discovery.
- **Cold email.** Across 7.5 million emails in 2025 the average reply rate was 0.45% (0.72% for 0–10 employee targets, 0.73% in Denmark). At a solo founder's volume that is a handful of replies a month; useful for validation interviews or with a trigger (a new regulation, a new register entry), not as a growth engine. SPF, DKIM and DMARC are mandatory for bulk senders.
- **Associations, accountants, communities.** No quantitative study exists. The pattern in Nordic SMB verticals is that accountants control the bookkeeping-system choice and associations sell trust to members; a partner channel pays a 15–30% referral or a member discount, takes 6–12 months to open, and has the lowest churn. Several ideas in this research (1, 4, 7, 8, 16, 40, 50) depend on such a channel.

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
- https://docs.stripe.com/payments/managed-payments
- https://www.paddle.com/pricing
- https://polar.sh/docs/merchant-of-record/fees
- https://dodopayments.com/pricing
- https://dodopayments.com/blogs/eu-vat-saas-guide-2026
- https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en
- https://www.skatteetaten.no/en/business-and-organisation/vat-and-duties/vat/foreign/e-commerce-voec/
- https://taxation-customs.ec.europa.eu/taxation/vat/vat-digital-age-vida_en
- https://www.semrush.com/blog/ai-overviews-study/
- https://www.seerinteractive.com/insights/ctr-aio
- https://developers.google.com/search/docs/essentials/spam-policies
- https://help.shopify.com/en/partners/how-to-earn
- https://developer.atlassian.com/platform/marketplace/pricing-payment-and-billing/
- https://docs.github.com/en/apps/github-marketplace/selling-your-app-on-github-marketplace/pricing-plans-for-github-marketplace-apps
- https://docs.slack.dev/slack-marketplace/
- https://belkins.io/blog/cold-email-response-rates
- https://developers.openai.com/api/docs/pricing
- https://ai.google.dev/gemini-api/docs/pricing
- https://www.cloudzero.com/blog/llm-api-pricing-comparison/
- https://deepgram.com/pricing
- https://www.assemblyai.com/pricing
- https://elevenlabs.io/pricing/api
- https://vapi.ai/pricing
- https://www.retellai.com/pricing
- https://www.bland.ai/pricing
- https://developers.deepgram.com/docs/models-languages-overview
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support
- https://huggingface.co/alexandrainst/roest-315m
- https://huggingface.co/NbAiLab/nb-whisper-large
