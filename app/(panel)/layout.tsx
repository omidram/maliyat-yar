import { Shell } from "@/components/shell";
import { StoreProvider } from "@/lib/store";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Shell>{children}</Shell>
    </StoreProvider>
  );
}
