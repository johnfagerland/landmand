/**
 * Public engine API. Pure TypeScript: no React, Next, DOM, MapLibre or terra-draw imports anywhere under src/engine.
 * Wave-1 agents fill in the module bodies; the exported names and signatures are the contract.
 */
export * from "./types";
export * from "./units";
export * from "./geo/localPlane";
export * from "./geo/ring";
export * from "./geo/segments";
export * from "./geo/offset";
export * from "./geo/snap";
export * from "./fence/gates";
export * from "./fence/posts";
export * from "./fence/spacing";
export * from "./elevation/profile";
export * from "./takeoff/money";
export * from "./takeoff/takeoff";
export * from "./quote/quote";
export * from "./pricebook/schema";
export * from "./pricebook/parse";
export * from "./pricebook/styles";
