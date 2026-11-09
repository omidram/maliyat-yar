"use client";

import { Card, Disclaimer, PageHeader, PrimaryButton } from "@/components/ui";
import { useStore, type ChannelId, type NotifyTopic } from "@/lib/store";

const CHANNELS: Array<{ id: ChannelId; title: string; text: string }> = [
  { id: "telegram", title: "تلگرام", text: "یادآوری مهلت، فقط به‌صورت علامت محلی" },
  { id: "bale", title: "بله", text: "اعلان داخل برنامه، بدون ربات واقعی" },
  { id: "whatsapp", title: "واتساپ", text: "WhatsApp Business در این نسخه وصل نیست" },
  { id: "sms", title: "پیامک", text: "شماره شما برای ارسال استفاده نمی‌شود" },
];

const TOPICS: Array<{ id: NotifyTopic; title: string; text: string }> = [
  { id: "deadline", title: "یادآوری مهلت اظهارنامه", text: "۷، ۳ و ۱ روز قبل، وقتی ارسال واقعی فعال شود" },
  { id: "debt", title: "اعلان بدهی یا برگ تشخیص", text: "در نسخه فعلی از درگاه رسمی خوانده نمی‌شود" },
  { id: "weekly", title: "گزارش هفتگی", text: "هر شنبه، فقط اگر کانال واقعی وصل باشد" },
];

export function MessagingView() {
  const { channels, setChannel, prefs, togglePref, toast } = useStore();

  return (
    <div>
      <PageHeader title="یادآوری در پیام‌رسان" description="کانال را برای ترجیح خودتان علامت بزنید. از این صفحه پیامی خارج نمی‌شود." />
      <div className="mb-4">
        <Disclaimer>ربات تلگرام، بله، واتساپ و پنل پیامک در این نسخه ساخته نشده است. علامت‌ها فقط ترجیح ذخیره‌شده روی مرورگر هستند.</Disclaimer>
      </div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CHANNELS.map((item) => {
          const on = channels[item.id];
          return (
            <Card key={item.id} className={`text-center ${on ? "border-teal-600" : ""}`}>
              <div className="font-bold">{item.title}</div>
              <div className={`mt-1 text-xs ${on ? "text-emerald-700" : "text-slate-400"}`}>{on ? "علامت محلی: روشن" : "خاموش"}</div>
              <p className="my-3 text-[11px] leading-5 text-slate-500">{item.text}</p>
              <button type="button" onClick={() => setChannel(item.id, !on)} className={`w-full rounded-lg px-3 py-1.5 text-xs ${on ? "border border-red-200 text-red-600" : "bg-teal-700 text-white"}`}>
                {on ? "خاموش کردن" : "روشن کردن علامت"}
              </button>
            </Card>
          );
        })}
      </div>
      <Card>
        <h2 className="mb-4 font-bold">ترجیح اعلان</h2>
        <div className="space-y-3 text-sm">
          {TOPICS.map((topic) => (
            <div key={topic.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-2">
              <div>
                <div className="font-medium">{topic.title}</div>
                <div className="text-xs text-slate-500">{topic.text}</div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs">
                {CHANNELS.map((channel) => (
                  <label key={channel.id} className="flex items-center gap-1">
                    <input type="checkbox" checked={prefs[topic.id][channel.id]} onChange={() => togglePref(topic.id, channel.id)} />
                    {channel.title}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <PrimaryButton className="mt-4" onClick={() => toast("ترجیح اعلان روی همین دستگاه ذخیره شد.")}>
          ذخیره ترجیح
        </PrimaryButton>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm">آزمایش علامت:</span>
          {CHANNELS.map((channel) => (
            <button
              key={channel.id}
              type="button"
              onClick={() => toast(channels[channel.id] ? `پیامی به ${channel.title} فرستاده نشد. فقط علامت محلی روشن است.` : `اول علامت ${channel.title} را روشن کنید.`)}
              className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs text-white"
            >
              {channel.title}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
