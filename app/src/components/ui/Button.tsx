"use client";
import { forwardRef, type ButtonHTMLAttributes } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-md font-medium whitespace-nowrap transition-colors " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 " +
  "disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-700",
  secondary: "bg-white text-zinc-800 hover:bg-zinc-100 border border-zinc-300",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 border border-transparent",
  danger: "bg-white text-red-700 hover:bg-red-50 border border-red-300",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "secondary", size = "md", active = false, className = "", type = "button", ...rest },
  ref,
) {
  const activeCls = active ? " ring-2 ring-emerald-500 bg-emerald-50 border-emerald-500" : "";
  return (
    <button
      ref={ref}
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]}${activeCls} ${className}`}
      aria-pressed={active || undefined}
      {...rest}
    />
  );
});
