import type { Metadata } from "next";
import { TicketsView } from "@/components/views/tickets";

export const metadata: Metadata = { title: "تیکت مشاور" };

export default function Page() {
  return <TicketsView />;
}
