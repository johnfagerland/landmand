"use client";

import type { PriceBook } from "@/engine/types";
import { styleAvailability } from "@/engine/pricebook/styles";
import { formatCents } from "@/lib/pdf/format";

export interface PriceBookTableProps {
  priceBook: PriceBook;
}

export function PriceBookTable({ priceBook }: PriceBookTableProps) {
  const availability = styleAvailability(priceBook);
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div>
        <h3 className="mb-1 font-medium">Styles</h3>
        <ul className="flex flex-wrap gap-2" data-testid="style-availability">
          {availability.map(({ rule, missingRoles }) => (
            <li
              key={rule.id}
              data-testid={`style-${rule.id}`}
              data-complete={missingRoles.length === 0 ? "true" : "false"}
              className={`rounded-full px-2.5 py-0.5 text-xs ring-1 ring-inset ${
                missingRoles.length === 0 ? "bg-emerald-50 text-emerald-800 ring-emerald-200" : "bg-amber-50 text-amber-800 ring-amber-200"
              }`}
              title={missingRoles.length === 0 ? "All required roles are bound" : `Missing: ${missingRoles.join(", ")}`}
            >
              {rule.name}
              {missingRoles.length === 0 ? " · ready" : ` · missing ${missingRoles.join(", ")}`}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-x-auto rounded border border-zinc-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 text-zinc-600">
            <tr>
              <th className="px-2 py-1.5 font-medium">SKU</th>
              <th className="px-2 py-1.5 font-medium">Description</th>
              <th className="px-2 py-1.5 font-medium">Category</th>
              <th className="px-2 py-1.5 font-medium">Unit</th>
              <th className="px-2 py-1.5 text-right font-medium">Unit price</th>
              <th className="px-2 py-1.5 font-medium">Tax</th>
              <th className="px-2 py-1.5 font-medium">Bindings</th>
            </tr>
          </thead>
          <tbody>
            {priceBook.items.map((item) => (
              <tr key={item.sku} className="border-t border-zinc-100" data-testid="pricebook-row" data-sku={item.sku}>
                <td className="px-2 py-1 font-mono">{item.sku}</td>
                <td className="px-2 py-1">{item.description}</td>
                <td className="px-2 py-1 text-zinc-600">{item.category}</td>
                <td className="px-2 py-1 text-zinc-600">
                  {item.unit}
                  {item.unit === "roll" && item.rollLengthFt ? ` (${item.rollLengthFt} ft)` : ""}
                </td>
                <td className="px-2 py-1 text-right tabular-nums">{formatCents(item.unitPriceCents)}</td>
                <td className="px-2 py-1 text-zinc-600">{item.taxable ? "yes" : "no"}</td>
                <td className="px-2 py-1 text-zinc-600">
                  {item.roles.length === 0 ? <span className="text-zinc-400">–</span> : item.roles.map((r) => `${r.styleId} / ${r.role}`).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-zinc-500">
        {priceBook.items.length} items · imported {new Date(priceBook.importedAt).toLocaleString()}
        {priceBook.sourceFileName ? ` from ${priceBook.sourceFileName}` : ""}
      </p>
    </div>
  );
}
