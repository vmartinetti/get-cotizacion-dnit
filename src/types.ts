import { DnitScraperError } from './errors';

export interface ExchangeRateResult {
  success: boolean;
  data?: {
    fecha: string;
    compra: string; 
    venta: string 
  };
  error?: DnitScraperError;
} 