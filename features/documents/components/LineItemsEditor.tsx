
"use client";

import { Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DocumentItem } from "../types/document.types";

type Props = {
  items: DocumentItem[];
  onChange: (items: DocumentItem[]) => void;
};

const inputClass =
  "h-9 w-full min-w-0 rounded-md border border-input bg-background px-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function LineItemsEditor({ items, onChange }: Props) {
  function addItem() {
    onChange([
      ...items,
      {
        id: crypto.randomUUID(),
        name: "",
        description: "",
        quantity: 1,
        unit: "pcs",
        rate: 0,
        taxRate: 0,
      },
    ]);
  }

  function updateItem(
    id: string,
    field: keyof DocumentItem,
    value: string | number
  ) {
    onChange(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold">Items and services</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add the products or services included in this document.
          </p>
        </div>

        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-2 size-4" />
          Add item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No items added yet.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={addItem}
          >
            <Plus className="mr-2 size-4" />
            Add your first item
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => {
            const amount = item.quantity * item.rate;

            return (
              <div
                key={item.id}
                className="space-y-3 rounded-lg border border-border p-3 sm:p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Item {index + 1}
                  </p>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Item name *
                    </label>
                    <input
                      className={inputClass}
                      value={item.name}
                      onChange={(e) =>
                        updateItem(item.id, "name", e.target.value)
                      }
                      placeholder="Product or service name"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Description
                    </label>
                    <input
                      className={inputClass}
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, "description", e.target.value)
                      }
                      placeholder="Optional description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:col-span-2 sm:grid-cols-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Quantity
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className={inputClass}
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "quantity",
                            Math.max(0, Number(e.target.value))
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Unit
                      </label>
                      <input
                        className={inputClass}
                        value={item.unit}
                        onChange={(e) =>
                          updateItem(item.id, "unit", e.target.value)
                        }
                        placeholder="pcs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        className={inputClass}
                        value={item.rate}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "rate",
                            Math.max(0, Number(e.target.value))
                          )
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">
                        Tax (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="any"
                        className={inputClass}
                        value={item.taxRate}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "taxRate",
                            Math.min(100, Math.max(0, Number(e.target.value)))
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end border-t border-border pt-3">
                  <p className="text-sm text-muted-foreground">
                    Amount:{" "}
                    <span className="font-semibold text-foreground">
                      {formatCurrency(amount)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
