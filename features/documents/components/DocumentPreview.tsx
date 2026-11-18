
"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { ArrowLeft, Printer } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  BUSINESS_PROFILE_STORAGE_KEY,
  BUSINESS_PROFILE_UPDATED_EVENT,
} from "@/features/business-profile/services/business-profile.service";

import {
  defaultBusinessProfile,
} from "@/features/business-profile/schemas/business-profile.schema";

import type {
  BusinessProfile,
} from "@/features/business-profile/types/business-profile.types";

import {
  DOCUMENT_TEMPLATE_STORAGE_KEY,
  DOCUMENT_TEMPLATE_UPDATED_EVENT,
} from "@/features/document-templates/services/document-template.service";

import {
  getDocumentTemplate,
  DEFAULT_DOCUMENT_TEMPLATE,
} from "@/features/document-templates/config/document-templates";

import type {
  DocumentTemplateId,
} from "@/features/document-templates/types/document-template.types";

import type {
  DocumentDraft,
} from "../types/document.types";

import {
  documentTypeConfig,
} from "../configs/document-types";

import {
  calculateDocumentTotals,
} from "../services/document-calculations";

type Props = {
  document: DocumentDraft;
  onBack: () => void;
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value: string) => {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
};

const paymentMethodLabels: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  "bank-transfer": "Bank transfer",
  card: "Card",
  cheque: "Cheque",
  other: "Other",
};

function subscribeToBusinessProfile(callback: () => void) {
  window.addEventListener("storage", callback);

  window.addEventListener(
    BUSINESS_PROFILE_UPDATED_EVENT,
    callback
  );

  return () => {
    window.removeEventListener("storage", callback);

    window.removeEventListener(
      BUSINESS_PROFILE_UPDATED_EVENT,
      callback
    );
  };
}

function getBusinessProfileSnapshot() {
  return localStorage.getItem(BUSINESS_PROFILE_STORAGE_KEY);
}

function getBusinessProfileServerSnapshot() {
  return null;
}

function subscribeToTemplateChanges(callback: () => void) {
  window.addEventListener("storage", callback);

  window.addEventListener(
    DOCUMENT_TEMPLATE_UPDATED_EVENT,
    callback
  );

  return () => {
    window.removeEventListener("storage", callback);

    window.removeEventListener(
      DOCUMENT_TEMPLATE_UPDATED_EVENT,
      callback
    );
  };
}

function getTemplateSnapshot() {
  return localStorage.getItem(DOCUMENT_TEMPLATE_STORAGE_KEY);
}

function getTemplateServerSnapshot() {
  return null;
}

export default function DocumentPreview({
  document,
  onBack,
}: Props) {
  const storedProfile = useSyncExternalStore(
    subscribeToBusinessProfile,
    getBusinessProfileSnapshot,
    getBusinessProfileServerSnapshot
  );

  const storedTemplate = useSyncExternalStore(
    subscribeToTemplateChanges,
    getTemplateSnapshot,
    getTemplateServerSnapshot
  );

  let businessProfile: BusinessProfile = {
    ...defaultBusinessProfile,
  };

  if (storedProfile) {
    try {
      businessProfile = {
        ...defaultBusinessProfile,
        ...JSON.parse(storedProfile),
      };
    } catch {
      businessProfile = {
        ...defaultBusinessProfile,
      };
    }
  }

  const validTemplateId: DocumentTemplateId =
    storedTemplate === "modern" || storedTemplate === "elegant"
      ? storedTemplate
      : DEFAULT_DOCUMENT_TEMPLATE;

  const template = getDocumentTemplate(validTemplateId);

  const isModern = template.style === "modern";
  const isElegant = template.style === "elegant";

  const accentColor = template.accentColor;

  const config = documentTypeConfig[document.type];

  const totals = calculateDocumentTotals({
    items: document.items,
    taxMode: document.taxMode,
    discount: document.discount,
    additionalCharges: document.additionalCharges,
  });

  const isReceipt = document.type === "receipt";
  const isQuotation = document.type === "quotation";
  const isEstimate = document.type === "estimate";
  const isInvoice = document.type === "invoice";

  const termsHeading = isInvoice
    ? "Payment terms"
    : isQuotation
      ? "Acceptance terms"
      : "Terms and conditions";

    const handlePrint = () => {
    const originalTitle = window.document.title;

    const filename = [
      document.number,
      businessProfile.businessName,
    ]
      .filter(Boolean)
      .join("-")
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    const restoreTitle = () => {
      window.document.title = originalTitle;
    };

    window.addEventListener("afterprint", restoreTitle, {
      once: true,
    });

    window.document.title = filename || "Business-Document";

    try {
      window.print();
    } catch (error) {
      window.removeEventListener("afterprint", restoreTitle);
      restoreTitle();
      throw error;
    }
  };

  const businessAddress = [
    businessProfile.address,
    [
      businessProfile.city,
      businessProfile.state,
      businessProfile.pincode,
    ]
      .filter(Boolean)
      .join(", "),
    businessProfile.country,
  ].filter(Boolean);

  const hasPaymentInformation = Boolean(
    businessProfile.bankName ||
    businessProfile.accountNumber ||
    businessProfile.upiId
  );

  const sectionBorder = isElegant
    ? "border-[#e8dfd5]"
    : "border-slate-200";

  const mutedText = isElegant
    ? "text-stone-500"
    : "text-slate-500";

  const headingFont = isElegant
    ? "font-serif"
    : "";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {/* Preview actions */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 size-4" />
          Back to editor
        </Button>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {template.name} template
          </span>

          <Button onClick={handlePrint}>
            <Printer className="mr-2 size-4" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      <div
        className={`print-document mx-auto w-full max-w-4xl overflow-hidden rounded-xl border bg-white text-slate-900 shadow-sm ${
          isElegant
            ? "border-[#e8dfd5] font-serif"
            : "border-border"
        }`}
      >
        {/* Template accent */}
        {isModern && (
          <div
            className="h-2 w-full"
            style={{ backgroundColor: accentColor }}
          />
        )}

        <div className="p-6 sm:p-10">
          {/* Document header */}
          <header
            className={`flex flex-col justify-between gap-6 border-b pb-8 sm:flex-row ${sectionBorder}`}
          >
            <div className="space-y-2">
              {businessProfile.logo && (
                <Image
                  src={businessProfile.logo}
                  alt={`${businessProfile.businessName || "Business"} logo`}
                  width={120}
                  height={80}
                  unoptimized
                  className="mb-3 h-16 w-auto max-w-[160] object-contain"
                />
              )}

              <h1
                className={`text-2xl font-bold tracking-tight ${headingFont}`}
              >
                {businessProfile.businessName || "Your Business Name"}
              </h1>

              <div className={`space-y-1 text-sm ${mutedText}`}>
                {businessAddress.map((line, index) => (
                  <p key={index}>{line}</p>
                ))}

                {businessProfile.phone && (
                  <p>Phone: {businessProfile.phone}</p>
                )}

                {businessProfile.alternatePhone && (
                  <p>
                    Alternate phone: {businessProfile.alternatePhone}
                  </p>
                )}

                {businessProfile.email && (
                  <p>Email: {businessProfile.email}</p>
                )}

                {businessProfile.website && (
                  <p>{businessProfile.website}</p>
                )}

                {businessProfile.gstin && (
                  <p>GSTIN: {businessProfile.gstin}</p>
                )}

                {businessProfile.pan && (
                  <p>PAN: {businessProfile.pan}</p>
                )}
              </div>
            </div>

            <div
              className={`sm:text-right ${
                isModern
                  ? "rounded-lg p-4 sm:min-w-[190]"
                  : ""
              }`}
              style={
                isModern
                  ? {
                      backgroundColor: `${accentColor}0D`,
                    }
                  : undefined
              }
            >
              <h2
                className={`text-3xl font-bold uppercase tracking-wider ${
                  headingFont
                }`}
                style={{ color: accentColor }}
              >
                {config.label}
              </h2>

              <p className={`mt-2 text-sm ${mutedText}`}>
                Document #{document.number}
              </p>

              <p className={`mt-1 text-sm ${mutedText}`}>
                Date: {formatDate(document.date)}
              </p>

              {isInvoice && document.dueDate && (
                <p className={`mt-1 text-sm ${mutedText}`}>
                  Payment due: {formatDate(document.dueDate)}
                </p>
              )}

              {(isQuotation || isEstimate) &&
                document.validUntil && (
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    Valid until: {formatDate(document.validUntil)}
                  </p>
                )}
            </div>
          </header>

          {/* Document introduction */}
          {(isQuotation || isEstimate) && (
            <section className={`border-b py-5 ${sectionBorder}`}>
              <p className={`text-sm leading-6 ${mutedText}`}>
                {isQuotation
                  ? "Thank you for your enquiry. Please find our proposed pricing and offer details below."
                  : "Please find below the estimated costs for the requested products or services."}
              </p>
            </section>
          )}

          {/* Customer details */}
          <section className={`border-b py-8 ${sectionBorder}`}>
            <p
              className={`mb-3 text-xs font-semibold uppercase tracking-wider ${
                isElegant ? "text-stone-400" : "text-slate-400"
              }`}
            >
              {isReceipt ? "Received from" : "Prepared for"}
            </p>

            <h3 className={`font-semibold ${headingFont}`}>
              {document.customer.name || "Customer name"}
            </h3>

            <div className={`mt-2 space-y-1 text-sm ${mutedText}`}>
              {document.customer.address && (
                <p className="whitespace-pre-line">
                  {document.customer.address}
                </p>
              )}

              {document.customer.email && (
                <p>{document.customer.email}</p>
              )}

              {document.customer.phone && (
                <p>{document.customer.phone}</p>
              )}

              {document.customer.gstin && (
                <p>GSTIN: {document.customer.gstin}</p>
              )}
            </div>
          </section>

          {/* Receipt payment details */}
          {isReceipt && (
            <section className={`border-b py-6 ${sectionBorder}`}>
              <h3
                className={`mb-4 text-sm font-semibold ${headingFont}`}
              >
                Payment confirmation
              </h3>

              <div
                className={`rounded-lg border p-4 ${
                  isElegant
                    ? "border-[#e8dfd5] bg-[#faf7f3]"
                    : "border-slate-200"
                }`}
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className={`text-xs ${mutedText}`}>
                      Amount received
                    </p>

                    <p
                      className="mt-1 text-xl font-bold"
                      style={{ color: accentColor }}
                    >
                      {formatCurrency(
                        document.receipt.amountReceived
                      )}
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs ${mutedText}`}>
                      Payment method
                    </p>

                    <p className="mt-1 font-medium">
                      {paymentMethodLabels[
                        document.receipt.paymentMethod
                      ] || "Other"}
                    </p>
                  </div>

                  <div>
                    <p className={`text-xs ${mutedText}`}>
                      Payment date
                    </p>

                    <p className="mt-1 font-medium">
                      {formatDate(document.receipt.paymentDate)}
                    </p>
                  </div>

                  {document.receipt.transactionReference && (
                    <div>
                      <p className={`text-xs ${mutedText}`}>
                        Transaction reference
                      </p>

                      <p className="mt-1 break-all font-medium">
                        {document.receipt.transactionReference}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Line items */}
          <section className="py-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600] text-left text-sm">
                <thead>
                  <tr
                    className={`border-b text-xs uppercase tracking-wider ${
                      isModern
                        ? "border-transparent text-white"
                        : isElegant
                          ? "border-[#e8dfd5] text-stone-600"
                          : "border-slate-200 text-slate-500"
                    }`}
                    style={
                      isModern
                        ? { backgroundColor: accentColor }
                        : undefined
                    }
                  >
                    <th className="px-3 py-3 font-semibold">
                      Description
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                      Qty
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                      Rate
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                      GST
                    </th>

                    <th className="px-3 py-3 text-right font-semibold">
                      Amount
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {document.items.map((item) => (
                    <tr
                      key={item.id}
                      className={`border-b ${
                        isElegant
                          ? "border-[#f0e9e1]"
                          : "border-slate-100"
                      }`}
                    >
                      <td className="px-3 py-4">
                        <p className="font-medium">
                          {item.name || "Item"}
                        </p>

                        {item.description && (
                          <p className={`mt-1 text-xs ${mutedText}`}>
                            {item.description}
                          </p>
                        )}
                      </td>

                      <td className="px-3 py-4 text-right">
                        {item.quantity} {item.unit}
                      </td>

                      <td className="px-3 py-4 text-right">
                        {formatCurrency(item.rate)}
                      </td>

                      <td className="px-3 py-4 text-right">
                        {item.taxRate}%
                      </td>

                      <td className="px-3 py-4 text-right font-medium">
                        {formatCurrency(
                          item.quantity * item.rate
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Document totals */}
          <section
            className={`flex justify-end border-b pb-8 ${sectionBorder}`}
          >
            <div className="w-full space-y-3 sm:max-w-xs">
              <div className="flex justify-between gap-4 text-sm">
                <span className={mutedText}>Subtotal</span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between gap-4 text-sm">
                  <span className={mutedText}>Discount</span>
                  <span>
                    -{formatCurrency(totals.discountAmount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between gap-4 text-sm">
                <span className={mutedText}>Taxable amount</span>
                <span>
                  {formatCurrency(totals.taxableAmount)}
                </span>
              </div>

              {document.taxMode === "intra-state" ? (
                <>
                  <div className="flex justify-between gap-4 text-sm">
                    <span className={mutedText}>CGST</span>
                    <span>{formatCurrency(totals.cgst)}</span>
                  </div>

                  <div className="flex justify-between gap-4 text-sm">
                    <span className={mutedText}>SGST</span>
                    <span>{formatCurrency(totals.sgst)}</span>
                  </div>
                </>
              ) : (
                <div className="flex justify-between gap-4 text-sm">
                  <span className={mutedText}>IGST</span>
                  <span>{formatCurrency(totals.igst)}</span>
                </div>
              )}

              {document.additionalCharges.map((charge) => (
                <div
                  key={charge.id}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className={mutedText}>
                    {charge.name || "Additional charge"}
                  </span>

                  <span>{formatCurrency(charge.amount)}</span>
                </div>
              ))}

              <div
                className={`flex justify-between gap-4 border-t pt-3 text-lg font-bold ${
                  isElegant
                    ? "border-[#d9cabb]"
                    : "border-slate-200"
                }`}
                style={{ color: accentColor }}
              >
                <span>
                  {isQuotation
                    ? "Quoted total"
                    : isEstimate
                      ? "Estimated total"
                      : isReceipt
                        ? "Receipt total"
                        : "Grand total"}
                </span>

                <span>{formatCurrency(totals.grandTotal)}</span>
              </div>
            </div>
          </section>

          {/* Business payment information */}
          {hasPaymentInformation && (
            <section className={`border-b py-6 ${sectionBorder}`}>
              <h3 className={`mb-3 text-sm font-semibold ${headingFont}`}>
                Payment information
              </h3>

              <div className={`grid gap-4 text-sm sm:grid-cols-2 ${mutedText}`}>
                {businessProfile.bankName && (
                  <div>
                    <p className="text-xs">Bank name</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {businessProfile.bankName}
                    </p>
                  </div>
                )}

                {businessProfile.accountName && (
                  <div>
                    <p className="text-xs">Account holder</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {businessProfile.accountName}
                    </p>
                  </div>
                )}

                {businessProfile.accountNumber && (
                  <div>
                    <p className="text-xs">Account number</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {businessProfile.accountNumber}
                    </p>
                  </div>
                )}

                {businessProfile.ifscCode && (
                  <div>
                    <p className="text-xs">IFSC code</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {businessProfile.ifscCode}
                    </p>
                  </div>
                )}

                {businessProfile.branch && (
                  <div>
                    <p className="text-xs">Branch</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {businessProfile.branch}
                    </p>
                  </div>
                )}

                {businessProfile.upiId && (
                  <div>
                    <p className="text-xs">UPI ID</p>
                    <p className="mt-1 font-medium text-slate-900">
                      {businessProfile.upiId}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Receipt acknowledgement */}
          {isReceipt && (
            <section className={`border-b py-6 ${sectionBorder}`}>
              <p className={`text-sm leading-6 ${mutedText}`}>
                We acknowledge receipt of{" "}
                <strong className="text-slate-900">
                  {formatCurrency(
                    document.receipt.amountReceived
                  )}
                </strong>{" "}
                from{" "}
                <strong className="text-slate-900">
                  {document.customer.name || "the customer"}
                </strong>{" "}
                via{" "}
                <strong className="text-slate-900">
                  {paymentMethodLabels[
                    document.receipt.paymentMethod
                  ] || "Other"}
                </strong>.
              </p>
            </section>
          )}

          {/* Estimate disclaimer */}
          {isEstimate && (
            <section className={`border-b py-6 ${sectionBorder}`}>
              <h3 className={`mb-2 text-sm font-semibold ${headingFont}`}>
                Estimate disclaimer
              </h3>

              <p className={`text-sm leading-6 ${mutedText}`}>
                This document is an estimate of the expected costs based
                on the information currently available. The final amount
                may vary depending on the actual requirements, quantities,
                materials or services provided. This estimate is not a
                payment request or tax invoice.
              </p>
            </section>
          )}

          {/* Quotation acceptance */}
          {isQuotation && (
            <section className={`border-b py-6 ${sectionBorder}`}>
              <h3 className={`mb-2 text-sm font-semibold ${headingFont}`}>
                Acceptance of quotation
              </h3>

              <p className={`text-sm leading-6 ${mutedText}`}>
                By accepting this quotation, the customer agrees to the
                proposed pricing, scope of work and terms outlined in
                this document. This offer is subject to the validity
                period mentioned above.
              </p>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <div className={`border-b ${sectionBorder}`} />
                  <p className={`mt-2 text-xs ${mutedText}`}>
                    Customer signature
                  </p>
                </div>

                <div>
                  <div className={`border-b ${sectionBorder}`} />
                  <p className={`mt-2 text-xs ${mutedText}`}>
                    Date
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Notes */}
          {document.notes && (
            <section className={`border-b py-6 ${sectionBorder}`}>
              <h3 className={`mb-2 text-sm font-semibold ${headingFont}`}>
                Notes
              </h3>

              <p className={`whitespace-pre-line text-sm ${mutedText}`}>
                {document.notes}
              </p>
            </section>
          )}

          {/* Terms */}
          {document.terms && (
            <section className={`border-b py-6 ${sectionBorder}`}>
              <h3 className={`mb-2 text-sm font-semibold ${headingFont}`}>
                {termsHeading}
              </h3>

              <p className={`whitespace-pre-line text-sm ${mutedText}`}>
                {document.terms}
              </p>
            </section>
          )}

          {/* Invoice payment reminder */}
          {isInvoice && document.dueDate && (
            <section className={`border-b py-5 ${sectionBorder}`}>
              <p className={`text-sm ${mutedText}`}>
                Please make payment by{" "}
                <strong className="text-slate-900">
                  {formatDate(document.dueDate)}
                </strong>.
              </p>
            </section>
          )}

          {/* Footer */}
          <footer
            className={`pt-8 text-center text-xs ${
              isElegant ? "text-stone-400" : "text-slate-400"
            }`}
          >
            {isReceipt
              ? "Thank you. Payment acknowledgement issued successfully."
              : isQuotation
                ? "We look forward to working with you."
                : isEstimate
                  ? "Thank you for considering our services."
                  : "Thank you for your business."}
          </footer>
        </div>
      </div>
    </div>
  );
}
