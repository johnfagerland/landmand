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
- **Timezones, currencies, and locale.** These are the most common class of bugs in agent-generated Nordic/EU business apps (week numbers, VAT rates, decimal commas, DST). Test them explicitly.

## 2. Reference stack for a solo SaaS

The stack below is the default for all 50 ideas unless an idea says otherwise. It is chosen for: one language end to end, managed everything, generous free tiers, EU data residency available, and strong coding-agent familiarity.

| Layer | Default | Alternatives | Notes |
|---|---|---|---|
| App framework | Next.js (App Router) on Vercel | SvelteKit, Remix, Rails | Agents know Next.js best. Vercel has EU regions. |
| Database, auth, storage | Supabase (Postgres, EU region) | Neon + Clerk, PlanetScale, Turso | RLS gives multi-tenant isolation in the database itself. |
| Background jobs | Inngest, Trigger.dev, or Supabase cron + edge functions | Temporal (overkill), a worker on Railway/Fly | Needed for any idea with polling, scheduled reports or long AI jobs. |
| Payments and VAT | Paddle or Lemon Squeezy (merchant of record) | Stripe direct + Stripe Tax; Polar | MoR handles EU VAT/OSS, invoices, and B2B reverse charge. |
| Transactional email | Resend or Postmark | AWS SES | Set up SPF/DKIM/DMARC on day one (also an idea in this list). |
| SMS/voice | Twilio, Telnyx, or 46elks (Nordic) | Bird, Sinch | Nordic sender-ID registration rules apply. |
| LLM | Claude (Sonnet/Haiku tier) or OpenAI/Gemini equivalents | Local models for privacy-sensitive verticals | Use structured outputs; cache; batch where latency does not matter. |
| Document/OCR | LLM vision directly, or Azure Document Intelligence / Google Document AI for tables | Textract, Mistral OCR | Vision LLMs are enough for most receipts, forms and photos. |
| PDF | React-PDF or Playwright HTML-to-PDF | Gotenberg | |
| Monitoring | Sentry + Better Stack/Axiom | Highlight, OpenTelemetry | |
| Analytics | PostHog (EU cloud) | Plausible | |
| E-signature | Documenso (open source) or embedded via Dropbox Sign | Scrive (Nordic, BankID) | Nordic BankID/MitID signing needs a broker (Criipto, Signicat). |
| i18n | next-intl + AI-assisted translation | | |

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

*(Filled in from the cross-cutting research pass: see section 4 below once complete.)*
