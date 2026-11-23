
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
  "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "text-xs font-medium text-muted-foreground";

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
        taxRate: 0,
      },
    ]);
  }

  function updateCharge(
    id: string,
    field: keyof AdditionalCharge,
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
    <section className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div>
        <h2 className="font-semibold">Pricing and tax</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Set the GST calculation, discount and extra charges.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={labelClass}>GST calculation</label>
          <select
            className={inputClass}
            value={taxMode}
            onChange={(event) =>
              onTaxModeChange(event.target.value as TaxMode)
            }
          >
            <option value="intra-state">Intra-state (CGST + SGST)</option>
            <option value="inter-state">Inter-state (IGST)</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Choose according to the supplier&apos;s and customer&apos;s state.
          </p>
        </div>

        <div className="space-y-2">
          <label className={labelClass}>Discount</label>
          <div className="grid grid-cols-[1fr_110px] gap-2">
            <select
              className={inputClass}
              value={discount.type}
              onChange={(event) =>
                onDiscountChange({
                  ...discount,
                  type: event.target.value as DocumentDiscount["type"],
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
              onChange={(event) =>
                onDiscountChange({
                  ...discount,
                  value: Math.max(0, Number(event.target.value)),
                })
              }
              aria-label="Discount value"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Applied to the item subtotal.
          </p>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold">Additional charges</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Shipping, packaging, handling and other charges.
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
          <p className="mt-3 rounded-lg border border-dashed border-border px-4 py-5 text-center text-sm text-muted-foreground">
            No additional charges. Add one if needed.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {additionalCharges.map((charge, index) => (
              <div
                key={charge.id}
                className="rounded-lg border border-border p-3"
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    Charge {index + 1}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeCharge(charge.id)}
                    aria-label="Remove charge"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-[minmax(0,1fr)_120px_100px]">
                  <div className="col-span-2 min-w-0 space-y-1.5 sm:col-span-1">
                    <label className={labelClass}>Charge name</label>
                    <input
                      className={inputClass}
                      value={charge.name}
                      onChange={(event) =>
                        updateCharge(
                          charge.id,
                          "name",
                          event.target.value
                        )
                      }
                      placeholder="e.g. Shipping"
                    />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <label className={labelClass}>Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      className={inputClass}
                      value={charge.amount}
                      onChange={(event) =>
                        updateCharge(
                          charge.id,
                          "amount",
                          Math.max(0, Number(event.target.value))
                        )
                      }
                      aria-label="Charge amount"
                    />
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <label className={labelClass}>GST (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="any"
                      className={inputClass}
                      value={charge.taxRate ?? 0}
                      onChange={(event) =>
                        updateCharge(
                          charge.id,
                          "taxRate",
                          Math.min(
                            100,
                            Math.max(0, Number(event.target.value))
                          )
                        )
                      }
                      aria-label="Charge GST rate"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
