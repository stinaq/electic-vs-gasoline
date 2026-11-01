import { describe, expect, it } from 'vitest';
import { CHARGING_EFFICIENCY, ELECTRICITY_PRICE_RANGE, GASOLINE_PRICE_RANGE, TIE_THRESHOLD } from '../constants';
import {
  calculateChargedConsumption,
  calculateChargingLossShare,
  calculateElectricCost,
  calculateGasolineCost,
  calculateTripDistance,
  compareCosts,
  determineCheaper,
} from './calculateCosts';

describe('calculateTripDistance', () => {
  it('uses the distance as-is for one way', () => {
    expect(calculateTripDistance(12.5, false)).toBeCloseTo(12.5);
  });

  it('doubles the distance for a round trip', () => {
    expect(calculateTripDistance(12.5, true)).toBeCloseTo(25);
  });
});

describe('calculateGasolineCost', () => {
  it('computes distance / 100 × l/100 km × price', () => {
    // 100 km × 8 l/100 km × 17,50 kr/l = 140 kr
    expect(calculateGasolineCost(100, 8, 17.5)).toBeCloseTo(140);
    expect(calculateGasolineCost(25, 8, 17.5)).toBeCloseTo(35);
  });

  it('works at the slider extremes', () => {
    expect(calculateGasolineCost(100, 8, GASOLINE_PRICE_RANGE.min)).toBeCloseTo(96);
    expect(calculateGasolineCost(100, 8, GASOLINE_PRICE_RANGE.max)).toBeCloseTo(240);
  });
});

describe('calculateChargedConsumption', () => {
  it('returns the car consumption as-is without charging losses', () => {
    expect(calculateChargedConsumption(13, false, 0.85)).toBe(13);
  });

  it('divides by the charging efficiency with charging losses', () => {
    // 13 kWh out of the battery needs 13 / 0,85 ≈ 15,29 kWh from the wall
    expect(calculateChargedConsumption(13, true, 0.85)).toBeCloseTo(15.294, 3);
    expect(calculateChargedConsumption(30, true, CHARGING_EFFICIENCY)).toBeCloseTo(35.294, 3);
  });

  it('changes nothing at 100 % efficiency', () => {
    expect(calculateChargedConsumption(13, true, 1)).toBeCloseTo(13);
  });

  it('makes the paid-for energy times the efficiency equal the car consumption', () => {
    expect(calculateChargedConsumption(21.7, true, 0.85) * 0.85).toBeCloseTo(21.7);
  });
});

describe('calculateChargingLossShare', () => {
  it('is the part of the charged electricity that never reaches the battery', () => {
    expect(calculateChargingLossShare(0.85)).toBeCloseTo(0.15);
    expect(calculateChargingLossShare(1)).toBe(0);
  });
});

describe('calculateElectricCost', () => {
  it('computes distance / 100 × kWh/100 km × price', () => {
    // 100 km × 13 kWh/100 km × 2 kr/kWh = 26 kr
    expect(calculateElectricCost(100, 13, 2)).toBeCloseTo(26);
  });

  it('is 0 when electricity is free', () => {
    expect(calculateElectricCost(100, 13, ELECTRICITY_PRICE_RANGE.min)).toBe(0);
  });

  it('works at the max price and consumption', () => {
    expect(calculateElectricCost(100, 30, ELECTRICITY_PRICE_RANGE.max)).toBeCloseTo(450);
  });
});

describe('determineCheaper', () => {
  it('picks electric when gasoline costs more', () => {
    expect(determineCheaper(140, 26, TIE_THRESHOLD)).toBe('electric');
  });

  it('picks gasoline when electric costs more', () => {
    expect(determineCheaper(96, 450, TIE_THRESHOLD)).toBe('gasoline');
  });

  it('is equal for identical costs', () => {
    expect(determineCheaper(50, 50, TIE_THRESHOLD)).toBe('equal');
  });

  it('is equal when the difference is below the threshold', () => {
    expect(determineCheaper(50.005, 50, TIE_THRESHOLD)).toBe('equal');
    expect(determineCheaper(50, 50.009, TIE_THRESHOLD)).toBe('equal');
  });

  it('is not equal at or above the threshold', () => {
    expect(determineCheaper(50.02, 50, TIE_THRESHOLD)).toBe('electric');
    expect(determineCheaper(50, 50.02, TIE_THRESHOLD)).toBe('gasoline');
  });
});

describe('compareCosts', () => {
  it('returns both costs, the winner and the saving', () => {
    const result = compareCosts(140, 26, TIE_THRESHOLD);
    expect(result.cheaper).toBe('electric');
    expect(result.saving).toBeCloseTo(114);
    expect(result.gasolineCost).toBeCloseTo(140);
    expect(result.electricCost).toBeCloseTo(26);
  });

  it('reports the saving as a positive amount when gasoline wins', () => {
    const result = compareCosts(96, 450, TIE_THRESHOLD);
    expect(result.cheaper).toBe('gasoline');
    expect(result.saving).toBeCloseTo(354);
  });

  it('handles a tie', () => {
    const result = compareCosts(26, 26, TIE_THRESHOLD);
    expect(result.cheaper).toBe('equal');
    expect(result.saving).toBe(0);
  });

  it('handles free electricity on a round trip', () => {
    const trip = calculateTripDistance(12.5, true);
    const result = compareCosts(calculateGasolineCost(trip, 8, 17.5), calculateElectricCost(trip, 13, 0), TIE_THRESHOLD);
    expect(result.cheaper).toBe('electric');
    expect(result.electricCost).toBe(0);
    expect(result.saving).toBeCloseTo(35);
  });

  it('costs more for the electric car with charging losses', () => {
    // 100 km at 2 kr/kWh: 26 kr without losses, 26 / 0,85 ≈ 30,59 kr with
    const withLosses = calculateElectricCost(100, calculateChargedConsumption(13, true, 0.85), 2);
    expect(withLosses).toBeCloseTo(30.588, 3);
    expect(compareCosts(140, withLosses, TIE_THRESHOLD).saving).toBeCloseTo(109.412, 3);
  });
});
