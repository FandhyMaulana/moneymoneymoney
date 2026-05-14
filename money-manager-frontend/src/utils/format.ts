/**
 * Centralized financial and date formatting utilities.
 * Follows a consistent locale and formatting standard for the entire platform.
 */

export const formatCurrency = (amount: number, currency: string = "USD", compact: boolean = false) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(amount);
};

export const formatCompactNumber = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

export const formatPercentage = (value: number, includeSymbol: boolean = true) => {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
  
  return includeSymbol ? `${formatted}%` : formatted;
};

export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat("en-US", options || {
    dateStyle: "medium",
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date) => {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};
