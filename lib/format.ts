const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
const ARABIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function toEnglishDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)));
}

export function parseAmount(value: string): number {
  const normalized = toEnglishDigits(value).replace(/[,،\s]/g, "");
  if (!normalized) return 0;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("fa-IR");
}

export function formatYear(year: number): string {
  return year.toLocaleString("fa-IR", { useGrouping: false });
}

export function formatRial(value: number): string {
  return `${formatNumber(value)} ریال`;
}

export function formatToman(rial: number): string {
  return `${formatNumber(rial / 10)} تومان`;
}

export function formatPercent(rate: number): string {
  return `${(rate * 100).toLocaleString("fa-IR", { maximumFractionDigits: 1 })}٪`;
}
