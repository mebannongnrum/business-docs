
import type {
  AdditionalCharge,
  DocumentDiscount,
  DocumentItem,
  TaxMode,
} from "../types/document.types";

export type DocumentCalculationInput = {
  items: DocumentItem[];
  taxMode: TaxMode;
  discount: DocumentDiscount;
  additionalCharges: AdditionalCharge[];
};

export type DocumentCalculationResult = {
  subtotal: number;
  discountAmount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  additionalChargesTotal: number;
  grandTotal: number;
};

const roundMoney = (value: number) =>
  Math.round((value + Number.EPSILON) * 100) / 100;

const clampNonNegative = (value: number) =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

export function calculateDocumentTotals({
  items,
  taxMode,
  discount,
  additionalCharges,
}: DocumentCalculationInput): DocumentCalculationResult {
  // 1. Calculate subtotal before discount and tax.
  const subtotal = roundMoney(
    items.reduce(
      (total, item) =>
        total +
        clampNonNegative(item.quantity) *
          clampNonNegative(item.rate),
      0
    )
  );

  // 2. Calculate document-level discount.
  let discountAmount = 0;

  if (discount.type === "percentage") {
    const percentage = Math.min(
      100,
      clampNonNegative(discount.value)
    );

    discountAmount = subtotal * (percentage / 100);
  } else {
    discountAmount = Math.min(
      subtotal,
      clampNonNegative(discount.value)
    );
  }

  discountAmount = roundMoney(discountAmount);

  // 3. Apply discount proportionally to each item before tax.
  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  items.forEach((item) => {
    const itemAmount =
      clampNonNegative(item.quantity) *
      clampNonNegative(item.rate);

    const itemDiscount =
      subtotal > 0
        ? (itemAmount / subtotal) * discountAmount
        : 0;

    const taxableItemAmount = Math.max(
      0,
      itemAmount - itemDiscount
    );

    const taxRate = clampNonNegative(item.taxRate);

    const itemTax = taxableItemAmount * (taxRate / 100);

    if (taxMode === "intra-state") {
      cgst += itemTax / 2;
      sgst += itemTax / 2;
    } else {
      igst += itemTax;
    }
  });

  // 4. Calculate tax totals.
  cgst = roundMoney(cgst);
  sgst = roundMoney(sgst);
  igst = roundMoney(igst);

  const totalTax = roundMoney(cgst + sgst + igst);

  // 5. Calculate additional charges.
  const additionalChargesTotal = roundMoney(
    additionalCharges.reduce(
      (total, charge) =>
        total + clampNonNegative(charge.amount),
      0
    )
  );

  // 6. Calculate final amount.
  const taxableAmount = roundMoney(subtotal - discountAmount);

  const grandTotal = roundMoney(
    taxableAmount + totalTax + additionalChargesTotal
  );

  return {
    subtotal,
    discountAmount,
    taxableAmount,
    cgst,
    sgst,
    igst,
    totalTax,
    additionalChargesTotal,
    grandTotal,
  };
}
