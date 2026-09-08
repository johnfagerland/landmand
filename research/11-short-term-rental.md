# 11 — Short-term rental industry, US (ideas 56–60)

Five ideas where the buyer is a host, co-host, or small operator inside the US short-term rental (STR) industry. Two adjacent ideas already live in [02-trades-field-service-property.md](02-trades-field-service-property.md) and are not repeated here: [13. Move-in and move-out inspections](02-trades-field-service-property.md#13-move-in-and-move-out-inspections-with-ai-photo-comparison-and-state-deadline-compliance), built for long-term tenancies under state deposit law, and [15. Short-term rental turnover operations](02-trades-field-service-property.md#15-short-term-rental-turnover-operations), which that research scored 15/30 and found "crowded and bundled." Two ideas below sit deliberately close to that territory — 58 targets the STR damage-*claim* workflow rather than the tenancy deposit workflow of 13, and 60 targets the cleaning-*company* rather than the host, the vendor side of 15's problem — and each says explicitly how it differs.

AirDNA's 2026 outlook puts active US short-term-rental supply at about 1.77 million listings, growing only 2.7% this year as new-supply growth cools; the growth story in this cluster is not more listings, it is cities formalizing rules around the listings that already exist. San Diego, Los Angeles, New York, Honolulu, Austin, Scottsdale and dozens of others have spent 2023–2026 replacing informal enforcement with permits, caps, insurance minimums and quarterly reporting, while Florida's legislature has twice failed to pre-empt the patchwork with one statewide registry. That regulatory churn, not a new underlying TAM, is the demand driver for two of the five ideas below (56, 59); the other three (57, 58, 60) are workflow and trust gaps inside an already-large, already-professionalizing host and manager population.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 56. STR permit, registration and lodging-tax compliance tracker

**One-liner.** A host or small manager with 2–20 units registers every property once, and the tool tracks each city and county's permit renewal date, occupancy-tax filing schedule, insurance and inspection requirements, flagging what is due before the fine hits.

### Problem statement
Cities have spent 2023–2026 replacing "list and hope" with permit regimes that vary block by block. San Diego's STRO caps whole-home (Tier 3) licenses outside Mission Beach at roughly 1% of the city's housing stock — about 5,400 licenses — and had issued 4,853 of them as of late August 2026, with fees running $193 to $1,129 depending on tier (Tier 1 part-time home-sharing up to Tier 4 Mission Beach whole-home, which is closed to new applicants). Los Angeles fines non-compliant listings $500 a day or double the nightly rate, whichever is greater. New York's Local Law 18 had approved only 3,522 registered hosts against roughly 40,000 pre-law listings. Scottsdale, Arizona requires STR operators to carry $500,000 in liability insurance, provide a 24/7 emergency contact, and notify every adjacent neighbor with the licence number and contact details within 30 days of licensing. Florida has twice tried to replace this patchwork with a single state registry — Gov. DeSantis vetoed SB 280 in June 2024 — so Florida hosts still juggle county- and city-level rules with no statewide relief in sight. The market leader for the tax slice of this problem, Avalara's MyLodgeTax, starts at $27 a month per property plus a $299 one-time setup fee for a single property (custom quotes above six), and focuses on occupancy-tax calculation and remittance — not on the permit renewal, insurance or inspection deadlines that differ by city.

### Who experiences the problem
Hosts and small managers operating across 2–20 units, especially those spanning more than one regulated city. AirDNA's 2026 reporting repeatedly references the "professionalization" of the host base but a single national count of multi-city, multi-unit operators was not found. The buyer and user are the same person: the host or the small manager's office lead.

### Value of solving it
A missed San Diego Tier 3 renewal or a lapsed Los Angeles registration risks $500-a-day fines or a total loss of the right to operate — for a five-property host, a single missed deadline costs more than a year of a $69-a-month subscription.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Avalara MyLodgeTax | $27/mo per property + $299 setup (1 property); custom quote for 6+ | Tax remittance only, not permits, insurance or inspections |
| Ximplifi | Not found (bookkeeping/tax service, quote-based) | A service, not self-serve software |
| Granicus Host Compliance, Deckard, LTAS, Rentalscape | No public host-facing pricing (sold to city governments) | Built for enforcement, not for hosts |
| Lodgify, Hostaway (built-in tax fields) | Bundled into $25–100+/mo PMS plans | A tax-rate field, not a permit or inspection calendar |
| Spreadsheets and calendar reminders | Free | No multi-city rule database, no alerts before a deadline lapses |

### Pricing model
Banded per-portfolio subscription: $29/month for up to 5 properties, $69/month for up to 20, $149/month for 50+, covering unlimited cities.

### Path to profitability
At $69 ARPU you need 73 portfolios for $5k MRR and 145 for $10k. Costs are low: this is mostly a content product (a curated, kept-current city-rule database) plus reminders and document storage, not compute-heavy AI. Distribution: STR host Facebook groups and subreddits, city permit registries (many, like San Diego's and NYC's, publish licence data as public records that double as a lead list), VRMA and short-term-rental host conferences, and SEO on "[city] short-term rental permit deadline" queries that have no good incumbent answer today.

### Where AI is used
- **In the product:** monitoring city ordinance pages for changes and diffing them against the stored rule set, extracting renewal dates from permit confirmation PDFs and emails, and drafting the specific compliance checklist for an address from parcel and zoning lookups.
- **To build it:** the reminders, document vault and portfolio dashboard are standard SaaS; the hard, non-code work is researching and continuously maintaining an accurate rule set across dozens of cities that amend their ordinances multiple times a year (Austin alone amended its STR code twice in 2025).

### MVP
- **Doing:** address-based lookup against a curated database of the top 50 STR-regulated US cities and counties, a permit and insurance renewal calendar with email/SMS alerts, a document vault for permits and certificates, and an occupancy-tax *filing* calendar (dates only, not calculation or remittance).
- **Not doing:** tax calculation and remittance (leave to MyLodgeTax or the state), submitting permit applications on the host's behalf, cities outside the initial top 50 at launch.
- **Effort:** 6 weeks.
- **Dependencies:** a manually curated and continuously updated ordinance database, SMS via Twilio with 10DLC registration and TCPA consent capture, document storage; no special licence is needed to sell the tool itself.
- **Hardest part:** keeping the rule database accurate as city councils amend ordinances several times a year — this is an ongoing research obligation, not a one-time build.

### Score and verdict
Pain 4 · Solo 4 · AI 3 · Gap 3 · WTP 3 · Reach 3 = **20/30**. A genuine, multi-city fine risk that the tax-focused incumbent leaves wide open; win it by tracking every deadline that can end a listing, not only the tax one.

---

## 57. Owner statements, trust accounting and 1099s for small STR property managers and co-hosts (5–50 units)

**One-liner.** Reconciled monthly owner statements, split payouts and year-end 1099s for co-hosts and small STR managers who manage other people's properties across tools they don't fully control.

### Problem statement
Airbnb's Co-Host Network launched 16 October 2024 with more than 10,000 co-hosts across 10 countries, matching owners who lack time to self-manage with local hosts who take over day-to-day operations — creating a fast-growing population of people who manage someone else's Airbnb account and owe that owner a clean monthly accounting. Florida law requires anyone who handles rental income on behalf of another owner for compensation to hold a real-estate licence and keep client funds in a separate escrow or trust account at a Florida-licensed institution (Florida Statute 475 and FREC Rule 61J2-14), audited and enforced; commingling funds is a licensing violation, not just a bookkeeping error. Full property-management systems bundle owner statements as a feature of the whole platform: OwnerRez starts near $88/month on a sliding per-property scale, and Hostfully runs roughly $119–215/month for 11–19 units — but a co-host who books through the *owner's own* Airbnb account, or who splits properties across several different tools (Guesty for some clients, Hospitable for others), has no owner-statement layer that sits above the booking systems rather than replacing them.

### Who experiences the problem
Co-hosts (10,000+ enrolled in Airbnb's own network alone) and small STR managers with 5–50 units. VRMA's exact membership count was not independently confirmed (not found). The buyer is the co-host or small manager; the user is the same person, with the property owner as the statement's reader.

### Value of solving it
A miscalculated split payout or a Florida trust-account violation risks licence discipline for a licensed manager, and even outside licensed states, an inaccurate statement is a client-loss event for a co-host whose entire product is trust.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| OwnerRez | Sliding scale from ~$88/mo; owner statements via its Property Management add-on | Requires adopting the whole PMS, not a companion layer |
| Hostfully | ~$119–215/mo (Starter–Pro, up to 11–19 units) | Same — bundled, not standalone |
| Guesty | Guesty Lite from $16/mo (single host); mid-size portfolios commonly report $20–50 effective per listing/mo | Enterprise-leaning pricing and onboarding |
| Track (TravelNet Solutions), Streamline | Not found (custom enterprise quotes) | No published small-manager tier |
| Bnbtally (now Tallybreeze) | Reconciles OTA payouts inside QuickBooks Online (~$38/mo QBO Simple Start); Tallybreeze's own fee not found | Revenue reconciliation into QuickBooks, not owner-facing trust statements or 1099s |

### Pricing model
Per-portfolio, not per-listing, since a co-host often doesn't own the booking account: $79/month for up to 20 units, $199/month for up to 75.

### Path to profitability
At $99 ARPU you need 51 managers for $5k MRR and 101 for $10k. Costs: Stripe Connect/ACH transfer fees and a 1099 e-file API or vendor. Distribution: Airbnb's own Co-Host Network directory, VRMA chapters, STR co-host Facebook groups, and accountants who already serve STR clients as a referral channel.

### Where AI is used
- **In the product:** reconciling OTA payout CSVs and PDFs into owner-ready statements line by line, flagging split-payout errors before they reach an owner, drafting the plain-English cover note per statement, and auto-generating 1099-NEC/1099-MISC forms at year-end (threshold now $2,000 for payments made after 31 December 2025 under the One Big Beautiful Bill Act, up from $600).
- **To build it:** parsing OTA payout statements is a standard document-extraction task; the one hard piece is correctly modeling trust-account segregation rules that differ by state and are not written in a form built for software to consume.

### MVP
- **Doing:** CSV/PDF import from Airbnb and Vrbo payout reports, commission and split-payout calculation, owner statement PDF generation, Stripe Connect payouts, 1099 generation and e-file, and a Florida-specific trust-account ledger view.
- **Not doing:** booking or channel management, guest messaging, dynamic pricing — all left to the PMS the co-host already uses.
- **Effort:** 7 weeks.
- **Dependencies:** Stripe Connect, a 1099 e-file vendor (e.g., Track1099/Tax1099-style API), QuickBooks Online API, and Florida's (then other states') trust-account rule content as a maintained reference, not legal advice.
- **Hardest part:** state-by-state trust-account and licensing rules are inconsistent, and the product must never look like it is practicing law or accounting on the manager's behalf.

### Score and verdict
Pain 3 · Solo 4 · AI 3 · Gap 2 · WTP 3 · Reach 3 = **18/30**. Real audit and trust exposure for a fast-growing co-host segment, held back by the fact that every full PMS already bundles owner statements — the wedge is narrow: the multi-tool co-host who won't switch platforms.

---

## 58. STR damage-claim evidence and resolution pack

**One-liner.** Guided pre- and post-stay photo capture with AI change detection builds a timestamped, itemized claim pack a host can file with Airbnb's Resolution Center or Vrbo's e-claims portal inside the filing window, instead of losing a valid claim to a missing photo or a missed deadline.

### Problem statement
Airbnb requires a reimbursement request within 14 days of the responsible guest's checkout, or before the next guest checks in — whichever is sooner — and separately requires "legitimate, verifiable evidence" submitted within 30 days; missing either deadline is cited as the single most common reason AirCover damage claims are denied. Vrbo's e-claims portal, run jointly with insurer Generali, gives hosts 14 days from checkout to file, allows exactly one submission with all damage tallied at once, and excludes cleaning fees and intentional acts from coverage. The existing vendors in this space sell risk transfer, not documentation: Truvi (formerly Superhog) bills per booking on a usage basis and its own claims team handles recovery; Safely bundles guest screening with up to $1 million of coverage at roughly $5–8 per stay; Waivo prices from about $15 per booking wholesale, marked up to guests at $39–79. None of them is a documentation tool a host keeps regardless of which (if any) protection product is attached to a given reservation. This differs from idea 13 in this research (move-in/move-out inspections) by targeting the STR claim workflow specifically — platform-mandated deadlines, the Resolution Center and e-claims portal formats, and 1–4 night turnovers rather than a year-long tenancy.

### Who experiences the problem
Hosts and small managers who self-manage or use a PMS without built-in AI photo comparison — most of the market, since Hospitable, Lodgify and Guesty's core tiers do not include damage diffing. The buyer and user are the host, or the cleaner performing the walkthrough on the host's behalf.

### Value of solving it
A claim denied for missing the 14-day window or lacking pre-stay photos is a total loss on the repair or replacement cost, which for furniture, appliances or flooring commonly runs from a few hundred to several thousand dollars per incident; no neutral, aggregated figure for the US market was found (unverified).

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Truvi (Superhog) | Usage-based, billed monthly per product used; no published flat per-booking rate | Sells risk transfer and recovery service, not a standalone evidence tool |
| Safely | ~$5–8 per stay (screening + protection bundle) | Same — protection product, not documentation |
| Waivo | From ~$15 per booking wholesale; marked up to $39–79 for guests | Same |
| Autohost | Usage-based per verification, custom quote | ID/fraud focus, not damage evidence |
| Minut | Hardware sensor, no public per-unit price found | Solves in-stay monitoring, not post-stay claims |
| Breezeway (inspections) | From ~$19/unit/mo, bundled with turnover ops | An inspection checklist, not a claim-pack generator |

### Pricing model
$19/month per host account (unlimited properties) for guided capture and AI diffing, plus a $9 "claim pack" fee per generated submission bundle — kept cheap on the subscription since filing a claim is occasional, not constant.

### Path to profitability
At $29 ARPU (subscription plus claim-pack fees, blended) you need 172 hosts for $5k MRR and 345 for $10k. Costs: a vision-LLM comparison per photo pair runs cents. Distribution: STR host communities (r/AirBnBHosts, r/vrbo, and similar Facebook groups), PMS app marketplaces (Hospitable, Guesty), and a free "pre-stay photo checklist" as a lead magnet.

### Where AI is used
- **In the product:** a guided shot list per room, image alignment and vision-model comparison flagging new damage against pre-existing wear, and drafting the claim narrative and evidence index in the format Airbnb's Resolution Center and Vrbo's e-claims portal actually expect.
- **To build it:** the capture-and-diff pipeline reuses the same approach as idea 13 in this research; the one hard, ongoing piece is keeping the claim-pack format in sync as the platforms change their own forms and evidence rules.

### MVP
- **Doing:** guided pre-arrival and post-checkout photo capture, AI diff with a severity flag, a PDF claim pack with a day-stamped evidence index, a 14-day countdown reminder tied to each checkout date, and Airbnb/Vrbo-specific claim templates.
- **Not doing:** filing the claim on the host's behalf, underwriting or insurance, in-stay monitoring hardware.
- **Effort:** 5 weeks.
- **Dependencies:** a vision LLM, mobile capture, PDF generation, and iCal/PMS calendar sync to trigger the countdown at each checkout.
- **Hardest part:** the claim outcome is still decided by Airbnb's or Vrbo's own reviewer — the product improves the odds of a well-documented claim, it cannot guarantee a payout.

### Score and verdict
Pain 3 · Solo 4 · AI 4 · Gap 3 · WTP 2 · Reach 3 = **19/30**. A real, sourced 14-day deadline that trips up hosts today, with no incumbent selling documentation alone rather than risk transfer — but occasional use caps what a host will pay for a standing subscription.

---

## 59. Mid-term rental leasing and operations for hosts pivoting away from STR ordinances

**One-liner.** Lease generation, FCRA-compliant screening, furnished-inventory tracking and 30–90 day turnover scheduling for hosts moving units out of nightly short-term rental and into the longer stays that most city STR ordinances exempt.

### Problem statement
Most STR ordinances regulate only stays under 30 days: Austin's code defines a short-term rental as one rented "for fewer than 30 consecutive days," and Honolulu confines STRs to resort-zoned parcels while effectively requiring a 30-day minimum stay everywhere else on Oahu — which is exactly why furnished monthly rentals for travel nurses, relocating employees and remote workers have become the standard workaround in restricted markets such as New York City and Washington, DC. Furnished Finder, the largest marketplace at this stay length, charges hosts $199/year to list a property ($149 for each additional unit at the same address) and offers its KeyCheck screening free to the landlord while charging travelers a $44.99 screening fee — but Furnished Finder is a listing marketplace, not a lease-and-turnover operations tool. Hemlane prices lease management, e-signature and rent collection at $28/month plus $2/unit on its Basic annual tier, but is built around 12-month leases, not the furnished, 30–90 day cycle with utility-inclusive billing that mid-term stays require. Demand from one large mid-term-rental segment is well documented elsewhere in this research: the US travel-nurse workforce grew from about 33,000 in 2018 to more than 175,000 by 2024 (see the healthcare-staffing cluster for more).

### Who experiences the problem
Hosts and small managers converting units out of nightly STR use because of local ordinances (Austin, New York City, Honolulu and similar cities), and hosts targeting travel-nurse or relocation demand from the outset. The buyer is the host; the user is the host plus each incoming mid-term tenant.

### Value of solving it
A host who avoids a permit fight by shifting to 30+ day stays keeps operating without a compliance battle at all; mid-term nightly-equivalent rates typically sit between long-term lease rent and nightly STR rates, though no neutral national average comparison was found (unverified).

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Furnished Finder / KeyCheck | $199/yr/property listing; KeyCheck screening free to host, $44.99 to traveler | A marketplace, not turnover or lease-operations tooling |
| Hemlane | $28/mo + $2–58/unit by tier (billed annually) | Built for 12-month leases, not furnished 30–90 day stays |
| TurboTenant | Free–$999/yr | Same — long-term-lease assumptions |
| Zeus Living, Landing, Blueground, Kopa | No self-serve host pricing published (they operate their own inventory) | Not a tool independent hosts can use on their own units |
| Hospitable (MTR support), Guesty | Add-on inside a full STR-first PMS, $29–99+/mo | Mid-term bolted onto short-term-first tools |

### Pricing model
$49/month per host account for up to 5 properties (furnished-inventory tracking, lease templates, screening pass-through), $99/month for up to 20.

### Path to profitability
At $59 ARPU (blended) you need 85 hosts for $5k MRR and 170 for $10k. Costs: an FCRA-compliant screening partner fee pass-through, e-signature, Stripe. Distribution: STR host forums discussing "pivoting off Airbnb" after a local ban, Furnished Finder's own host community and blog, travel-nurse housing Facebook groups, and SEO on "[city] short-term rental ban alternative."

### Where AI is used
- **In the product:** drafting the state-specific furnished lease and security-deposit clause for a 30–90 day term (governed by different rules than a one-night stay or a 12-month lease), a turnover checklist calibrated to furnished-inventory condition, and a utility bill-back estimator.
- **To build it:** lease-clause drafting per state reuses the same 50-state template approach used elsewhere in this research; the hard, ongoing piece is correctly scoping which state landlord-tenant protections apply once a stay crosses the 30-day threshold — they generally apply in full.

### MVP
- **Doing:** furnished-property listing sync, FCRA-compliant screening integration, state-specific 30–90 day lease generation and e-sign, a furnished-inventory condition checklist, a utility bill-back calculator, and turnover scheduling between mid-term tenants.
- **Not doing:** nightly STR features, building a competing marketplace (list on Furnished Finder instead), and traditional 12-month leasing.
- **Effort:** 8 weeks.
- **Dependencies:** an FCRA-compliant screening partner (not a DIY background check), e-signature, state landlord-tenant templates, Stripe.
- **Hardest part:** once a stay is legally a tenancy rather than a hotel stay, standard landlord-tenant law (notice periods, deposit limits) applies in full, and getting that wrong creates real host liability the product must not paper over.

### Score and verdict
Pain 4 · Solo 4 · AI 3 · Gap 3 · WTP 3 · Reach 3 = **20/30**. A genuine regulation-driven pivot with a marketplace incumbent that doesn't do operations and a long-term-lease incumbent that doesn't understand furnished, 30–90 day stays; the legal-classification risk is real but manageable with good content and a clear scope.

---

## 60. STR cleaning company operations (the vendor side)

**One-liner.** Crew scheduling, per-turn photo checklists and per-host billing built for cleaning companies that service many short-term rental clients — the vendor side of idea 15's host-side turnover-ops problem, not a restatement of it.

### Problem statement
This is the vendor-side mirror of idea 15 in this research (short-term rental turnover operations), which found the host-facing tool "crowded and bundled" and scored it 15/30; the cleaning-company side is served just as densely. ResortCleaning charges $5/property/month on its Industry tier ($20/month minimum) or $7/property with inventory management ($80/month minimum); Properly starts at $12.99/property/month, falling toward $5 at volume; ZenMaid runs roughly $49–99/month plus $9 per additional cleaner seat. Turno operates what it calls the industry's largest cleaner marketplace, claiming 55,000+ vacation-rental cleaning professionals in one piece of its own marketing (a separate figure of 126,000+ appears elsewhere in Turno's materials and the two are not reconciled) across the US, Canada, Europe and Australia — meaning a new entrant competes for cleaner acquisition against a two-sided network effect that already exists. TIDY, a fully managed marketplace rather than software, prices at roughly 3.9% of the booking value plus 3.9% of the cleaning fee, and Breezeway bundles a vendor portal into its host-facing, from-$19/unit/month inspection product rather than selling it standalone.

### Who experiences the problem
Independent and small cleaning companies (roughly 2–20 crews) that specialize in, or substantially serve, STR turnovers. A national count of STR-specific cleaning businesses was not found; Turno's marketplace size is the closest available proxy, and it is itself internally inconsistent (see above). The buyer is the cleaning-company owner; the users are crew members and the owner's office staff.

### Value of solving it
Faster per-turn billing and fewer missed cleans reduce the late fees hosts impose and the reputational damage from a review that traces back to a dirty unit; not independently quantified for this segment.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| ResortCleaning | $5/property/mo ($20 min); $7 with inventory ($80 min) | Already the cheapest incumbent — sets the price floor |
| Properly | $12.99/property/mo, falling to ~$5 at volume | Also bundles marketplace access |
| ZenMaid | ~$49–99/mo + $9/extra seat | A general cleaning-business tool, not STR-specific |
| Turno (cleaner side) | Free to join; hosts pay $8–10/property/mo | Owns the largest cleaner marketplace already |
| TIDY | ~3.9% of booking value + 3.9% of cleaning fee | A managed marketplace, not self-serve software |
| Breezeway vendor portal | Bundled from ~$19/unit/mo (a host-side product) | The vendor view is a feature, not something sold on its own |

### Pricing model
Flat $39/month per cleaning company for up to 15 serviced properties, $79/month for up to 40 — priced against ZenMaid's floor rather than ResortCleaning's, since per-property pricing has already been driven down to $5.

### Path to profitability
At $45 ARPU you need 112 cleaning companies for $5k MRR and 223 for $10k, against at least five incumbents already pricing at or below that level. Running costs are low — a simple photo checklist needs no vision-model spend beyond a pass/fail classification. Distribution: referrals from host-side turnover tools like idea 15, Turno's own cleaner marketplace as an unpaid discovery channel, and cleaning-industry Facebook groups.

### Where AI is used
- **In the product:** photo QA against a reference set per room, bilingual (English/Spanish) checklists and instructions for crews, and automatic supply-reorder flags.
- **To build it:** standard mobile capture plus a small vision-classification step; nothing here is a hard research problem, which is also why it is easy for every incumbent listed above to already have it.

### MVP
- **Doing:** crew scheduling from host iCal feeds, a photo checklist with pass/fail QA, per-host per-turn invoicing, Stripe Connect payouts, and 1099-NEC generation for contractor cleaners (threshold now $2,000 for payments made after 31 December 2025 under the One Big Beautiful Bill Act, up from $600).
- **Not doing:** building a cleaner marketplace (Turno already has one at scale), dynamic pricing, guest messaging.
- **Effort:** 6 weeks.
- **Dependencies:** iCal/PMS calendar feeds, Stripe Connect, 1099 e-filing, SMS with TCPA consent for crew alerts.
- **Hardest part:** ResortCleaning and Properly already sell this exact workflow at $5–13 per property, and Turno's marketplace network effect makes cleaner acquisition someone else's job today, not this product's.

### Score and verdict
Pain 3 · Solo 4 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **16/30**. A real workflow that at least five funded competitors already sell at or below a sustainable price point; worth building only as a feature bolted onto a broader tool, not as a standalone bet.

---

## Cluster summary

| # | Idea | Score | ARPU $ | Customers to $10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 56 | STR permit, registration and lodging-tax compliance tracker | **20** | 69 | 145 | 6 |
| 59 | Mid-term rental leasing and operations for STR-ordinance pivots | **20** | 59 | 170 | 8 |
| 58 | STR damage-claim evidence and resolution pack | **19** | 29 | 345 | 5 |
| 57 | Owner statements, trust accounting and 1099s for small STR managers | **18** | 99 | 101 | 7 |
| 60 | STR cleaning company operations (the vendor side) | **16** | 45 | 223 | 6 |

Two candidates from the original brief were considered and kept rather than swapped. Idea 60 (cleaning-company ops) was checked against a reserve candidate — a bookkeeping and material-participation ("STR loophole") tax tool — but that space turned out to be at least as crowded: REPSLog, REPStracker, REPS Time and HourProof already sell AI-assisted material-participation hour logging at $10–17/month, so the swap would not have improved the Gap score. Guest-messaging AI and dynamic pricing were excluded per the brief as already crowded (Hospitable, HostAI, Besty for messaging; PriceLabs, Wheelhouse, Beyond for pricing) and no evidence surfaced during this research to overturn that call.

## Sources
- https://stayfi.com/vrm-insider/2026/04/20/vacation-rental-statistics/
- https://www.prnewswire.com/news-releases/steady-demand-and-slower-new-supply-define-us-short-term-rentals-in-2026-airdna-finds-302820776.html
- https://www.avalara.com/mylodgetax/en/index.html
- https://strspecialist.com/reviews/avalara-mylodgetax-tax-compliance-review
- https://www.avalara.com/mylodgetax/en/blog/2026/01/a-year-of-change-for-short-term-rentals-2025-regulation-trends-and-2026-outlook.html
- https://www.avalara.com/mylodgetax/en/blog/2024/07/florida-governor-vetoes-short-term-rental-bill.html
- https://floridaphoenix.com/2024/06/27/desantis-vetoes-short-term-vacation-rental-bill/
- https://www.sandiego.gov/treasurer/short-term-residential-occupancy
- https://oodahost.com/blog/san-diego-str-regulations-2025-owner-guide-licensing-tot
- https://www.nyc.gov/site/specialenforcement/news/new-yorkers-registered-to-host-surpassed-3500-for-first-time.page
- https://www.minut.com/blog/los-angeles-short-term-rental-laws
- https://bramnicklawaz.com/uncategorized/changes-to-arizona-laws-for-vacation-and-short-term-rentals-hb-2672/
- https://www.bnbcalc.com/blog/short-term-rental-regulation/Scottsdale-Arizona-guide
- https://awning.com/post/texas-short-term-rental-laws
- https://www.ownerrez.com/pricing
- https://www.ownerrez.com/features/statements
- https://www.hostfully.com/compare/hostfully-vs-guesty/
- https://www.roommaster.com/blog/hostfully-pricing
- https://awning.com/post/guesty-review
- https://relayfi.com/blog/best-airbnb-accounting-software/
- https://skift.com/2024/10/16/airbnb-launches-host-and-co-host-matchmaker-service/
- https://www.forbes.com/sites/geoffwhitmore/2024/10/17/airbnb-launches-co-host-network/
- https://www.avalara.com/blog/en/north-america/2025/07/one-big-beautiful-bill-act-1099-reporting-threshold.html
- https://www.patriotsoftware.com/blog/accounting/1099-reporting-threshold/
- https://www.airbnb.com/help/article/279
- https://www.gowithsurge.com/blog/airbnb-host-damage-protection
- https://rapideyeinspections.com/blog/airbnb-aircover-damage-claim-guide/
- https://www.vrbo.com/tlp/trust-and-safety/damage-deposit-policy
- https://rapideyeinspections.com/blog/vrbo-damage-claim-guide-2026/
- https://truvi.com/blog/vrbo-damage-protection/
- https://www.guesty.com/marketplace-items/truvi/
- https://safely.com/guest-screening/
- https://www.uplisting.io/blog/best-vacation-rental-insurance
- https://waivo.io/
- https://www.autohost.ai/pricing/
- https://www.breezeway.io/pricing
- https://www.furnishedfinder.com/blog/keycheck-by-furnished-finder-tenant-screening-rent-payments-and-more
- https://hospitable.com/furnished-finder-fees
- https://www.hemlane.com/pricing/
- https://www.hemlane.com/resources/mid-term-rentals/
- https://www.abstaffing.com/travel-nursing-statistics/
- https://help.turno.com/en/articles/2142069-what-are-the-fees-for-using-turno-as-a-host
- https://turno.com/for-cleaner/
- https://turno.com/pricing/
- https://www.resortcleaning.com/pricing
- https://www.cleanbizsoftware.com/zenmaid-pricing/
- https://www.tidy.com/services/vacation-rental-cleaning
- https://getproperly.com/
- https://www.reps-log.com/
- https://www.hourproof.app/
- https://www.reihub.net/resources/short-term-rental-tax-loophole/
- https://www.baselane.com/short-term-rentals
