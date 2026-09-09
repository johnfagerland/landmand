/**
 * Proposal PDF (Letter). Server-side only: rendered by /api/proposal via renderToBuffer.
 * Built-in Helvetica only; no font fetching.
 */
import {
  Document,
  Image,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import type {
  FirmSettings,
  Quote,
  StyleRule,
  TakeOff,
  TakeOffLine,
} from "@/engine/types";
import { FigureSvg } from "./FigureSvg";
import { layoutFigure } from "./figure";
import {
  formatCents,
  formatDate,
  formatFt,
  formatQty,
  formatSlopePct,
} from "./format";

export interface ProposalDocumentProps {
  quote: Quote;
  takeoff: TakeOff;
  firm: FirmSettings;
  /** Product name for the small footer credit. */
  appName: string;
  /** Human style name (falls back to the style id). */
  styleName?: string;
  /** Style rule used, for the specification paragraph. */
  rule?: StyleRule;
}

const ink = "#111827";
const muted = "#6b7280";
const rule = "#d1d5db";

const styles = StyleSheet.create({
  // NOTE: no lineHeight on the Page itself: react-pdf 4.9 drops absolutely-positioned fixed
  // footers when the page carries a lineHeight, so it lives on the body wrapper instead.
  page: {
    paddingTop: 40,
    paddingBottom: 44,
    paddingHorizontal: 44,
    fontFamily: "Helvetica",
    fontSize: 9.5,
    color: ink,
  },
  body: {},
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1.5,
    borderBottomColor: ink,
    paddingBottom: 10,
    marginBottom: 12,
  },
  firmName: { fontSize: 16, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  small: { fontSize: 8, color: muted },
  logo: { maxWidth: 140, maxHeight: 56, objectFit: "contain" },
  title: { fontSize: 13, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  h2: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    marginTop: 12,
    marginBottom: 4,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: rule,
  },
  twoCol: { flexDirection: "row", gap: 24 },
  col: { flex: 1 },
  label: {
    fontSize: 8,
    color: muted,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  figureRow: { flexDirection: "row", gap: 14, marginTop: 4 },
  summary: { width: 200, gap: 3 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#eef0f2",
    paddingVertical: 2,
  },
  table: { marginTop: 2 },
  tr: {
    flexDirection: "row",
    paddingVertical: 2.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#eef0f2",
  },
  th: {
    flexDirection: "row",
    paddingVertical: 3,
    borderBottomWidth: 1,
    borderBottomColor: ink,
    fontFamily: "Helvetica-Bold",
    fontSize: 8.5,
  },
  cDesc: { flex: 1, paddingRight: 6 },
  cSku: { width: 78, color: muted, fontSize: 8 },
  cQty: { width: 48, textAlign: "right" },
  cUnit: { width: 34, textAlign: "left", paddingLeft: 4, color: muted },
  cPrice: { width: 62, textAlign: "right" },
  cExt: { width: 68, textAlign: "right" },
  totals: { alignSelf: "flex-end", width: 240, marginTop: 6 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 2,
  },
  grand: {
    borderTopWidth: 1,
    borderTopColor: ink,
    marginTop: 2,
    paddingTop: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  terms: { fontSize: 8.5, color: "#374151", lineHeight: 1.35 },
  warn: { fontSize: 8.5, color: "#92400e" },
  sig: { flexDirection: "row", gap: 32, marginTop: 6 },
  sigBlock: { flex: 1 },
  sigLine: {
    borderTopWidth: 0.75,
    borderTopColor: ink,
    marginTop: 20,
    paddingTop: 3,
    fontSize: 8,
    color: muted,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 44,
    right: 44,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7.5,
    color: muted,
  },
  footerCell: { flex: 1 },
});

function isRasterDataUrl(url: string | undefined): url is string {
  return !!url && /^data:image\/(png|jpe?g);base64,/i.test(url);
}

function addressLine(q: Quote): string {
  const a = q.address;
  const cityLine = [a.city, [a.state, a.zip].filter(Boolean).join(" ")]
    .filter(Boolean)
    .join(", ");
  return [a.line1, cityLine].filter(Boolean).join(", ") || a.matched;
}

function splitLines(lines: TakeOffLine[]): {
  materials: TakeOffLine[];
  labor: TakeOffLine[];
} {
  const materials: TakeOffLine[] = [];
  const labor: TakeOffLine[] = [];
  for (const l of lines) (l.category === "labor" ? labor : materials).push(l);
  return { materials, labor };
}

function LineTable({ lines }: { lines: TakeOffLine[] }) {
  return (
    <View style={styles.table}>
      <View style={styles.th} minPresenceAhead={40}>
        <Text style={styles.cDesc}>Item</Text>
        <Text style={styles.cSku}>SKU</Text>
        <Text style={styles.cQty}>Qty</Text>
        <Text style={styles.cUnit}>Unit</Text>
        <Text style={styles.cPrice}>Unit price</Text>
        <Text style={styles.cExt}>Extended</Text>
      </View>
      {lines.length === 0 ? (
        <View style={styles.tr}>
          <Text style={[styles.cDesc, { color: muted }]}>None</Text>
        </View>
      ) : (
        lines.map((l, i) => (
          <View style={styles.tr} key={`${l.sku}-${i}`} wrap={false}>
            <View style={styles.cDesc}>
              <Text>{l.description}</Text>
              {l.basis ? <Text style={styles.small}>{l.basis}</Text> : null}
            </View>
            <Text style={styles.cSku}>{l.sku}</Text>
            <Text style={styles.cQty}>{formatQty(l.qty)}</Text>
            <Text style={styles.cUnit}>{l.unit}</Text>
            <Text style={styles.cPrice}>{formatCents(l.unitPriceCents)}</Text>
            <Text style={styles.cExt}>{formatCents(l.extendedCents)}</Text>
          </View>
        ))
      )}
    </View>
  );
}

function specification(
  rule: StyleRule | undefined,
  takeoff: TakeOff,
): string[] {
  const out: string[] = [];
  if (!rule) return out;
  const bags = `${rule.concreteBagsPerLinePost} bag${rule.concreteBagsPerLinePost === 1 ? "" : "s"} per line post, ${rule.concreteBagsPerTerminalPost} per corner, end and gate post`;
  out.push(
    `Posts set every ${rule.postSpacingFt} ft (max) in concrete: ${bags}.`,
  );
  if (rule.sectionModel === "stick") {
    out.push(
      `${rule.railsPerSection ?? 0} rails per section; ${rule.picketWidthIn ?? 0} in pickets${rule.picketGapIn ? ` with ${rule.picketGapIn} in gaps` : ", butted"}.`,
    );
  } else if (rule.sectionModel === "panel") {
    out.push(
      `${rule.panelWidthFt ?? rule.postSpacingFt} ft prefabricated panels with post caps; the last panel in each run is cut to fit.`,
    );
  } else {
    out.push(
      "Fabric stretched between terminal posts with a top rail; tension bands, ties and bar included in hardware.",
    );
  }
  out.push(
    `${takeoff.heightFt} ft nominal height; countable materials carry ${rule.wastePct}% waste; lengths in feet are rounded up.`,
  );
  out.push(
    "Corners and ends are set as terminal posts; gates get their own posts and hardware.",
  );
  return out;
}

function SegmentTable({ takeoff }: { takeoff: TakeOff }) {
  if (takeoff.segments.length === 0) return null;
  return (
    <View style={styles.table}>
      <View style={styles.th}>
        <Text style={{ width: 60 }}>Side</Text>
        <Text style={styles.cQty}>Flat</Text>
        <Text style={[styles.cPrice, { width: 70 }]}>Corrected</Text>
        <Text style={[styles.cPrice, { width: 70 }]}>Fence</Text>
        <Text style={styles.cPrice}>Slope</Text>
        <Text style={styles.cPrice}>Sections</Text>
        <Text style={styles.cPrice}>Line posts</Text>
        <Text style={[styles.cDesc, { paddingLeft: 10 }]}>Gates</Text>
      </View>
      {takeoff.segments.map((s) => (
        <View style={styles.tr} key={s.segmentIndex} wrap={false}>
          <Text style={{ width: 60 }}>{s.segmentIndex + 1}</Text>
          <Text style={styles.cQty}>{s.flatFt.toFixed(1)}</Text>
          <Text style={[styles.cPrice, { width: 70 }]}>
            {s.correctedFt.toFixed(1)}
          </Text>
          <Text style={[styles.cPrice, { width: 70 }]}>
            {s.fenceFt.toFixed(1)}
          </Text>
          <Text style={styles.cPrice}>
            {s.slopeFactor > 1.0005 ? formatSlopePct(s.slopeFactor) : "flat"}
          </Text>
          <Text style={styles.cPrice}>{s.sections}</Text>
          <Text style={styles.cPrice}>{s.linePosts}</Text>
          <Text style={[styles.cDesc, { paddingLeft: 10 }]}>
            {s.gateIds.length ? `${s.gateIds.length}` : "–"}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function ProposalDocument({
  quote,
  takeoff,
  firm,
  appName,
  styleName,
  rule,
}: ProposalDocumentProps) {
  const figure = layoutFigure({
    fenceVertices: quote.fence.vertices,
    closed: quote.fence.closed,
    gates: quote.fence.gates,
    parcel: quote.parcel ?? null,
    segmentLengthsFt: takeoff.segments.length
      ? takeoff.segments.map((s) => s.flatFt)
      : undefined,
    width: 300,
    height: 210,
  });
  const { materials, labor } = splitLines(takeoff.lines);
  const slopeApplied = takeoff.slopeFactor > 1.0005;
  const attribution =
    quote.parcel?.attribution ??
    (quote.parcelStatus === "manual"
      ? "Lot lines: drawn by contractor"
      : "Lot lines: not available");
  const firmName = firm.name.trim() || "Fence contractor";
  const contact = [firm.phone, firm.email]
    .filter((s) => s && s.trim())
    .join("  ·  ");
  const gateSummary =
    takeoff.gates > 0
      ? `${takeoff.gates} (${quote.fence.gates.map((g) => `${g.widthFt} ft ${g.kind}`).join(", ")})`
      : "none";
  const title = `Fence proposal — ${quote.id.slice(0, 8)}`;
  const spec = specification(rule, takeoff);

  return (
    <Document
      title={title}
      author={firmName}
      producer={appName}
      creator={appName}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={styles.body}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.firmName}>{firmName}</Text>
              {firm.addressLines
                .filter((l) => l.trim())
                .map((l, i) => (
                  <Text key={i}>{l}</Text>
                ))}
              {contact ? <Text>{contact}</Text> : null}
              {firm.licenseNo ? (
                <Text style={styles.small}>License {firm.licenseNo}</Text>
              ) : null}
            </View>
            <View style={{ alignItems: "flex-end" }}>
              {isRasterDataUrl(firm.logoDataUrl) ? (
                // eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image has no alt prop
                <Image src={firm.logoDataUrl} style={styles.logo} />
              ) : null}
              <Text style={[styles.small, { marginTop: 4 }]}>
                {formatDate(takeoff.computedAt || quote.updatedAt)}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>Fence proposal</Text>

          {/* Customer + site */}
          <View style={styles.twoCol}>
            <View style={styles.col}>
              <Text style={styles.label}>Prepared for</Text>
              <Text>{quote.customer.name || "Homeowner"}</Text>
              {quote.customer.phone ? (
                <Text>{quote.customer.phone}</Text>
              ) : null}
              {quote.customer.email ? (
                <Text>{quote.customer.email}</Text>
              ) : null}
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Site address</Text>
              <Text>{addressLine(quote)}</Text>
              {quote.parcel?.apn ? (
                <Text style={styles.small}>Parcel {quote.parcel.apn}</Text>
              ) : null}
            </View>
            <View style={styles.col}>
              <Text style={styles.label}>Proposal</Text>
              <Text>{quote.id.slice(0, 8).toUpperCase()}</Text>
              <Text style={styles.small}>
                Prepared {formatDate(quote.updatedAt)}
              </Text>
            </View>
          </View>

          {/* Figure + summary */}
          <Text style={styles.h2}>Site plan and summary</Text>
          <View style={styles.figureRow}>
            <View>
              <FigureSvg layout={figure} />
              <Text style={[styles.small, { width: 300, marginTop: 3 }]}>
                {attribution}; imagery not used for measurement.
              </Text>
            </View>
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Style</Text>
                <Text>{styleName ?? takeoff.styleId}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Height</Text>
                <Text>{takeoff.heightFt} ft</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Length (flat)</Text>
                <Text>{formatFt(takeoff.flatLengthFt)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Length (slope-corrected)</Text>
                <Text>
                  {formatFt(takeoff.correctedLengthFt)}
                  {slopeApplied
                    ? ` (${formatSlopePct(takeoff.slopeFactor)})`
                    : ""}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Fence length (less gates)</Text>
                <Text>{formatFt(takeoff.fenceLengthFt)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Posts</Text>
                <Text>
                  {takeoff.posts.total} ({takeoff.posts.corner} corner,{" "}
                  {takeoff.posts.end} end, {takeoff.posts.line} line,{" "}
                  {takeoff.posts.gate} gate)
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Sections</Text>
                <Text>{takeoff.sections}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.label}>Gates</Text>
                <Text>{gateSummary}</Text>
              </View>
              <Text style={[styles.small, { marginTop: 4 }]}>
                {slopeApplied
                  ? "Lengths corrected for terrain using USGS 3DEP elevation."
                  : "Slope not applied; lengths are horizontal."}
              </Text>
            </View>
          </View>

          {/* Specification */}
          {spec.length > 0 ? (
            <View wrap={false}>
              <Text style={styles.h2}>
                Specification — {styleName ?? takeoff.styleId}
              </Text>
              {spec.map((line, i) => (
                <Text key={i} style={styles.terms}>
                  • {line}
                </Text>
              ))}
            </View>
          ) : null}

          {/* Per-side breakdown */}
          <Text style={styles.h2} minPresenceAhead={70}>
            Fence sides (feet)
          </Text>
          <SegmentTable takeoff={takeoff} />

          {/* Materials */}
          <Text style={styles.h2} minPresenceAhead={70}>
            Materials
          </Text>
          <LineTable lines={materials} />

          {/* Labour */}
          <Text style={styles.h2} minPresenceAhead={70}>
            Labor
          </Text>
          <LineTable lines={labor} />

          {/* Totals */}
          <View style={styles.totals} wrap={false}>
            <View style={styles.totalRow}>
              <Text>Subtotal</Text>
              <Text>{formatCents(takeoff.subtotalCents)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Tax{firm.taxRatePct ? ` (${firm.taxRatePct}%)` : ""}</Text>
              <Text>{formatCents(takeoff.taxCents)}</Text>
            </View>
            <View style={[styles.totalRow, styles.grand]}>
              <Text>Total</Text>
              <Text>{formatCents(takeoff.totalCents)}</Text>
            </View>
          </View>

          {takeoff.warnings.length > 0 ? (
            <View style={{ marginTop: 8 }} wrap={false}>
              <Text style={styles.label}>Notes from the take-off</Text>
              {takeoff.warnings.map((w, i) => (
                <Text key={i} style={styles.warn}>
                  • {w}
                </Text>
              ))}
            </View>
          ) : null}

          {quote.notes.trim() ? (
            <View style={{ marginTop: 8 }} wrap={false}>
              <Text style={styles.label}>Notes</Text>
              <Text style={styles.terms}>{quote.notes}</Text>
            </View>
          ) : null}

          {/* Method */}
          <View wrap={false}>
            <Text style={styles.h2}>How this was measured</Text>
            <Text style={styles.terms}>
              The fence line was laid out on the county lot lines (
              {attribution.replace(/^Lot lines:\s*/i, "")}) and adjusted by the
              contractor on the map; aerial imagery was displayed for context
              only and never measured from. Lengths are computed in a local
              plane in feet
              {slopeApplied
                ? ", then corrected for terrain with USGS 3DEP elevation"
                : ""}
              . Quantities follow the specification above and are rounded up;
              final counts are confirmed on site before ordering.
            </Text>
          </View>

          {/* Terms */}
          <Text style={styles.h2} minPresenceAhead={40}>
            Terms
          </Text>
          <Text style={styles.terms}>
            {firm.terms.trim() || "Terms to be agreed in writing."}
          </Text>

          {/* Signatures */}
          <View style={styles.sig} wrap={false}>
            <View style={styles.sigBlock}>
              <View style={styles.sigLine}>
                <Text>Customer</Text>
                <Text>Date</Text>
              </View>
            </View>
            <View style={styles.sigBlock}>
              <View style={styles.sigLine}>
                <Text>Contractor</Text>
                <Text>Date</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerCell}>{firmName}</Text>
          <Text
            style={[styles.footerCell, { textAlign: "center" }]}
            render={({ pageNumber, totalPages }) =>
              `Page ${pageNumber} of ${totalPages}`
            }
          />
          <Text style={[styles.footerCell, { textAlign: "right" }]}>
            Prepared with {appName}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
