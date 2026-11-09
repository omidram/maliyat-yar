"use client";

import { useState } from "react";
import { Card, Disclaimer, PageHeader, PrimaryButton } from "@/components/ui";
import { formatPercent, formatRial, formatToman, formatYear, parseAmount } from "@/lib/format";
import { useStore } from "@/lib/store";
import { article131Limits, declaredIncomeDiscount, taxArticle131, taxCorporate, taxPenalty, taxSalaryMonthly, taxVat, type TaxYear } from "@/lib/tax";

type Tab = "real" | "legal" | "vat" | "salary" | "penalty";

const TABS: Array<{ id: Tab; label: string }> = [
  { id: "real", label: "اشخاص حقیقی" },
  { id: "legal", label: "اشخاص حقوقی" },
  { id: "vat", label: "ارزش افزوده" },
  { id: "salary", label: "مالیات حقوق" },
  { id: "penalty", label: "جریمه" },
];

function MoneyInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const amount = parseAmount(value);
  return (
    <label className="mb-4 block text-sm">
      <span className="mb-1 block font-medium">{label}</span>
      <input
        value={value}
        dir="ltr"
        inputMode="numeric"
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-lg outline-none focus:border-teal-600"
      />
      <span className="mt-1 block text-xs text-slate-400">{amount ? formatToman(amount) : "مبلغ را به ریال وارد کنید"}</span>
    </label>
  );
}

function Slices({ rows }: { rows: Array<{ label: string; amount: number; rate: number; tax: number }> }) {
  if (!rows.length) return null;
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full text-right text-sm">
        <thead className="text-xs text-slate-500">
          <tr>
            <th className="py-1 font-medium">پله</th>
            <th className="py-1 font-medium">مبلغ</th>
            <th className="py-1 font-medium">نرخ</th>
            <th className="py-1 font-medium">مالیات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-teal-100">
              <td className="py-2">{row.label}</td>
              <td>{formatRial(row.amount)}</td>
              <td>{formatPercent(row.rate)}</td>
              <td>{formatRial(row.tax)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CalculatorView() {
  const { scenario } = useStore();
  const formKey = [scenario.personType, scenario.taxYear, scenario.annualIncome, scenario.exemption, scenario.previousIncome, scenario.applyDiscount].join(":");
  return <CalculatorForm key={formKey} />;
}

function CalculatorForm() {
  const { scenario, updateScenario, toast } = useStore();
  const [tab, setTab] = useState<Tab>(scenario.personType === "legal" ? "legal" : "real");
  const [income, setIncome] = useState(String(scenario.annualIncome));
  const [exemption, setExemption] = useState(String(scenario.exemption));
  const [previous, setPrevious] = useState(String(scenario.previousIncome));
  const [discountOn, setDiscountOn] = useState(scenario.applyDiscount);
  const [year, setYear] = useState<TaxYear>(scenario.taxYear);
  const [rate, setRate] = useState("25");
  const [vatBase, setVatBase] = useState("100000000");
  const [vatRate, setVatRate] = useState("10");
  const [vatMode, setVatMode] = useState<"add" | "extract">("add");
  const [salary, setSalary] = useState("900000000");
  const [principal, setPrincipal] = useState("100000000");
  const [months, setMonths] = useState("3");
  const [filing, setFiling] = useState<0 | 0.1 | 0.3>(0);
  const [kind, setKind] = useState<"income" | "vat">("income");

  const limits = article131Limits(year);
  const points = discountOn ? declaredIncomeDiscount(parseAmount(income), parseAmount(previous)) : 0;
  const real = taxArticle131(parseAmount(income), year, parseAmount(exemption), points);
  const legal = taxCorporate(parseAmount(income), parseAmount(rate) / 100);
  const vat = taxVat(parseAmount(vatBase), parseAmount(vatRate), vatMode);
  const payroll = taxSalaryMonthly(parseAmount(salary));
  const penalty = taxPenalty({
    principal: parseAmount(principal),
    months: parseAmount(months),
    filingRate: filing,
    kind,
  });

  function saveScenario(personType: "real" | "legal") {
    updateScenario({
      personType,
      taxYear: year,
      annualIncome: parseAmount(income),
      exemption: personType === "real" ? parseAmount(exemption) : 0,
      previousIncome: parseAmount(previous),
      applyDiscount: personType === "real" && discountOn,
    });
    toast("این برآورد روی داشبورد همین دستگاه نشسته است.");
  }

  return (
    <div>
      <PageHeader title="ماشین‌حساب‌های مالیاتی" description="برآورد آموزشی با نصاب‌های منتشرشده. نرخ بالاتر فقط به مازاد همان پله اعمال می‌شود." />
      <div className="mb-4">
        <Disclaimer>این محاسبه برگ تشخیص، اظهارنامه یا نظر سازمان امور مالیاتی نیست. معافیت را فقط وقتی وارد کنید که شرایط همان سال را دارید.</Disclaimer>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${tab === item.id ? "bg-teal-700 text-white" : "bg-white text-slate-600"}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === "real" ? (
        <Card className="max-w-3xl">
          <h2 className="mb-1 font-bold">مالیات بر درآمد اشخاص حقیقی</h2>
          <p className="mb-4 text-xs leading-6 text-slate-500">
            سال {formatYear(year)}: تا {formatRial(limits.first)} با ۱۵٪ و تا {formatRial(limits.second)} با ۲۰٪. مازاد ۲۵٪ است.
          </p>
          <div className="mb-4 flex flex-wrap gap-2">
            {([1403, 1404, 1405] as TaxYear[]).map((item) => (
              <button key={item} type="button" onClick={() => setYear(item)} className={`rounded-lg px-3 py-1.5 text-xs ${year === item ? "bg-teal-800 text-white" : "bg-slate-100"}`}>
                عملکرد {formatYear(item)}
              </button>
            ))}
          </div>
          <MoneyInput label="درآمد مشمول مالیات سالانه، پیش از معافیت (ریال)" value={income} onChange={setIncome} />
          <MoneyInput label="معافیت ماده ۱۰۱، فقط در صورت شمول (ریال)" value={exemption} onChange={setExemption} />
          <button type="button" onClick={() => setExemption("2800000000")} className="mb-4 text-xs text-teal-800 underline">
            درج رقم منتشرشده برای عملکرد ۱۴۰۴: ۲٫۸ میلیارد ریال
          </button>
          <label className="mb-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={discountOn} onChange={(event) => setDiscountOn(event.target.checked)} />
            اعمال تبصره ماده ۱۳۱؛ بدهی سال قبل تسویه شده و اظهارنامه در مهلت داده شده است
          </label>
          {discountOn ? <MoneyInput label="درآمد ابرازی مشمول مالیات سال قبل (ریال)" value={previous} onChange={setPrevious} /> : null}
          <PrimaryButton onClick={() => saveScenario("real")}>محاسبه و نمایش در داشبورد</PrimaryButton>
          <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
            <div className="text-sm text-teal-800">مالیات برآوردی</div>
            <div className="text-2xl font-bold text-teal-950">{formatRial(real.tax)}</div>
            <div className="text-xs text-slate-500">
              {formatToman(real.tax)} • نرخ مؤثر {formatPercent(real.effectiveRate)}
              {real.discountPoints ? ` • تخفیف ${real.discountPoints.toLocaleString("fa-IR")} واحد درصد` : ""}
            </div>
            <Slices rows={real.slices} />
          </div>
        </Card>
      ) : null}

      {tab === "legal" ? (
        <Card className="max-w-3xl">
          <h2 className="mb-4 font-bold">مالیات اشخاص حقوقی</h2>
          <MoneyInput label="سود مشمول مالیات (ریال)" value={income} onChange={setIncome} />
          <label className="mb-4 block text-sm">
            <span className="mb-1 block font-medium">نرخ درصد</span>
            <input value={rate} dir="ltr" onChange={(event) => setRate(event.target.value)} className="w-full rounded-xl border px-4 py-3" />
            <span className="mt-1 block text-xs text-slate-400">نرخ عمومی ماده ۱۰۵ برابر ۲۵ است. نرخ خاص را فقط اگر مصداق قانونی دارد تغییر دهید.</span>
          </label>
          <PrimaryButton onClick={() => saveScenario("legal")}>محاسبه و نمایش در داشبورد</PrimaryButton>
          <div className="mt-4 rounded-xl border border-teal-100 bg-teal-50 p-4">
            <div className="text-sm text-teal-800">مالیات برآوردی</div>
            <div className="text-2xl font-bold">{formatRial(legal.tax)}</div>
            <div className="text-xs text-slate-500">{formatToman(legal.tax)} با نرخ {formatPercent(legal.rate)}</div>
          </div>
        </Card>
      ) : null}

      {tab === "vat" ? (
        <Card className="max-w-3xl">
          <h2 className="mb-4 font-bold">مالیات بر ارزش افزوده</h2>
          <div className="mb-4 flex gap-2">
            <button type="button" onClick={() => setVatMode("add")} className={`rounded-lg px-3 py-1.5 text-xs ${vatMode === "add" ? "bg-teal-800 text-white" : "bg-slate-100"}`}>
              افزودن به مبلغ خالص
            </button>
            <button type="button" onClick={() => setVatMode("extract")} className={`rounded-lg px-3 py-1.5 text-xs ${vatMode === "extract" ? "bg-teal-800 text-white" : "bg-slate-100"}`}>
              جدا کردن از مبلغ کل
            </button>
          </div>
          <MoneyInput label={vatMode === "add" ? "مبلغ خالص صورتحساب (ریال)" : "مبلغ کل شامل مالیات (ریال)"} value={vatBase} onChange={setVatBase} />
          <label className="mb-4 block text-sm">
            <span className="mb-1 block font-medium">نرخ درصد</span>
            <input value={vatRate} dir="ltr" onChange={(event) => setVatRate(event.target.value)} className="w-full rounded-xl border px-4 py-3" />
            <span className="mt-1 block text-xs text-slate-400">نرخ عمومی ۱۴۰۵ برابر ۱۰ است. سوخت، دخانیات و اجرت طلا نرخ دیگری دارند.</span>
          </label>
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
            <div>مبلغ خالص: {formatRial(vat.base)}</div>
            <div className="text-2xl font-bold text-teal-950">مالیات: {formatRial(vat.vat)}</div>
            <div className="text-sm">مبلغ کل: {formatRial(vat.total)}</div>
          </div>
        </Card>
      ) : null}

      {tab === "salary" ? (
        <Card className="max-w-3xl">
          <h2 className="mb-2 font-bold">مالیات حقوق ۱۴۰۵</h2>
          <p className="mb-4 text-xs leading-6 text-slate-500">جدول عمومی بودجه ۱۴۰۵. مبلغ را پس از کسر مزایای غیرمشمول وارد کنید. بیمه و نرخ هیئت علمی اینجا اعمال نمی‌شود.</p>
          <MoneyInput label="حقوق و مزایای مشمول مالیات در ماه (ریال)" value={salary} onChange={setSalary} />
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4">
            <div className="text-sm text-teal-800">مالیات ماهانه</div>
            <div className="text-2xl font-bold">{formatRial(payroll.tax)}</div>
            <div className="text-xs text-slate-500">خالص پس از این مالیات: {formatRial(payroll.net)} • {formatToman(payroll.tax)}</div>
            <Slices rows={payroll.slices} />
          </div>
        </Card>
      ) : null}

      {tab === "penalty" ? (
        <Card className="max-w-3xl">
          <h2 className="mb-4 font-bold">برآورد جریمه</h2>
          <div className="mb-4 flex gap-2">
            <button type="button" onClick={() => setKind("income")} className={`rounded-lg px-3 py-1.5 text-xs ${kind === "income" ? "bg-teal-800 text-white" : "bg-slate-100"}`}>
              عملکرد، ۲٫۵٪ در ماه
            </button>
            <button type="button" onClick={() => setKind("vat")} className={`rounded-lg px-3 py-1.5 text-xs ${kind === "vat" ? "bg-teal-800 text-white" : "bg-slate-100"}`}>
              ارزش افزوده، ۲٪ در ماه
            </button>
          </div>
          <MoneyInput label="اصل مالیات (ریال)" value={principal} onChange={setPrincipal} />
          <label className="mb-4 block text-sm">
            <span className="mb-1 block font-medium">تعداد ماه تأخیر پرداخت</span>
            <input value={months} dir="ltr" onChange={(event) => setMonths(event.target.value)} className="w-full rounded-xl border px-4 py-3" />
          </label>
          <label className="mb-4 block text-sm">
            <span className="mb-1 block font-medium">عدم تسلیم اظهارنامه</span>
            <select value={String(filing)} onChange={(event) => setFiling(Number(event.target.value) as 0 | 0.1 | 0.3)} className="w-full rounded-xl border px-4 py-3">
              <option value="0">اظهارنامه داده شده</option>
              <option value="0.1">جریمه ۱۰٪</option>
              <option value="0.3">جریمه ۳۰٪</option>
            </select>
          </label>
          <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm leading-7">
            <div>دیرکرد پرداخت: {formatRial(penalty.delay)}</div>
            <div>عدم تسلیم: {formatRial(penalty.filing)}</div>
            <div className="text-xl font-bold">جمع آموزشی: {formatRial(penalty.total)}</div>
            <p className="text-xs text-slate-500">بخشودگی به درخواست و سابقه مؤدی بستگی دارد و در این جمع نیست.</p>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
