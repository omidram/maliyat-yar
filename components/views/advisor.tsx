"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";

const SAMPLES = ["نرخ مالیات اشخاص حقیقی در ۱۴۰۵ چیست؟", "چطور در سامانه مودیان صورتحساب بفرستم؟", "جریمه دیرکرد اظهارنامه چقدر است؟", "مالیات حقوق ۴۰ میلیون تومان معافیت دارد؟"];

export function AdvisorView() {
  const { messages, ask, clearChat } = useStore();
  const [text, setText] = useState("");
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight });
  }, [messages]);

  function send(value: string) {
    const question = value.trim();
    if (!question) return;
    ask(question);
    setText("");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between bg-teal-800 px-5 py-3 text-white">
        <div>
          <div className="text-sm font-bold">مشاور هوشمند مالیات‌یار</div>
          <div className="text-xs text-teal-100">پایگاه دانش داخلی، بدون اتصال به سازمان</div>
        </div>
        <button type="button" onClick={clearChat} className="text-xs text-teal-100">
          پاک کردن گفتگو
        </button>
      </div>
      <div ref={scroller} className="h-[28rem] space-y-3 overflow-y-auto bg-slate-50 p-4 text-sm">
        {messages.length === 0 ? (
          <div className="max-w-[90%] rounded-2xl rounded-tr-sm border bg-white px-3.5 py-2.5 leading-7 shadow-sm">
            درباره ماده ۱۳۱، مالیات شرکت، ارزش افزوده، حقوق، سامانه مودیان، مهلت‌ها و جریمه بپرسید. اگر پاسخ آماده نباشد، همان سؤال را می‌توانید در تیکت مشاور ثبت کنید.
          </div>
        ) : null}
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[90%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 leading-7 ${message.role === "user" ? "rounded-tl-sm bg-teal-700 text-white" : "rounded-tr-sm border bg-white shadow-sm"}`}>
              {message.text}
              {message.refs?.length ? <div className="mt-2 text-[11px] text-teal-800">مبنا: {message.refs.join("، ")}</div> : null}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-3">
        <form
          className="flex gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            send(text);
          }}
        >
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="سؤال مالیاتی خود را بنویسید"
            className="flex-1 rounded-xl border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-teal-500"
          />
          <button type="submit" className="rounded-xl bg-teal-700 px-4 py-2 text-sm text-white">
            ارسال
          </button>
        </form>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SAMPLES.map((sample) => (
            <button key={sample} type="button" onClick={() => send(sample)} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px]">
              {sample}
            </button>
          ))}
        </div>
        <Link href="/tickets" className="mt-3 inline-block text-xs text-teal-800">
          ارجاع همین موضوع به مشاور انسانی
        </Link>
      </div>
    </div>
  );
}
