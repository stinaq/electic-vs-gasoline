import { describe, expect, it } from 'vitest';
import { decimalsForStep, formatMoney, formatNumber, formatWithUnit } from './formatNumber';

// sv-SE uses a non-breaking space as thousands separator.
const nbsp = ' ';

describe('formatNumber', () => {
  it('uses decimal comma and the given decimals', () => {
    expect(formatNumber(17.5, 2)).toBe('17,50');
    expect(formatNumber(8, 1)).toBe('8,0');
  });

  it('groups thousands with a space', () => {
    expect(formatNumber(1234.5, 2)).toBe(`1${nbsp}234,50`);
  });

  it('rounds only at display time', () => {
    expect(formatNumber(1.005, 2)).toMatch(/^1,0[01]$/);
    expect(formatNumber(2.346, 2)).toBe('2,35');
  });

  it('formats zero', () => {
    expect(formatNumber(0, 2)).toBe('0,00');
  });
});

describe('formatWithUnit', () => {
  it('appends the unit after a non-breaking space', () => {
    expect(formatWithUnit(17.5, 2, 'kr/l')).toBe(`17,50${nbsp}kr/l`);
  });
});

describe('formatMoney', () => {
  it('formats with 2 decimals and kr', () => {
    expect(formatMoney(1234.5)).toBe(`1${nbsp}234,50${nbsp}kr`);
    expect(formatMoney(147.2)).toBe(`147,20${nbsp}kr`);
  });
});

describe('decimalsForStep', () => {
  it('derives decimals from the step', () => {
    expect(decimalsForStep(0.05)).toBe(2);
    expect(decimalsForStep(0.1)).toBe(1);
    expect(decimalsForStep(1)).toBe(0);
    expect(decimalsForStep(10)).toBe(0);
  });
});
