
"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import DocumentDetailsForm from "./DocumentDetailsForm";
import CustomerDetailsForm from "./CustomerDetailsForm";
import LineItemsEditor from "./LineItemsEditor";
import DocumentAdjustments from "./DocumentAdjustments";
import ReceiptPaymentForm from "./ReceiptPaymentForm";
import DocumentPreview from "./DocumentPreview";

import type {
  DocumentDraft,
  DocumentType,
} from "../types/document.types";

import { documentTypeConfig } from "../configs/document-types";
import { calculateDocumentTotals } from "../services/document-calculations";

import {
  reserveDocumentNumber,
} from "../services/document-number.service";

import { getBusinessProfile } from "@/features/business-profile/services/business-profile.service";

import { businessPresets } from "@/features/business-presets/configs/business-presets";
import { getBusinessPresetId } from "@/features/business-presets/services/business-preset.service";

type DocumentBuilderProps = {
  initialType: DocumentType;
  initialDate: string;
};

const createInitialDocument = (
  type: DocumentType,
  initialDate: string,
  number?: string
): DocumentDraft => {
  const preset = businessPresets[getBusinessPresetId()];

  return {
    type,
    number: number ?? `${documentTypeConfig[type].prefix}-0001`,
    date: initialDate,
    dueDate: "",
    validUntil: "",

    customer: {
      name: "",
      email: "",
      phone: "",
      address: "",
      gstin: "",
    },

    items: [],

    customFields: preset.documentFields.map((field) => ({
      id: field.id,
      label: field.label,
      value: "",
    })),

    itemCustomColumns: preset.itemColumns.map((column) => ({
      id: column.id,
      label: column.label,
    })),

    taxMode: "intra-state",

    discount: {
      type: "percentage",
      value: 0,
    },

    additionalCharges: [],

    receipt: {
      amountReceived: 0,
      paymentMethod: "cash",
      paymentDate: initialDate,
      transactionReference: "",
    },

    notes: "",
    terms: "",
  };
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function DocumentBuilder({
  initialType,
  initialDate,
}: DocumentBuilderProps) {
  const [document, setDocument] = useState<DocumentDraft>(
    () => createInitialDocument(initialType, initialDate)
  );

  const [showPreview, setShowPreview] = useState(false);
  const [numberReserved, setNumberReserved] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const config = documentTypeConfig[document.type];

  const totals = useMemo(
    () =>
      calculateDocumentTotals({
        items: document.items,
        taxMode: document.taxMode,
        discount: document.discount,
        additionalCharges: document.additionalCharges,
      }),
    [
      document.items,
      document.taxMode,
      document.discount,
      document.additionalCharges,
    ]
  );

  function updateDocumentField(
    field: keyof DocumentDraft,
    value: string
  ) {
    setDocument((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function updateCustomerField(
    field: keyof DocumentDraft["customer"],
    value: string
  ) {
    setDocument((previous) => ({
      ...previous,
      customer: {
        ...previous.customer,
        [field]: value,
      },
    }));
  }

  function addCustomDocumentField() {
    setDocument((previous) => ({
      ...previous,
      customFields: [
        ...previous.customFields,
        {
          id: crypto.randomUUID(),
          label: "",
          value: "",
        },
      ],
    }));
  }

  function updateCustomDocumentField(
    id: string,
    field: "label" | "value",
    value: string
  ) {
    setDocument((previous) => ({
      ...previous,
      customFields: previous.customFields.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  }

  function removeCustomDocumentField(id: string) {
    setDocument((previous) => ({
      ...previous,
      customFields: previous.customFields.filter(
        (item) => item.id !== id
      ),
    }));
  }

  function updateReceiptField(
    field: keyof DocumentDraft["receipt"],
    value: string | number
  ) {
    setDocument((previous) => ({
      ...previous,
      receipt: {
        ...previous.receipt,
        [field]: value,
      },
    }));
  }

  function handleContinueToPreview() {
    const errors: string[] = [];
    const businessProfile = getBusinessProfile();

    // Business details
    if (!businessProfile.businessName.trim()) {
      errors.push("Add your business name in Business Profile.");
    }

    // Document details
    if (!document.number.trim()) {
      errors.push("Enter a document number.");
    }

    if (!document.date) {
      errors.push("Select a document date.");
    }

    // Customer details
    if (!document.customer.name.trim()) {
      errors.push("Enter the customer name.");
    }

    // Line items
    if (document.items.length === 0) {
      errors.push("Add at least one line item.");
    }

    document.items.forEach((item, index) => {
      const itemNumber = index + 1;

      if (!item.name.trim()) {
        errors.push(`Enter a name for line item ${itemNumber}.`);
      }

      if (
        !Number.isFinite(item.quantity) ||
        item.quantity <= 0
      ) {
        errors.push(
          `Line item ${itemNumber} must have a quantity greater than zero.`
        );
      }

      if (
        !Number.isFinite(item.rate) ||
        item.rate < 0
      ) {
        errors.push(
          `Line item ${itemNumber} has an invalid rate.`
        );
      }

      if (
        !Number.isFinite(item.taxRate) ||
        item.taxRate < 0 ||
        item.taxRate > 100
      ) {
        errors.push(
          `Line item ${itemNumber} has an invalid tax rate.`
        );
      }
    });

    // Custom document fields
    document.customFields.forEach((field, index) => {
      if (!field.label.trim()) {
        errors.push(
          `Enter a name for custom document field ${index + 1}.`
        );
      }
    });

    // Custom item columns
    document.itemCustomColumns.forEach((column, index) => {
      if (!column.label.trim()) {
        errors.push(
          `Enter a name for custom item column ${index + 1}.`
        );
      }
    });

    // Discount
    if (
      !Number.isFinite(document.discount.value) ||
      document.discount.value < 0 ||
      (
        document.discount.type === "percentage" &&
        document.discount.value > 100
      )
    ) {
      errors.push("Enter a valid discount amount or percentage.");
    }

    // Additional charges
    document.additionalCharges.forEach((charge, index) => {
      if (!charge.name.trim()) {
        errors.push(
          `Enter a name for additional charge ${index + 1}.`
        );
      }

      if (
        !Number.isFinite(charge.amount) ||
        charge.amount < 0
      ) {
        errors.push(
          `Additional charge ${index + 1} has an invalid amount.`
        );
      }

      if (
        !Number.isFinite(charge.taxRate) ||
        charge.taxRate < 0 ||
        charge.taxRate > 100
      ) {
        errors.push(
          `Additional charge ${index + 1} has an invalid tax rate.`
        );
      }
    });

    // Receipt details
    if (document.type === "receipt") {
      if (
        !Number.isFinite(document.receipt.amountReceived) ||
        document.receipt.amountReceived < 0
      ) {
        errors.push("Enter a valid received amount.");
      }

      if (!document.receipt.paymentDate) {
        errors.push("Select the payment date.");
      }
    }

    setValidationErrors(errors);

    if (errors.length > 0) {
      return;
    }

    // Reserve a number only after validation succeeds.
    // Returning from preview will not consume another number.
    if (!numberReserved) {
      const reservedNumber = reserveDocumentNumber(document.type);

      setDocument((previous) => ({
        ...previous,
        number: reservedNumber,
      }));

      setNumberReserved(true);
    }

    setShowPreview(true);
  }

  if (showPreview) {
    return (
      <DocumentPreview
        document={document}
        onBack={() => setShowPreview(false)}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 pb-28 lg:space-y-8 lg:pb-0">
      {/* Page heading */}
      <div>
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2.5 text-primary">
            <FileText className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Create {config.label}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the details below to prepare your document.
            </p>
          </div>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_290px]">
        {/* Main form */}
        <div className="min-w-0 space-y-5">
          <DocumentDetailsForm
            document={document}
            onChange={updateDocumentField}
          />

          <CustomerDetailsForm
            customer={document.customer}
            onChange={updateCustomerField}
          />

          {/* Custom document fields */}
          <details className="group rounded-xl border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
              <div>
                <h2 className="font-semibold">
                  Custom document fields
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  PO number, project name, vehicle number and more.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {document.customFields.length} field
                  {document.customFields.length === 1 ? "" : "s"}
                </p>
              </div>

              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition group-open:rotate-45">
                <Plus className="size-4" />
              </span>
            </summary>

            <div className="space-y-3 border-t border-border p-4 sm:p-5">
              {document.customFields.map((field) => (
                <div
                  key={field.id}
                  className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]"
                >
                  <input
                    className="h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    value={field.label}
                    onChange={(event) =>
                      updateCustomDocumentField(
                        field.id,
                        "label",
                        event.target.value
                      )
                    }
                    placeholder="Field name (e.g. PO Number)"
                  />

                  <input
                    className="h-10 min-w-0 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    value={field.value}
                    onChange={(event) =>
                      updateCustomDocumentField(
                        field.id,
                        "value",
                        event.target.value
                      )
                    }
                    placeholder="Field value"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-10 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      removeCustomDocumentField(field.id)
                    }
                    aria-label="Remove custom document field"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCustomDocumentField}
              >
                <Plus className="mr-2 size-4" />
                Add field
              </Button>
            </div>
          </details>

          <LineItemsEditor
            items={document.items}
            columns={document.itemCustomColumns}
            onChange={(items) =>
              setDocument((previous) => ({
                ...previous,
                items,
              }))
            }
            onColumnsChange={(itemCustomColumns) =>
              setDocument((previous) => ({
                ...previous,
                itemCustomColumns,
              }))
            }
          />

          <DocumentAdjustments
            taxMode={document.taxMode}
            discount={document.discount}
            additionalCharges={document.additionalCharges}
            onTaxModeChange={(taxMode) =>
              setDocument((previous) => ({
                ...previous,
                taxMode,
              }))
            }
            onDiscountChange={(discount) =>
              setDocument((previous) => ({
                ...previous,
                discount,
              }))
            }
            onChargesChange={(additionalCharges) =>
              setDocument((previous) => ({
                ...previous,
                additionalCharges,
              }))
            }
          />

          {document.type === "receipt" && (
            <ReceiptPaymentForm
              receipt={document.receipt}
              onChange={updateReceiptField}
            />
          )}

          {/* Additional information */}
          <details className="group rounded-xl border border-border bg-card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
              <div>
                <h2 className="font-semibold">
                  Additional information
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Optional notes and terms for your document.
                </p>
              </div>

              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground transition group-open:rotate-45">
                <Plus className="size-4" />
              </span>
            </summary>

            <div className="space-y-4 border-t border-border p-4 sm:p-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Notes
                </label>
                <textarea
                  className="min-h-24 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  value={document.notes}
                  onChange={(event) =>
                    updateDocumentField("notes", event.target.value)
                  }
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Terms and conditions
                </label>
                <textarea
                  className="min-h-24 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                  value={document.terms}
                  onChange={(event) =>
                    updateDocumentField("terms", event.target.value)
                  }
                  placeholder="Enter terms and conditions..."
                />
              </div>
            </div>
          </details>

          {/* Mobile validation errors */}
          {validationErrors.length > 0 && (
            <div
              role="alert"
              className="space-y-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 lg:hidden"
            >
              <p className="text-sm font-semibold text-destructive">
                Please fix the following:
              </p>

              <ul className="list-disc space-y-1 pl-5 text-xs text-destructive">
                {validationErrors.map((error, index) => (
                  <li key={`${index}-${error}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Desktop document summary */}
        <aside className="sticky top-6 hidden h-fit space-y-5 rounded-xl border border-border bg-card p-5 lg:block">
          <div>
            <h2 className="font-semibold">Document summary</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Live calculation of your document.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Items</span>
              <span className="font-medium">
                {document.items.length}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Discount</span>
              <span className="text-destructive">
                −{formatCurrency(totals.discountAmount)}
              </span>
            </div>

            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                Taxable amount
              </span>
              <span>{formatCurrency(totals.taxableAmount)}</span>
            </div>

            {document.taxMode === "intra-state" ? (
              <>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">CGST</span>
                  <span>{formatCurrency(totals.cgst)}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">SGST</span>
                  <span>{formatCurrency(totals.sgst)}</span>
                </div>
              </>
            ) : (
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">IGST</span>
                <span>{formatCurrency(totals.igst)}</span>
              </div>
            )}

            {totals.additionalChargesTotal > 0 && (
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">
                  Additional charges
                </span>
                <span>
                  {formatCurrency(totals.additionalChargesTotal)}
                </span>
              </div>
            )}

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground">
                Document total
              </p>
              <p className="mt-1 text-2xl font-semibold tracking-tight text-primary tabular-nums">
                {formatCurrency(totals.grandTotal)}
              </p>
            </div>

            {document.type === "receipt" && (
              <div className="rounded-lg bg-primary/5 p-3">
                <div className="flex justify-between gap-3">
                  <span className="font-medium">
                    Amount received
                  </span>
                  <span className="font-semibold text-primary">
                    {formatCurrency(document.receipt.amountReceived)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {validationErrors.length > 0 && (
            <div
              role="alert"
              className="space-y-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3"
            >
              <p className="text-sm font-semibold text-destructive">
                Please fix the following:
              </p>

              <ul className="list-disc space-y-1 pl-5 text-xs text-destructive">
                {validationErrors.map((error, index) => (
                  <li key={`${index}-${error}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleContinueToPreview}
          >
            Continue to preview
            <ArrowRight className="ml-2 size-4" />
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Review before printing or saving as PDF.
          </p>
        </aside>
      </div>

      {/* Mobile sticky preview action */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              Document total
            </p>
            <p className="truncate text-lg font-semibold text-primary tabular-nums">
              {formatCurrency(totals.grandTotal)}
            </p>
          </div>

          <Button
            className="shrink-0"
            onClick={handleContinueToPreview}
          >
            Preview
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
