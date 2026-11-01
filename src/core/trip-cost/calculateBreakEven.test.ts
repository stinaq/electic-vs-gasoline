import { describe, expect, it } from 'vitest';
import { calculateElectricCost, calculateGasolineCost } from './calculateCosts';
import { calculateElectricityBreakEven, calculateGasolineBreakEven } from './calculateBreakEven';

describe('calculateElectricityBreakEven', () => {
  it('computes gasolinePrice × l/100 km / kWh/100 km', () => {
    expect(calculateElectricityBreakEven(17.5, 8, 13)).toBeCloseTo(10.769, 3);
  });

  it('makes both costs equal at the break-even price', () => {
    const breakEven = calculateElectricityBreakEven(17.5, 8, 13);
    expect(breakEven).not.toBeNull();
    if (breakEven === null) return;
    expect(calculateElectricCost(250, 13, breakEven)).toBeCloseTo(calculateGasolineCost(250, 8, 17.5));
  });

  it('can be outside the slider range', () => {
    expect(calculateElectricityBreakEven(30, 8, 12)).toBeCloseTo(20);
  });

  it('returns null when a consumption is 0', () => {
    expect(calculateElectricityBreakEven(17.5, 8, 0)).toBeNull();
    expect(calculateElectricityBreakEven(17.5, 0, 13)).toBeNull();
  });
});

describe('calculateGasolineBreakEven', () => {
  it('computes electricityPrice × kWh/100 km / l/100 km', () => {
    expect(calculateGasolineBreakEven(2, 13, 8)).toBeCloseTo(3.25);
  });

  it('makes both costs equal at the break-even price', () => {
    const breakEven = calculateGasolineBreakEven(4.35, 21.7, 8);
    expect(breakEven).not.toBeNull();
    if (breakEven === null) return;
    expect(calculateGasolineCost(87, 8, breakEven)).toBeCloseTo(calculateElectricCost(87, 21.7, 4.35));
  });

  it('is 0 when electricity is free', () => {
    expect(calculateGasolineBreakEven(0, 13, 8)).toBe(0);
  });

  it('returns null when a consumption is 0', () => {
    expect(calculateGasolineBreakEven(2, 0, 8)).toBeNull();
    expect(calculateGasolineBreakEven(2, 13, 0)).toBeNull();
  });
});
