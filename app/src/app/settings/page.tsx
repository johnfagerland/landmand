import type { Metadata } from "next";
import { APP_NAME } from "@/lib/config";
import { SettingsClient } from "./SettingsClient";

export const metadata: Metadata = {
  title: `Settings · ${APP_NAME}`,
  description: "Firm details for proposals and the price book used for every take-off.",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
