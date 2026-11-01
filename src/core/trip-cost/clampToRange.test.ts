import { describe, expect, it } from 'vitest';
import { clampConsumption, clampToRange } from './clampToRange';
import type { Vehicle } from './types';

describe('clampToRange', () => {
  it('keeps values inside the range', () => {
    expect(clampToRange(17.5, 12, 30)).toBe(17.5);
  });

  it('keeps the bounds themselves', () => {
    expect(clampToRange(12, 12, 30)).toBe(12);
    expect(clampToRange(30, 12, 30)).toBe(30);
  });

  it('clamps below min and above max', () => {
    expect(clampToRange(5, 12, 30)).toBe(12);
    expect(clampToRange(31, 12, 30)).toBe(30);
    expect(clampToRange(-1, 0, 15)).toBe(0);
  });

  it('handles infinities and NaN', () => {
    expect(clampToRange(Infinity, 0, 15)).toBe(15);
    expect(clampToRange(-Infinity, 0, 15)).toBe(0);
    expect(clampToRange(Number.NaN, 0, 15)).toBe(0);
  });
});

describe('clampConsumption', () => {
  const editable: Vehicle = {
    id: 'ev',
    name: 'EV',
    type: 'electric',
    consumptionPer100Km: 13,
    consumptionRange: { min: 12, max: 30, step: 0.1 },
  };
  const fixed: Vehicle = { id: 'gas', name: 'Gas', type: 'gasoline', consumptionPer100Km: 8 };

  it('clamps to the car range', () => {
    expect(clampConsumption(20, editable)).toBe(20);
    expect(clampConsumption(5, editable)).toBe(12);
    expect(clampConsumption(40, editable)).toBe(30);
  });

  it('keeps cars without a range at their config value', () => {
    expect(clampConsumption(20, fixed)).toBe(8);
  });
});
