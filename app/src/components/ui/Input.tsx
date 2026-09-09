"use client";
import { forwardRef, type InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, className = "", id, ...rest },
  ref,
) {
  const inputId = id ?? (label ? `in-${label.replace(/\W+/g, "-").toLowerCase()}` : undefined);
  const field = (
    <input
      ref={ref}
      id={inputId}
      className={
        "w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 " +
        "placeholder:text-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 " +
        "disabled:bg-zinc-100 " +
        className
      }
      {...rest}
    />
  );
  if (!label) return field;
  return (
    <label htmlFor={inputId} className="flex flex-col gap-1 text-xs font-medium text-zinc-600">
      <span>{label}</span>
      {field}
      {hint ? <span className="font-normal text-zinc-500">{hint}</span> : null}
    </label>
  );
});
