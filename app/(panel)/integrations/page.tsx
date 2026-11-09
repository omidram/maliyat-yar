import type { Metadata } from "next";
import { IntegrationsView } from "@/components/views/integrations";

export const metadata: Metadata = { title: "اتصالات" };

export default function Page() {
  return <IntegrationsView />;
}
