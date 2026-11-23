
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
  additionalChargeTaxDetails: {
    id: string;
    taxAmount: number;
  }[];
  grandTotal: number;
};

const toPaise = (value: number): number =>
  Number.isFinite(value)
    ? Math.round((value + Number.EPSILON) * 100)
    : 0;

const fromPaise = (value: number): number => value / 100;

const clampNonNegative = (value: number): number =>
  Number.isFinite(value) ? Math.max(0, value) : 0;

const clampTaxRate = (value: number): number =>
  Math.min(100, clampNonNegative(value));

export function calculateDocumentTotals({
  items,
  taxMode,
  discount,
  additionalCharges,
}: DocumentCalculationInput): DocumentCalculationResult {
  // 1. Calculate item amounts.
  const itemAmounts = items.map((item) =>
    toPaise(
      clampNonNegative(item.quantity) *
        clampNonNegative(item.rate)
    )
  );

  const subtotalPaise = itemAmounts.reduce(
    (total, amount) => total + amount,
    0
  );

  // 2. Calculate document discount.
  let discountPaise = 0;

  if (discount.type === "percentage") {
    const percentage = Math.min(
      100,
      clampNonNegative(discount.value)
    );

    discountPaise = Math.round(
      (subtotalPaise * percentage) / 100
    );
  } else {
    discountPaise = Math.min(
      subtotalPaise,
      toPaise(clampNonNegative(discount.value))
    );
  }

  // 3. Allocate discount proportionally across items.
  const itemDiscounts = itemAmounts.map(() => 0);

  let allocatedDiscount = 0;

  const lastEligibleIndex = itemAmounts.findLastIndex(
    (amount) => amount > 0
  );

  itemAmounts.forEach((amount, index) => {
    if (amount === 0 || subtotalPaise === 0) return;

    const remainingDiscount =
      discountPaise - allocatedDiscount;

    const itemDiscount =
      index === lastEligibleIndex
        ? remainingDiscount
        : Math.min(
            remainingDiscount,
            Math.round(
              (discountPaise * amount) / subtotalPaise
            )
          );

    itemDiscounts[index] = itemDiscount;
    allocatedDiscount += itemDiscount;
  });

  // 4. Calculate item GST.
  let taxablePaise = 0;
  let cgstPaise = 0;
  let sgstPaise = 0;
  let igstPaise = 0;

  function addTax(taxableAmount: number, taxRate: number) {
    const taxPaise = Math.round(
      (taxableAmount * clampTaxRate(taxRate)) / 100
    );

    if (taxMode === "intra-state") {
      const itemCgst = Math.round(taxPaise / 2);
      const itemSgst = taxPaise - itemCgst;

      cgstPaise += itemCgst;
      sgstPaise += itemSgst;
    } else {
      igstPaise += taxPaise;
    }
  }

  items.forEach((item, index) => {
    const taxableItemPaise = Math.max(
      0,
      itemAmounts[index] - itemDiscounts[index]
    );

    taxablePaise += taxableItemPaise;

    addTax(taxableItemPaise, item.taxRate);
  });

  // 5. Calculate additional charges and their GST.
  let additionalChargesPaise = 0;

  const additionalChargeTaxDetails = additionalCharges.map(
    (charge) => {
      const amountPaise = toPaise(
        clampNonNegative(charge.amount)
      );

      additionalChargesPaise += amountPaise;

      const taxRate = clampTaxRate(charge.taxRate ?? 0);

      const taxPaise = Math.round(
        (amountPaise * taxRate) / 100
      );

      if (taxMode === "intra-state") {
        const chargeCgst = Math.round(taxPaise / 2);
        const chargeSgst = taxPaise - chargeCgst;

        cgstPaise += chargeCgst;
        sgstPaise += chargeSgst;
      } else {
        igstPaise += taxPaise;
      }

      return {
        id: charge.id,
        taxAmount: fromPaise(taxPaise),
      };
    }
  );

  // 6. Calculate total tax and final amount.
  const totalTaxPaise =
    cgstPaise + sgstPaise + igstPaise;

  const grandTotalPaise =
    taxablePaise +
    additionalChargesPaise +
    totalTaxPaise;

  return {
    subtotal: fromPaise(subtotalPaise),
    discountAmount: fromPaise(discountPaise),
    taxableAmount: fromPaise(taxablePaise),
    cgst: fromPaise(cgstPaise),
    sgst: fromPaise(sgstPaise),
    igst: fromPaise(igstPaise),
    totalTax: fromPaise(totalTaxPaise),
    additionalChargesTotal: fromPaise(
      additionalChargesPaise
    ),
    additionalChargeTaxDetails,
    grandTotal: fromPaise(grandTotalPaise),
  };
}
