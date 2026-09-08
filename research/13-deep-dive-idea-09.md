# 13 — Deep dive: idea 9, fence-first measurement and instant quotes (8 September 2026)

*This is a decision document, not a new idea chapter. It re-examines idea 9 from [02-trades-field-service-property.md](02-trades-field-service-property.md#9-roof-fence-and-solar-measurement-with-instant-quotes-from-aerial-imagery) against the v2 findings and one further research pass focused on the four things a solo founder cannot afford to get wrong: patents, imagery licence terms, the real state of fence-measurement competition, and accuracy. Every fact below carries a source; anything not found is labelled so rather than guessed.*

---

## 1. Thesis and what this deep dive changes

The original thesis holds at the top: **build fence measurement first, add roofing second, treat solar as a later, shrinking add-on.** This pass sharpens two parts of that thesis and narrows one materially.

**Confirmed.** Free federal imagery and elevation data (USGS 3DEP, USDA NAIP) plus free-to-cheap cadastral data (county open-data portals, Regrid) still make a low-cost entrant possible against incumbents charging $13–105 per report. Google's Solar API still returns roof segments and pitch at $10 per 1,000 requests, removing the roof-facet ML problem for most US buildings. Residential solar demand is confirmed to be contracting: the Section 25D residential clean-energy credit terminated for systems placed in service after 31 December 2025 under the One Big Beautiful Bill Act (Public Law 119-21, signed 4 July 2025), while the business-claimed Section 48E credit — the one solar lessors and PPA providers use — continues through 2027 (SEIA; Congress.gov CRS product IN12611). That shifts who buys solar toward leasing companies, not cash homeowners, without reviving a case for building solar first.

**New, and it reinforces roofing-second.** Jobber already gives away a free, standalone roof-measurement tool (getjobber.com/free-tools/roof-measurement-tool) built on licensed EagleView imagery "as sharp as 1 inch," no account required. Housecall Pro still has no aerial-measurement or fence feature at any tier (contractortoolstack.com's 2026 Housecall Pro review). A paid roofing product now competes with a free lead magnet from the category's largest FSM platform, built on the same incumbent imagery this idea would want to avoid licensing. Housecall Pro's total absence from both roofing and fence measurement, meanwhile, is the one channel with no free substitute to beat — build a Housecall Pro listing alongside a Jobber one, not instead of it.

**New, and it narrows the fence thesis.** "Nobody serious plays" in fence measurement no longer holds. Two funded, live competitors now do close to what idea 9 proposes: **Visual Fence Pro** auto-loads the parcel/cadastral boundary from an address ("One Search. Instant Property Lines"), lets the user click-drag the fence line and add gates, and produces a bill of materials, covering all 50 states, Puerto Rico and Canada, at a discounted "founder rate" of $39/$89/$149 per month (Starter/Pro/Enterprise; regular $79/$179/$299) (visualfencepro.com, fetched September 2026); its "lock in the founder rate before 31 October 2026" language suggests a recent, still-small launch. **FenceTracer** is a Google-Maps-based fence estimator at $99–199/month (fencetracer.com; cleansavannah.com's 2026 roundup). FenceCloud, the incumbent named in the original chapters, still costs $220–545/month with satellite tracing only via a separate $99/month GeoDraw add-on (fervorstudio.ca; cleansavannah.com) — it remains the expensive, clunky option, but it is no longer the only alternative to nothing. **Revised verdict: fence is still the right place to start, but the wedge is now price and packaging against Visual Fence Pro and FenceTracer — neither ships a proposal-to-e-sign-to-payment flow or a Jobber/Housecall export — not empty-category first-mover advantage.** Trial Visual Fence Pro directly before proceeding past validation (section 7).

---

## 2. Data and imagery, verified

**Regrid (parcel/cadastral data).** Regrid's self-serve API ships two schema tiers, Standard and Premium, each including 2,000 parcel records and 200,000 map tiles per month, with overage at $0.10 (Standard) or $0.15 (Premium) per parcel record and $0.001 per tile (support.regrid.com/changelog/self-serve-api-plans, v2025.9.23). The base monthly price for each tier is **not published** — Regrid gates it behind account sign-up at app.regrid.com/api/plans, offering a 30-day free trial instead (regrid.com/api). Confirm the real number in a trial account before committing to a pricing model built on it.

**County open data.** Roughly 83% of the 3,164 US counties tracked by one aggregator have usable published parcel data (getparceldata.com), and aggregators claim 95–99.7% population coverage once county feeds are combined with state and commercial fill-in (uslandgrid.com's 2025 mid-year parcel review). Large counties publish parcels through free, no-key ArcGIS Hub portals — Maricopa County, AZ (data-maricopa.opendata.arcgis.com) and Wake County, NC (data-wake.opendata.arcgis.com) are two working examples fetched in this pass. Build a fallback path — Regrid first, the county's own ArcGIS REST endpoint second — rather than paying for national coverage on day one.

**Alternatives to Regrid.** ReportAll USA and LightBox both sell national parcel layers, and ATTOM sells parcel-linked property data; none of their self-serve prices were confirmed in this pass. Treat Regrid plus a county-GIS fallback as the working plan.

**USGS 3DEP.** The 3D Elevation Program's lidar point clouds and derived 1-metre DEMs are "available free of charge and without use restrictions" (usgs.gov/3d-elevation-program), accessible via AWS Open Data and USGS's own APIs — this is the slope-correction layer for both fence-line grading and roof pitch.

**NAIP.** USDA's National Agriculture Imagery Program is public-domain orthoimagery. Ground sample distance was 1–2 metres from 2002–2017; the 2018 standard moved to 0.6 metre with a 0.3-metre option, and the 2025 acquisition delivered roughly half the states at 60 cm and half at 30 cm (state GIS pages, e.g. gis.utah.gov's NAIP page; usgs.gov's National Map orthoimagery FAQ). The refresh cycle tightened from 5 years to "no more than 3 years, generally every other year," with about a third of the continental US flown each year (same USGS FAQ). NAIP suits manual roof-facet drawing as a fallback but is not sharp or current enough to rival EagleView's sub-inch, on-demand imagery — lean on Google's Solar API first and use NAIP only where Google has no coverage.

**Google Solar API.** Building Insights (roof segments, pitch, usable area) costs $10 per 1,000 requests with 10,000 free per month; Data Layers (raw raster) costs $75 per 1,000 with 1,000 free (developers.google.com/maps/documentation/solar/usage-and-billing). Coverage reaches "more than 95% of all buildings in the United States" at HIGH quality (0.1 m/pixel) or MEDIUM/BASE elsewhere (developers.google.com/maps/documentation/solar/coverage; mapsplatform.google.com's 2025 coverage post). This is licensed, pre-computed output, not raw imagery a customer traces — which matters directly for section 3.

**Google Maps Platform and Mapbox terms of service.** Both explicitly forbid tracing measurements from their base imagery. Google's terms prohibit "tracing or digitizing roadways, building outlines... from satellite imagery" and state that "programmatically reading and recording measurements (heights, distances, elevations, etc.)" is "derivative and prohibited," alongside a ban on "image analysis, machine interpretation, object detection/identification, geodata extraction" (cloud.google.com/maps-platform/terms/maps-service-terms). Mapbox's product terms similarly bar tracing, deriving or extracting content for commercial use, carving out only non-commercial and OpenStreetMap contributions (mapbox.com/legal/tos; Mapbox Product Terms, 2025-10). **Neither vendor's base imagery may be traced for a paid measurement product** — the architecture must rest on Regrid/county-parcel geometry (a licensed feed, not imagery tracing), USGS/NAIP (public domain), and Google's Solar API (a licensed, purpose-built output), never a Mapbox basemap used as the measurement source. A basemap is fine to *display* the property; it must not be what the software measures from.

**Building footprints.** Microsoft's US Building Footprints (1.2 billion+ ML-derived polygons from Bing imagery) are licensed under ODbL, its Global ML Building Footprints under CDLA Permissive 2.0 (github.com/microsoft/USBuildingFootprints; github.com/microsoft/GlobalMLBuildingFootprints). Overture Maps' buildings theme combines OpenStreetMap, Microsoft, Google Open Buildings and other ML footprints under ODbL (docs.overturemaps.org/guides/buildings). Both are free fallback layers where Google's Solar API has no coverage, but carry no pitch or facet detail.

---

## 3. Patent landscape

EagleView (through its subsidiary Pictometry International Corp.) holds one of the most litigated patent portfolios in small-business software. This is the single biggest risk in the idea, and the one place where "move fast" is the wrong instinct.

**The patents.** EagleView's roof-measurement reports are covered by, among others, US Patent Nos. 8,078,436; 8,145,578; 8,170,840; 8,209,152; 8,515,125; 8,542,880; 8,670,961; 8,818,770; 8,825,454; 9,135,737; 9,244,589; 9,329,749; 9,514,568; and 9,599,466 (compiled from EagleView's own report disclosures, cross-checked against Justia/Google Patents). The anchor patent, **US 8,515,125, "System and Process for Roof Measurement Using Aerial Imagery,"** issued 20 August 2013 to Pictometry, claims deriving roof area and pitch "directly from aerial imagery." Utility patents run 20 years from filing: the oldest of this group (filed roughly 2008–2011) starts expiring 2028–2031, the newest (2015–2017 filings) run into the mid-2030s. Treat none as expired yet.

**EagleView v. Xactware/Verisk — the deterrent case.** A 12-day jury trial found Xactware and parent Verisk Analytics willfully infringed EagleView's patents, awarding EagleView $125 million in September 2019 (prnewswire.com, release 300926615). A further ruling on 16 February 2021 added $250 million, for $375 million total, before the companies settled in November 2021, vacating the award and Verisk's appeal and lifting an injunction on some Verisk products (insurancejournal.com, 8 Nov 2021). EagleView has proven, to a jury, that it can shut down a well-funded rival's product line over these patents.

**EagleView v. Roofr — the one favourable data point.** EagleView sued Roofr in the District of Delaware from 2021, asserting US Patents 9,183,538 and 10,648,800, later amended to add the '840 patent (bloomberglaw.com, "Roofr Wipes Out Patents Underlying Delaware Infringement Suit"). The PTAB found the two originally asserted patents obvious and invalid in **July 2024**, and the Federal Circuit affirmed on appeal. That is real, recent evidence at least two of EagleView's aerial-roof patents failed a validity challenge — but it took Roofr a multi-year suit, a PTAB proceeding, and an appeal to get there, and it does not clear the rest of the portfolio. **No lawsuit against Hover, QuoteIQ, FenceCloud, Visual Fence Pro or FenceTracer was found** in this pass.

**EagleView v. Nearmap.** The two settled District of Utah litigation — dating to 2021, over "roofing measurement patents and other intellectual property matters" — on confidential terms on **29 May 2026** (globenewswire.com/news-release/2026/05/29/3303611). No dollar figure, patent numbers, or licence terms were disclosed.

**Does fence-line measurement from parcel data infringe?** Every patent and suit found here concerns deriving measurements **from aerial imagery of the structure itself**. A fence line drawn along a county-published cadastral boundary is a different data source (a government-surveyed property-line polygon) and a different computation (vector geometry, not photogrammetry). No patent found claims measuring a fence or deriving a boundary from parcel/plat data rather than imagery — a reasoned, not certain, basis for lower risk on the fence side. This is not a freedom-to-operate opinion and not legal advice.

**Recommended budget.** Skip the traditional $10,000–50,000 outside-counsel FTO opinion before a paying customer exists (ipcg.com's 2026 FTO cost guide). Budget instead for an AI-assisted first-pass clearance search plus a few hours of attorney review — roughly $3,000–10,000 in 2026 (ipcg.com; tradespace.io's 2026 FTO practitioner guide) — timed right before the fence MVP's public launch, with a fuller opinion only once the roofing module approaches aerial roof-facet measurement.

---

## 4. Competitors, deeper

| Product | Segment | Published US pricing | Measurement source | Gap |
|---|---|---|---|---|
| **Visual Fence Pro** | Fence, AI-native | Starter $39/mo, Pro $89/mo, Enterprise $149/mo (founder rate; regular $79/$179/$299) (visualfencepro.com) | Parcel/cadastral auto-load, click-drag fence line, gates | No proposal/e-sign or Jobber export confirmed; brand-new, still building trust |
| **FenceTracer** | Fence | Basic ~$99/mo, Pro ~$199/mo (fencetracer.com; cleansavannah.com) | Google Maps-based drawing | Imagery-trace approach sits closer to the Google ToS line than parcel data |
| **FenceCloud** | Fence CRM | Essential $220/mo, Professional $345/mo, Ultimate $545/mo; GeoDraw map-tracing add-on $99/mo from a separate vendor (fervorstudio.ca; fence.cloud/pricing) | No native satellite measure; GeoDraw bolt-on | Expensive, multi-vendor stack for a small shop |
| **QuoteIQ (MapMeasure Pro)** | Multi-trade, AI-native | Bundled from $74.99/mo (Beginner); not on the $29.99 Essentials tier (myquoteiq.com/features/mapmeasure-pro) | Satellite tracing | Generic across trades, not fence-specific; "market-accurate" pricing claims are a liability |
| **Deep Lawn** | Lawn/pest, AI-native | Not found (self-serve widget, enterprise sales) | AI measurement off leaf-on and leaf-off imagery; measures lawn, driveway, sidewalk, building — **not fences** (deeplawn.com/measurements) | No fence product; validates that instant satellite-quote widgets convert for adjacent trades |
| **Go iLawn** | Lawn/landscape | Pay-as-you-go, not found | Satellite/aerial tracing, leaf-off imagery timing | Landscape-only, not fences |
| **Jobber free roof tool** | Roofing, lead magnet | Free, no account required | Licensed EagleView imagery ("as sharp as 1 inch") | Free undercuts any paid roofing entrant on Jobber's own marketplace; no fence coverage |
| **Housecall Pro** | Field service | $59–$329/mo, no measurement add-on at any tier | None | Complete absence of aerial/fence measurement — the one clean channel gap |
| **Roofr** | Roofing CRM + reports | Free Starter ($19/report); Essentials $249/mo ($209 annual); Scale $349/mo ($299 annual); reports $13 on paid plans; Instant Estimator add-on $125–149/mo (roofr.com/product-blog, March 2026 repricing) | EagleView-licensed and its own imagery pipeline | Per-report fees stack on top of the subscription even after the March 2026 simplification |
| **EagleView** | Roofing/insurance reports | Per-report, $24–105 range (third-party); EagleView One subscription, quote-only | Proprietary aerial capture | Cost; the most litigious incumbent in the category |
| **Hover** | Photo-to-3D | Pay-as-you-go $29–139/job by complexity; Pro $99/mo or $999/yr flat (roofingsoftwareguide.com's 2026 Hover pricing breakdown) | Smartphone photos, not aerial | Needs an on-site photo walk, not address-only |
| **Nearmap** | Imagery + AI | Enterprise, ~$2,000+/yr (third-party) | Proprietary high-frequency aerial capture | Enterprise-priced; recently settled patent litigation with EagleView |
| **RoofSnap** | Roofing measurement | $105–150/mo range depending on plan (roofingsoftwareguide.com/reviews/roofsnap-pricing) | Aerial measurement reports | Manual-leaning workflow |
| **iRoofing** | Roofing estimating | From $107/mo, 3-user cap, HD imagery metered by credit (roofingsoftwareguide.com/reviews/iroofing-pricing) | Aerial imagery, credit-metered | Credit ceilings bite active sales teams |
| **AccuLynx** | Roofing CRM | Essential plan $250/mo (publicly priced entry point); higher tiers per-user $165–300+/mo plus paid add-ons (builderlync.com's 2026 AccuLynx review) | Integrates third-party measurement | Enterprise-leaning cost stack |
| **JobNimbus (with SumoQuote)** | Roofing CRM + proposals | Largely quote-based, not published | Proposal layer, not its own aerial measurement | SumoQuote was folded into JobNimbus; pricing opacity |
| **Leap** | Roofing sales CRM | Team $249/mo (3 users); SalesPro $750/mo (6 users) (roofingsoftwareguide.com/comparisons/acculynx-vs-leap) | Integrates measurement partners | Priced for larger sales teams |
| **Bobyard** | AI takeoff, multi-trade | Not found for roofing specifically; expanded into flooring/drywall/paint takeoff in June 2026 (globenewswire.com/news-release/2026/06/17/3313581) | AI takeoff from plans/photos | Broader takeoff play, not an address-in/quote-out roofing tool |
| **Xactimate (Verisk/Xactware)** | Insurance estimating | ~$100–149/mo Professional (annual/monthly), $2,390–2,690/yr for standard seats (capout.ai's 2026 breakdown; verisk.com) | Manual + measurement imports | Insurance-adjuster workflow, not a contractor's instant-quote tool |
| **Aurora Solar** | Solar design | Basic $135/user/mo annual ($159 monthly); Premium $220/user/mo annual ($259 monthly) (aurorasolar.com/pricing) | Own imagery + LiDAR pipeline | Per-seat, full design suite — overkill for an instant quote |
| **OpenSolar** | Solar design | Free | Own imagery pipeline | Sets a free ceiling under any paid solar quoting tool |

**Where the fence gap really is, revised.** Not "nobody serious plays" — rather, the two products that play it well (Visual Fence Pro, FenceTracer) are new, sub-$200/month, and neither ships a proposal-to-e-sign-to-payment flow or a native Jobber/Housecall Pro export. The wedge is bundling the whole quote-to-close motion (parcel-based measurement, the firm's own price list, a branded proposal PDF, e-signature, Stripe, and a one-click CRM export) below FenceCloud and competitive with Visual Fence Pro's regular pricing — not being the only tool that can draw a fence line on a map.

---

## 5. Buyer and channel, verified

**Segment size.** Roofing sits in NAICS 238160: 25,519 employer establishments, 80.3% under ten employees, plus a share of 299,418 non-employer exterior-trade businesses (Census CBP 2023 / Nonemployer Statistics 2022, cbp23us.zip/nonemp22us.zip — reused from [02-trades-field-service-property.md](02-trades-field-service-property.md) and the v2 scratchpad research on the same source files). Fencing has no dedicated NAICS code; it sits inside 238990 "All other specialty trade contractors" (42,748 employer establishments, same source), mixed with unrelated trades. IBISWorld's dedicated fence-construction report is cleaner: **$20.4 billion in 2026 revenue and 315,000 businesses**, a 3.3% five-year CAGR through 2026 with an estimated 0.6% dip this year (ibisworld.com/united-states/industry/fence-construction/2022). The gap between Census's 42,748 employer establishments and IBISWorld's 315,000 "businesses" is almost entirely non-employer, owner-operator installers — the buyer to target first, since they have no office staff to absorb a slow tool.

**Associations and events.** The American Fence Association has "more than 2,000 member companies" across 20-plus chapters (americanfenceassociation.com/about) and runs **FENCETECH 2026 on 2–6 February 2026** at the Indiana Convention Center, exhibits 4–6 February (americanfenceassociation.com/page/fencetech_2026_current_exhibitors). AFA members save $600–800 on a standard 10x10 booth (americanfenceassociation.com/page/fencetech_2026_become_an_exhibitor) — a plausible first distribution spend once validated. NRCA has "more than 3,700 members from all 50 states and 25 countries" (nrca.net/about); with roofing second in the build sequence, NRCA is a second-priority channel.

**Distributor programmes.** Master Halco, "North America's leading manufacturer and wholesale distributor" of fencing, serves "thousands of professional fencing... contractors" through 70-plus branches (masterhalco.com/about) and already runs its own free contractor tool, **QuoteMaster**, for submitting quotes to the nearest branch — a reminder a distributor may see this as competing with its own lead tool, or as a co-marketing opportunity. A Merchants Metals dealer-programme page was **not found**; treat Master Halco as the confirmed first distributor conversation.

**Marketplaces.** Jobber's App Marketplace serves "300,000+" customers and requires an App Review pass before listing (help.getjobber.com); developer revenue-share terms were **not found**. Housecall Pro states "200K+ Pros" and about 27 native integrations plus Zapier reach (housecallpro.com/integrations); its app-store listing terms were **not found** and should be requested directly — Housecall Pro is the one channel with no existing measurement competitor to beat (section 4).

**Other channels.** Facebook groups and trade subreddits exist but were not counted; treat as free outreach, not a measured channel. **No source was found for Google Ads CPC** on "fence estimating software" or similar terms — pull that number from Keyword Planner directly before setting a paid-search budget.

**Seasonality.** Fence installation follows the outdoor-construction season (spring–autumn, Sun Belt excepted); roofing demand spikes after storm season. Plan the fence launch for late winter, ahead of spring, timed near FENCETECH (early February).

---

## 6. Accuracy bar and ground truth

**What contractors accept.** EagleView's independently verified benchmark — CompassData's April–May 2025 LiDAR comparison of single-family homes in the Denver metro area — found EagleView's roof-line measurements 98.77% accurate, roof-area 98.43%, roof-slope 98.49%, with an average area difference of 5.61 square feet and a linear difference of 0.2 feet (globenewswire.com/news-release/2025/06/04/3093587). That is roughly a **1–2% error rate on the market's trusted incumbent**; industry commentary places "leading platforms" generally in the 95–99% band (zuper.co). Treat 2–5% deviation from a hand measurement as the bar a contractor will tolerate, and the EagleView benchmark as the target to approach, since first sales conversations will be against contractors who already trust EagleView's numbers. This is a vendor-commissioned study on a narrow geography; do not present it as proof the method generalises to steep or heavily obstructed roofs.

**Parcel lines are not fence lines.** A county parcel boundary is a legal property line, not where a fence should sit. Real installations move off it for three reasons a tool must handle, not ignore: **setbacks** (zoning ordinances commonly require a fixed distance inside the property line, varying by municipality and fence height); **easements** (utility, drainage or access easements, which a parcel record may or may not expose depending on plan and county); and **existing conditions** (a neighbour's fence, a hedge, a slope that makes the surveyed line impractical). The product's job is letting the contractor drag the auto-loaded parcel line to the real, walked line in seconds — matching Visual Fence Pro's own "lot boundary loads automatically... click property lines, drag handles" pattern (visualfencepro.com) — not presenting the parcel line as the finished quote.

**Slope correction.** Fence take-offs (posts, panels, rail length) assume a flat run unless corrected for grade; USGS 3DEP's 1-metre DEM gives the elevation profile along any drawn line, from which a slope factor applies to linear footage and post spacing. This is geometry, not machine learning, and belongs in week 3–4 of the MVP (section 8), not deferred.

**A ground-truth protocol before launch.** Before quoting a real customer, measure **30 properties across 3 counties** of differing parcel-data quality (one large-metro ArcGIS Hub county, one mid-size county via Regrid, one rural fallback county) two ways: the tool's output, and a ground truth from a measuring wheel or a permit/plat survey. Record percentage deviation per property, not just an average, and require every property to fall inside the 2–5% band before charging for a quote — one 15%-off outlier on a real project costs more trust than ten exact measurements earn.

---

## 7. Validation plan (2 weeks, under $500)

**Week 1 — talk to contractors, build nothing.**
- Find 15 fence contractors through the AFA's public locator, a Master Halco branch counter, and 2–3 fence Facebook groups; call or visit 10.
- Ask five questions: (1) How do you measure a job before quoting today — wheel, tape, satellite tool, or a site visit only? (2) What do you pay for estimating software, and what do you actually use versus ignore? (3) Have you tried Visual Fence Pro, FenceTracer, or FenceCloud — what happened? (4) If a tool gave a fence line, gate count and material list from an address in under a minute, accurate within a few feet, what would you pay per month? (5) Where do quotes fall apart today?
- **Kill criterion:** fewer than 5 of 10 describe an unprompted measurement or quoting-speed pain, or more than half already use and like Visual Fence Pro/FenceTracer/FenceCloud.

**Week 1, in parallel — landing page and waitlist.** A one-page site: headline names the pain ("Quote a fence job from the address in 60 seconds, not a 45-minute site visit"), the price ($49/month, stated plainly), email capture. Push to the same Facebook groups and the 15 contractors called. Cost: a domain (~$12/year) and an hour of copy. **Target: 20 sign-ups from under 200 views.**

**Week 2 — five concierge quotes by hand.** For a real job each of five friendly contractors is quoting, manually pull the parcel from a Regrid trial or county ArcGIS, draw the fence line by eye in QGIS, apply their own price list, hand back a PDF within an hour — no software built. Ask each to compare the output against their own tape/wheel numbers.

**Week 2, in parallel — the accuracy test.** Run the 30-property, 3-county ground-truth protocol from section 6 with the same manual process; it doubles as both accuracy proof and concierge-quote content.

**Week 2 — the pricing test.** Ask the five: $49/month flat for unlimited quotes, or $5–8 per quote with no subscription? Note which clusters and why, rather than guessing between a subscription and Roofr's much-hated per-report model.

**Overall kill criteria.** Stop before writing code if: fewer than half the week-1 interviewees describe the pain unprompted; the landing page converts under 5%; concierge quotes land outside 5% on more than a handful of the 30 test properties; or three-plus of the five concierge contractors already use and like Visual Fence Pro or FenceTracer at their current price.

---

## 8. MVP spec, week by week (8 weeks)

**Stack.** Next.js on Vercel plus Supabase (Postgres, auth, storage, RLS); **MapLibre GL JS**, not Mapbox GL, for the map surface — the open-source fork with no imagery-tracing restriction, rendering OSM or USGS/NAIP tiles instead of a licensed basemap; **Turf.js** for polygon/line geometry; **Regrid** for parcels with a county-ArcGIS-REST fallback; **USGS 3DEP** for slope; **Google Solar API** for roofing; a PDF library for proposals; **Documenso** (open-source, self-hostable e-sign) to avoid a per-envelope fee at low volume; **Stripe** for billing — the same reference-stack pattern as elsewhere in this repository ([07-building-with-ai.md](07-building-with-ai.md)), adapted for a geometry-heavy product.

- **Week 1 — foundation.** Next.js/Supabase scaffold, Stripe billing skeleton, accounts, address geocoding, Regrid parcel fetch wired to the county-ArcGIS fallback.
- **Week 2 — the fence line.** MapLibre renders the parcel polygon on an OSM/NAIP background; click-to-place, drag-to-adjust fence-line editor with Turf.js, defaulting to the parcel edge, draggable inward for setbacks.
- **Week 3 — gates, corners, slope.** Gate markers along the line, corner-post detection from polygon vertex angles, a 3DEP elevation profile along the line applying a slope correction to linear footage and post count.
- **Week 4 — price book and take-off.** CSV import of the firm's own unit prices (posts, panels, rails, concrete, gate hardware, labour rate); spacing rules (e.g., a post every 8 feet) produce a real material list and price — no invented "market" pricing (the QuoteIQ liability, section 4).
- **Week 5 — the proposal.** Branded PDF with map, line-item take-off and total; Documenso e-sign; accept/decline tracking.
- **Week 6 — billing and export.** Stripe checkout, team accounts, a CSV/API export formatted for Jobber and Housecall Pro — this bundle is exactly what section 4 found missing from Visual Fence Pro and FenceTracer.
- **Week 7 — roofing module.** Google Solar API Building Insights for facets and pitch; a manual facet-drawing fallback on NAIP for the ~5% of buildings outside Solar API coverage; a pitch-based shingle/underlayment take-off.
- **Week 8 — accuracy pass and launch.** Run the 30-property, 3-county ground-truth test (section 6) against the finished tool, fix what it surfaces, onboard the five concierge contractors as paying customers, open the waitlist.

**Not doing:** 3D models, drone imagery, solar production/financial modelling, a general CRM (export to the contractor's own instead), and any tracing from Google or Mapbox base layers (section 2).

**Dependencies and gates:** Regrid or county ArcGIS access, USGS 3DEP, Google Maps Platform and Solar API accounts, Stripe, Documenso or a comparable e-sign API. No licence, certification or HIPAA-style gate applies; a patent-clearance pass (section 3) belongs before the roofing module, not the fence MVP.

**Hardest part.** Not the geometry — getting the auto-loaded parcel line close enough, and the drag-to-adjust fast enough, that a contractor trusts the output in the roughly one-in-six counties where parcel data is thin or stale (section 5), without ever surfacing a raw "missing data" error.

---

## 9. Unit economics and pricing

**Per-lookup cost.** Regrid's base self-serve price is unverified (section 2); its marginal cost above the included 2,000 parcel records/month is $0.10–0.15 per record and $0.001 per tile — trivial at MVP volume. Google Solar API Building Insights costs $0.01/request above 10,000 free per month (developers.google.com/maps/documentation/solar/usage-and-billing) — a solo product won't exceed the free tier for a long while. USGS 3DEP carries no per-call fee. There is no LLM in the fence path (pure geometry); the roofing module's NAIP fallback could optionally use a vision model at a few cents per image ([07-building-with-ai.md](07-building-with-ai.md#45-in-product-ai-costs-september-2026-list-prices)).

**Gross margin.** At $49/month (fence) or $99/month (bundled), with per-quote costs in the low cents and hosting in the $25–150/month range at this scale ([00-overview.md](00-overview.md#5-assumptions-used-in-every-path-to-profitability)), gross margin sits above 90% at either price — one of the strongest-margin ideas in this repository, because the underlying data is free or near-free.

**Customers to $5k/$10k MRR.** At $49 fence-only ARPU: **102 customers for $5k MRR, 204 for $10k.** At $99 bundled ARPU: **51 for $5k, 102 for $10k** — close enough to the original chapter's $120-ARPU math (42/84) to confirm the pricing logic holds with fence folded in.

**Where that sits against the market.** $49–99/month undercuts FenceCloud ($220–545/month) by a wide margin, sits at or below Visual Fence Pro's *regular* pricing ($79–299/month), matches or slightly undercuts FenceTracer ($99–199/month), and is far cheaper than Roofr's $209–349/month-plus-per-report stack. It does **not** undercut Visual Fence Pro's current founder-rate Starter ($39/month) — the strongest argument here for moving fast through validation (section 7) rather than assuming the fence gap is still wide open.

**Annual prepay.** Offer roughly two months free (17% discount), matching every competitor in section 4 (Roofr, Aurora, FenceCloud) — this also offsets the seasonality risk in section 5 by collecting cash in the slow season.

---

## 10. Risks and kill criteria

1. **Patent risk on the roofing module.** EagleView's portfolio produced a $375 million jury/settlement outcome against Verisk and a still-partly-unresolved suit history against Roofr (section 3). Mitigate by building the roofing module strictly on Google's licensed Solar API output, never by tracing base imagery, and budget $3,000–10,000 for an AI-assisted clearance pass before it ships. **Kill/delay signal:** a clearance search surfacing a live claim on "deriving roof measurements from a licensed API's pre-computed output" — escalate to a full attorney opinion before shipping.
2. **Imagery terms of service.** Google Maps Platform and Mapbox both forbid tracing measurements from base imagery (section 2) — a contract risk, not just a patent one; violation can mean instant API-key termination. **Kill/redesign signal:** any use of a Mapbox or Google basemap as the measurement source, not just the display layer, must be caught in code review.
3. **Accuracy.** If the 30-property, 3-county ground-truth test (sections 6–7) shows more than a small minority of properties outside 2–5% deviation — especially concentrated in one county type — exclude that type from marketing claims or flag low-confidence counties rather than showing false precision.
4. **Seasonality.** Fence and roofing demand concentrate in the outdoor-construction season; smooth revenue with annual prepay (section 9) and consider a Sun Belt-first launch.
5. **Residential solar's 2025 contraction.** Section 25D's termination on 31 December 2025 removes the cash/loan homeowner buyer; the surviving Section 48E buyer (leasing/PPA, through 2027) is smaller and more enterprise-shaped — confirming solar as a late, possibly-skipped module.
6. **A platform ships fence measurement for free.** Jobber already did this for roofing (section 1); nothing stops Jobber or Housecall Pro from doing the same for fences. **Kill/pivot signal:** if either announces a free fence tool before meaningful revenue, the defensible remainder is the proposal-e-sign-billing-export bundle — price and position on that from week one, not on measurement alone.
7. **Visual Fence Pro or FenceTracer close the packaging gap first.** Both are small and new enough (section 4) to add e-sign, billing and a Jobber export before this ships — exactly what the 2-week validation plan (section 7), including a direct trial of Visual Fence Pro, is designed to catch before committing 8 weeks of build time.

---

## Sources

- https://www.getjobber.com/free-tools/roof-measurement-tool/
- https://roofr.com/estimator
- https://www.roofr.com/pricing
- https://roofr.com/product-blog/updates-to-roofrs-pricing-heres-what-you-need-to-know
- https://roofrhelp.zendesk.com/hc/en-us/articles/38742434512663-Roofr-Pricing-and-Packaging-Update-2026
- https://www.eidebailly.com/insights/alerts/2025/individual-solar-electric-credits
- https://seia.org/research-resources/clean-energy-provisions-big-beautiful-bill/
- https://www.congress.gov/crs-product/IN12611
- https://www.eagleview.com/insurance/eagleview-post-disaster-image-delivery-patent/
- https://patents.google.com/patent/US10528960B2/en
- https://patents.justia.com/patent/10528960
- https://news.bloomberglaw.com/ip-law/roofr-wipes-out-patents-underlying-delaware-infringement-suit
- https://www.prnewswire.com/news-releases/eagleview-achieves-unanimous-intellectual-property-win-as-jury-affirms-xactware-verisk-willfully-infringed-eagleviews-patents-300926615.html
- https://www.randrmagonline.com/articles/89375-eagleview-awarded-375m-in-lawsuit-against-verisk-analytics-parent-company-to-xactware
- https://www.insurancejournal.com/news/national/2021/11/08/641123.htm
- https://www.globenewswire.com/news-release/2026/05/29/3303611/0/en/eagleview-and-nearmap-reach-settlement-in-patent-dispute.html
- https://www.ipcg.com/answers/how-much-does-a-freedom-to-operate-search-and-opinion-cost
- https://tradespace.io/insights/freedom-to-operate-analysis-a-practitioner-guide-2026/
- https://www.globenewswire.com/news-release/2025/06/04/3093587/0/en/EagleView-Roof-Measurements-Confirmed-to-Be-98-77-Accurate-Compared-to-Independent-Benchmark-Measurements.html
- https://www.zuper.co/blog/accuracy-rates-of-roofing-software
- https://support.regrid.com/changelog/self-serve-api-plans
- https://regrid.com/api
- https://app.regrid.com/api/plans
- https://getparceldata.com/
- https://uslandgrid.com/news/post/2025-tax-parcel-database-mid-year-review
- https://reportallusa.com/blog/how-to-compare-national-parcel-data-providers
- https://data-maricopa.opendata.arcgis.com/datasets/c937f17330f64e64abd41976fc8bb17f
- https://data-wake.opendata.arcgis.com/datasets/parcels
- https://www.usgs.gov/3d-elevation-program
- https://www.usgs.gov/faqs/how-often-orthoimagery-national-map-updated-and-what-are-acquisition-dates
- https://gis.utah.gov/products/sgid/aerial-photography/naip/
- https://catalog.data.gov/dataset/national-agriculture-imagery-program-naip-imagery
- https://developers.google.com/maps/documentation/solar/usage-and-billing
- https://developers.google.com/maps/documentation/solar/coverage
- https://mapsplatform.google.com/resources/blog/our-solar-api-now-covers-more-rooftops-worldwide/
- https://cloud.google.com/maps-platform/terms/maps-service-terms
- https://www.mapbox.com/legal/tos
- https://cdn.prod.website-files.com/609ed46055e27a02ffc0749b/68dddd2815cb3d82685f0096_Mapbox%20Product%20Terms%20(October%201,%202025).pdf
- https://github.com/microsoft/USBuildingFootprints
- https://github.com/microsoft/GlobalMLBuildingFootprints
- https://docs.overturemaps.org/guides/buildings/
- https://visualfencepro.com/
- https://fencetracer.com/compare/fencecloud
- https://www.cleansavannah.com/post/best-fence-company-software-2026
- https://fervorstudio.ca/news/fence-cloud-review-pricing-alternatives/
- https://fence.cloud/pricing
- https://fencebase.com/geodraw/
- https://myquoteiq.com/features/mapmeasure-pro/
- https://fervorstudio.ca/news/quoteiq-mapmeasure-pro-review-pricing-alternatives/
- https://deeplawn.com/measurements
- https://goilawn.com/go-property-measurement/
- https://roofingsoftwareguide.com/reviews/roofsnap-pricing/
- https://roofingsoftwareguide.com/reviews/iroofing-pricing/
- https://www.capterra.com/p/171408/iRoofing/pricing/
- https://builderlync.com/blog/acculynx-review-pricing-features-2026
- https://roofingsoftwareguide.com/comparisons/acculynx-vs-leap/
- https://roofingsoftwareguide.com/guides/hover-pricing/
- https://www.capout.ai/resources/blog/xactimate-pricing
- https://www.verisk.com/products/xactimate/
- https://www.globenewswire.com/news-release/2026/06/17/3313581/0/en/bobyard-launches-ai-takeoff-and-estimating-for-flooring-drywall-paint-insulation-and-doors-windows.html
- https://aurorasolar.com/pricing/
- https://www.ibisworld.com/united-states/industry/fence-construction/2022/
- https://www.americanfenceassociation.com/about/
- https://www.americanfenceassociation.com/page/fencetech_2026_current_exhibitors/
- https://www.americanfenceassociation.com/page/fencetech_2026_become_an_exhibitor/
- https://www.nrca.net/about
- https://www.masterhalco.com/about
- https://help.getjobber.com/hc/en-us/articles/360062128653-App-Marketplace
- https://www.housecallpro.com/integrations/
- https://contractortoolstack.com/software/housecall-pro/
- https://www2.census.gov/programs-surveys/cbp/datasets/2023/cbp23us.zip
- https://www2.census.gov/programs-surveys/nonemployer-statistics/datasets/2022/historical-datasets/nonemp22us.zip
