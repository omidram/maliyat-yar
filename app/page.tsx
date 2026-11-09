import Link from "next/link";
import { Logo } from "@/components/logo";
import { formatPercent, formatRial, formatToman } from "@/lib/format";
import { taxArticle131 } from "@/lib/tax";

const sample = taxArticle131(6_000_000_000, 1405, 0);

const features = [
  { title: "ماشین‌حساب ماده ۱۳۱", text: "پله‌های ۱۴۰۳ تا ۱۴۰۵، معافیت اختیاری ماده ۱۰۱ و تخفیف تبصره افزایش درآمد ابرازی." },
  { title: "حقوق، شرکت و ارزش افزوده", text: "نرخ عمومی ۲۵٪، ارزش افزوده ۱۰٪ با جداسازی از مبلغ کل، و جدول حقوق بودجه ۱۴۰۵." },
  { title: "تقویم مهلت‌های متعارف", text: "اظهارنامه عملکرد، ارزش افزوده فصلی و پرداخت مالیات حقوق، با رویداد شخصی روی همین دستگاه." },
  { title: "راهنمای سامانه مودیان", text: "هفت گام از درگاه ملی تا پیگیری صورتحساب، بدون دریافت رمز دولت‌من." },
  { title: "پایگاه دانش، نه پاسخ ساختگی", text: "سؤال‌های شناخته‌شده با ارجاع به ماده قانونی جواب می‌گیرند و بقیه به تیکت نمونه می‌روند." },
  { title: "داده روی مرورگر شما", text: "حساب، سند و گفتگو در localStorage می‌ماند. محتوایی به سرور مالیات‌یار فرستاده نمی‌شود." },
];

const plans = [
  { name: "رایگان", price: "۰", items: ["ماشین‌حساب‌ها", "تقویم مهلت‌ها", "راهنمای مودیان"] },
  { name: "پایه", price: "۲۹۰ هزار", items: ["داشبورد پرونده", "بایگانی محلی اسناد", "یادآور داخل برنامه"] },
  { name: "حرفه‌ای", price: "۷۹۰ هزار", items: ["گفتگوی دانش‌محور", "تیکت نمونه مشاور", "گزارش چاپی"] },
  { name: "سازمانی", price: "توافقی", items: ["چند پرونده برای حسابدار", "نسخه سفید", "پس از مجوز API"] },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f4f1ea] text-slate-900">
      <div className="bg-teal-950 px-4 py-2 text-center text-xs text-teal-50">
        برآورد آموزشی بر اساس نصاب‌های منتشرشده ۱۴۰۵. این سامانه وابسته به سازمان امور مالیاتی نیست و اظهارنامه ارسال نمی‌کند.
      </div>
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/calculator" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-white sm:inline">
            ماشین‌حساب
          </Link>
          <Link href="/guide" className="hidden rounded-lg px-3 py-2 text-slate-600 hover:bg-white sm:inline">
            راهنمای مودیان
          </Link>
          <Link href="/dashboard" className="rounded-xl bg-teal-800 px-4 py-2 font-medium text-white">
            میز کار
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16">
        <section className="grid items-center gap-10 py-8 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-teal-800">TaxSmart Iran</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-teal-950 sm:text-4xl">لایه مشاوره‌ای روی تکالیف مالیاتی، نه یک نرم‌افزار حسابداری دیگر</h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              اشخاص حقیقی، شرکت‌های کوچک و حسابدارها سند و عددشان را همین‌جا مرتب می‌کنند، مالیات را پله‌به‌پله می‌بینند و مسیر سامانه مودیان را بدون سپردن رمز عبور جلو می‌برند.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/dashboard" className="rounded-xl bg-teal-800 px-5 py-3 text-sm font-semibold text-white">
                باز کردن داشبورد
              </Link>
              <Link href="/calculator" className="rounded-xl border border-teal-900/15 bg-white px-5 py-3 text-sm font-semibold">
                محاسبه نمونه ۶ میلیارد ریال
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-teal-900/10 bg-white p-5 shadow-sm">
            <div className="text-xs text-slate-500">نمونه ماده ۱۳۱ • سال ۱۴۰۵ • بدون معافیت</div>
            <div className="mt-2 text-sm">درآمد مشمول {formatRial(sample.taxable)}</div>
            <div className="mt-1 text-3xl font-bold text-teal-900">{formatRial(sample.tax)}</div>
            <div className="text-xs text-slate-500">{formatToman(sample.tax)} • نرخ مؤثر {formatPercent(sample.effectiveRate)}</div>
            <div className="mt-4 space-y-2 text-sm">
              {sample.slices.map((slice) => (
                <div key={slice.label} className="flex items-center justify-between rounded-xl bg-teal-50 px-3 py-2">
                  <span>{slice.label}</span>
                  <span>{formatRial(slice.tax)}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] leading-5 text-slate-400">۴ میلیارد اول ۱۵٪ و ۲ میلیارد بعدی ۲۰٪. نرخ ۲۵٪ به کل درآمد نمی‌خورد.</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ["تفسیر قانون", "بخشنامه، معافیت و جریمه برای مؤدی غیرفنی درهم است و خطای اظهارنامه گران تمام می‌شود."],
            ["مشاور کمیاب", "مشاور سنتی برای کسب‌وکار کوچک گران و نوبتش محدود است."],
            ["فاصله تا درگاه رسمی", "my.tax.gov.ir فرآیند را الکترونیکی کرده، ولی هنوز پل ساده‌ای تا فهم تکلیف نیست."],
          ].map(([title, text]) => (
            <article key={title} className="rounded-2xl bg-white p-5">
              <h2 className="font-bold text-teal-950">{title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{text}</p>
            </article>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-teal-950">آنچه در این نسخه کار می‌کند</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article key={feature.title} className="rounded-2xl border border-teal-900/10 bg-white/70 p-5">
                <h3 className="font-bold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{feature.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 rounded-3xl bg-teal-950 p-6 text-teal-50 md:grid-cols-4">
          {[
            ["۱", "نوع شخص و عدد مشمول را وارد کنید"],
            ["۲", "پله، مهلت و راهنمای مودیان را ببینید"],
            ["۳", "اگر پاسخ آماده نبود تیکت نمونه بسازید"],
            ["۴", "گزارش را از همین مرورگر چاپ کنید"],
          ].map(([index, text]) => (
            <div key={index}>
              <div className="text-2xl font-bold text-teal-200">{index}</div>
              <p className="mt-2 text-sm leading-7">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-teal-950">قیمت پیشنهادی</h2>
          <p className="mt-2 text-sm text-slate-500">درگاه پرداخت فعال نیست. عددها مدل درآمدی پیشنهادی‌اند، نه تعرفه قطعی.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <article key={plan.name} className="rounded-2xl bg-white p-5">
                <h3 className="font-bold">{plan.name}</h3>
                <div className="mt-2 text-xl font-bold text-teal-900">
                  {plan.price}
                  <span className="mr-1 text-xs font-normal text-slate-400">{plan.name === "سازمانی" ? "" : "تومان در ماه"}</span>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                  {plan.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-teal-900/10 px-4 py-6 text-center text-xs leading-6 text-slate-500">
        مالیات‌یار ابزار مستقل مشاوره‌ای است. تکلیف قانونی را در my.tax.gov.ir و سامانه مودیان انجام دهید.
      </footer>
    </div>
  );
}
