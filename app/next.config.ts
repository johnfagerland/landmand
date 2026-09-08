import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // @react-pdf/renderer is rendered server-side in /api/proposal and must not be bundled.
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
