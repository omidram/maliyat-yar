export type TaxYear = 1403 | 1404 | 1405;

export type TaxSlice = {
  label: string;
  amount: number;
  rate: number;
  tax: number;
};

export type Article131Result = {
  taxable: number;
  tax: number;
  slices: TaxSlice[];
  effectiveRate: number;
  discountPoints: number;
};

const YEAR_LIMITS: Record<TaxYear, { first: number; second: number }> = {
  1403: { first: 2_000_000_000, second: 4_000_000_000 },
  1404: { first: 2_000_000_000, second: 4_000_000_000 },
  1405: { first: 4_000_000_000, second: 8_000_000_000 },
};

export function article131Limits(year: TaxYear) {
  return YEAR_LIMITS[year];
}

export function declaredIncomeDiscount(current: number, previous: number): number {
  if (previous <= 0 || current <= previous) return 0;
  const steps = Math.floor((current - previous) / previous / 0.1);
  return Math.min(5, Math.max(0, steps));
}

export function taxArticle131(
  income: number,
  year: TaxYear,
  exemption = 0,
  discountPoints = 0,
): Article131Result {
  const taxable = Math.max(0, income - Math.max(0, exemption));
  const { first, second } = YEAR_LIMITS[year];
  const points = Math.min(5, Math.max(0, discountPoints));
  const bands = [
    { cap: first, rate: Math.max(0, 0.15 - points / 100), label: "پله ۱۵٪" },
    { cap: second, rate: Math.max(0, 0.2 - points / 100), label: "پله ۲۰٪" },
    { cap: Number.POSITIVE_INFINITY, rate: Math.max(0, 0.25 - points / 100), label: "پله ۲۵٪" },
  ];

  let cursor = 0;
  let tax = 0;
  const slices: TaxSlice[] = [];
  for (const band of bands) {
    if (taxable <= cursor) break;
    const upper = Math.min(taxable, band.cap);
    const amount = upper - cursor;
    const part = amount * band.rate;
    slices.push({ label: band.label, amount, rate: band.rate, tax: part });
    tax += part;
    cursor = upper;
  }

  return {
    taxable,
    tax,
    slices,
    effectiveRate: taxable > 0 ? tax / taxable : 0,
    discountPoints: points,
  };
}

export function taxCorporate(profit: number, rate = 0.25) {
  const taxable = Math.max(0, profit);
  const safeRate = Math.min(0.25, Math.max(0, rate));
  return { taxable, rate: safeRate, tax: taxable * safeRate };
}

export function taxVat(amount: number, ratePercent: number, mode: "add" | "extract") {
  const rate = Math.max(0, ratePercent) / 100;
  if (mode === "extract") {
    const base = rate === 0 ? amount : amount / (1 + rate);
    const vat = amount - base;
    return { base, vat, total: Math.max(0, amount), rate };
  }
  const base = Math.max(0, amount);
  const vat = base * rate;
  return { base, vat, total: base + vat, rate };
}

const SALARY_BANDS = [
  { upTo: 400_000_000, rate: 0, label: "تا ۴۰ میلیون تومان" },
  { upTo: 800_000_000, rate: 0.1, label: "مازاد تا ۸۰ میلیون تومان" },
  { upTo: 1_000_000_000, rate: 0.15, label: "مازاد تا ۱۰۰ میلیون تومان" },
  { upTo: 1_200_000_000, rate: 0.2, label: "مازاد تا ۱۲۰ میلیون تومان" },
  { upTo: 1_400_000_000, rate: 0.25, label: "مازاد تا ۱۴۰ میلیون تومان" },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3, label: "مازاد بر ۱۴۰ میلیون تومان" },
];

export function taxSalaryMonthly(monthly: number) {
  const income = Math.max(0, monthly);
  let cursor = 0;
  let tax = 0;
  const slices: TaxSlice[] = [];
  for (const band of SALARY_BANDS) {
    if (income <= cursor) break;
    const upper = Math.min(income, band.upTo);
    const amount = upper - cursor;
    const part = amount * band.rate;
    slices.push({ label: band.label, amount, rate: band.rate, tax: part });
    tax += part;
    cursor = upper;
  }
  return { income, tax, net: income - tax, slices };
}

export function taxPenalty(input: {
  principal: number;
  months: number;
  filingRate: 0 | 0.1 | 0.3;
  kind: "income" | "vat";
}) {
  const principal = Math.max(0, input.principal);
  const months = Math.max(0, input.months);
  const monthlyRate = input.kind === "vat" ? 0.02 : 0.025;
  const delay = principal * monthlyRate * months;
  const filing = principal * input.filingRate;
  return { principal, months, monthlyRate, delay, filing, total: delay + filing };
}
