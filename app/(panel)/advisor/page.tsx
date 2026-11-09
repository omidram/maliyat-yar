import type { Metadata } from "next";
import { AdvisorView } from "@/components/views/advisor";

export const metadata: Metadata = { title: "مشاور هوشمند" };

export default function Page() {
  return <AdvisorView />;
}
