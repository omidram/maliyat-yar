"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { useUpcoming } from "@/components/use-today";
import { formatJalali } from "@/lib/jalali";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/calendar", label: "تقویم مالیاتی" },
  { href: "/calculator", label: "ماشین‌حساب" },
  { href: "/documents", label: "اسناد" },
  { href: "/advisor", label: "مشاور هوشمند" },
  { href: "/guide", label: "راهنمای مودیان" },
  { href: "/tickets", label: "تیکت مشاور" },
  { href: "/reports", label: "گزارش‌ها" },
  { href: "/integrations", label: "اتصالات" },
  { href: "/messaging", label: "پیام‌رسان‌ها" },
  { href: "/account", label: "حساب کاربری" },
];

const MOBILE = [
  { href: "/dashboard", label: "داشبورد" },
  { href: "/calendar", label: "تقویم" },
  { href: "/calculator", label: "محاسبه" },
  { href: "/advisor", label: "مشاور" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile, channels, connections, gcal, toasts, dismissToast } = useStore();
  const { items } = useUpcoming();
  const [openNotif, setOpenNotif] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const connectedChannels = Object.values(channels).filter(Boolean).length;
  const connectedApps = Object.values(connections).filter((status) => status === "connected").length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white print:hidden">
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between gap-3 px-4">
          <Logo href="/dashboard" />
          <nav className="hidden items-center gap-1 text-sm xl:flex">
            {NAV.slice(0, 6).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-1.5 ${pathname === item.href ? "bg-teal-50 font-semibold text-teal-800" : "text-slate-600 hover:bg-slate-100"}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpenNotif((value) => !value)}
              className="relative rounded-lg p-2 hover:bg-slate-100"
              aria-label="اعلان‌ها"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" />
                <path d="M9 17a3 3 0 0 0 6 0" />
              </svg>
              {items.length > 0 ? <span className="absolute top-1 left-1 h-2 w-2 rounded-full bg-red-500" /> : null}
            </button>
            <Link href="/account" className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800">
              {profile ? profile.name : "ثبت‌نام"}
            </Link>
          </div>
        </div>
      </header>

      {openNotif ? (
        <div className="fixed top-16 left-4 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl print:hidden">
          <div className="flex items-center justify-between border-b px-4 py-3 text-sm font-bold">
            <span>مهلت‌های پیش رو</span>
            <button type="button" onClick={() => setOpenNotif(false)} className="text-slate-400">
              بستن
            </button>
          </div>
          <div className="max-h-80 overflow-y-auto text-sm">
            {items.slice(0, 5).map((item) => (
              <Link key={item.id} href="/calendar" onClick={() => setOpenNotif(false)} className="block border-b px-4 py-3 hover:bg-slate-50">
                <div className="font-medium">{item.title}</div>
                <div className="mt-0.5 text-xs text-slate-500">
                  {formatJalali(item.year, item.month, item.day)} • {item.days === 0 ? "امروز" : `${item.days.toLocaleString("fa-IR")} روز`}
                </div>
              </Link>
            ))}
            {items.length === 0 ? <p className="px-4 py-6 text-xs text-slate-500">مهلت آینده‌ای در فهرست نیست.</p> : null}
          </div>
        </div>
      ) : null}

      <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6">
        <aside className="hidden w-60 shrink-0 lg:block print:hidden">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="mb-2 px-3 text-xs font-bold text-slate-400">منوی اصلی</div>
            <nav className="space-y-0.5 text-sm">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2 ${pathname === item.href ? "bg-teal-50 font-semibold text-teal-800" : "hover:bg-slate-50"}`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 border-t border-slate-100 px-3 pt-3 text-xs text-slate-500">
              <div className="mb-1 text-slate-400">وضعیت روی این دستگاه</div>
              <div>{connectedApps.toLocaleString("fa-IR")} اتصال علامت‌خورده</div>
              <div>{connectedChannels.toLocaleString("fa-IR")} کانال یادآوری</div>
              <div>{gcal ? "تقویم گوگل علامت خورده" : "تقویم گوگل خاموش"}</div>
            </div>
          </div>
        </aside>
        <main className="min-w-0 flex-1 pb-24 lg:pb-4">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white print:hidden lg:hidden">
        <div className="grid grid-cols-5 text-center text-[11px]">
          {MOBILE.map((item) => (
            <Link key={item.href} href={item.href} className={`px-1 py-3 ${pathname === item.href ? "font-bold text-teal-800" : "text-slate-500"}`}>
              {item.label}
            </Link>
          ))}
          <button type="button" onClick={() => setOpenMenu(true)} className="px-1 py-3 text-slate-500">
            بیشتر
          </button>
        </div>
      </nav>

      {openMenu ? (
        <div className="fixed inset-0 z-50 bg-slate-900/40 lg:hidden" onClick={() => setOpenMenu(false)}>
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-4" onClick={(event) => event.stopPropagation()}>
            <div className="mb-3 flex items-center justify-between">
              <div className="font-bold">همه بخش‌ها</div>
              <button type="button" onClick={() => setOpenMenu(false)} className="text-sm text-slate-500">
                بستن
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpenMenu(false)}
                  className={`rounded-xl px-3 py-3 text-sm ${pathname === item.href ? "bg-teal-50 font-semibold text-teal-800" : "bg-slate-50"}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 flex w-[min(92vw,24rem)] -translate-x-1/2 flex-col gap-2 print:hidden lg:bottom-6">
        {toasts.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => dismissToast(item.id)}
            className="pointer-events-auto rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg"
          >
            {item.text}
          </button>
        ))}
      </div>
    </div>
  );
}
