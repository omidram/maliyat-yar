"use client";

import { useEffect, useMemo, useState } from "react";
import { OBLIGATIONS, type Obligation } from "@/lib/deadlines";
import { daysBetween, toJalali } from "@/lib/jalali";

export function useToday() {
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const now = new Date();
      setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  return today;
}

export type Upcoming = Obligation & { days: number };

export function useUpcoming() {
  const today = useToday();
  const items = useMemo<Upcoming[]>(() => {
    if (!today) return [];
    return OBLIGATIONS.map((item) => ({
      ...item,
      days: daysBetween(today, item.year, item.month, item.day),
    }))
      .filter((item) => item.days >= 0)
      .sort((a, b) => a.days - b.days);
  }, [today]);
  return { today, items };
}

export function useJalaliToday() {
  const today = useToday();
  return useMemo(() => {
    if (!today) return null;
    const [year, month, day] = toJalali(today.getFullYear(), today.getMonth() + 1, today.getDate());
    return { year, month, day, date: today };
  }, [today]);
}
