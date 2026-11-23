
"use client";

import { useId } from "react";

import type { DocumentCustomer } from "../types/document.types";

type Props = {
  customer: DocumentCustomer;
  onChange: (field: keyof DocumentCustomer, value: string) => void;
};

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function CustomerDetailsForm({
  customer,
  onChange,
}: Props) {
  const id = useId();

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-foreground">
          Customer details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Who is this document being prepared for?
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`${id}-name`}
            className="text-sm font-medium text-foreground"
          >
            Customer or business name <span className="text-destructive">*</span>
          </label>
          <input
            id={`${id}-name`}
            required
            className={inputClass}
            value={customer.name}
            onChange={(event) =>
              onChange("name", event.target.value)
            }
            placeholder="Enter customer name"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${id}-email`}
            className="text-sm font-medium text-foreground"
          >
            Email address
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id={`${id}-email`}
            type="email"
            className={inputClass}
            value={customer.email}
            onChange={(event) =>
              onChange("email", event.target.value)
            }
            placeholder="customer@example.com"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor={`${id}-phone`}
            className="text-sm font-medium text-foreground"
          >
            Phone number
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id={`${id}-phone`}
            type="tel"
            className={inputClass}
            value={customer.phone}
            onChange={(event) =>
              onChange("phone", event.target.value)
            }
            placeholder="Enter phone number"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`${id}-address`}
            className="text-sm font-medium text-foreground"
          >
            Billing address
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <textarea
            id={`${id}-address`}
            className="min-h-20 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
            value={customer.address}
            onChange={(event) =>
              onChange("address", event.target.value)
            }
            placeholder="Enter billing address"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label
            htmlFor={`${id}-gstin`}
            className="text-sm font-medium text-foreground"
          >
            Customer GSTIN
            <span className="ml-1 font-normal text-muted-foreground">
              (optional)
            </span>
          </label>
          <input
            id={`${id}-gstin`}
            className={inputClass}
            value={customer.gstin}
            onChange={(event) =>
              onChange("gstin", event.target.value)
            }
            placeholder="Enter GSTIN if applicable"
          />
        </div>
      </div>
    </section>
  );
}
