
"use client";

import {
  Calculator,
  FileCheck,
  FileText,
  Receipt,
} from "lucide-react";

import type { DocumentType } from "../types/document.types";
import { documentTypeConfig } from "../configs/document-types";

const documentIcons = {
  invoice: Receipt,
  quotation: FileCheck,
  estimate: Calculator,
  receipt: FileText,
};

type DocumentTypeSelectorProps = {
  value: DocumentType;
  onChange: (value: DocumentType) => void;
};

export default function DocumentTypeSelector({
  value,
  onChange,
}: DocumentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Object.entries(documentTypeConfig).map(([key, config]) => {
        const type = key as DocumentType;
        const Icon = documentIcons[type];
        const selected = value === type;

        return (
          <button
            key={type}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(type)}
            className={`relative flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
              selected
                ? "border-primary bg-primary/4 ring-1 ring-primary"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/30"
            }`}
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={1.8} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {config.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {config.description}
              </p>
            </div>

            {selected && (
              <span className="absolute right-3 top-3 size-2 rounded-full bg-primary" />
            )}
          </button>
        );
      })}
    </div>
  );
}
