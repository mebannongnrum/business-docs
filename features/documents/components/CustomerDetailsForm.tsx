
import type { DocumentCustomer } from "../types/document.types";

type Props = {
  customer: DocumentCustomer;
  onChange: (field: keyof DocumentCustomer, value: string) => void;
};

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function CustomerDetailsForm({
  customer,
  onChange,
}: Props) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="font-semibold">Customer details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the details of the customer receiving this document.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Customer name *</label>
          <input
            className={inputClass}
            value={customer.name}
            onChange={(e) => onChange("name", e.target.value)}
            placeholder="Enter customer or business name"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Email address</label>
          <input
            type="email"
            className={inputClass}
            value={customer.email}
            onChange={(e) => onChange("email", e.target.value)}
            placeholder="customer@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Phone number</label>
          <input
            type="tel"
            className={inputClass}
            value={customer.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Billing address</label>
          <textarea
            className="min-h-20 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            value={customer.address}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="Enter billing address"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">GSTIN</label>
          <input
            className={inputClass}
            value={customer.gstin}
            onChange={(e) => onChange("gstin", e.target.value)}
            placeholder="Enter customer GSTIN (optional)"
          />
        </div>
      </div>
    </section>
  );
}
