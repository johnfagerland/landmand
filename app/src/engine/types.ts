/**
 * Domain types for the fence-estimate engine.
 * Pure data, no framework imports. FROZEN during wave 1: changes go through the integrating agent.
 *
 * Units: all lengths in feet, all money in integer cents, all angles in degrees, coordinates WGS84 [lon, lat].
 */

export type LonLat = [lon: number, lat: number];
export interface XY {
  x: number;
  y: number;
}

/** A local tangent plane in feet centred on a parcel; all measurement happens here, never in degrees. */
export interface LocalPlane {
  origin: LonLat;
  ftPerDegLon: number;
  ftPerDegLat: number;
  toXY(p: LonLat): XY;
  toLonLat(p: XY): LonLat;
}

export type ParcelSource = "regrid" | "county" | "manual";

export interface Parcel {
  /** `${providerId}:${apn}` or `manual:${uuid}` */
  id: string;
  source: ParcelSource;
  /** e.g. "county:37183", "regrid", "manual" */
  providerId: string;
  /** Shown on the map and the PDF, e.g. "Lot lines: Wake County GIS" */
  attribution: string;
  apn?: string;
  siteAddress?: string;
  /** Exterior ring: CCW, no closing duplicate, slivers < 1 ft removed, 7 dp. */
  ring: LonLat[];
  /** Display only in Phase A. */
  holes: LonLat[][];
  areaSqFt: number;
  /** Local-plane origin = ring centroid. */
  origin: LonLat;
  /** ISO timestamp */
  fetchedAt: string;
}

export type GateKind = "single" | "double";

export interface Gate {
  id: string;
  /** Re-projected onto the nearest fence segment after every edit. */
  anchor: LonLat;
  /** 3..16 */
  widthFt: number;
  kind: GateKind;
}

export interface FenceLine {
  /** Ordered vertices. Closed loops do NOT repeat the first vertex. */
  vertices: LonLat[];
  /** true = perimeter fence (polygon), false = open run (line) */
  closed: boolean;
  gates: Gate[];
  /** StyleRule id, e.g. "wood-privacy-6" */
  styleId: string;
  heightFt: number;
}

/** Derived by segmentsOf(); never stored. */
export interface FenceSegment {
  index: number;
  /** Hash of rounded endpoints; used as the elevation-profile cache key. */
  key: string;
  a: XY;
  b: XY;
  aLonLat: LonLat;
  bLonLat: LonLat;
  /** Flat, planar length in feet (full precision). */
  lengthFt: number;
  /** 0..360, clockwise from north */
  bearingDeg: number;
}

export type PostKind = "corner" | "end" | "line" | "gate";

export interface Post {
  kind: PostKind;
  at: XY;
  lonLat: LonLat;
  segmentIndex: number;
  /** Distance in feet from the start of the segment. */
  stationFt: number;
}

export interface ElevationSample {
  stationFt: number;
  /** null when the DEM had no data at this point */
  elevFt: number | null;
  lonLat: LonLat;
}

export type ElevationSource = "3dep" | "epqs" | "none";

export interface ElevationProfile {
  segmentKey: string;
  samples: ElevationSample[];
  correctedLengthFt: number;
  /** corrected / flat, >= 1 */
  slopeFactor: number;
  /** end elevation minus start elevation */
  riseFt: number;
  maxGradePct: number;
  source: ElevationSource;
  resolutionM?: number;
}

export type ItemCategory =
  | "post"
  | "rail"
  | "picket"
  | "panel"
  | "fabric"
  | "concrete"
  | "gate"
  | "hardware"
  | "cap"
  | "labor"
  | "other";

export type Unit = "each" | "ft" | "bag" | "roll" | "hour";

/** Roles a price-book item can play inside a fence style. */
export type StyleRole =
  | "linePost"
  | "terminalPost"
  | "gatePost"
  | "rail"
  | "picket"
  | "panel"
  | "fabric"
  | "topRail"
  | "cap"
  | "concrete"
  | "laborPerFt"
  | "gateSingle"
  | "gateDouble"
  | "gateHardware"
  | "laborPerGate";

export interface PriceBookItem {
  sku: string;
  description: string;
  category: ItemCategory;
  unit: Unit;
  unitPriceCents: number;
  /** For unit "roll": feet per roll. */
  rollLengthFt?: number;
  taxable: boolean;
  /** Bindings of this item to a style role, from the CSV's optional `style` + `role` columns. */
  roles: { styleId: string; role: StyleRole }[];
}

export type SectionModel = "stick" | "panel" | "roll";

export interface StyleRule {
  id: string;
  name: string;
  sectionModel: SectionModel;
  heightFt: number;
  /** stick: 8; panel: panel width; roll: 10 */
  postSpacingFt: number;
  /** default 15 */
  cornerThresholdDeg: number;
  railsPerSection?: number;
  picketWidthIn?: number;
  picketGapIn?: number;
  panelWidthFt?: number;
  concreteBagsPerLinePost: number;
  concreteBagsPerTerminalPost: number;
  wastePct: number;
  /** Roles that must be bound for the style to be usable. */
  requiredRoles: StyleRole[];
  /** Resolved role -> sku bindings from the price book. */
  skus: Partial<Record<StyleRole, string>>;
}

export interface PriceBook {
  id: string;
  name: string;
  items: PriceBookItem[];
  /** Style rules with `skus` resolved from item role bindings. */
  rules: StyleRule[];
  importedAt: string;
  sourceFileName?: string;
}

export interface TakeOffLine {
  sku: string;
  description: string;
  category: ItemCategory;
  unit: Unit;
  qty: number;
  unitPriceCents: number;
  extendedCents: number;
  /** Human-readable derivation, e.g. "40 sections x 3 rails" */
  basis: string;
  taxable: boolean;
}

export interface SegmentTakeOff {
  segmentIndex: number;
  flatFt: number;
  correctedFt: number;
  /** corrected length minus gate openings */
  fenceFt: number;
  slopeFactor: number;
  linePosts: number;
  sections: number;
  gateIds: string[];
}

export interface PostCounts {
  corner: number;
  end: number;
  line: number;
  gate: number;
  total: number;
}

export interface TakeOff {
  styleId: string;
  heightFt: number;
  flatLengthFt: number;
  correctedLengthFt: number;
  /** corrected length minus gate openings */
  fenceLengthFt: number;
  slopeFactor: number;
  posts: PostCounts;
  sections: number;
  gates: number;
  segments: SegmentTakeOff[];
  lines: TakeOffLine[];
  subtotalCents: number;
  taxCents: number;
  totalCents: number;
  warnings: string[];
  computedAt: string;
}

export interface Address {
  line1: string;
  city: string;
  state: string;
  zip: string;
  /** The geocoder's matched address string. */
  matched: string;
  /** 5-digit county FIPS when known. */
  countyFips?: string;
}

export type ParcelStatus = "found" | "manual" | "pending";

export interface Customer {
  name: string;
  email?: string;
  phone?: string;
}

export interface Quote {
  schemaVersion: 1;
  id: string;
  createdAt: string;
  updatedAt: string;
  address: Address;
  geocode: LonLat;
  parcel?: Parcel;
  parcelStatus: ParcelStatus;
  fence: FenceLine;
  /** Keyed by FenceSegment.key */
  profiles: Record<string, ElevationProfile>;
  priceBookId?: string;
  takeoff?: TakeOff;
  customer: Customer;
  notes: string;
}

export interface FirmSettings {
  name: string;
  /** data: URL, capped at 200 KB */
  logoDataUrl?: string;
  addressLines: string[];
  phone: string;
  email: string;
  licenseNo?: string;
  taxRatePct: number;
  defaultSetbackFt: number;
  terms: string;
}
