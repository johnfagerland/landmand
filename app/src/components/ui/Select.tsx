"use client";
import { forwardRef, type SelectHTMLAttributes } from "react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, options, className = "", id, ...rest },
  ref,
) {
  const selectId = id ?? (label ? `sel-${label.replace(/\W+/g, "-").toLowerCase()}` : undefined);
  const field = (
    <select
      ref={ref}
      id={selectId}
      className={
        "rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm text-zinc-900 " +
        "focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 " +
        className
      }
      {...rest}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} disabled={o.disabled}>
          {o.label}
        </option>
      ))}
    </select>
  );
  if (!label) return field;
  return (
    <label htmlFor={selectId} className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
      <span>{label}</span>
      {field}
    </label>
  );
});
