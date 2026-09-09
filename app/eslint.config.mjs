import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const FRAMEWORK_IMPORTS = [
  "react", "react-dom", "react/*", "react-dom/*", "next", "next/*",
  "maplibre-gl", "maplibre-gl/*", "terra-draw", "terra-draw-*", "zustand", "zustand/*",
  "@react-pdf/*", "@/components/*", "@/app/*", "@/lib/*",
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Purity rule: the measurement engine and the data adapters stay framework-free (see AGENTS.md).
    files: ["src/engine/**/*.ts", "src/adapters/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: FRAMEWORK_IMPORTS,
              message: "src/engine and src/adapters must not import React, Next, map libraries, stores or app code.",
            },
          ],
        },
      ],
    },
  },
  {
    // The engine may not depend on adapters either (adapters depend on engine types, not the reverse).
    files: ["src/engine/**/*.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { group: [...FRAMEWORK_IMPORTS, "@/adapters/*"], message: "src/engine is pure: no adapters, no framework code." },
          ],
        },
      ],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts", "e2e/artifacts/**"]),
]);

export default eslintConfig;
