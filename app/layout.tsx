import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const vazir = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazir",
});

export const metadata: Metadata = {
  title: {
    default: "مالیات‌یار | مشاوره و اجرای امور مالیاتی",
    template: "%s | مالیات‌یار",
  },
  description:
    "میز کار مالیاتی برای اشخاص حقیقی و حقوقی: ماشین‌حساب قوانین ایران، تقویم مهلت‌ها، راهنمای سامانه مودیان و مشاوره آموزشی.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazir.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
