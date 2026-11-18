
"use client";

import { FileText, Receipt, Calculator, FileCheck } from "lucide-react";

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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Object.entries(documentTypeConfig).map(([key, config]) => {
        const type = key as DocumentType;
        const Icon = documentIcons[type];
        const selected = value === type;

        return (
          <button
            key={type}
            type="button"
            onClick={() => onChange(type)}
            className={`flex flex-col items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
              selected
                ? "border-primary bg-primary/5 ring-2 ring-primary/15"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
            }`}
          >
            <div
              className={`rounded-lg p-2 ${
                selected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Icon className="size-5" />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                {config.label}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {config.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
