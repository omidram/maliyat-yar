const JALALI_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

const WEEKDAYS = ["ش", "ی", "د", "س", "چ", "پ", "ج"] as const;

export function jalaliMonthName(month: number): string {
  return JALALI_MONTHS[month - 1] ?? "";
}

export function jalaliWeekdays(): readonly string[] {
  return WEEKDAYS;
}

const LEAP_BREAKS = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

export function isLeapJalali(year: number): boolean {
  const mod = (a: number, b: number) => a - Math.floor(a / b) * b;
  let jp = LEAP_BREAKS[0];
  let jump = 0;
  for (let index = 1; index < LEAP_BREAKS.length; index += 1) {
    const jm = LEAP_BREAKS[index];
    jump = jm - jp;
    if (year < jm) break;
    jp = jm;
  }
  let n = year - jp;
  if (jump - n < 6) n = n - jump + Math.floor((jump + 4) / 33) * 33;
  let leap = mod(mod(n + 1, 33) - 1, 4);
  if (leap === -1) leap = 4;
  return leap === 0;
}

export function jalaliMonthLength(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isLeapJalali(year) ? 30 : 29;
}

export function toJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const gDayMonth = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    gDayMonth[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

export function toGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  let gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;
  const days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  let day = days % 146097;
  if (day > 36524) {
    gy += 100 * Math.floor(--day / 36524);
    day %= 36524;
    if (day >= 365) day++;
  }
  gy += 4 * Math.floor(day / 1461);
  day %= 1461;
  if (day > 365) {
    gy += Math.floor((day - 1) / 365);
    day = (day - 1) % 365;
  }
  let gd = day + 1;
  const leap = (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0;
  const monthDays = [0, 31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 1;
  while (gm < 13 && gd > monthDays[gm]) {
    gd -= monthDays[gm];
    gm++;
  }
  return [gy, gm, gd];
}

export function jalaliToDate(year: number, month: number, day: number): Date {
  const [gy, gm, gd] = toGregorian(year, month, day);
  return new Date(gy, gm - 1, gd);
}

export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function daysBetween(from: Date, year: number, month: number, day: number): number {
  const target = startOfDay(jalaliToDate(year, month, day));
  const origin = startOfDay(from);
  return Math.round((target.getTime() - origin.getTime()) / 86_400_000);
}

export function weekdayIndex(year: number, month: number, day: number): number {
  const date = jalaliToDate(year, month, day);
  return (date.getDay() + 1) % 7;
}

export function formatJalali(year: number, month: number, day: number): string {
  const dayText = day.toLocaleString("fa-IR", { useGrouping: false });
  const yearText = year.toLocaleString("fa-IR", { useGrouping: false });
  return `${dayText} ${jalaliMonthName(month)} ${yearText}`;
}
