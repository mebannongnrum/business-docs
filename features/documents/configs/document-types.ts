
import type { DocumentType } from "../types/document.types";

export type DocumentTypeConfig = {
  label: string;
  description: string;
  prefix: string;
  hasDueDate: boolean;
  hasValidityDate: boolean;
  hasLineItems: boolean;
  hasPaymentDetails: boolean;
};

export const documentTypeConfig: Record<
  DocumentType,
  DocumentTypeConfig
> = {
  invoice: {
    label: "Invoice",
    description: "Request payment for products or services.",
    prefix: "INV",
    hasDueDate: true,
    hasValidityDate: false,
    hasLineItems: true,
    hasPaymentDetails: true,
  },
  quotation: {
    label: "Quotation",
    description: "Provide a price offer to your customer.",
    prefix: "QUO",
    hasDueDate: false,
    hasValidityDate: true,
    hasLineItems: true,
    hasPaymentDetails: false,
  },
  estimate: {
    label: "Estimate",
    description: "Share an estimated cost before work begins.",
    prefix: "EST",
    hasDueDate: false,
    hasValidityDate: true,
    hasLineItems: true,
    hasPaymentDetails: false,
  },
  receipt: {
    label: "Receipt",
    description: "Confirm payment received from a customer.",
    prefix: "REC",
    hasDueDate: false,
    hasValidityDate: false,
    hasLineItems: true,
    hasPaymentDetails: true,
  },
};
