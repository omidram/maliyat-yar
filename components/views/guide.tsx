"use client";

import { Card, Disclaimer, PageHeader } from "@/components/ui";
import { useStore } from "@/lib/store";

const STEPS = [
  {
    id: "portal",
    title: "ورود به درگاه ملی",
    body: "نشانی رسمی my.tax.gov.ir را خودتان در مرورگر باز کنید. مالیات‌یار به‌جای شما وارد حساب نمی‌شود.",
  },
  {
    id: "sso",
    title: "احراز هویت با دولت‌من",
    body: "ورود از پنجره ملی خدمات دولت انجام می‌شود. رمز عبور، کد یکبارمصرف یا گواهی امضا را در این برنامه وارد نکنید.",
  },
  {
    id: "folder",
    title: "تکمیل کارپوشه",
    body: "اطلاعات پایه، شماره‌حساب و وضعیت پرونده را در کارپوشه رسمی کنترل کنید. مغایرت هویتی را همان‌جا اصلاح کنید.",
  },
  {
    id: "memory",
    title: "شناسه یکتای حافظه مالیاتی",
    body: "برای ارسال صورتحساب، شناسه یکتای حافظه مالیاتی را از مسیر سامانه مودیان بگیرید و فقط در نرم‌افزار صدور صورتحساب خودتان نگه دارید.",
  },
  {
    id: "goods",
    title: "شناسه کالا و خدمت",
    body: "هر ردیف صورتحساب به شناسه استاندارد کالا یا خدمت نیاز دارد. نرخ ارزش افزوده را از همان شناسه بخوانید، نه از حدس.",
  },
  {
    id: "send",
    title: "ارسال صورتحساب الکترونیکی",
    body: "صورتحساب را از نرم‌افزار حسابداری یا کارپوشه بفرستید و شماره یکتا را ذخیره کنید.",
  },
  {
    id: "status",
    title: "پیگیری وضعیت",
    body: "وضعیت تأیید، رد یا انتظار را در سامانه ببینید. رد شدن صورتحساب را با دلیل اعلام‌شده اصلاح کنید.",
  },
];

export function GuideView() {
  const { guideDone, toggleGuide } = useStore();
  const done = STEPS.filter((step) => guideDone.includes(step.id)).length;

  return (
    <div>
      <PageHeader title="راهنمای سامانه مودیان" description={`${done.toLocaleString("fa-IR")} از ${STEPS.length.toLocaleString("fa-IR")} گام را روی این دستگاه علامت زده‌اید.`} />
      <div className="mb-4">
        <Disclaimer>
          این راهنما مسیر متعارف کار است. اختیار ورود، ارسال صورتحساب و استعلام بدهی فقط در سامانه‌های رسمی است.{" "}
          <a className="font-medium underline" href="https://my.tax.gov.ir" target="_blank" rel="noreferrer">
            my.tax.gov.ir
          </a>
        </Disclaimer>
      </div>
      <div className="mb-4 h-2 overflow-hidden rounded-full bg-slate-200">
        <div className="h-full bg-teal-700" style={{ width: `${(done / STEPS.length) * 100}%` }} />
      </div>
      <div className="space-y-3">
        {STEPS.map((step, index) => {
          const checked = guideDone.includes(step.id);
          return (
            <Card key={step.id} className={checked ? "border-teal-200 bg-teal-50/40" : ""}>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-800 text-sm text-white">{(index + 1).toLocaleString("fa-IR")}</div>
                <div className="flex-1">
                  <h2 className="font-bold">{step.title}</h2>
                  <p className="mt-1 text-sm leading-7 text-slate-600">{step.body}</p>
                  <button type="button" onClick={() => toggleGuide(step.id)} className="mt-3 text-xs font-medium text-teal-800">
                    {checked ? "علامت انجام شد — برداشتن" : "این گام را انجام دادم"}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
