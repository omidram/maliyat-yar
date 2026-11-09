import Link from "next/link";

export function Logo({ href = "/", compact = false }: { href?: string; compact?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-800 text-sm font-bold text-white">م</span>
      <span className={compact ? "hidden sm:block" : ""}>
        <span className="block text-sm font-bold leading-tight text-teal-950">مالیات‌یار</span>
        <span className="block text-[10px] text-slate-400">TaxSmart Iran</span>
      </span>
    </Link>
  );
}
