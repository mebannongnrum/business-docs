import type { DocumentDraft } from "../types/document.types";
import { documentTypeConfig } from "../configs/document-types";

type Props = {
  document: DocumentDraft;
  onChange: (field: keyof DocumentDraft, value: string) => void;
};

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function DocumentDetailsForm({
  document,
  onChange,
}: Props) {
  const config = documentTypeConfig[document.type];

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="font-semibold">Document details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the document number and relevant dates.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Document number</label>
          <input
            className={inputClass}
            value={document.number}
            onChange={(e) => onChange("number", e.target.value)}
            placeholder={`${config.prefix}-0001`}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Document date</label>
          <input
            type="date"
            className={inputClass}
            value={document.date}
            onChange={(e) => onChange("date", e.target.value)}
          />
        </div>

        {config.hasDueDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Due date</label>
            <input
              type="date"
              className={inputClass}
              value={document.dueDate}
              onChange={(e) => onChange("dueDate", e.target.value)}
            />
          </div>
        )}

        {config.hasValidityDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Valid until</label>
            <input
              type="date"
              className={inputClass}
              value={document.validUntil}
              onChange={(e) => onChange("validUntil", e.target.value)}
            />
          </div>
        )}
      </div>
    </section>
  );
}
