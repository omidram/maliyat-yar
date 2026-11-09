"use client";

import { useMemo, useState } from "react";
import { Card, Disclaimer, PageHeader, PrimaryButton, TextField } from "@/components/ui";
import { useJalaliToday } from "@/components/use-today";
import { OBLIGATIONS } from "@/lib/deadlines";
import { formatYear } from "@/lib/format";
import { daysBetween, formatJalali, jalaliMonthLength, jalaliMonthName, jalaliWeekdays, weekdayIndex } from "@/lib/jalali";
import { useStore } from "@/lib/store";

export function CalendarView() {
  const today = useJalaliToday();
  const { events, addEvent, removeEvent, gcal, setGcal } = useStore();
  const [offset, setOffset] = useState(0);
  const [title, setTitle] = useState("");
  const [day, setDay] = useState("15");
  const [note, setNote] = useState("");
  const shown = useMemo(() => {
    if (!today) return null;
    const absolute = today.year * 12 + (today.month - 1) + offset;
    const monthIndex = ((absolute % 12) + 12) % 12;
    return { year: Math.floor(absolute / 12), month: monthIndex + 1 };
  }, [offset, today]);

  const cells = useMemo(() => {
    if (!shown) return [];
    const lead = weekdayIndex(shown.year, shown.month, 1);
    const length = jalaliMonthLength(shown.year, shown.month);
    const blanks = Array.from({ length: lead }, () => null);
    const days = Array.from({ length: length }, (_, index) => index + 1);
    return [...blanks, ...days];
  }, [shown]);

  if (!shown || !today) {
    return <Card>تقویم در حال تنظیم روی تاریخ همین دستگاه است.</Card>;
  }

  const monthEvents = [
    ...OBLIGATIONS.filter((item) => item.year === shown.year && item.month === shown.month).map((item) => ({
      id: item.id,
      day: item.day,
      title: item.title,
      official: true,
    })),
    ...events
      .filter((item) => item.year === shown.year && item.month === shown.month)
      .map((item) => ({ id: item.id, day: item.day, title: item.title, official: false })),
  ];

  const upcoming = [...OBLIGATIONS, ...events.map((item) => ({ ...item, detail: item.note }))]
    .map((item) => ({ ...item, days: daysBetween(today.date, item.year, item.month, item.day) }))
    .filter((item) => item.days >= 0)
    .sort((a, b) => a.days - b.days)
    .slice(0, 5);

  const view = shown;

  function shift(delta: number) {
    setOffset((current) => current + delta);
  }

  function saveEvent() {
    const parsedDay = Number(day);
    const max = jalaliMonthLength(view.year, view.month);
    if (!title.trim() || parsedDay < 1 || parsedDay > max) return;
    addEvent({ title: title.trim(), year: view.year, month: view.month, day: parsedDay, note: note.trim() });
    setTitle("");
    setNote("");
  }

  return (
    <div>
      <PageHeader
        title="تقویم مالیاتی"
        description="مهلت‌های متعارف به‌علاوه رویدادهایی که خودتان روی همین دستگاه اضافه می‌کنید."
        action={
          <button type="button" onClick={() => setGcal(!gcal)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm">
            {gcal ? "علامت Google Calendar روشن است" : "علامت Google Calendar"}
          </button>
        }
      />
      <div className="mb-4">
        <Disclaimer>اتصال واقعی به Google Calendar در این نسخه انجام نمی‌شود. یادآوری پیامکی یا تلگرامی هم از اینجا ارسال نمی‌شود.</Disclaimer>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="overflow-hidden p-0 lg:col-span-2">
          <div className="flex items-center justify-between border-b bg-slate-50 px-4 py-3">
            <button type="button" onClick={() => shift(-1)} className="rounded px-2 py-1 hover:bg-slate-200" aria-label="ماه قبل">
              ‹
            </button>
            <div className="font-bold">
              {jalaliMonthName(shown.month)} {formatYear(shown.year)}
            </div>
            <button type="button" onClick={() => shift(1)} className="rounded px-2 py-1 hover:bg-slate-200" aria-label="ماه بعد">
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 border-b text-center text-xs font-medium text-slate-500">
            {jalaliWeekdays().map((name) => (
              <div key={name} className="py-2">
                {name}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-sm">
            {cells.map((value, index) => {
              if (!value) return <div key={`blank-${index}`} className="min-h-20 border border-slate-100 bg-slate-50" />;
              const hits = monthEvents.filter((item) => item.day === value);
              const isToday = today.year === shown.year && today.month === shown.month && today.day === value;
              return (
                <div key={value} className={`min-h-20 border border-slate-100 p-1.5 ${hits.length ? "bg-emerald-50" : ""}`}>
                  <div className={`text-xs font-medium ${isToday ? "inline-flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-white" : ""}`}>
                    {value.toLocaleString("fa-IR")}
                  </div>
                  {hits.slice(0, 2).map((hit) => (
                    <div key={hit.id} className="mt-1 truncate rounded bg-teal-100 px-1 text-[10px] text-teal-800">
                      {hit.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </Card>
        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 text-sm font-bold">نزدیک‌ترین مهلت‌ها</h2>
            <div className="space-y-3 text-sm">
              {upcoming.map((item) => (
                <div key={item.id} className="border-r-4 border-teal-600 pr-3">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-slate-500">
                    {formatJalali(item.year, item.month, item.day)} • {item.days === 0 ? "امروز" : `${item.days.toLocaleString("fa-IR")} روز دیگر`}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card>
            <h2 className="mb-3 text-sm font-bold">رویداد شخصی</h2>
            <div className="space-y-3">
              <TextField label={`عنوان در ${jalaliMonthName(shown.month)}`} value={title} onChange={setTitle} />
              <TextField label="روز" value={day} onChange={setDay} dir="ltr" inputMode="numeric" />
              <TextField label="یادداشت" value={note} onChange={setNote} />
              <PrimaryButton onClick={saveEvent} className="w-full">
                افزودن به تقویم دستگاه
              </PrimaryButton>
            </div>
            <div className="mt-4 space-y-2">
              {events.length === 0 ? <p className="text-xs text-slate-500">هنوز رویداد شخصی ندارید.</p> : null}
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between gap-2 text-sm">
                  <span>
                    {event.title}
                    <span className="mr-1 text-xs text-slate-400">{formatJalali(event.year, event.month, event.day)}</span>
                  </span>
                  <button type="button" onClick={() => removeEvent(event.id)} className="text-xs text-red-600">
                    حذف
                  </button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
