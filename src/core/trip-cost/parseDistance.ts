import { TEXT } from '../constants';
import type { ParseResult } from './types';

const NUMBER_PATTERN = /^[+-]?(\d+([.,]\d*)?|[.,]\d+)$/;

/** Parses a raw distance string (decimal comma or dot, surrounding whitespace allowed). Must be > 0. */
export const parseDistance = (raw: string): ParseResult => {
  const trimmed = raw.trim();
  if (trimmed === '') {
    return { ok: false, error: TEXT.errorDistanceRequired };
  }
  if (!NUMBER_PATTERN.test(trimmed)) {
    return { ok: false, error: TEXT.errorDistanceNotNumber };
  }
  const value = Number(trimmed.replace(',', '.'));
  if (value <= 0) {
    return { ok: false, error: TEXT.errorDistanceNotPositive };
  }
  return { ok: true, value };
};

/** Returns the error to display: only once the field has been touched. */
export const visibleError = (result: ParseResult, touched: boolean): string | null =>
  touched && !result.ok ? result.error : null;
