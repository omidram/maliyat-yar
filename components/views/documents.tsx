"use client";

import { useState } from "react";
import { Card, Disclaimer, PageHeader } from "@/components/ui";
import { formatNumber } from "@/lib/format";
import { useStore, type DocumentCategory } from "@/lib/store";

const CATEGORIES: DocumentCategory[] = ["صورتحساب", "قرارداد", "حقوق", "سایر"];

export function DocumentsView() {
  const { documents, addDocuments, removeDocument } = useStore();
  const [category, setCategory] = useState<DocumentCategory>("صورتحساب");
  const [over, setOver] = useState(false);

  function take(files: FileList | null) {
    if (!files?.length) return;
    addDocuments(Array.from(files), category);
  }

  return (
    <div>
      <PageHeader title="مدیریت اسناد" description="فقط نام و حجم فایل روی همین مرورگر می‌ماند. محتوای سند خوانده یا به سرور فرستاده نمی‌شود." />
      <div className="mb-4">
        <Disclaimer>برای پرونده واقعی، سند را در فضای رمزنگاری‌شده و داخل کشور نگه دارید. این صفحه بایگانی ابری نیست.</Disclaimer>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {CATEGORIES.map((item) => (
          <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-lg px-3 py-1.5 text-xs ${category === item ? "bg-teal-700 text-white" : "bg-white"}`}>
            دسته آپلود: {item}
          </button>
        ))}
      </div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault();
          setOver(false);
          take(event.dataTransfer.files);
        }}
        className={`mb-5 rounded-2xl border-2 border-dashed bg-white p-10 text-center ${over ? "border-teal-500 bg-teal-50" : "border-slate-300"}`}
      >
        <div className="font-medium">فایل را اینجا رها کنید یا انتخاب کنید</div>
        <div className="mt-1 text-xs text-slate-400">PDF، تصویر یا اکسل • دسته فعلی: {category}</div>
        <label className="mt-4 inline-block cursor-pointer rounded-xl bg-teal-700 px-4 py-2 text-sm text-white">
          انتخاب فایل
          <input
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.csv"
            className="hidden"
            onChange={(event) => {
              take(event.target.files);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {CATEGORIES.map((item) => (
          <Card key={item} className="p-4 text-center">
            <div className="text-xl font-bold text-teal-800">{documents.filter((doc) => doc.category === item).length.toLocaleString("fa-IR")}</div>
            <div className="text-xs text-slate-500">{item}</div>
          </Card>
        ))}
      </div>
      <div className="space-y-2">
        {documents.length === 0 ? <Card className="text-sm text-slate-500">هنوز سندی ثبت نشده است.</Card> : null}
        {documents.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-sm">
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{doc.name}</div>
              <div className="text-xs text-slate-400">
                {doc.category} • {formatNumber(doc.size / 1024)} کیلوبایت • {doc.source === "sepidar" ? "فهرست نمایشی سپیدار" : "انتخاب محلی"}
              </div>
            </div>
            <button type="button" onClick={() => removeDocument(doc.id)} className="text-xs text-red-600">
              حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
