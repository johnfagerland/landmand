/**
 * Server-only entry point for rendering the proposal PDF. Keep this module (and @react-pdf/renderer)
 * out of client bundles: it is imported only by src/app/api/proposal/route.ts.
 */
import { renderToBuffer } from "@react-pdf/renderer";
import type { FirmSettings, Quote, TakeOff } from "@/engine/types";
import { DEFAULT_STYLE_RULES } from "@/engine/pricebook/styles";
import { APP_NAME } from "@/lib/config";
import { ProposalDocument } from "./ProposalDocument";

export interface RenderProposalInput {
  quote: Quote;
  takeoff: TakeOff;
  firm: FirmSettings;
}

export async function renderProposalPdf({ quote, takeoff, firm }: RenderProposalInput): Promise<Buffer> {
  const rule = DEFAULT_STYLE_RULES.find((r) => r.id === takeoff.styleId);
  return renderToBuffer(
    <ProposalDocument quote={quote} takeoff={takeoff} firm={firm} appName={APP_NAME} styleName={rule?.name} rule={rule} />,
  );
}

/** Safe file name for the download. */
export function proposalFileName(quoteId: string): string {
  const safe = quoteId.replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "") || "quote";
  return `proposal-${safe}.pdf`;
}
