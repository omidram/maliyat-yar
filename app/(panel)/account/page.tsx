import type { Metadata } from "next";
import { AccountView } from "@/components/views/account";

export const metadata: Metadata = { title: "حساب کاربری" };

export default function Page() {
  return <AccountView />;
}
