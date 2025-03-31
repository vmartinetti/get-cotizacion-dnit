/**
 * Custom error class for DNIT scraper
 */
export class DnitScraperError extends Error {
  constructor(
    message: string,
    public readonly code: 'FETCH_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND_ERROR'
  ) {
    super(message);
    this.name = 'DnitScraperError';
  }
}

export type DnitErrorCode = 'FETCH_ERROR' | 'PARSE_ERROR' | 'VALIDATION_ERROR' | 'NOT_FOUND_ERROR'; 