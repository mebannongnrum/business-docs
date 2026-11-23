
"use client";

import type {
  PaymentMethod,
  ReceiptDetails,
} from "../types/document.types";

type Props = {
  receipt: ReceiptDetails;
  onChange: (field: keyof ReceiptDetails, value: string | number) => void;
};

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "text-xs font-medium text-muted-foreground";

const paymentMethods: { value: PaymentMethod; label: string }[] = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank-transfer", label: "Bank transfer" },
  { value: "card", label: "Card" },
  { value: "cheque", label: "Cheque" },
  { value: "other", label: "Other" },
];

export default function ReceiptPaymentForm({
  receipt,
  onChange,
}: Props) {
  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div>
        <h2 className="font-semibold">Payment details</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter the payment received from your customer.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelClass}>Amount received (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputClass}
            value={receipt.amountReceived}
            onChange={(event) =>
              onChange(
                "amountReceived",
                Math.max(0, Number(event.target.value))
              )
            }
            placeholder="0.00"
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Payment method</label>
          <select
            className={inputClass}
            value={receipt.paymentMethod}
            onChange={(event) =>
              onChange(
                "paymentMethod",
                event.target.value as PaymentMethod
              )
            }
          >
            {paymentMethods.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>Payment date</label>
          <input
            type="date"
            className={inputClass}
            value={receipt.paymentDate}
            onChange={(event) =>
              onChange("paymentDate", event.target.value)
            }
          />
        </div>

        <div className="space-y-1.5">
          <label className={labelClass}>
            Transaction reference
            <span className="ml-1 font-normal">(Optional)</span>
          </label>
          <input
            className={inputClass}
            value={receipt.transactionReference}
            onChange={(event) =>
              onChange("transactionReference", event.target.value)
            }
            placeholder="UPI ID, cheque number, etc."
          />
        </div>
      </div>
    </section>
  );
}
