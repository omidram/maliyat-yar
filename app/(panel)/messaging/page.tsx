import type { Metadata } from "next";
import { MessagingView } from "@/components/views/messaging";

export const metadata: Metadata = { title: "پیام‌رسان‌ها" };

export default function Page() {
  return <MessagingView />;
}
