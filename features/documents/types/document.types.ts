
export type DocumentType =
  | "invoice"
  | "quotation"
  | "estimate"
  | "receipt";

export type DocumentStatus = "draft" | "final";

export type TaxMode = "intra-state" | "inter-state";

export type DiscountType = "percentage" | "fixed";

export type PaymentMethod =
  | "cash"
  | "upi"
  | "bank-transfer"
  | "card"
  | "cheque"
  | "other";

export type DocumentItem = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
  taxRate: number;
};

export type DocumentCustomer = {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
};

export type DocumentDiscount = {
  type: DiscountType;
  value: number;
};

export type AdditionalCharge = {
  id: string;
  name: string;
  amount: number;
};

export type ReceiptDetails = {
  amountReceived: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  transactionReference: string;
};

export type BusinessDocument = {
  id: string;
  type: DocumentType;
  number: string;
  date: string;
  dueDate: string;
  validUntil: string;

  customer: DocumentCustomer;
  items: DocumentItem[];

  taxMode: TaxMode;
  discount: DocumentDiscount;
  additionalCharges: AdditionalCharge[];

  receipt: ReceiptDetails;

  notes: string;
  terms: string;
};

export type DocumentDraft = Omit<BusinessDocument, "id">;
