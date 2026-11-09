"use client";

import Link from "next/link";
import { Card, Disclaimer, PageHeader } from "@/components/ui";
import { useUpcoming } from "@/components/use-today";
import { formatJalali } from "@/lib/jalali";
import { useStore } from "@/lib/store";
import { formatRial, formatToman, formatYear } from "@/lib/format";
import { declaredIncomeDiscount, taxArticle131, taxCorporate } from "@/lib/tax";

export function DashboardView() {
  const { profile, scenario, documents, connections, channels } = useStore();
  const { items } = useUpcoming();
  const discount = scenario.applyDiscount ? declaredIncomeDiscount(scenario.annualIncome, scenario.previousIncome) : 0;
  const real = taxArticle131(scenario.annualIncome, scenario.taxYear, scenario.exemption, discount);
  const legal = taxCorporate(scenario.annualIncome);
  const isLegal = scenario.personType === "legal";
  const tax = isLegal ? legal.tax : real.tax;
  const next = items[0];
  const synced = documents.filter((doc) => doc.source === "sepidar").length;
  const activeApps = Object.values(connections).filter((status) => status === "connected").length;
  const channelNames: Record<string, string> = { telegram: "تلگرام", bale: "بله", whatsapp: "واتساپ", sms: "پیامک" };
  const activeChannels = Object.entries(channels).filter(([, on]) => on);

  return (
    <div>
      <PageHeader
        title={profile ? `سلام، ${profile.name}` : "داشبورد مؤدی"}
        description="برآورد از عددی که در ماشین‌حساب ذخیره شده. تا وقتی خودتان محاسبه نکنید، نمونه ۶ میلیارد ریالی سال ۱۴۰۵ نشان داده می‌شود."
        action={
          <Link href="/calculator" className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800">
            ویرایش محاسبه
          </Link>
        }
      />
      <div className="mb-5">
        <Disclaimer>
          اعداد جایگزین برگ تشخیص نیستند. مهلت‌ها متعارف‌اند و بخشنامه می‌تواند آن‌ها را تمدید کند. هیچ داده‌ای به سازمان امور مالیاتی فرستاده نمی‌شود.
        </Disclaimer>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs text-slate-500">{isLegal ? "سود مشمول (نمونه یا ذخیره‌شده)" : "درآمد مشمول پس از معافیت"}</div>
          <div className="mt-1 text-xl font-bold">{formatRial(isLegal ? legal.taxable : real.taxable)}</div>
          <div className="text-[11px] text-slate-400">{formatToman(isLegal ? legal.taxable : real.taxable)} • سال {formatYear(scenario.taxYear)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">{isLegal ? "مالیات ۲۵٪" : "مالیات برآوردی ماده ۱۳۱"}</div>
          <div className="mt-1 text-xl font-bold text-teal-800">{formatRial(tax)}</div>
          <div className="text-[11px] text-slate-400">{formatToman(tax)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">مهلت بعدی</div>
          <div className="mt-1 text-xl font-bold text-amber-700">{next ? (next.days === 0 ? "امروز" : `${next.days.toLocaleString("fa-IR")} روز`) : "—"}</div>
          <div className="text-[11px] text-slate-400">{next?.title ?? "در حال خواندن تقویم"}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs text-slate-500">اسناد روی همین دستگاه</div>
          <div className="mt-1 text-xl font-bold">{documents.length.toLocaleString("fa-IR")}</div>
          <div className="text-[11px] text-slate-400">{synced.toLocaleString("fa-IR")} مورد از فهرست نمایشی سپیدار</div>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-bold">تکالیف پیش رو</h2>
          <div className="space-y-2">
            {items.slice(0, 4).map((item) => (
              <div key={item.id} className={`flex items-center gap-3 rounded-xl border p-3 ${item.days <= 20 ? "border-amber-100 bg-amber-50" : "border-slate-100 bg-slate-50"}`}>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{item.title}</div>
                  <div className="text-xs text-slate-500">
                    {formatJalali(item.year, item.month, item.day)} • {item.detail}
                  </div>
                </div>
                <Link href="/guide" className="shrink-0 rounded-lg bg-teal-700 px-3 py-1 text-xs text-white">
                  راهنما
                </Link>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="mb-3 text-sm font-bold">وضعیت محلی</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>اتصالات علامت‌خورده</span>
              <span className="font-medium">{activeApps.toLocaleString("fa-IR")}</span>
            </div>
            <div className="flex justify-between">
              <span>کانال یادآوری</span>
              <span className="font-medium">{activeChannels.length ? activeChannels.map(([name]) => channelNames[name] ?? name).join("، ") : "هیچ‌کدام"}</span>
            </div>
            <div className="flex justify-between">
              <span>نوع محاسبه</span>
              <span className="font-medium">{isLegal ? "شخص حقوقی" : "شخص حقیقی"}</span>
            </div>
            <Link href="/integrations" className="mt-2 block rounded-xl border border-teal-200 py-2 text-center text-xs text-teal-800 hover:bg-teal-50">
              مدیریت اتصالات
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
