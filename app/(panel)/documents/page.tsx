import type { Metadata } from "next";
import { DocumentsView } from "@/components/views/documents";

export const metadata: Metadata = { title: "اسناد" };

export default function Page() {
  return <DocumentsView />;
}
