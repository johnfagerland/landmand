/**
 * POST /api/proposal { quote, takeoff, firm } -> application/pdf (attachment proposal-<quoteId>.pdf).
 * Node runtime: @react-pdf/renderer is a server external (next.config.ts) and never reaches the client.
 */
import { z } from "zod";
import { proposalRequestSchema } from "@/lib/repo/schemas";
import { proposalFileName, renderProposalPdf } from "@/lib/pdf/render";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalid_json", message: "Request body must be JSON." }, { status: 400 });
  }
  const parsed = proposalRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid_request", message: "Invalid proposal payload.", issues: z.treeifyError(parsed.error) },
      { status: 400 },
    );
  }
  try {
    const pdf = await renderProposalPdf(parsed.data);
    // Copy into a plain ArrayBuffer-backed view so the Web Response accepts it.
    const bytes = new Uint8Array(pdf.byteLength);
    bytes.set(pdf);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${proposalFileName(parsed.data.quote.id)}"`,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[api/proposal] render failed", err);
    return Response.json({ ok: false, error: "render_failed", message: "Could not render the proposal PDF." }, { status: 500 });
  }
}
