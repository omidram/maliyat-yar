import { isValidNationalId } from "../lib/id";
import { isLeapJalali, toJalali } from "../lib/jalali";
import { declaredIncomeDiscount, taxArticle131, taxSalaryMonthly, taxVat } from "../lib/tax";

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

const [year, month, day] = toJalali(2026, 11, 9);
assert(year === 1405 && month === 8 && day === 18, `jalali ${year}-${month}-${day}`);
const norooz = toJalali(2026, 3, 21);
assert(norooz[0] === 1405 && norooz[1] === 1 && norooz[2] === 1, "norooz 1405");
assert(isLeapJalali(1403) && !isLeapJalali(1404) && !isLeapJalali(1405), "leap years");

const real = taxArticle131(6_000_000_000, 1405, 0);
assert(real.tax === 1_000_000_000, `article 131 ${real.tax}`);
const older = taxArticle131(1_850_000_000, 1404, 0);
assert(older.tax === 277_500_000, `1404 tax ${older.tax}`);
assert(declaredIncomeDiscount(6_000_000_000, 5_000_000_000) === 2, "discount points");

const salary = taxSalaryMonthly(900_000_000);
assert(salary.tax === 55_000_000, `salary ${salary.tax}`);
const vat = taxVat(110_000_000, 10, "extract");
assert(Math.round(vat.base) === 100_000_000, `vat base ${vat.base}`);

let code = "";
for (let n = 100000000; n < 100020000 && !code; n += 1) {
  const digits = String(n).padStart(9, "0");
  const sum = digits.split("").reduce((total, digit, index) => total + Number(digit) * (10 - index), 0);
  const remainder = sum % 11;
  const check = remainder < 2 ? remainder : 11 - remainder;
  const candidate = `${digits}${check}`;
  if (isValidNationalId(candidate)) code = candidate;
}
assert(Boolean(code), "generated national id");
const broken = `${code.slice(0, 9)}${(Number(code[9]) + 1) % 10}`;
assert(!isValidNationalId("0000000000") && !isValidNationalId(broken), "rejected bad national ids");

console.log("checks ok", { nationalId: code, salary: salary.tax, vat: Math.round(vat.vat) });
