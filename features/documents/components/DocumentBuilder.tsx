
"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  FileText,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import DocumentTypeSelector from "./DocumentTypeSelector";
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
  getNextDocumentNumber,
  reserveDocumentNumber,
} from "../services/document-number.service";

import { getBusinessProfile } from "@/features/business-profile/services/business-profile.service";

const today = () => {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const createInitialDocument = (
  type: DocumentType = "invoice",
  number?: string
): DocumentDraft => ({
  type,
  number: number ?? `${documentTypeConfig[type].prefix}-0001`,
  date: today(),
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

  taxMode: "intra-state",

  discount: {
    type: "percentage",
    value: 0,
  },

  additionalCharges: [],

  receipt: {
    amountReceived: 0,
    paymentMethod: "cash",
    paymentDate: today(),
    transactionReference: "",
  },

  notes: "",
  terms: "",
});

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

export default function DocumentBuilder() {
  const [document, setDocument] = useState<DocumentDraft>(
    () => createInitialDocument()
  );

  const [showEditor, setShowEditor] = useState(false);
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

  function handleDocumentTypeChange(type: DocumentType) {
    setDocument(createInitialDocument(type));
    setNumberReserved(false);
    setValidationErrors([]);
  }

  function handleStartEditor() {
    const nextNumber = getNextDocumentNumber(document.type);

    setDocument((previous) => ({
      ...previous,
      number: nextNumber,
    }));

    setNumberReserved(false);
    setValidationErrors([]);
    setShowEditor(true);
  }

  function handleContinueToPreview() {
    const errors: string[] = [];
    const businessProfile = getBusinessProfile();

    // Business details
    if (!businessProfile.businessName.trim()) {
      errors.push(
        "Add your business name in Business Profile."
      );
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
        errors.push(
          `Enter a name for line item ${itemNumber}.`
        );
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

    // Discount
    if (
      !Number.isFinite(document.discount.value) ||
      document.discount.value < 0 ||
      (
        document.discount.type === "percentage" &&
        document.discount.value > 100
      )
    ) {
      errors.push(
        "Enter a valid discount amount or percentage."
      );
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
    // Going back from preview will not consume another number.
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
    <div className="mx-auto w-full max-w-6xl space-y-8">
      <div>
        <Link
          href="/"
          className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
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
              {showEditor
                ? `Create ${config.label}`
                : "Create document"}
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              {showEditor
                ? "Enter the information for your document."
                : "Choose the type of document you want to create."}
            </p>
          </div>
        </div>
      </div>

      {!showEditor ? (
        <>
          <section className="space-y-4">
            <div>
              <h2 className="font-semibold">
                Select document type
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Choose the document you want to create.
              </p>
            </div>

            <DocumentTypeSelector
              value={document.type}
              onChange={handleDocumentTypeChange}
            />
          </section>

          <div className="flex justify-end border-t border-border pt-6">
            <Button onClick={handleStartEditor}>
              Continue
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEditor(false)}
            >
              <ArrowLeft className="mr-2 size-4" />
              Change document type
            </Button>

            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {config.label}
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
            <div className="min-w-0 space-y-6">
              <DocumentDetailsForm
                document={document}
                onChange={updateDocumentField}
              />

              <CustomerDetailsForm
                customer={document.customer}
                onChange={updateCustomerField}
              />

              <LineItemsEditor
                items={document.items}
                onChange={(items) =>
                  setDocument((previous) => ({
                    ...previous,
                    items,
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

              <section className="space-y-4 rounded-xl border border-border bg-card p-5">
                <div>
                  <h2 className="font-semibold">
                    Additional information
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Add notes or terms to your document.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Notes
                  </label>

                  <textarea
                    className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    value={document.notes}
                    onChange={(event) =>
                      updateDocumentField(
                        "notes",
                        event.target.value
                      )
                    }
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Terms and conditions
                  </label>

                  <textarea
                    className="min-h-20 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                    value={document.terms}
                    onChange={(event) =>
                      updateDocumentField(
                        "terms",
                        event.target.value
                      )
                    }
                    placeholder="Enter terms and conditions..."
                  />
                </div>
              </section>
            </div>

            <aside className="h-fit space-y-4 rounded-xl border border-border bg-card p-5 lg:sticky lg:top-6">
              <div>
                <h2 className="font-semibold">
                  Document summary
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Automatically calculated totals.
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Items
                  </span>
                  <span>{document.items.length}</span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Subtotal
                  </span>
                  <span>
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Discount
                  </span>
                  <span className="text-destructive">
                    −{formatCurrency(totals.discountAmount)}
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    Taxable amount
                  </span>
                  <span>
                    {formatCurrency(totals.taxableAmount)}
                  </span>
                </div>

                {document.taxMode === "intra-state" ? (
                  <>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">
                        CGST
                      </span>
                      <span>
                        {formatCurrency(totals.cgst)}
                      </span>
                    </div>

                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">
                        SGST
                      </span>
                      <span>
                        {formatCurrency(totals.sgst)}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      IGST
                    </span>
                    <span>
                      {formatCurrency(totals.igst)}
                    </span>
                  </div>
                )}

                {totals.additionalChargesTotal > 0 && (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      Additional charges
                    </span>
                    <span>
                      {formatCurrency(
                        totals.additionalChargesTotal
                      )}
                    </span>
                  </div>
                )}

                <div className="border-t border-border pt-3">
                  <div className="flex justify-between gap-3">
                    <span className="font-semibold">
                      Document total
                    </span>

                    <span className="text-lg font-semibold text-primary">
                      {formatCurrency(totals.grandTotal)}
                    </span>
                  </div>
                </div>

                {document.type === "receipt" && (
                  <div className="rounded-lg bg-primary/5 p-3">
                    <div className="flex justify-between gap-3">
                      <span className="font-medium">
                        Amount received
                      </span>

                      <span className="font-semibold text-primary">
                        {formatCurrency(
                          document.receipt.amountReceived
                        )}
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
                      <li key={`${index}-${error}`}>
                        {error}
                      </li>
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
                Review your document before printing or saving it as PDF.
              </p>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
