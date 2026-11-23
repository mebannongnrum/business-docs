
"use client";

import { useId } from "react";

import type { DocumentDraft } from "../types/document.types";
import { documentTypeConfig } from "../configs/document-types";

type Props = {
  document: DocumentDraft;
  onChange: (field: keyof DocumentDraft, value: string) => void;
};

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function DocumentDetailsForm({
  document,
  onChange,
}: Props) {
  const id = useId();
  const config = documentTypeConfig[document.type];

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Document details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the document number and dates.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label
            htmlFor={`${id}-number`}
            className="text-sm font-medium text-foreground"
          >
            Document number
          </label>
          <input
            id={`${id}-number`}
            className={inputClass}
            value={document.number}
            onChange={(event) =>
              onChange("number", event.target.value)
            }
            placeholder={`${config.prefix}-0001`}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${id}-date`}
            className="text-sm font-medium text-foreground"
          >
            Document date
          </label>
          <input
            id={`${id}-date`}
            type="date"
            className={inputClass}
            value={document.date}
            onChange={(event) =>
              onChange("date", event.target.value)
            }
          />
        </div>

        {config.hasDueDate && (
          <div className="space-y-2">
            <label
              htmlFor={`${id}-due-date`}
              className="text-sm font-medium text-foreground"
            >
              Payment due date
            </label>
            <input
              id={`${id}-due-date`}
              type="date"
              className={inputClass}
              value={document.dueDate}
              onChange={(event) =>
                onChange("dueDate", event.target.value)
              }
            />
          </div>
        )}

        {config.hasValidityDate && (
          <div className="space-y-2">
            <label
              htmlFor={`${id}-valid-until`}
              className="text-sm font-medium text-foreground"
            >
              Valid until
            </label>
            <input
              id={`${id}-valid-until`}
              type="date"
              className={inputClass}
              value={document.validUntil}
              onChange={(event) =>
                onChange("validUntil", event.target.value)
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}
