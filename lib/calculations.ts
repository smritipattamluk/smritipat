export interface BookingTotals {
  baseRent: number;
  totalCharges: number;
  discountAmount: number;
  subtotal: number; // Before discount
  subtotalAfterDiscount: number; // After discount
  taxRate: number;
  taxAmount: number;
  grandTotal: number;
  totalPaid: number;
  totalRefunds: number;
  netReceived: number;
  balance: number;
}

export interface BookingChargeInput {
  amount: number | any;
}

export interface PaymentInput {
  amount: number | any;
  type: 'ADVANCE' | 'FINAL' | 'REFUND';
}

/**
 * Calculate all booking totals including charges, payments, taxes, and balance
 */
export function calculateBookingTotals(
  baseRent: number | any,
  discountAmount: number | any,
  taxRate: number | any,
  charges: BookingChargeInput[],
  payments: PaymentInput[]
): BookingTotals {
  const baseRentNum = Number(baseRent);
  const discountNum = Number(discountAmount);
  const taxRateNum = Number(taxRate);

  // Sum all additional charges
  const totalChargesAmount = charges.reduce(
    (sum, charge) => sum + Number(charge.amount),
    0
  );

  // Total charges = base rent + additional charges
  const totalCharges = baseRentNum + totalChargesAmount;

  // Subtotal before discount
  const subtotal = totalCharges;

  // Subtotal after discount
  const subtotalAfterDiscount = subtotal - discountNum;

  // Calculate tax on amount after discount
  const taxAmount = subtotalAfterDiscount * taxRateNum;

  // Grand total
  const grandTotal = subtotalAfterDiscount + taxAmount;

  // Calculate payments
  const totalPaid = payments
    .filter((p) => p.type !== 'REFUND')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const totalRefunds = payments
    .filter((p) => p.type === 'REFUND')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const netReceived = totalPaid - totalRefunds;

  // Balance due
  const balance = grandTotal - netReceived;

  return {
    baseRent: baseRentNum,
    totalCharges,
    discountAmount: discountNum,
    subtotal,
    subtotalAfterDiscount,
    taxRate: taxRateNum,
    taxAmount,
    grandTotal,
    totalPaid,
    totalRefunds,
    netReceived,
    balance,
  };
}

/**
 * Format currency with symbol
 */
export function formatCurrency(amount: number | any, symbol: string = '₹'): string {
  const num = Number(amount);
  return `${symbol}${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Check if two date-time ranges overlap
 */
export function checkTimeRangeOverlap(
  start1: Date,
  end1: Date,
  start2: Date,
  end2: Date
): boolean {
  return start1 < end2 && start2 < end1;
}
