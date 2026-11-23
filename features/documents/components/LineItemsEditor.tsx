
"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  DocumentCustomColumn,
  DocumentItem,
} from "../types/document.types";

type Props = {
  items: DocumentItem[];
  columns: DocumentCustomColumn[];
  onChange: (items: DocumentItem[]) => void;
  onColumnsChange: (columns: DocumentCustomColumn[]) => void;
};

const inputClass =
  "h-10 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15";

const labelClass = "text-xs font-medium text-muted-foreground";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function LineItemsEditor({
  items,
  columns,
  onChange,
  onColumnsChange,
}: Props) {
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
        customFields: {},
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

  function updateCustomField(
    itemId: string,
    columnId: string,
    value: string
  ) {
    onChange(
      items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              customFields: {
                ...item.customFields,
                [columnId]: value,
              },
            }
          : item
      )
    );
  }

  function addColumn() {
    onColumnsChange([
      ...columns,
      { id: crypto.randomUUID(), label: "" },
    ]);
  }

  function updateColumn(id: string, label: string) {
    onColumnsChange(
      columns.map((column) =>
        column.id === id ? { ...column, label } : column
      )
    );
  }

  function removeColumn(id: string) {
    onColumnsChange(columns.filter((column) => column.id !== id));

    onChange(
      items.map((item) => {
        const customFields = { ...item.customFields };
        delete customFields[id];
        return { ...item, customFields };
      })
    );
  }

  function removeItem(id: string) {
    onChange(items.filter((item) => item.id !== id));
  }

  return (
    <section className="space-y-5 rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">Items and services</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add the products or services included in this document.
          </p>
        </div>

        <Button type="button" size="sm" onClick={addItem}>
          <Plus className="mr-2 size-4" />
          Add item
        </Button>
      </div>

      {columns.length > 0 && (
        <div className="space-y-3 rounded-lg bg-muted/40 p-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-sm font-medium">Custom item columns</p>
              <p className="text-xs text-muted-foreground">
                Add details such as HSN/SAC, SKU or service code.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addColumn}
            >
              <Plus className="mr-2 size-4" />
              Add column
            </Button>
          </div>

          {columns.map((column) => (
            <div key={column.id} className="flex items-center gap-2">
              <input
                className={inputClass}
                value={column.label}
                onChange={(event) =>
                  updateColumn(column.id, event.target.value)
                }
                placeholder="Column name, e.g. HSN/SAC"
                aria-label="Custom column name"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-10 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeColumn(column.id)}
                aria-label="Remove custom column"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {columns.length === 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-dashed border-border px-3 py-2.5">
          <p className="text-xs text-muted-foreground">
            Need extra fields like HSN/SAC or SKU?
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColumn}
          >
            <Plus className="mr-2 size-4" />
            Add custom column
          </Button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border px-4 py-10 text-center">
          <p className="font-medium text-sm">No items added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Start by adding a product or service.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={addItem}
          >
            <Plus className="mr-2 size-4" />
            Add your first item
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="space-y-4 rounded-lg border border-border p-3 sm:p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex size-7 items-center justify-center rounded-md bg-muted text-xs font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-sm font-semibold">
                    Item {index + 1}
                  </p>
                </div>

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
                  <label className={labelClass}>
                    Item name <span className="text-destructive">*</span>
                  </label>
                  <input
                    className={inputClass}
                    value={item.name}
                    onChange={(event) =>
                      updateItem(item.id, "name", event.target.value)
                    }
                    placeholder="Product or service name"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className={labelClass}>Description</label>
                  <input
                    className={inputClass}
                    value={item.description}
                    onChange={(event) =>
                      updateItem(item.id, "description", event.target.value)
                    }
                    placeholder="Optional description"
                  />
                </div>

                {columns.map((column) => (
                  <div key={column.id} className="space-y-1.5">
                    <label className={labelClass}>
                      {column.label || "Custom field"}
                    </label>
                    <input
                      className={inputClass}
                      value={item.customFields[column.id] ?? ""}
                      onChange={(event) =>
                        updateCustomField(
                          item.id,
                          column.id,
                          event.target.value
                        )
                      }
                      placeholder={column.label || "Enter value"}
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Quantity</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className={inputClass}
                    value={item.quantity}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "quantity",
                        Math.max(0, Number(event.target.value))
                      )
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Unit</label>
                  <input
                    className={inputClass}
                    value={item.unit}
                    onChange={(event) =>
                      updateItem(item.id, "unit", event.target.value)
                    }
                    placeholder="pcs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>Rate (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    className={inputClass}
                    value={item.rate}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "rate",
                        Math.max(0, Number(event.target.value))
                      )
                    }
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={labelClass}>GST (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="any"
                    className={inputClass}
                    value={item.taxRate}
                    onChange={(event) =>
                      updateItem(
                        item.id,
                        "taxRate",
                        Math.min(
                          100,
                          Math.max(0, Number(event.target.value))
                        )
                      )
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-3">
                <span className="text-xs text-muted-foreground">
                  Item amount
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatCurrency(item.quantity * item.rate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
