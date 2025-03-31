import { DnitScraperError } from './errors';

/**
 * Validates number format (e.g., 7.970,59)
 */
export function isValidNumberFormat(value: string): boolean {
  return /^\d{1,3}(\.\d{3})*,\d{2}$/.test(value);
}

/**
 * Validates exchange rate data
 */
export function validateExchangeRateData(compra: string, venta: string): void {
  if (!isValidNumberFormat(compra) || !isValidNumberFormat(venta)) {
    throw new DnitScraperError(
      "Invalid number format in exchange rate data",
      'VALIDATION_ERROR'
    );
  }
}

/**
 * Validates and formats date
 */
export function validateAndFormatDate(day: string): string {
  const parsedDay = parseInt(day);
  if (isNaN(parsedDay)) {
    throw new DnitScraperError(
      "Invalid day format in exchange rate data",
      'VALIDATION_ERROR'
    );
  }

  const currentDate = new Date();
  return new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    parsedDay
  ).toISOString().split('T')[0] as string;
} 