"use client";

import { createContext, useContext, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { answerQuestion } from "@/lib/knowledge";
import type { TaxYear } from "@/lib/tax";

const STORAGE_KEY = "maliyat-yar-v1";

export type PersonType = "real" | "legal";

export type Profile = {
  type: PersonType;
  name: string;
  nationalId: string;
  mobile: string;
  createdAt: string;
};

export type DocumentCategory = "صورتحساب" | "قرارداد" | "حقوق" | "سایر";

export type TaxDocument = {
  id: string;
  name: string;
  size: number;
  category: DocumentCategory;
  source: "upload" | "sepidar";
  addedAt: string;
};

export type ConnectionId = "sepidar" | "rahkaran" | "hesabfa" | "shop" | "mytax" | "moadian";
export type ChannelId = "telegram" | "bale" | "whatsapp" | "sms";
export type ConnectionStatus = "disconnected" | "syncing" | "connected";

export type NotifyTopic = "deadline" | "debt" | "weekly";

export type UserEvent = {
  id: string;
  title: string;
  year: number;
  month: number;
  day: number;
  note: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "bot";
  text: string;
  refs?: string[];
};

export type Ticket = {
  id: string;
  subject: string;
  body: string;
  createdAt: string;
  reply: string;
};

export type Scenario = {
  personType: PersonType;
  taxYear: TaxYear;
  annualIncome: number;
  exemption: number;
  previousIncome: number;
  applyDiscount: boolean;
};

type NotifyPrefs = Record<NotifyTopic, Record<ChannelId, boolean>>;

export type PersistedState = {
  profile: Profile | null;
  scenario: Scenario;
  documents: TaxDocument[];
  connections: Record<ConnectionId, ConnectionStatus>;
  channels: Record<ChannelId, boolean>;
  prefs: NotifyPrefs;
  gcal: boolean;
  events: UserEvent[];
  messages: ChatMessage[];
  tickets: Ticket[];
  guideDone: string[];
};

type ToastItem = { id: string; text: string };

type StoreValue = PersistedState & {
  toasts: ToastItem[];
  toast: (text: string) => void;
  dismissToast: (id: string) => void;
  saveProfile: (profile: Profile) => void;
  logout: () => void;
  updateScenario: (patch: Partial<Scenario>) => void;
  addDocuments: (files: File[], category: DocumentCategory) => void;
  removeDocument: (id: string) => void;
  setConnection: (id: ConnectionId, status: ConnectionStatus) => void;
  setChannel: (id: ChannelId, connected: boolean) => void;
  togglePref: (topic: NotifyTopic, channel: ChannelId) => void;
  setGcal: (connected: boolean) => void;
  addEvent: (event: Omit<UserEvent, "id">) => void;
  removeEvent: (id: string) => void;
  ask: (question: string) => void;
  clearChat: () => void;
  addTicket: (subject: string, body: string) => void;
  toggleGuide: (id: string) => void;
  resetLocal: () => void;
};

const defaultPrefs: NotifyPrefs = {
  deadline: { telegram: true, bale: true, whatsapp: false, sms: false },
  debt: { telegram: true, bale: true, whatsapp: false, sms: true },
  weekly: { telegram: true, bale: false, whatsapp: false, sms: false },
};

export const initialState: PersistedState = {
  profile: null,
  scenario: {
    personType: "real",
    taxYear: 1405,
    annualIncome: 6_000_000_000,
    exemption: 0,
    previousIncome: 0,
    applyDiscount: false,
  },
  documents: [],
  connections: {
    sepidar: "disconnected",
    rahkaran: "disconnected",
    hesabfa: "disconnected",
    shop: "disconnected",
    mytax: "disconnected",
    moadian: "disconnected",
  },
  channels: { telegram: false, bale: false, whatsapp: false, sms: false },
  prefs: defaultPrefs,
  gcal: false,
  events: [],
  messages: [],
  tickets: [],
  guideDone: [],
};

const StoreContext = createContext<StoreValue | null>(null);

function mergeState(parsed: Partial<PersistedState>): PersistedState {
  return {
    ...initialState,
    ...parsed,
    profile: parsed.profile ?? null,
    scenario: { ...initialState.scenario, ...parsed.scenario },
    documents: Array.isArray(parsed.documents)
      ? parsed.documents.map((doc) => ({ ...doc, category: doc.category ?? "سایر" }))
      : [],
    connections: { ...initialState.connections, ...parsed.connections },
    channels: { ...initialState.channels, ...parsed.channels },
    prefs: {
      deadline: { ...defaultPrefs.deadline, ...parsed.prefs?.deadline },
      debt: { ...defaultPrefs.debt, ...parsed.prefs?.debt },
      weekly: { ...defaultPrefs.weekly, ...parsed.prefs?.weekly },
    },
    events: Array.isArray(parsed.events) ? parsed.events : [],
    messages: Array.isArray(parsed.messages) ? parsed.messages : [],
    tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
    guideDone: Array.isArray(parsed.guideDone) ? parsed.guideDone : [],
  };
}

const SEPIDAR_SAMPLES: Array<{ name: string; category: DocumentCategory }> = [
  { name: "فاکتور فروش ۱۴۰۵-۰۱۴.pdf", category: "صورتحساب" },
  { name: "گردش بانک مهر.pdf", category: "سایر" },
  { name: "قرارداد خدمات.pdf", category: "قرارداد" },
  { name: "لیست حقوق آبان.xlsx", category: "حقوق" },
];

const CHANGE_EVENT = "maliyat-yar-change";
const SERVER_SNAPSHOT = "";

let browserSnapshot: string | null = null;

function readRaw() {
  return window.localStorage.getItem(STORAGE_KEY) ?? "";
}

function getSnapshot() {
  return browserSnapshot ?? SERVER_SNAPSHOT;
}

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

function subscribe(onStoreChange: () => void) {
  const apply = () => {
    const next = readRaw();
    if (next === browserSnapshot) return;
    browserSnapshot = next;
    onStoreChange();
  };
  window.addEventListener(CHANGE_EVENT, apply);
  window.addEventListener("storage", apply);
  return () => {
    window.removeEventListener(CHANGE_EVENT, apply);
    window.removeEventListener("storage", apply);
  };
}

function readState(raw: string): PersistedState {
  if (!raw) return initialState;
  try {
    return mergeState(JSON.parse(raw) as Partial<PersistedState>);
  } catch {
    return initialState;
  }
}

function writeState(next: PersistedState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      browserSnapshot = readRaw();
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  const state = useMemo(() => readState(hydrated ? raw : SERVER_SNAPSHOT), [hydrated, raw]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const api = useMemo<StoreValue>(() => {
    const toast = (text: string) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { id, text }]);
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== id));
      }, 3200);
    };
    const commit = (recipe: (current: PersistedState) => PersistedState) => {
      writeState(recipe(readState(readRaw())));
    };

    return {
      ...state,
      toasts,
      toast,
      dismissToast: (id) => setToasts((current) => current.filter((item) => item.id !== id)),
      saveProfile: (profile) => {
        commit((current) => ({
          ...current,
          profile,
          scenario: { ...current.scenario, personType: profile.type },
        }));
        toast("حساب روی همین مرورگر ذخیره شد.");
      },
      logout: () => {
        commit((current) => ({ ...current, profile: null }));
        toast("از حساب آزمایشی خارج شدید.");
      },
      updateScenario: (patch) => commit((current) => ({ ...current, scenario: { ...current.scenario, ...patch } })),
      addDocuments: (files, category) => {
        const next = files.map((file) => ({
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          category,
          source: "upload" as const,
          addedAt: new Date().toISOString(),
        }));
        commit((current) => ({ ...current, documents: [...next, ...current.documents] }));
        toast(`${files.length.toLocaleString("fa-IR")} فایل به فهرست محلی اضافه شد. محتوای فایل آپلود نمی‌شود.`);
      },
      removeDocument: (id) => commit((current) => ({ ...current, documents: current.documents.filter((doc) => doc.id !== id) })),
      setConnection: (id, status) => {
        commit((current) => {
          const documents =
            id === "sepidar" && status === "connected" && !current.documents.some((doc) => doc.source === "sepidar")
              ? [
                  ...SEPIDAR_SAMPLES.map((sample) => ({
                    id: crypto.randomUUID(),
                    name: sample.name,
                    size: 180_000,
                    category: sample.category,
                    source: "sepidar" as const,
                    addedAt: new Date().toISOString(),
                  })),
                  ...current.documents,
                ]
              : current.documents;
          return { ...current, documents, connections: { ...current.connections, [id]: status } };
        });
        toast(
          status === "disconnected"
            ? "وضعیت اتصال روی این دستگاه قطع شد."
            : "این اتصال واقعی نیست و فقط برای نمایش جریان کار ذخیره شد.",
        );
      },
      setChannel: (id, connected) => {
        commit((current) => ({ ...current, channels: { ...current.channels, [id]: connected } }));
        toast(connected ? "کانال یادآوری روی این دستگاه فعال شد. پیامی ارسال نمی‌شود." : "کانال یادآوری غیرفعال شد.");
      },
      togglePref: (topic, channel) =>
        commit((current) => ({
          ...current,
          prefs: {
            ...current.prefs,
            [topic]: { ...current.prefs[topic], [channel]: !current.prefs[topic][channel] },
          },
        })),
      setGcal: (connected) => {
        commit((current) => ({ ...current, gcal: connected }));
        toast(connected ? "علامت تقویم گوگل ذخیره شد. رویدادی به گوگل فرستاده نمی‌شود." : "علامت تقویم گوگل برداشته شد.");
      },
      addEvent: (event) => {
        commit((current) => ({ ...current, events: [{ ...event, id: crypto.randomUUID() }, ...current.events] }));
        toast("رویداد به تقویم همین دستگاه اضافه شد.");
      },
      removeEvent: (id) => commit((current) => ({ ...current, events: current.events.filter((event) => event.id !== id) })),
      ask: (question) => {
        const answer = answerQuestion(question);
        const stamp = crypto.randomUUID();
        commit((current) => ({
          ...current,
          messages: [
            ...current.messages,
            { id: `${stamp}-u`, role: "user", text: question },
            { id: `${stamp}-b`, role: "bot", text: answer.text, refs: answer.refs },
          ],
        }));
      },
      clearChat: () => commit((current) => ({ ...current, messages: [] })),
      addTicket: (subject, body) => {
        const answer = answerQuestion(`${subject} ${body}`);
        const ticket: Ticket = {
          id: crypto.randomUUID(),
          subject,
          body,
          createdAt: new Date().toISOString(),
          reply: answer.blocked ? answer.text : `پاسخ نمونه مشاور:\n${answer.text}\n\nاین متن خودکار است و بررسی پرونده واقعی نیست.`,
        };
        commit((current) => ({ ...current, tickets: [ticket, ...current.tickets] }));
        toast("تیکت در همین مرورگر ثبت شد.");
      },
      toggleGuide: (id) =>
        commit((current) => ({
          ...current,
          guideDone: current.guideDone.includes(id) ? current.guideDone.filter((item) => item !== id) : [...current.guideDone, id],
        })),
      resetLocal: () => {
        writeState(initialState);
        toast("داده‌های محلی پاک شد.");
      },
    };
  }, [state, toasts]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore must be used inside StoreProvider");
  return store;
}
