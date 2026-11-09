"use client";

import { useState } from "react";
import { Card, Disclaimer, PageHeader, PrimaryButton } from "@/components/ui";
import { useStore, type ConnectionId } from "@/lib/store";

const SOFTWARE: Array<{ id: ConnectionId; title: string; text: string }> = [
  { id: "sepidar", title: "سپیدار سیستم", text: "با علامت اتصال، چهار سند نمونه به فهرست محلی اضافه می‌شود." },
  { id: "rahkaran", title: "راهکاران همکاران سیستم", text: "اتصال واقعی در این نسخه وجود ندارد." },
  { id: "hesabfa", title: "حسابفا / لیام / هلو", text: "فقط وضعیت نمایشی روی همین دستگاه." },
  { id: "shop", title: "نرم‌افزار فروشگاهی", text: "صورتحسابی از صندوق دریافت نمی‌شود." },
];

const OFFICIAL: Array<{ id: ConnectionId; title: string; text: string }> = [
  { id: "mytax", title: "my.tax.gov.ir", text: "استعلام پرونده و بدهی فقط داخل درگاه رسمی است." },
  { id: "moadian", title: "سامانه مودیان", text: "ارسال صورتحساب از کارپوشه یا نرم‌افزار مجاز انجام می‌شود." },
];

export function IntegrationsView() {
  const { connections, setConnection, toast } = useStore();
  const [webhook, setWebhook] = useState("");

  function toggle(id: ConnectionId) {
    setConnection(id, connections[id] === "connected" ? "disconnected" : "connected");
  }

  return (
    <div>
      <PageHeader title="اتصالات و سامانه‌ها" description="دکمه‌ها دسترسی واقعی نمی‌سازند. برای دیدن جریان کار، وضعیت را روی همین مرورگر علامت می‌زنید." />
      <div className="mb-4">
        <Disclaimer>اتصال به سپیدار، راهکاران یا درگاه دولتی وابسته به API و مجوز رسمی است. این صفحه آن مجوز را شبیه‌سازی نمی‌کند و رمز نرم‌افزار هم نمی‌خواهد.</Disclaimer>
      </div>
      <div className="mb-5 grid gap-5 md:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-bold">نرم‌افزارهای حسابداری</h2>
          <div className="space-y-3">
            {SOFTWARE.map((item) => {
              const on = connections[item.id] === "connected";
              return (
                <div key={item.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${on ? "border-emerald-200 bg-emerald-50" : "border-slate-200"}`}>
                  <div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs text-slate-500">{on ? "علامت محلی: متصل" : item.text}</div>
                  </div>
                  <button type="button" onClick={() => toggle(item.id)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs ${on ? "border border-red-200 text-red-600" : "bg-teal-700 text-white"}`}>
                    {on ? "برداشتن علامت" : "علامت محلی"}
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
        <Card>
          <h2 className="mb-4 font-bold">سامانه‌های رسمی</h2>
          <div className="space-y-3">
            {OFFICIAL.map((item) => {
              const on = connections[item.id] === "connected";
              return (
                <div key={item.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-medium">{item.title}</div>
                      <div className="text-xs text-slate-500">{item.text}</div>
                    </div>
                    <button type="button" onClick={() => toggle(item.id)} className={`shrink-0 rounded-lg px-3 py-1.5 text-xs ${on ? "border border-red-200 text-red-600" : "bg-teal-700 text-white"}`}>
                      {on ? "برداشتن" : "علامت پیگیری"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
      <Card>
        <h2 className="mb-3 font-bold">کلید نمایشی</h2>
        <p className="mb-3 text-xs leading-6 text-slate-500">این رشته یک کلید زنده نیست و به هیچ سرویسی دسترسی نمی‌دهد.</p>
        <div className="flex flex-wrap gap-2">
          <code dir="ltr" className="rounded-lg bg-slate-50 px-3 py-2 text-xs">tx_demo_not_a_live_key</code>
          <button type="button" onClick={() => toast("کلید نمایشی کپی نمی‌شود چون اعتباری ندارد.")} className="rounded-lg border px-3 text-xs">
            چرا کلید واقعی نیست؟
          </button>
        </div>
        <label className="mt-4 block text-sm">
          <span className="mb-1 block text-xs text-slate-500">نشانی یادداشت وب‌هوک</span>
          <input value={webhook} dir="ltr" onChange={(event) => setWebhook(event.target.value)} placeholder="https://example.com/tax-note" className="w-full rounded-xl border px-3 py-2 text-sm" />
        </label>
        <PrimaryButton className="mt-3" onClick={() => toast(webhook.trim() ? "نشانی فقط در حافظه این صفحه ماند و ارسال نشد." : "نشانی خالی است.")}>
          نگه داشتن یادداشت
        </PrimaryButton>
      </Card>
    </div>
  );
}
