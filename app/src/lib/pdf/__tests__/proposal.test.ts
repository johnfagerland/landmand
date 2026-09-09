import { describe, expect, it } from "vitest";
import fixture from "./fixtures/proposal-300ft.json";
import { proposalRequestSchema } from "@/lib/repo/schemas";
import { renderProposalPdf, proposalFileName } from "../render";
import { layoutFigure, projectFt } from "../figure";
import { formatCents, formatFt, formatSlopePct } from "../format";

describe("proposal PDF", () => {
  it("validates the fixture with the route's schema", () => {
    const r = proposalRequestSchema.safeParse(fixture);
    expect(r.success, JSON.stringify(r.success ? null : r.error.issues)).toBe(true);
  });

  it("renders a Letter PDF larger than 10 KB", async () => {
    const input = proposalRequestSchema.parse(fixture);
    const pdf = await renderProposalPdf(input);
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
    expect(pdf.byteLength).toBeGreaterThan(10 * 1024);
    // Letter = 612 x 792 pt
    expect(pdf.toString("latin1")).toMatch(/MediaBox \[0 0 612 792\]/);
  }, 30_000);

  it("renders with a raster logo, no parcel and an open fence run", async () => {
    const input = proposalRequestSchema.parse(fixture);
    // 1x1 transparent PNG
    const png = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";
    const quote = { ...input.quote, parcel: undefined, parcelStatus: "manual" as const, fence: { ...input.quote.fence, closed: false } };
    const pdf = await renderProposalPdf({ ...input, quote, firm: { ...input.firm, logoDataUrl: png } });
    expect(pdf.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  }, 30_000);

  it("names the download from the quote id", () => {
    expect(proposalFileName("6f1c2a4e-0b7d")).toBe("proposal-6f1c2a4e-0b7d.pdf");
    expect(proposalFileName("../x y")).toBe("proposal-x-y.pdf");
  });
});

describe("figure layout", () => {
  const input = proposalRequestSchema.parse(fixture);

  it("projects with the equirectangular scale", () => {
    const origin = input.quote.geocode;
    const p = projectFt(origin, [origin[0], origin[1] + 1 / 364_000]);
    expect(p.y).toBeCloseTo(1, 6);
    expect(p.x).toBeCloseTo(0, 6);
  });

  it("fits parcel and fence into the box, labels segments and places the gate", () => {
    const layout = layoutFigure({
      fenceVertices: input.quote.fence.vertices,
      closed: true,
      gates: input.quote.fence.gates,
      parcel: input.quote.parcel,
      segmentLengthsFt: input.takeoff.segments.map((s) => s.flatFt),
      width: 300,
      height: 230,
    });
    expect(layout.empty).toBe(false);
    expect(layout.parcel).toHaveLength(4);
    expect(layout.fence).toHaveLength(4);
    for (const p of [...layout.parcel, ...layout.fence]) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(300);
      expect(p.y).toBeGreaterThanOrEqual(0);
      expect(p.y).toBeLessThanOrEqual(230);
    }
    expect(layout.segmentLabels.map((l) => l.text)).toEqual(["100.0 ft", "50.0 ft", "100.0 ft", "50.0 ft"]);
    expect(layout.gates).toHaveLength(1);
    const [a, b] = layout.gates[0].tick;
    expect(Math.hypot(b.x - a.x, b.y - a.y)).toBeCloseTo(4 * layout.pxPerFt, 3);
    // south side is the bottom of the figure (north up): the gate sits on the lowest fence edge
    expect(a.y).toBeCloseTo(Math.max(...layout.fence.map((p) => p.y)), 3);
    expect(layout.scaleBar.lengthFt).toBeGreaterThan(0);
  });

  it("handles an empty fence", () => {
    const layout = layoutFigure({ fenceVertices: [], closed: true, gates: [], width: 100, height: 100 });
    expect(layout.empty).toBe(true);
  });
});

describe("formatters", () => {
  it("formats cents, feet and slope", () => {
    expect(formatCents(123456)).toBe("$1,234.56");
    expect(formatCents(5)).toBe("$0.05");
    expect(formatCents(-250)).toBe("-$2.50");
    expect(formatFt(718.84)).toBe("718.8 ft");
    expect(formatSlopePct(1.019)).toBe("+1.9 %");
  });
});
