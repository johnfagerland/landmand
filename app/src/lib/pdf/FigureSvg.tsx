/**
 * Site figure for the proposal PDF (react-pdf Svg). Parcel dashed grey, fence solid black with
 * vertex dots, gates as red ticks with width labels, segment length labels, scale bar, north arrow.
 * Server-side only (imported by ProposalDocument).
 */
import { Circle, Line, Polygon, Polyline, Svg, Text } from "@react-pdf/renderer";
import type { ComponentType, ReactNode } from "react";
import type { FigureLayout } from "./figure";
import { pointsAttr } from "./figure";

/** react-pdf's SVG <Text> accepts font styling via `style`; its typings are narrower than the runtime. */
interface SvgTextProps {
  x: number;
  y: number;
  fill?: string;
  textAnchor?: "start" | "middle" | "end";
  style?: { fontSize?: number; fontFamily?: string; fontWeight?: number | string };
  children?: ReactNode;
}
const SvgText = Text as unknown as ComponentType<SvgTextProps>;

const FONT = { fontFamily: "Helvetica", fontSize: 6.5 };

export function FigureSvg({ layout }: { layout: FigureLayout }) {
  const { width, height } = layout;
  const northX = width - 14;
  const northY = 22;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      {/* Frame */}
      <Polygon points={pointsAttr([{ x: 0.5, y: 0.5 }, { x: width - 0.5, y: 0.5 }, { x: width - 0.5, y: height - 0.5 }, { x: 0.5, y: height - 0.5 }])} fill="#ffffff" stroke="#d4d4d8" strokeWidth={0.5} />

      {/* Parcel (lot lines) */}
      {layout.parcel.length >= 3 ? (
        <Polygon points={pointsAttr(layout.parcel)} fill="none" stroke="#9ca3af" strokeWidth={1} strokeDasharray="4 3" />
      ) : null}

      {/* Fence */}
      {layout.fence.length >= 2 ? (
        layout.closed && layout.fence.length >= 3 ? (
          <Polygon points={pointsAttr(layout.fence)} fill="none" stroke="#111827" strokeWidth={1.6} strokeLinejoin="round" />
        ) : (
          <Polyline points={pointsAttr(layout.fence)} fill="none" stroke="#111827" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
        )
      ) : null}
      {layout.fence.map((p, i) => (
        <Circle key={`v${i}`} cx={p.x} cy={p.y} r={1.8} fill="#111827" />
      ))}

      {/* Segment lengths */}
      {layout.segmentLabels.map((l, i) => (
        <SvgText key={`s${i}`} x={l.at.x} y={l.at.y} textAnchor="middle" fill="#374151" style={FONT}>
          {l.text}
        </SvgText>
      ))}

      {/* Gates */}
      {layout.gates.map((g) => (
        <Line key={g.id} x1={g.tick[0].x} y1={g.tick[0].y} x2={g.tick[1].x} y2={g.tick[1].y} stroke="#dc2626" strokeWidth={3.2} strokeLinecap="butt" />
      ))}
      {layout.gates.map((g) => (
        <SvgText key={`${g.id}-label`} x={g.label.x} y={g.label.y} textAnchor="middle" fill="#dc2626" style={FONT}>
          {`${g.kind === "double" ? "double " : ""}gate ${g.widthFt} ft`}
        </SvgText>
      ))}

      {/* Scale bar */}
      {!layout.empty ? (
        <>
          <Line x1={layout.scaleBar.from.x} y1={layout.scaleBar.from.y} x2={layout.scaleBar.to.x} y2={layout.scaleBar.to.y} stroke="#111827" strokeWidth={1.5} />
          <Line x1={layout.scaleBar.from.x} y1={layout.scaleBar.from.y - 3} x2={layout.scaleBar.from.x} y2={layout.scaleBar.from.y + 3} stroke="#111827" strokeWidth={1} />
          <Line x1={layout.scaleBar.to.x} y1={layout.scaleBar.to.y - 3} x2={layout.scaleBar.to.x} y2={layout.scaleBar.to.y + 3} stroke="#111827" strokeWidth={1} />
          <SvgText x={layout.scaleBar.to.x + 4} y={layout.scaleBar.to.y + 2.5} fill="#111827" style={FONT}>
            {`${layout.scaleBar.lengthFt} ft`}
          </SvgText>
        </>
      ) : null}

      {/* North arrow */}
      <Line x1={northX} y1={northY + 12} x2={northX} y2={northY - 8} stroke="#111827" strokeWidth={1} />
      <Polygon points={pointsAttr([{ x: northX, y: northY - 12 }, { x: northX - 3.5, y: northY - 4 }, { x: northX + 3.5, y: northY - 4 }])} fill="#111827" />
      <SvgText x={northX} y={northY + 20} textAnchor="middle" fill="#111827" style={{ ...FONT, fontWeight: 700 }}>
        N
      </SvgText>

      {layout.empty ? (
        <SvgText x={width / 2} y={height / 2} textAnchor="middle" fill="#6b7280" style={{ ...FONT, fontSize: 9 }}>
          No fence geometry
        </SvgText>
      ) : null}
    </Svg>
  );
}
