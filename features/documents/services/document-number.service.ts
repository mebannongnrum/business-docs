
import type { DocumentType } from "../types/document.types";
import { documentTypeConfig } from "../configs/document-types";

const STORAGE_KEY = "business-docs:document-counters";

type DocumentCounters = Record<DocumentType, number>;

const defaultCounters: DocumentCounters = {
  invoice: 1,
  quotation: 1,
  estimate: 1,
  receipt: 1,
};

function getCounters(): DocumentCounters {
  if (typeof window === "undefined") {
    return { ...defaultCounters };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return { ...defaultCounters };
    }

    const parsed = JSON.parse(stored) as Partial<DocumentCounters>;

    return {
      invoice: validCounter(parsed.invoice),
      quotation: validCounter(parsed.quotation),
      estimate: validCounter(parsed.estimate),
      receipt: validCounter(parsed.receipt),
    };
  } catch {
    return { ...defaultCounters };
  }
}

function validCounter(value: unknown): number {
  return (
    typeof value === "number" &&
    Number.isSafeInteger(value) &&
    value >= 1
  )
    ? value
    : 1;
}

function saveCounters(counters: DocumentCounters): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(counters)
  );
}

export function getNextDocumentNumber(type: DocumentType): string {
  const counters = getCounters();
  const nextNumber = counters[type];

  return `${documentTypeConfig[type].prefix}-${String(
    nextNumber
  ).padStart(4, "0")}`;
}

export function reserveDocumentNumber(type: DocumentType): string {
  const counters = getCounters();
  const nextNumber = counters[type];

  counters[type] = nextNumber + 1;

  saveCounters(counters);

  return `${documentTypeConfig[type].prefix}-${String(
    nextNumber
  ).padStart(4, "0")}`;
}
