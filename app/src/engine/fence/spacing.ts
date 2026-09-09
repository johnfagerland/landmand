import type { StyleRule } from "../types";

/**
 * Post spacing used for laying out line posts and counting sections.
 * Panel styles are governed by the panel width (a section is one panel); stick-built and roll
 * styles use the rule's post spacing. Keeps posts.ts and takeoff.ts in agreement.
 */
export function effectiveSpacingFt(rule: StyleRule): number {
  if (rule.sectionModel === "panel" && rule.panelWidthFt && rule.panelWidthFt > 0) return rule.panelWidthFt;
  return rule.postSpacingFt;
}
