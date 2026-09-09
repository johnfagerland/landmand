import type { Metadata } from "next";
import Link from "next/link";
import "maplibre-gl/dist/maplibre-gl.css";
import "./globals.css";
import { APP_NAME } from "@/lib/config";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "Quote a fence job from the address: lot lines, slope-corrected take-off, proposal PDF.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="flex items-center gap-6 border-b border-zinc-200 bg-white px-4 py-2 text-sm">
          <Link href="/" className="font-semibold tracking-tight" data-testid="nav-home">
            {APP_NAME}
          </Link>
          <nav className="flex gap-4 text-zinc-600">
            <Link href="/" data-testid="nav-quotes">Quotes</Link>
            <Link href="/settings" data-testid="nav-settings">Settings</Link>
          </nav>
        </header>
        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
