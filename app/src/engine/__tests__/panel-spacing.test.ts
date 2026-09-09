import { describe, expect, it } from "vitest";
import { effectiveSpacingFt } from "../fence/spacing";
import { layoutPosts } from "../fence/posts";
import { placeGates } from "../fence/gates";
import { segmentsOf } from "../geo/segments";
import { fence, plane, woodRule } from "./helpers";

describe("panel styles space posts by panel width", () => {
  const panelRule = woodRule({
    id: "vinyl-6",
    sectionModel: "panel",
    panelWidthFt: 6,
    postSpacingFt: 8, // deliberately different: the panel width must win
  });

  it("effectiveSpacingFt prefers panelWidthFt for panel styles only", () => {
    expect(effectiveSpacingFt(panelRule)).toBe(6);
    expect(effectiveSpacingFt(woodRule({ sectionModel: "stick", postSpacingFt: 8, panelWidthFt: 6 }))).toBe(8);
    expect(effectiveSpacingFt(woodRule({ sectionModel: "roll", postSpacingFt: 10, panelWidthFt: 6 }))).toBe(10);
    expect(effectiveSpacingFt(woodRule({ sectionModel: "panel", postSpacingFt: 8, panelWidthFt: undefined }))).toBe(8);
  });

  it("a 100 ft open run of 6 ft panels needs 17 sections and 18 posts", () => {
    const p = plane();
    const f = fence(p, [{ x: 0, y: 0 }, { x: 100, y: 0 }], { closed: false, styleId: "vinyl-6" });
    const segments = segmentsOf(f.vertices, f.closed, p);
    const placements = placeGates(f.gates, segments, p);
    const posts = layoutPosts(f, segments, placements, {}, panelRule, p);
    // ceil(100 / 6) = 17 sections -> 16 line posts + 2 end posts
    expect(posts.filter((q) => q.kind === "line")).toHaveLength(16);
    expect(posts.filter((q) => q.kind === "end")).toHaveLength(2);
    expect(posts).toHaveLength(18);
  });
});
