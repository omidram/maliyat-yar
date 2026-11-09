"use client";

import { useState } from "react";
import { Card, Disclaimer, PageHeader, PrimaryButton, TextField } from "@/components/ui";
import { toEnglishDigits } from "@/lib/format";
import { isValidMobile, isValidNationalId } from "@/lib/id";
import { useStore, type PersonType } from "@/lib/store";

export function AccountView() {
  const { profile } = useStore();
  const formKey = profile ? `${profile.type}:${profile.name}:${profile.nationalId}:${profile.mobile}` : "empty";
  return <AccountEditor key={formKey} />;
}

function AccountEditor() {
  const { profile, saveProfile, logout, resetLocal } = useStore();
  const [type, setType] = useState<PersonType>(profile?.type ?? "real");
  const [name, setName] = useState(profile?.name ?? "");
  const [nationalId, setNationalId] = useState(profile?.nationalId ?? "");
  const [mobile, setMobile] = useState(profile?.mobile ?? "");
  const [error, setError] = useState("");
  const [armed, setArmed] = useState(false);

  function submit() {
    const id = toEnglishDigits(nationalId).replace(/\D/g, "");
    const phone = toEnglishDigits(mobile).replace(/\D/g, "");
    if (name.trim().length < 3) {
      setError("نام را کامل‌تر بنویسید.");
      return;
    }
    if (type === "real" && !isValidNationalId(id)) {
      setError("کد ملی ۱۰ رقمی معتبر نیست.");
      return;
    }
    if (type === "legal" && !/^\d{11}$/.test(id)) {
      setError("شناسه ملی شخص حقوقی باید ۱۱ رقم باشد.");
      return;
    }
    if (!isValidMobile(phone)) {
      setError("شماره موبایل را با ۰۹ و ۱۱ رقم وارد کنید.");
      return;
    }
    setError("");
    saveProfile({
      type,
      name: name.trim(),
      nationalId: id,
      mobile: phone,
      createdAt: profile?.createdAt ?? new Date().toISOString(),
    });
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="حساب کاربری" description="حساب فقط در localStorage همین مرورگر ذخیره می‌شود و احراز هویت دولتی انجام نمی‌دهد." />
      <div className="mb-4">
        <Disclaimer>کد ملی را برای ورود به دولت‌من یا سازمان امور مالیاتی اینجا نفرستید. این فرم هویت شما را نزد هیچ سازمانی تأیید نمی‌کند.</Disclaimer>
      </div>
      <Card>
        <div className="mb-5 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => setType("real")} className={`rounded-xl border-2 py-2.5 text-sm ${type === "real" ? "border-teal-600 bg-teal-50 text-teal-900" : "border-slate-200"}`}>
            شخص حقیقی
          </button>
          <button type="button" onClick={() => setType("legal")} className={`rounded-xl border-2 py-2.5 text-sm ${type === "legal" ? "border-teal-600 bg-teal-50 text-teal-900" : "border-slate-200"}`}>
            شخص حقوقی
          </button>
        </div>
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <TextField label={type === "real" ? "نام و نام خانوادگی" : "نام شرکت"} value={name} onChange={setName} />
          <TextField label={type === "real" ? "کد ملی" : "شناسه ملی"} value={nationalId} onChange={setNationalId} dir="ltr" inputMode="numeric" maxLength={type === "real" ? 10 : 11} />
          <TextField label="موبایل" value={mobile} onChange={setMobile} dir="ltr" inputMode="tel" placeholder="09xxxxxxxxx" maxLength={11} />
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
          <PrimaryButton type="submit" className="w-full">
            {profile ? "به‌روزرسانی حساب محلی" : "ذخیره حساب محلی"}
          </PrimaryButton>
        </form>
        {profile ? (
          <button type="button" onClick={logout} className="mt-3 w-full text-sm text-slate-500">
            خروج از حساب محلی
          </button>
        ) : null}
      </Card>
      <Card className="mt-4">
        <h2 className="font-bold">پاک کردن داده‌های این دستگاه</h2>
        <p className="mt-1 text-xs leading-6 text-slate-500">اسناد، گفتگو، تیکت، علامت راهنما و حساب محلی حذف می‌شود.</p>
        <button
          type="button"
          onClick={() => {
            if (!armed) {
              setArmed(true);
              return;
            }
            resetLocal();
            setArmed(false);
            setName("");
            setNationalId("");
            setMobile("");
          }}
          className="mt-3 rounded-xl border border-red-200 px-4 py-2 text-sm text-red-700"
        >
          {armed ? "برای حذف نهایی دوباره بزنید" : "پاک کردن داده‌های محلی"}
        </button>
      </Card>
    </div>
  );
}
