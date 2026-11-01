import type { Vehicle } from './types';

/** Clamps a value to [min, max]. NaN falls back to min. */
export const clampToRange = (value: number, min: number, max: number): number => {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
};

/** Clamps a consumption to the car's editable range. Cars without a range are fixed at their config value. */
export const clampConsumption = (value: number, vehicle: Vehicle): number => {
  const range = vehicle.consumptionRange;
  if (range === undefined) return vehicle.consumptionPer100Km;
  return clampToRange(value, range.min, range.max);
};
