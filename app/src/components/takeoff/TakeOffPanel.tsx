"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ElevationProfile, FenceLine, FirmSettings, LocalPlane, PriceBook, TakeOff, TakeOffLine } from "@/engine/types";
import { computeTakeOff } from "@/engine/takeoff/takeoff";
import { findRule, styleAvailability } from "@/engine/pricebook/styles";
import { formatCents, formatFt, formatQty } from "@/lib/pdf/format";
import { SlopeBadge, slopeStatus } from "./SlopeBadge";

export interface TakeOffPanelProps {
  fence: FenceLine;
  plane: LocalPlane;
  profiles: Record<string, ElevationProfile>;
  priceBook: PriceBook | null;
  firm: FirmSettings;
  /** Called whenever a fresh take-off is computed (or with null when none can be). */
  onTakeOff?: (takeoff: TakeOff | null) => void;
  /** Called when the user picks a style or height, so the store can update fence.styleId / heightFt. */
  onStyleChange?: (styleId: string, heightFt: number) => void;
}

type Computed = { ok: true; takeoff: TakeOff } | { ok: false; reason: string };

const HEIGHTS = [3, 4, 5, 6, 8];

export function TakeOffPanel({ fence, plane, profiles, priceBook, firm, onTakeOff, onStyleChange }: TakeOffPanelProps) {
  const availability = useMemo(() => (priceBook ? styleAvailability(priceBook) : []), [priceBook]);
  const completeIds = useMemo(() => availability.filter((a) => a.missingRoles.length === 0).map((a) => a.rule.id), [availability]);

  // Local selection seeded from the fence (re-seeded when the fence's own style/height change);
  // falls back to the first complete style.
  const [styleId, setStyleId] = useState(fence.styleId);
  const [heightFt, setHeightFt] = useState(fence.heightFt);
  const [seed, setSeed] = useState({ styleId: fence.styleId, heightFt: fence.heightFt });
  if (seed.styleId !== fence.styleId || seed.heightFt !== fence.heightFt) {
    setSeed({ styleId: fence.styleId, heightFt: fence.heightFt });
    setStyleId(fence.styleId);
    setHeightFt(fence.heightFt);
  }
  const effectiveStyleId = completeIds.includes(styleId) ? styleId : (completeIds[0] ?? styleId);

  // Recompute on content changes, not object identity, so a store that re-creates `fence` or
  // `profiles` each render does not re-emit onTakeOff in a loop.
  const fenceKey = JSON.stringify(fence);
  const profilesKey = Object.entries(profiles)
    .map(([k, p]) => `${k}:${p.source}:${p.correctedLengthFt}`)
    .sort()
    .join("|");
  const planeKey = `${plane.origin[0]},${plane.origin[1]}`;
  const bookKey = priceBook ? `${priceBook.id}:${priceBook.importedAt}` : "";

  const computed: Computed | null = useMemo(() => {
    if (!priceBook) return null;
    const rule = findRule(priceBook, effectiveStyleId);
    if (!rule) return { ok: false, reason: `Style "${effectiveStyleId}" is not in the price book.` };
    if (fence.vertices.length < 2) return { ok: false, reason: "Draw a fence to see the take-off." };
    try {
      const takeoff = computeTakeOff({
        fence: { ...fence, styleId: effectiveStyleId, heightFt },
        plane,
        profiles,
        priceBook,
        rule: { ...rule, heightFt },
        taxRatePct: firm.taxRatePct,
        now: new Date().toISOString(),
      });
      return { ok: true, takeoff };
    } catch (err) {
      console.warn("[TakeOffPanel] computeTakeOff failed", err);
      return { ok: false, reason: "take-off unavailable" };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed on serialised content (see above)
  }, [bookKey, planeKey, fenceKey, profilesKey, effectiveStyleId, heightFt, firm.taxRatePct]);

  // Publish the result upward. `onTakeOff` is read through a ref so parents may pass inline callbacks.
  const onTakeOffRef = useRef(onTakeOff);
  useEffect(() => {
    onTakeOffRef.current = onTakeOff;
  });
  useEffect(() => {
    onTakeOffRef.current?.(computed && computed.ok ? computed.takeoff : null);
  }, [computed]);

  if (!priceBook) {
    return (
      <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-4 text-sm" data-testid="takeoff-panel">
        <h2 className="mb-1 font-semibold">Take-off</h2>
        <p className="text-zinc-600" data-testid="takeoff-no-pricebook">
          No price book yet. Import your price book CSV in{" "}
          <Link href="/settings" className="font-medium text-blue-700 underline">
            Settings
          </Link>{" "}
          to price this fence. Prices only ever come from your own list.
        </p>
      </section>
    );
  }

  const segmentCount = fence.closed ? fence.vertices.length : Math.max(fence.vertices.length - 1, 0);
  const profileCount = Object.values(profiles).filter((p) => p.source !== "none").length;

  const pick = (nextStyle: string, nextHeight: number) => {
    setStyleId(nextStyle);
    setHeightFt(nextHeight);
    onStyleChange?.(nextStyle, nextHeight);
  };

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 text-sm" data-testid="takeoff-panel">
      <div className="flex flex-wrap items-end gap-3">
        <h2 className="mr-auto font-semibold">Take-off</h2>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Style
          <select
            data-testid="style-select"
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900"
            value={effectiveStyleId}
            onChange={(e) => {
              const rule = findRule(priceBook, e.target.value);
              pick(e.target.value, rule?.heightFt ?? heightFt);
            }}
          >
            {availability.map(({ rule, missingRoles }) => (
              <option key={rule.id} value={rule.id} disabled={missingRoles.length > 0}>
                {rule.name}
                {missingRoles.length > 0 ? ` (missing: ${missingRoles.join(", ")})` : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-zinc-600">
          Height
          <select
            data-testid="height-select"
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900"
            value={heightFt}
            onChange={(e) => pick(effectiveStyleId, Number(e.target.value))}
          >
            {(HEIGHTS.includes(heightFt) ? HEIGHTS : [...HEIGHTS, heightFt].sort((a, b) => a - b)).map((h) => (
              <option key={h} value={h}>
                {h} ft
              </option>
            ))}
          </select>
        </label>
      </div>

      {completeIds.length === 0 ? (
        <p className="rounded bg-amber-50 p-2 text-amber-800" data-testid="takeoff-no-style">
          None of the styles is complete in this price book. Bind the missing roles in{" "}
          <Link href="/settings" className="underline">
            Settings
          </Link>
          .
        </p>
      ) : null}

      {computed === null ? null : !computed.ok ? (
        <p className="rounded bg-zinc-50 p-2 text-zinc-600" data-testid="takeoff-unavailable">
          {computed.reason}
        </p>
      ) : (
        <TakeOffBody takeoff={computed.takeoff} profileCount={profileCount} segmentCount={segmentCount} taxRatePct={firm.taxRatePct} />
      )}
    </section>
  );
}

function TakeOffBody({ takeoff, profileCount, segmentCount, taxRatePct }: { takeoff: TakeOff; profileCount: number; segmentCount: number; taxRatePct: number }) {
  const status = slopeStatus(takeoff.slopeFactor, profileCount, segmentCount);
  const partial = profileCount > 0 && profileCount < segmentCount;
  const materials = takeoff.lines.filter((l) => l.category !== "labor");
  const labor = takeoff.lines.filter((l) => l.category === "labor");
  return (
    <>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
        <Stat label="Length (flat)" value={formatFt(takeoff.flatLengthFt)} testId="takeoff-length-flat" />
        <Stat
          label="Length (corrected)"
          value={
            <span className="flex flex-wrap items-center gap-2">
              <span data-testid="takeoff-length-corrected">{formatFt(takeoff.correctedLengthFt)}</span>
              <SlopeBadge status={status} slopeFactor={takeoff.slopeFactor} partial={partial} />
            </span>
          }
        />
        <Stat label="Fence (less gates)" value={formatFt(takeoff.fenceLengthFt)} testId="takeoff-length-fence" />
        <Stat label="Sections" value={String(takeoff.sections)} testId="takeoff-sections" />
        <Stat
          label="Posts"
          testId="takeoff-posts"
          value={`${takeoff.posts.total} total · ${takeoff.posts.corner} corner · ${takeoff.posts.end} end · ${takeoff.posts.line} line · ${takeoff.posts.gate} gate`}
          wide
        />
        <Stat label="Gates" value={String(takeoff.gates)} testId="takeoff-gates" />
        <Stat label="Height" value={`${takeoff.heightFt} ft`} />
      </dl>

      <LineTable title="Materials" lines={materials} />
      <LineTable title="Labor" lines={labor} />

      <div className="ml-auto grid w-full max-w-xs grid-cols-2 gap-y-0.5 text-right">
        <span className="text-zinc-600">Subtotal</span>
        <span data-testid="takeoff-subtotal">{formatCents(takeoff.subtotalCents)}</span>
        <span className="text-zinc-600">Tax{taxRatePct ? ` (${taxRatePct}%)` : ""}</span>
        <span data-testid="takeoff-tax">{formatCents(takeoff.taxCents)}</span>
        <span className="border-t border-zinc-300 pt-1 font-semibold">Total</span>
        <span className="border-t border-zinc-300 pt-1 font-semibold" data-testid="takeoff-total">
          {formatCents(takeoff.totalCents)}
        </span>
      </div>

      {takeoff.warnings.length > 0 ? (
        <ul className="list-disc space-y-0.5 rounded bg-amber-50 py-2 pl-6 pr-2 text-amber-900" data-testid="takeoff-warnings">
          {takeoff.warnings.map((w, i) => (
            <li key={i} data-testid="takeoff-warning">
              {w}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

function Stat({ label, value, testId, wide = false }: { label: string; value: React.ReactNode; testId?: string; wide?: boolean }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <dt className="text-xs text-zinc-500">{label}</dt>
      <dd className="font-medium" data-testid={testId}>
        {value}
      </dd>
    </div>
  );
}

function LineTable({ title, lines }: { title: string; lines: TakeOffLine[] }) {
  if (lines.length === 0) return null;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <caption className="pb-1 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">{title}</caption>
        <thead>
          <tr className="border-b border-zinc-300 text-zinc-500">
            <th className="py-1 pr-2 font-medium">Item</th>
            <th className="py-1 pr-2 text-right font-medium">Qty</th>
            <th className="py-1 pr-2 font-medium">Unit</th>
            <th className="py-1 pr-2 text-right font-medium">Price</th>
            <th className="py-1 text-right font-medium">Extended</th>
          </tr>
        </thead>
        <tbody>
          {lines.map((l, i) => (
            <tr key={`${l.sku}-${i}`} className="border-b border-zinc-100 align-top" data-testid="takeoff-line" data-sku={l.sku}>
              <td className="py-1 pr-2">
                <div>{l.description}</div>
                <div className="text-[11px] text-zinc-500">
                  {l.sku}
                  {l.basis ? ` · ${l.basis}` : ""}
                </div>
              </td>
              <td className="py-1 pr-2 text-right tabular-nums">{formatQty(l.qty)}</td>
              <td className="py-1 pr-2 text-zinc-500">{l.unit}</td>
              <td className="py-1 pr-2 text-right tabular-nums">{formatCents(l.unitPriceCents)}</td>
              <td className="py-1 text-right tabular-nums">{formatCents(l.extendedCents)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
