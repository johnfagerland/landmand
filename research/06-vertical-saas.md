# 06 — Vertical SaaS: health, education, hospitality, associations (ideas 44–50)

Seven ideas in verticals where the buyer is a clinic, a teacher, a restaurant, a nonprofit, a tour operator or a volunteer board. These are the classic "vertical SaaS" plays and the research shows why most are hard for a solo founder: the buyers with money (clinics) sit behind practice-management systems that gate integrations and bundle the feature; the buyers without money (teachers, clubs) already have free or near-free tools that are loved. One idea (46) has strong clinical evidence and business-grade pricing; two (47, 48) have a specific Nordic gap; the rest are documented so they can be ruled out with reasons.

Scores use the framework in [00-overview.md](00-overview.md#4-scoring-framework); the full ranking is in [09-scorecard.md](09-scorecard.md).

---

## 44. Physiotherapy home-exercise programme builder

**One-liner.** A clinician builds a video exercise programme in two minutes from the assessment note; the patient gets an app that tracks adherence and pain; the clinician sees who is falling behind.

### Problem statement
Non-adherence to home exercise is 50–70% in low-back-pain populations; only about 35% of physiotherapy patients fully complete what is prescribed. Video delivery raised adherence to 76% at three months versus 55% for paper handouts, and a meta-analysis of ten trials found digital delivery better in seven. The category is mature: Physitrack (€22.95 a month, 15,000+ videos), Rehab Guru (free to £20), SimpleSet ($11–15), MedBridge ($325 a year), and in Norway ExorLive with an AI programme builder. Sword Health paid $285 million for Kaia Health in January 2026, so consolidation is happening above. The gates are real: EU guidance (MDCG 2019-11, revised June 2025) lists "software assisting patients in performing therapy exercises" as potential medical-device software, Class I at minimum, and patient data is GDPR Article 9 health data.

### Who experiences the problem
Physiotherapists, chiropractors and occupational therapists in private practice: Norway has over 18,000 authorised physiotherapists, Denmark about 5,500 in private clinics, Sweden about 13,800; the US 283,700. The buyer is the clinic owner or solo practitioner; the users are clinician and patient.

### Value of solving it
Adherence lifts of 10–20 percentage points, and in the US billable remote therapeutic monitoring (Physitrack sells it at $30 a month plus $8 per active patient). But practitioner spend is only €120–280 a year per seat, so the argument is outcomes and minutes saved, not licence savings.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Physitrack (UK/Finland) | €22.95/mo; RTM add-on | Auto-logout and iOS complaints, price |
| Rehab Guru (UK) | Free to 6 clients; £10–£20/mo; AI assistant | Sets the floor |
| SimpleSet (Canada) | $11–$15/mo | Cheap |
| MedBridge (US) | $325/yr individual; per-episode overage for groups | Complex |
| ExorLive (Norway) | About NOK 400–500 per user/mo (unconfirmed); 9,510 exercises; AI builder | Nordic incumbent |
| Physiotools, Wibbi, Exercise Pro Live, HEP2go | £109 packs to free | Long tail |

### Pricing model
Per practitioner per month at €10–25; the band is set.

### Path to profitability
At €18 ARPU you need 278 clinicians for €5k MRR and 556 for €10k, against incumbents with 15,000-video libraries and association discounts. The video library is the moat and costs more than a solo founder can produce.

### Where AI is used
Drafting programmes from assessment notes (already shipping at ExorLive and Rehab Guru, so table stakes), auto-progression, message summarisation, voice-to-programme. Camera form-checking and "AI adjusts your rehab" push the software toward Class IIa and add liability.

### MVP
- **Doing / not doing:** not recommended. The content library, the medical-device qualification and the health-data obligations make this a poor solo bet regardless of build speed.
- **Effort:** 10 weeks plus content.
- **Dependencies:** exercise video licence or production, patient app, clinic-system integrations (Cliniko API documented; Nordic systems not found), GDPR Article 9 processing agreements, MDR Class I self-declaration.
- **Hardest part:** the library and the regulatory qualification.

### Score and verdict
Pain 3 · Solo 2 · AI 3 · Gap 1 · WTP 2 · Reach 3 = **14/30**. Mature, gated, cheap. Skip.

---

## 45. Independent tutor and music teacher management

**One-liner.** Scheduling, make-up credits, invoicing with Vipps and MobilePay, lesson notes and parent updates for a teacher with 20–60 students.

### Problem statement
The incumbents are old and loved but dated: My Music Staff and TutorBird charge $16.95 a month plus $4.95 per extra teacher, have limited booking widgets, pool make-up credits and lack a native mobile app; TutorCruncher has a steep learning curve. Municipal music schools in the Nordics are served by SpeedAdmin (700 schools, 2 million users) through public procurement. The UK has about 10,000 full-time tutors and 200,000 who tutor part-time; the US self-enrichment-teacher occupation is growing 20% a decade. Nordic independent-teacher counts were not found, and marketplaces list only tens of music tutors per category in Norway.

### Who experiences the problem
Independent teachers and 1–8 teacher studios. The buyer is the teacher; the users are teacher, parents and students.

### Value of solving it
Fewer missed lessons, faster payment, less admin. No study quantifies it; willingness to pay is $15–20 a month.

### Main competitors
| Product | Published pricing |
|---|---|
| My Music Staff, TutorBird | $16.95/mo + $4.95 per teacher |
| Teachworks | $16.49–$187.99/mo plus per-lesson fees |
| TutorCruncher | $30–$80/mo plus 1% |
| Fons, Duet | $19.95/mo; $20/mo + 1% |
| Bizzly (UK entrant) | £19–£49/mo flat |
| Acuity + Stripe | $20–$61/mo |
| SpeedAdmin (Denmark) | Municipal tenders |

### Pricing model
Flat $15–20 a month.

### Path to profitability
At €17 ARPU you need 294 teachers for €5k MRR and 588 for €10k, against fifteen-year-old incumbents and "Calendly plus Stripe". Not attractive.

### Where AI is used
Lesson-note and practice-plan drafting from voice after each lesson, parent progress summaries, invoice chasing. Useful but small; recording minors raises consent issues.

### MVP
- **Doing / not doing:** not recommended as a business; fine as a side project with Vipps and MobilePay as the Nordic hook.
- **Effort:** 5 weeks.
- **Dependencies:** Stripe, Vipps/MobilePay, calendar sync, SMS.
- **Hardest part:** tiny ARPU.

### Score and verdict
Pain 2 · Solo 5 · AI 3 · Gap 2 · WTP 2 · Reach 3 = **17/30**. Easy, pleasant, too small.

---

## 46. Small clinic recall and no-show reduction

**One-liner.** Two-way SMS recalls and reminders for dental, vet and physio clinics that understand "can I move it to Thursday", rebook automatically, and backfill cancelled slots from a waitlist, with a no-show risk score per appointment.

### Problem statement
Dental no-show rates run 15–20% (up to 30% in some practices), and each missed slot costs $200–400 in production. The evidence for the fix is unusually strong: a Cochrane review of eight trials found SMS reminders raised attendance from 67.8% to 78.6%, as effective as phone calls and 55–65% cheaper. Recall (getting patients back for hygiene visits) is the revenue engine, which is why Weave and Solutionreach include it in every tier. But the US tools are quote-only, phone-bundled and on annual contracts, and the practice-management systems increasingly include basic reminders (Cliniko, Provet, Dentally). The Nordic angle: Vetstoria charges Nordic vets €249 a month for what costs €199 elsewhere in the EU, which shows both willingness to pay and thin competition; the Nordic dental systems (Opus Dental, Aspit, Physica) have no public integration terms.

### Who experiences the problem
Norway has about 4,900 dentists, 3,700 in private practice, in a NOK 13.6 billion private market; Denmark 1,358 dental clinics; Sweden 4,202 private-practice dentists; plus physio clinics (idea 44) and vet clinics (count not found). The buyer is the owner or office manager; the user is reception.

### Value of solving it
One recovered slot a day at $200–400 is $50k+ a year; the Cochrane effect on a 20-patient day is about two slots. SMS costs cents.

### Main competitors
| Product | Positioning | Published pricing | Gap |
|---|---|---|---|
| Weave (US) | Reminders, recall, payments, phones | From $199/mo; quote tiers | US, phone bundle |
| Solutionreach, NexHealth, RevenueWell, Dental Intelligence (US) | Patient communication | Quote; annual contracts | US |
| Vetstoria (UK/Norway) | Vet booking and reminders | Nordic €249–€449/mo per location | Premium Nordic pricing |
| PetDesk | Vet reminders | Quote | US |
| Provet Cloud, Cliniko, Dentally, Pabau, Semble | Practice-management systems with reminders | $45–$395/mo; £125–£320/mo | Bundling; one-way reminders |
| Nordic PMS (Opus Dental, Aspit, Physica) | Journal systems | Integration terms not found | Gate |

### Pricing model
Per location: NOK 1,290 a month including 1,000 messages, NOK 2,490 for multi-chair clinics; SMS at cost beyond.

### Path to profitability
At €150 ARPU you need 34 clinics for €5k MRR and 67 for €10k, from thousands of Nordic clinics that are all listed in public registers. Costs: SMS (NOK 0.7 per message) and LLM intent handling (cents). Clinics churn slowly once recall lists live in the tool. The gate is integration: without a feed from the practice-management system the tool needs CSV imports or a partnership; the first version should pick one system with an API (Cliniko for physio, Provet for vets) and one country.

### Where AI is used
- **In the product:** two-way SMS intent handling (reschedule, cancel, question) with automatic rebooking and waitlist backfill, no-show risk scoring from history, personalised recall copy in the patient's language, summarising replies for reception. This is the differentiator over one-way reminders and is well within current model capability. A full voice receptionist in Nordic languages belongs to idea 43.
- **To build it:** SMS gateway, scheduling logic and dashboards are standard; the PMS connectors are the work.

### MVP
- **Doing:** one vertical (vet or physio) with an API-equipped system, appointment sync, reminder and recall sequences, two-way SMS with AI intent and rebooking, waitlist backfill, no-show risk flag, weekly recovered-revenue report.
- **Not doing:** payments, phones, online booking widgets, dental until a PMS partnership exists.
- **Effort:** 7 weeks.
- **Dependencies:** Cliniko or Provet API, Twilio or 46elks Nordic numbers, GDPR Article 9 data-processing agreement, EU hosting, Norway's health-information security code (Normen) to be checked.
- **Hardest part:** integration access controlled by incumbents, and the fact that basic reminders are becoming free.

### Score and verdict
Pain 4 · Solo 3 · AI 4 · Gap 2 · WTP 4 · Reach 3 = **20/30**. The best vertical idea here: clinical evidence, business-grade pricing, reachable buyers, and an AI wedge (two-way handling and backfill) that the bundled reminders do not have. The PMS gate decides it.

---

## 47. Restaurant allergen matrix and menu compliance

**One-liner.** Upload supplier spec sheets and recipes; the tool extracts allergens and "may contain" warnings, builds the dish-level allergen matrix the law requires, publishes it as a QR menu, and logs staff training.

### Problem statement
EU Regulation 1169/2011 has required allergen information for non-prepacked food since December 2014 (14 allergens), with national enforcement; the UK's Natasha's Law added full ingredient labelling for prepacked-for-direct-sale food. Restaurants rebuild the allergen matrix by hand at every menu change. The UK tools are entrenched but dated (Nutritics reviewers call it "horrendously slow" and unchanged in years; Kafoodle has setup and sync complaints), MenuCalc is US-only, and no AI-native allergen extractor was found. Verbal disclosure remains legal in most EU states, which lowers urgency.

### Who experiences the problem
About 1.5 million EU food and beverage service enterprises; roughly 29,000 restaurant and catering companies in Sweden, an unverified 7,700 restaurants in Norway. The buyer is the owner or manager; the user is the chef.

### Value of solving it
Avoided improvement notices, prosecutions and reputational loss; hours per menu change; label reprints. Nothing quantified.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Nutritics (Ireland) | Quote; about $21 per feature/mo | Slow, dated |
| Kafoodle (UK) | About £20 per feature/mo | Setup complaints |
| Erudus (UK) | Subscription; 92,000 manufacturer specs | UK data |
| FoodDocs (Estonia) | $79–$299 per site/mo | HACCP-first |
| MarketMan, Apicbase | $249+/mo; quote from 5 outlets | Inventory-first |
| Menu Tiger | Free to $119/mo | QR menus without allergen logic |

### Pricing model
Per site: NOK 349 a month, NOK 690 with staff training logs and multi-site.

### Path to profitability
At €40 ARPU you need 125 restaurants for €5k MRR and 250 for €10k. Restaurants fail often and are price-sensitive, so churn is high; the association channel (NHO Reiseliv, Horesta, Visita) and the overlap with idea 40's producer tool are the distribution.

### Where AI is used
Extracting ingredients and allergens from supplier spec PDFs, photos and Open Food Facts into the recipe-to-dish matrix, menu translation, generating staff training quizzes. High value; human sign-off is mandatory because a missed allergen is a safety event.

### MVP
- **Doing:** spec-sheet upload and extraction, recipe builder with allergen roll-up, dish matrix PDF and QR menu, change log, staff training record.
- **Not doing:** nutrition declarations (idea 40), inventory, POS integration.
- **Effort:** 6 weeks.
- **Dependencies:** Open Food Facts API, Matvaretabellen, supplier PDFs, LLM, QR hosting.
- **Hardest part:** liability and low willingness to pay.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 2 · Reach 3 = **18/30**. A real extraction problem with dated incumbents, in a customer base that churns and pays little. Better as a module of idea 40.

---

## 48. Nonprofit grant discovery, deadline tracking and AI proposal drafting

**One-liner.** A profile of the organisation, a searchable database of foundations and public schemes, a deadline calendar, and proposal drafts written from the organisation's past applications.

### Problem statement
In the US the category is large and funded: Instrumentl (4,500+ customers, $55 million raised in 2025, about $8.9 million ARR estimated) charges $299–999 a month; Candid Premium $219 a month; Grantable offers AI drafting from $50. In the Nordics the tooling is a decade behind: Denmark's Legatbogen is a free search engine with a DKK 129 a month premium tier, and Norway's Legathåndboken is still an annual printed book. Grant Assistant customers claim 50–90% reductions in proposal time.

### Who experiences the problem
Small nonprofits, associations and foundations: the US has 1.9 million nonprofits; Norway 7,354 sports clubs alone, Denmark 11,000, Sweden 18,000, plus cultural, social and religious organisations whose totals were not found. The buyer is the director or fundraiser.

### Value of solving it
Grants won and hours saved per proposal (unquantified but large for volunteer-run organisations). Nordic willingness to pay is anchored at DKK 129 a month by Legatbogen.

### Main competitors
| Product | Published pricing | Gap |
|---|---|---|
| Instrumentl (US) | $299–$999/mo | US data, price |
| GrantStation, Candid (US) | $199–$699/yr; $219/mo | US data |
| Grantable (US) | Free; $50–$150/mo; AI drafting | No Nordic data |
| Legatbogen (Denmark) | Free; DKK 129/mo premium | Search only, no drafting |
| Legathåndboken (Norway) | Printed book | |
| Submittable, Foundant, Fluxx | Grantmaker side | |

### Pricing model
NOK 490 a month per organisation with unlimited users; consultant tier NOK 1,490 for multiple clients.

### Path to profitability
At €60 ARPU you need 84 organisations for €5k MRR and 167 for €10k. The moat and the cost are the same: a maintained database of Norwegian foundations (the Stiftelsesregisteret is public) and public schemes, plus deadline extraction. Distribution: Frivillighet Norge, sports federations, municipal culture offices. Overlaps with idea 7 (the agricultural variant) and idea 50 (clubs).

### Where AI is used
Semantic matching of the organisation profile to opportunities, deadline and eligibility extraction from foundation websites, proposal drafting from an "organisation memory" of past applications, report drafting. Auto-submission and hallucinated deadlines are the risks.

### MVP
- **Doing:** Norway. Foundation database from the public register enriched by scraping, profile-based matching, deadline calendar, proposal drafting with past-application memory, Word export.
- **Not doing:** US data, submission, grantmaker features.
- **Effort:** 7 weeks plus database build.
- **Dependencies:** Stiftelsesregisteret, foundation websites, LLM.
- **Hardest part:** data maintenance and volunteer organisations' willingness to pay.

### Score and verdict
Pain 3 · Solo 3 · AI 4 · Gap 3 · WTP 2 · Reach 3 = **18/30**. A genuine Nordic gap (a printed book is the incumbent) with weak willingness to pay. Consider merging with idea 7 into one Nordic grant tool sold to advisors and consultants.

---

## 49. Small tour and activity operator booking, waivers and capacity

**One-liner.** Bookings, capacity, digital waivers, guide assignment and weather-driven cancellation messaging for guided hikes, kayak and boat charters and small attractions, at a flat price instead of a 6% commission.

### Problem statement
FareHarbor charges 6% per direct booking plus 1.9% + $0.30 processing, effectively 9–11% of every sale, with a further OTA fee reportedly added in 2026; operators actively search for alternatives. The alternatives are €49–249 a month plus 1–3% (Rezdy, TrekkSoft, Checkfront, Regiondo) or free tiers tied to the online travel agencies (Bókun, owned by Viator, is free with 0% on Viator bookings). The EU Package Travel Directive revision was approved by Parliament in March 2026, and Norway's package-travel law requires a travel guarantee only for arrangements over 24 hours with an overnight stay.

### Who experiences the problem
Guided-activity operators, charter boats, ski and climbing guides, small attractions; counts were not found. The buyer is the owner; users are guides and customers.

### Value of solving it
An operator with €200k of online sales pays about €12k a year in FareHarbor fees versus €600–3,000 on flat plans; weather cancellations are handled by hand today.

### Main competitors
| Product | Model | Gap |
|---|---|---|
| FareHarbor (Booking Holdings) | 6% + processing, no monthly | Fees |
| Peek Pro, Xola, Beyonk | 4–6% commission | Fees; weak for rentals |
| Bókun (Viator) | Free; $49–$499/mo + 1–1.5% | OTA lock-in |
| Rezdy, Checkfront, TrekkSoft, Regiondo | €49–€249/mo + 1–3% | Similar to each other |
| Smartwaiver | From $19/mo | Waivers only |

### Pricing model
NOK 590 a month flat with payment at cost, no booking fee.

### Path to profitability
At €90 ARPU you need 56 operators for €5k MRR and 111 for €10k. Seasonality is brutal (most Nordic operators earn in three months), and the online travel agencies control demand. Distribution: Visit Norway regional bodies, NHO Reiseliv, Norwegian and Danish adventure tourism associations.

### Where AI is used
Weather-driven cancellation and reschedule messages drafted per booking from met.no forecasts, review replies, multilingual listings, capacity forecasts. Useful but not decisive.

### MVP
- **Doing:** products and schedules, capacity, online checkout with Vipps/MobilePay/cards, digital waivers, guide assignment, met.no-driven weather alerts with drafted customer messages, iCal export.
- **Not doing:** OTA channel management at launch (v2 via Viator or Bókun), package travel, gift cards.
- **Effort:** 7 weeks.
- **Dependencies:** Stripe, Vipps, MobilePay, met.no, e-signature, later Viator Partner API.
- **Hardest part:** seasonality and OTA-owned distribution.

### Score and verdict
Pain 3 · Solo 3 · AI 3 · Gap 2 · WTP 3 · Reach 3 = **17/30**. A fee-driven switching market that the online travel agencies are steadily absorbing. Skip unless you are embedded in a tourism region.

---

## 50. Club and association membership, dues and volunteer scheduling

**One-liner.** Members, dues with Vipps and MobilePay, events, volunteer shift scheduling and communications for sports clubs, choirs and community organisations.

### Problem statement
The Nordics have about 36,000 sports clubs alone (7,354 in Norway with 1.86 million memberships, 11,000 in Denmark with 2.8 million, 18,000 in Sweden). Spond, the Norwegian communication app, is free and reached 3 million monthly active users in 2024, monetising through club websites (NOK 499 a month) and payments. The paid incumbents are dense and local: Rubic (NOK 600–1,800 a month plus 2.5% and an NOK 850 volunteer module), Conventus (free to DKK 175 a month), KlubModul (DKK 9,995 one-off), Foreningsadministrator (DKK 69–129), and a new Danish freemium entrant, Skøn Forening. Volunteer boards are slow, price-sensitive and turn over annually.

### Who experiences the problem
Volunteer treasurers and boards; members, parents and volunteers.

### Value of solving it
Treasurer hours, payment-fee spread, volunteer shift scheduling (which Rubic charges NOK 850 a month for). No hours-saved study.

### Main competitors
| Product | Published pricing |
|---|---|
| Spond (Norway) | Free; club website NOK 499/mo |
| Rubic (Norway) | NOK 600–1,800/mo plus fees and modules |
| Conventus, KlubModul, Foreningsadministrator, Skøn Forening (Denmark) | Free to DKK 175/mo; DKK 9,995 one-off; DKK 69–149/mo |
| Wild Apricot, Join It, ClubExpress, Hello Club (US/NZ) | $29–$226/mo |
| TeamSnap, MemberPress | Free to $499/yr |

### Pricing model
Member-band flat monthly with transaction fees, matching the market.

### Path to profitability
At €40 ARPU you need 125 clubs for €5k MRR and 250 for €10k, against Spond free and four local incumbents. Not attractive.

### Where AI is used
Drafting member communications and annual-meeting minutes, dues chasing, volunteer shift matching by availability, municipal grant application drafting (overlap with idea 48). Nice, not decisive.

### MVP
- **Doing / not doing:** not recommended; the volunteer-scheduling module with AI matching could be sold as an add-on to existing systems instead.
- **Effort:** 7 weeks.
- **Dependencies:** Vipps MobilePay recurring payments, KID/OCR references, Danish Betalingsservice, sports-federation identity systems, SMS.
- **Hardest part:** Spond.

### Score and verdict
Pain 2 · Solo 3 · AI 3 · Gap 1 · WTP 2 · Reach 4 = **15/30**. Reachable, lovable, and already served for free. Skip.

---

## Cluster summary

| # | Idea | Score | ARPU € | Customers to €10k MRR | MVP weeks |
|---|---|---|---|---|---|
| 46 | Clinic recall and no-show reduction | **20** | 150 | 67 | 7 |
| 47 | Restaurant allergen matrix | **18** | 40 | 250 | 6 |
| 48 | Nonprofit grant discovery and drafting | **18** | 60 | 167 | 7 |
| 45 | Tutor and music teacher management | **17** | 17 | 588 | 5 |
| 49 | Tour and activity operator booking | **17** | 90 | 111 | 7 |
| 50 | Club membership and volunteers | **15** | 40 | 250 | 7 |
| 44 | Physio home-exercise builder | **14** | 18 | 556 | 10 |

## Sources
- https://support.physitrack.com/article/159-how-much-does-physitrack-cost
- https://www.physitrack.com/insights/why-patients-stop-home-exercises-adherence-data
- https://www.physitrack.com/insights/physitrack-reviews
- https://www.physio-pedia.com/Adherence_to_Home_Exercise_Programs
- https://www.rehabguru.com/pricing
- https://simpleset.net/pricing/
- https://otpotential.com/blog/medbridge-group-discounts
- https://www.exorlive.com/no/klinikkpakke
- https://health.ec.europa.eu/system/files/2020-09/md_mdcg_2019_11_guidance_en_0.pdf
- https://quickbirdmedical.com/en/medical-device-class-software-app-mdr/
- https://gdpr-info.eu/art-9-gdpr/
- https://www.mobihealthnews.com/news/sword-health-acquires-kaia-health-285m
- https://fysio.no/om-oss
- https://www.fysio.dk/om-os/hvem-er-vi/medlemstal
- https://www.bls.gov/ooh/healthcare/physical-therapists.htm
- https://www.mymusicstaff.com/pricing/
- https://www.tutorbird.com/pricing/
- https://teachworks.com/pricing
- https://www.capterra.com/p/145838/TutorCruncher/pricing/
- https://fons.com/pricing
- https://www.duetpartner.com/pricing
- https://www.bizzly.net/guides/mymusicstaff-alternatives
- https://www.acuityscheduling.com/pricing
- https://www.speedadmin.com/no/om-oss
- https://www.ib-tutoring.net/how-many-tutors-are-in-the-uk
- https://www.cochrane.org/CD007458/EPOC_mobile-phone-messaging-reminders-attendance-healthcare-appointments
- https://clerri.com/blog/dental-patient-no-show-statistics
- https://tensorlinks.com/blog/true-cost-of-no-show-appointments/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9680883/
- https://www.getweave.com/pricing/
- https://www.solutionreach.com/pricing
- https://www.nexhealth.com/pricing
- https://www.vetstoria.com/pricing/
- https://www.provet.com/pricing
- https://www.cliniko.com/pricing/
- https://docs.api.cliniko.com/
- https://www.dentally.com/pricing
- https://www.twilio.com/en-us/sms/pricing/no
- https://www.tannlegeforeningen.no/arkiv/nyhetsarkiv/nyheter/2024-06-24-ny-rapport-om-den-private-tannhelsetjenesten.html
- https://dentamatch.dk/hvor-mange-tandlaeger-er-der-i-danmark/
- https://ptl.se/branschfakta/tandvarden-i-siffror/
- https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32011R1169
- https://lovdata.no/dokument/SF/forskrift/2014-11-28-1497
- https://www.gov.uk/government/publications/allergen-guidance-for-food-businesses/allergen-guidance-for-food-businesses
- https://www.capterra.com/p/173920/Nutritics-Labelling/
- https://www.capterra.com/p/197380/Kafoodle-Kitchen/
- https://www.menucalc.com/pricing
- https://erudus.com/
- https://www.fooddocs.com/pricing
- https://get.apicbase.com/pricing/
- https://www.marketman.com/pricing
- https://www.menutiger.com/pricing
- https://www.matvaretabellen.no/api/
- https://openfoodfacts.github.io/openfoodfacts-server/api/
- https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/10092.pdf
- https://www.instrumentl.com/pricing
- https://theaiinsider.tech/2025/04/25/instrumentl-raises-55m-from-summit-partners-to-accelerate-their-ai-grant-fundraising-platform/
- https://getlatka.com/companies/instrumental.com
- https://grantstation.com/
- https://candid.org/pricing/
- https://learning.candid.org/number-of-nonprofits-in-us/272665
- https://www.grantable.co/pricing
- https://www.grantassistant.ai/
- https://www.legatbogen.dk/
- https://www.universitetsforlaget.no/legathandboken-2026
- https://equipdash.com/fareharbor-alternatives
- https://orhuk.com/blog/fareharbor-alternatives-2026-tour-operators
- https://www.reddit.com/r/smallbusiness/comments/134oz0a/experiences_with_peek_pro_or_fareharbor_or_other/
- https://www.xola.com/pricing/
- https://www.bokun.io/pricing
- https://rezdy.com/pricing/
- https://www.checkfront.com/pricing/
- https://www.trekksoft.com/en/pricing
- https://go.regiondo.com/pricing
- https://www.beyonk.com/pricing
- https://www.smartwaiver.com/pricing
- https://www.consilium.europa.eu/en/press/press-releases/2025/12/02/consumer-protection-council-and-parliament-strike-a-deal-on-revising-rules-on-package-travel/
- https://lovdata.no/dokument/NL/lov/2018-06-15-32
- https://docs.viator.com/partner-api/
- https://api.met.no/
- https://www.ssb.no/kultur-og-fritid/kultur/kulturstatistikk/idrett-og-friluftsliv/tabeller/tabell-1-antall-idrettslag-og-medlemskap-etter-idrettskrets
- https://www.dst.dk/da/Statistik/nyheder-analyser-publ/nyt/NytHtml?cid=54521
- https://idrottsstatistik.se/foreningsidrott/medlemmar/
- https://www.spond.com/news-and-blog/spond-3-million-monthly-active-users/
- https://help.spond.com/club/en/articles/179796-monthly-website-cost
- https://rubic.no/priser/
- https://web.conventus.dk/priser/
- https://www.klubmodul.dk/priser
- https://www.foreningsadministrator.dk/priser/
- https://skonforening.dk/pricing
- https://www.wildapricot.com/pricing
- https://www.joinit.com/pricing
- https://helloclub.com/pricing
- https://developer.vippsmobilepay.com/
