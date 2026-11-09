"use client";

import { useState } from "react";
import { Card, Disclaimer, PageHeader, PrimaryButton, TextField } from "@/components/ui";
import { useStore } from "@/lib/store";

export function TicketsView() {
  const { tickets, addTicket } = useStore();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  return (
    <div>
      <PageHeader title="تیکت مشاور انسانی" description="در این نسخه مشاور انسانی وصل نیست. ثبت تیکت یک پاسخ نمونه از همان پایگاه دانش می‌سازد و روی مرورگر می‌ماند." />
      <div className="mb-4">
        <Disclaimer>برای پرونده واقعی، مدارک را برای شخص ناشناس ارسال نکنید. پاسخ نمونه، نظر رسمی مشاور یا سازمان نیست.</Disclaimer>
      </div>
      <Card className="mb-5 max-w-2xl">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            if (subject.trim().length < 4 || body.trim().length < 8) {
              setError("موضوع حداقل ۴ نویسه و شرح حداقل ۸ نویسه باشد.");
              return;
            }
            setError("");
            addTicket(subject.trim(), body.trim());
            setSubject("");
            setBody("");
          }}
        >
          <TextField label="موضوع" value={subject} onChange={setSubject} />
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-medium text-slate-500">شرح سؤال</span>
            <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} className="w-full rounded-xl border px-4 py-2.5 outline-none focus:border-teal-600" />
          </label>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <PrimaryButton type="submit">ثبت تیکت نمونه</PrimaryButton>
        </form>
      </Card>
      <div className="space-y-3">
        {tickets.length === 0 ? <Card className="text-sm text-slate-500">تیکتی ثبت نشده است.</Card> : null}
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <div className="text-xs text-slate-400">{new Date(ticket.createdAt).toLocaleString("fa-IR")}</div>
            <h2 className="mt-1 font-bold">{ticket.subject}</h2>
            <p className="mt-1 text-sm leading-7 text-slate-600">{ticket.body}</p>
            <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm leading-7">{ticket.reply}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
