export const MONTHS_IN_SPANISH = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const DNIT_URL = "https://www.dnit.gov.py/en/web/portal-institucional/cotizaciones";
export const DAY_INDEX = 0;
export const COMPRA_INDEX = 1;
export const VENTA_INDEX = 2;

/**
 * Timeout in milliseconds for HTTP requests to DNIT's website.
 * Set to 10 seconds to prevent hanging requests and improve error handling.
 * Used in axios configuration for all API calls.
 */
export const TIMEOUT_MS = 10000; // 10 seconds 