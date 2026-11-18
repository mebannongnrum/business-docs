
"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type {
  AdditionalCharge,
  DocumentDiscount,
  TaxMode,
} from "../types/document.types";

type Props = {
  taxMode: TaxMode;
  discount: DocumentDiscount;
  additionalCharges: AdditionalCharge[];
  onTaxModeChange: (value: TaxMode) => void;
  onDiscountChange: (value: DocumentDiscount) => void;
  onChargesChange: (value: AdditionalCharge[]) => void;
};

const inputClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

export default function DocumentAdjustments({
  taxMode,
  discount,
  additionalCharges,
  onTaxModeChange,
  onDiscountChange,
  onChargesChange,
}: Props) {
  function addCharge() {
    onChargesChange([
      ...additionalCharges,
      {
        id: crypto.randomUUID(),
        name: "",
        amount: 0,
      },
    ]);
  }

  function updateCharge(
    id: string,
    field: "name" | "amount",
    value: string | number
  ) {
    onChargesChange(
      additionalCharges.map((charge) =>
        charge.id === id ? { ...charge, [field]: value } : charge
      )
    );
  }

  function removeCharge(id: string) {
    onChargesChange(
      additionalCharges.filter((charge) => charge.id !== id)
    );
  }

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-5">
      <div>
        <h2 className="font-semibold">Pricing & tax</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure GST, discounts and additional charges.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">GST calculation</label>
        <select
          className={inputClass}
          value={taxMode}
          onChange={(e) => onTaxModeChange(e.target.value as TaxMode)}
        >
          <option value="intra-state">
            Intra-state — CGST + SGST
          </option>
          <option value="inter-state">
            Inter-state — IGST
          </option>
        </select>
        <p className="text-xs text-muted-foreground">
          Select based on the supplier&aposs and customer&aposs state.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium">Discount</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            Apply a discount to the item subtotal.
          </p>
        </div>

        <div className="grid grid-cols-[1fr_110px] gap-3">
          <select
            className={inputClass}
            value={discount.type}
            onChange={(e) =>
              onDiscountChange({
                ...discount,
                type: e.target.value as DocumentDiscount["type"],
              })
            }
          >
            <option value="percentage">Percentage (%)</option>
            <option value="fixed">Fixed amount (₹)</option>
          </select>

          <input
            type="number"
            min="0"
            step="any"
            className={inputClass}
            value={discount.value}
            onChange={(e) =>
              onDiscountChange({
                ...discount,
                value: Math.max(0, Number(e.target.value)),
              })
            }
          />
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-medium">Additional charges</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Shipping, packaging, handling, etc.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addCharge}
          >
            <Plus className="mr-2 size-4" />
            Add charge
          </Button>
        </div>

        {additionalCharges.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
            No additional charges added.
          </p>
        ) : (
          <div className="space-y-3">
            {additionalCharges.map((charge) => (
              <div
                key={charge.id}
                className="grid grid-cols-[1fr_110px_36px] items-center gap-2"
              >
                <input
                  className={inputClass}
                  value={charge.name}
                  onChange={(e) =>
                    updateCharge(charge.id, "name", e.target.value)
                  }
                  placeholder="Charge name"
                />

                <input
                  type="number"
                  min="0"
                  step="any"
                  className={inputClass}
                  value={charge.amount}
                  onChange={(e) =>
                    updateCharge(
                      charge.id,
                      "amount",
                      Math.max(0, Number(e.target.value))
                    )
                  }
                  aria-label="Charge amount"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeCharge(charge.id)}
                  aria-label="Remove charge"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
