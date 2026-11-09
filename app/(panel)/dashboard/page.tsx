import type { Metadata } from "next";
import { DashboardView } from "@/components/views/dashboard";

export const metadata: Metadata = { title: "داشبورد" };

export default function Page() {
  return <DashboardView />;
}
