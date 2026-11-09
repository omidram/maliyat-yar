import type { Metadata } from "next";
import { CalculatorView } from "@/components/views/calculator";

export const metadata: Metadata = { title: "ماشین‌حساب" };

export default function Page() {
  return <CalculatorView />;
}
