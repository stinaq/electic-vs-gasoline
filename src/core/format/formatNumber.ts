import { CURRENCY_UNIT, LOCALE, MONEY_DECIMALS, UNIT_SEPARATOR } from '../constants';

/** Formats a number in the app locale with a fixed number of decimals, e.g. `1 234,50`. */
export const formatNumber = (value: number, decimals: number): string =>
  new Intl.NumberFormat(LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);

/** Formats a value with a unit label, e.g. `17,50 kr/l`. Uses a non-breaking space. */
export const formatWithUnit = (value: number, decimals: number, unit: string): string =>
  `${formatNumber(value, decimals)}${UNIT_SEPARATOR}${unit}`;

/** Formats a money amount, e.g. `1 234,50 kr`. */
export const formatMoney = (value: number): string => formatWithUnit(value, MONEY_DECIMALS, CURRENCY_UNIT);

/** Number of decimals implied by a slider step, e.g. 0.05 -> 2, 0.1 -> 1, 1 -> 0. */
export const decimalsForStep = (step: number): number => {
  const [, fraction = ''] = String(step).split('.');
  return fraction.length;
};
