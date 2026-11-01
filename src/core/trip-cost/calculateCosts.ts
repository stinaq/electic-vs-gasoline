import { KM_PER_CONSUMPTION_UNIT, ROUND_TRIP_MULTIPLIER } from '../constants';
import type { Cheaper, CostComparison } from './types';

export const calculateTripDistance = (distance: number, roundTrip: boolean): number =>
  distance * (roundTrip ? ROUND_TRIP_MULTIPLIER : 1);

export const calculateGasolineCost = (
  tripDistance: number,
  litersPer100Km: number,
  gasolinePrice: number,
): number => (tripDistance / KM_PER_CONSUMPTION_UNIT) * litersPer100Km * gasolinePrice;

export const calculateElectricCost = (
  tripDistance: number,
  kWhPer100Km: number,
  electricityPrice: number,
): number => (tripDistance / KM_PER_CONSUMPTION_UNIT) * kWhPer100Km * electricityPrice;

export const determineCheaper = (gasolineCost: number, electricCost: number, tieThreshold: number): Cheaper => {
  const difference = gasolineCost - electricCost;
  if (Math.abs(difference) < tieThreshold) return 'equal';
  return difference > 0 ? 'electric' : 'gasoline';
};

export const compareCosts = (gasolineCost: number, electricCost: number, tieThreshold: number): CostComparison => ({
  gasolineCost,
  electricCost,
  cheaper: determineCheaper(gasolineCost, electricCost, tieThreshold),
  saving: Math.abs(gasolineCost - electricCost),
});
