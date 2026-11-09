import type { Metadata } from "next";
import { CalendarView } from "@/components/views/calendar";

export const metadata: Metadata = { title: "تقویم مالیاتی" };

export default function Page() {
  return <CalendarView />;
}
