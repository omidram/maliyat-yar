export type Obligation = {
  id: string;
  title: string;
  year: number;
  month: number;
  day: number;
  detail: string;
  tone: "amber" | "teal" | "blue";
};

export const OBLIGATIONS: Obligation[] = [
  {
    id: "return-1404",
    title: "اظهارنامه عملکرد ۱۴۰۴ اشخاص حقیقی",
    year: 1405,
    month: 3,
    day: 31,
    detail: "مهلت متعارف: پایان خرداد سال بعد",
    tone: "amber",
  },
  {
    id: "vat-spring-1405",
    title: "اظهارنامه ارزش افزوده بهار ۱۴۰۵",
    year: 1405,
    month: 4,
    day: 15,
    detail: "مهلت متعارف فصل بهار: ۱۵ تیر",
    tone: "blue",
  },
  {
    id: "vat-summer-1405",
    title: "اظهارنامه ارزش افزوده تابستان ۱۴۰۵",
    year: 1405,
    month: 7,
    day: 15,
    detail: "مهلت متعارف فصل تابستان: ۱۵ مهر",
    tone: "blue",
  },
  {
    id: "salary-mehr",
    title: "پرداخت مالیات حقوق مهر",
    year: 1405,
    month: 8,
    day: 30,
    detail: "رویۀ پرداخت تا پایان ماه بعد",
    tone: "teal",
  },
  {
    id: "salary-aban",
    title: "پرداخت مالیات حقوق آبان",
    year: 1405,
    month: 9,
    day: 30,
    detail: "رویۀ پرداخت تا پایان ماه بعد",
    tone: "teal",
  },
  {
    id: "vat-autumn-1405",
    title: "اظهارنامه ارزش افزوده پاییز ۱۴۰۵",
    year: 1405,
    month: 10,
    day: 15,
    detail: "مهلت متعارف فصل پاییز: ۱۵ دی",
    tone: "blue",
  },
  {
    id: "salary-azar",
    title: "پرداخت مالیات حقوق آذر",
    year: 1405,
    month: 10,
    day: 30,
    detail: "رویۀ پرداخت تا پایان ماه بعد",
    tone: "teal",
  },
  {
    id: "salary-dey",
    title: "پرداخت مالیات حقوق دی",
    year: 1405,
    month: 11,
    day: 30,
    detail: "رویۀ پرداخت تا پایان ماه بعد",
    tone: "teal",
  },
  {
    id: "salary-bahman",
    title: "پرداخت مالیات حقوق بهمن",
    year: 1405,
    month: 12,
    day: 29,
    detail: "رویۀ پرداخت تا پایان ماه بعد",
    tone: "teal",
  },
  {
    id: "vat-winter-1405",
    title: "اظهارنامه ارزش افزوده زمستان ۱۴۰۵",
    year: 1406,
    month: 2,
    day: 15,
    detail: "مهلت متعارف فصل زمستان: ۱۵ اردیبهشت",
    tone: "blue",
  },
  {
    id: "return-1405",
    title: "اظهارنامه عملکرد ۱۴۰۵ اشخاص حقیقی",
    year: 1406,
    month: 3,
    day: 31,
    detail: "مهلت متعارف: پایان خرداد سال بعد",
    tone: "amber",
  },
  {
    id: "corporate-1405",
    title: "اظهارنامه اشخاص حقوقی با سال مالی اسفند",
    year: 1406,
    month: 4,
    day: 31,
    detail: "چهار ماه پس از پایان سال مالی منتهی به اسفند",
    tone: "amber",
  },
];
