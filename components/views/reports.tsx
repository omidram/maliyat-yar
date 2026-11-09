"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/ui";
import { useUpcoming } from "@/components/use-today";
import { formatRial, formatYear } from "@/lib/format";
import { formatJalali } from "@/lib/jalali";
import { useStore } from "@/lib/store";
import { declaredIncomeDiscount, taxArticle131, taxCorporate } from "@/lib/tax";

type ReportKind = "tax" | "calendar" | "sync";

export function ReportsView() {
  const { profile, scenario, documents, connections, channels } = useStore();
  const { items } = useUpcoming();
  const [kind, setKind] = useState<ReportKind>("tax");
  const discount = scenario.applyDiscount ? declaredIncomeDiscount(scenario.annualIncome, scenario.previousIncome) : 0;
  const real = taxArticle131(scenario.annualIncome, scenario.taxYear, scenario.exemption, discount);
  const legal = taxCorporate(scenario.annualIncome);

  const cards: Array<{ id: ReportKind; title: string; text: string }> = [
    { id: "tax", title: "خلاصه برآورد مالیات", text: "درآمد، پله‌ها و مبلغ برآوردی ذخیره‌شده" },
    { id: "calendar", title: "فهرست مهلت‌ها", text: "تکالیف باقی‌مانده با تاریخ شمسی" },
    { id: "sync", title: "وضعیت اسناد و علامت‌ها", text: "آنچه فقط روی این دستگاه ذخیره شده" },
  ];

  return (
    <div>
      <PageHeader
        title="گزارش‌ها"
        description="خروجی چاپی از همین صفحه ساخته می‌شود. فایل به سرور نمی‌رود."
        action={
          <button type="button" onClick={() => window.print()} className="rounded-xl bg-teal-700 px-4 py-2 text-sm font-semibold text-white">
            چاپ یا ذخیره PDF
          </button>
        }
      />
      <div className="mb-5 grid gap-3 sm:grid-cols-3 print:hidden">
        {cards.map((card) => (
          <button key={card.id} type="button" onClick={() => setKind(card.id)} className={`rounded-2xl border p-4 text-right ${kind === card.id ? "border-teal-600 bg-teal-50" : "border-slate-200 bg-white"}`}>
            <div className="font-bold">{card.title}</div>
            <div className="mt-1 text-xs text-slate-500">{card.text}</div>
          </button>
        ))}
      </div>
      <Card>
        <article id="print-area" className="text-sm leading-7">
          <h2 className="text-lg font-bold">مالیات‌یار — {cards.find((card) => card.id === kind)?.title}</h2>
          <p className="text-xs text-slate-500">برآورد آموزشی و مستقل از سازمان امور مالیاتی. {profile ? `حساب محلی: ${profile.name}` : "بدون حساب محلی"}</p>
          {kind === "tax" ? (
            <div className="mt-4">
              <p>نوع: {scenario.personType === "legal" ? "شخص حقوقی" : "شخص حقیقی"} • سال {formatYear(scenario.taxYear)}</p>
              {scenario.personType === "legal" ? (
                <p>سود مشمول {formatRial(legal.taxable)} • مالیات {formatRial(legal.tax)}</p>
              ) : (
                <>
                  <p>درآمد پس از معافیت {formatRial(real.taxable)} • مالیات {formatRial(real.tax)}</p>
                  <ul className="mt-2 list-disc pr-5">
                    {real.slices.map((slice) => (
                      <li key={slice.label}>
                        {slice.label}: {formatRial(slice.amount)} × {(slice.rate * 100).toLocaleString("fa-IR")}٪ = {formatRial(slice.tax)}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ) : null}
          {kind === "calendar" ? (
            <ul className="mt-4 space-y-1">
              {items.map((item) => (
                <li key={item.id}>
                  {formatJalali(item.year, item.month, item.day)} — {item.title} ({item.days.toLocaleString("fa-IR")} روز)
                </li>
              ))}
            </ul>
          ) : null}
          {kind === "sync" ? (
            <div className="mt-4">
              <p>اسناد محلی: {documents.length.toLocaleString("fa-IR")}</p>
              <ul className="list-disc pr-5">
                {documents.map((doc) => (
                  <li key={doc.id}>
                    {doc.name} — {doc.category}
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                اتصالات علامت‌خورده:{" "}
                {Object.entries(connections)
                  .filter(([, status]) => status === "connected")
                  .map(([name]) => name)
                  .join("، ") || "هیچ"}
              </p>
              <p>کانال‌ها: {Object.entries(channels).filter(([, on]) => on).map(([name]) => ({ telegram: "تلگرام", bale: "بله", whatsapp: "واتساپ", sms: "پیامک" })[name as "telegram"] ?? name).join("، ") || "هیچ"}</p>
            </div>
          ) : null}
        </article>
      </Card>
    </div>
  );
}
