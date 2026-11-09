import type { Metadata } from "next";
import { GuideView } from "@/components/views/guide";

export const metadata: Metadata = { title: "راهنمای مودیان" };

export default function Page() {
  return <GuideView />;
}
