import {
  DEFAULT_CONSUMPTION_DECIMALS,
  DEFAULT_DISTANCE,
  DEFAULT_ROUND_TRIP,
  ELECTRIC_CONSUMPTION_UNIT,
  ELECTRICITY_PRICE_RANGE,
  ELECTRICITY_PRICE_UNIT,
  GASOLINE_CONSUMPTION_UNIT,
  GASOLINE_PRICE_RANGE,
  GASOLINE_PRICE_UNIT,
  MONEY_DECIMALS,
  TEXT,
  TIE_THRESHOLD,
} from '../constants';
import { decimalsForStep, formatMoney, formatWithUnit } from '../format/formatNumber';
import { calculateElectricityBreakEven, calculateGasolineBreakEven } from './calculateBreakEven';
import {
  calculateElectricCost,
  calculateGasolineCost,
  calculateTripDistance,
  compareCosts,
} from './calculateCosts';
import { parseDistance, visibleError } from './parseDistance';
import type { CarPair, CostComparison, SliderRange, TripCostInput, Vehicle, VehicleType } from './types';

export type SliderView = {
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
};

export type CarView = {
  name: string;
  /** Read-only consumption text, set when the car's consumption is not editable. */
  consumptionText: string | null;
  /** Consumption slider, set when the car's consumption is editable. */
  consumptionSlider: SliderView | null;
};

export type ResultCardView = {
  title: string;
  cost: string;
  highlighted: boolean;
};

export type ResultsView = {
  gasoline: ResultCardView;
  electric: ResultCardView;
  summary: string;
};

export type BreakEvenView = {
  electricity: string | null;
  gasoline: string | null;
};

export type TripCostView = {
  distanceError: string | null;
  gasolinePrice: SliderView;
  electricityPrice: SliderView;
  gasolineCar: CarView;
  electricCar: CarView;
  /** Null when the inputs are invalid: results are hidden, not shown as 0. */
  results: ResultsView | null;
  breakEven: BreakEvenView;
};

const CONSUMPTION_UNITS: Record<VehicleType, string> = {
  gasoline: GASOLINE_CONSUMPTION_UNIT,
  electric: ELECTRIC_CONSUMPTION_UNIT,
};

export const createInitialInput = (cars: CarPair): TripCostInput => ({
  distance: DEFAULT_DISTANCE,
  distanceTouched: false,
  roundTrip: DEFAULT_ROUND_TRIP,
  gasolinePrice: GASOLINE_PRICE_RANGE.defaultValue,
  electricityPrice: ELECTRICITY_PRICE_RANGE.defaultValue,
  kWhPer100Km: cars.electric.consumptionPer100Km,
});

export const buildPriceSlider = (value: number, range: SliderRange, unit: string): SliderView => ({
  value,
  min: range.min,
  max: range.max,
  step: range.step,
  display: formatWithUnit(value, MONEY_DECIMALS, unit),
});

/** Builds a car's view; `consumption` is the current value (may differ from the config default if editable). */
export const buildCarView = (vehicle: Vehicle, consumption: number): CarView => {
  const unit = CONSUMPTION_UNITS[vehicle.type];
  const range = vehicle.consumptionRange;
  if (range === undefined) {
    return {
      name: vehicle.name,
      consumptionText: formatWithUnit(consumption, DEFAULT_CONSUMPTION_DECIMALS, unit),
      consumptionSlider: null,
    };
  }
  return {
    name: vehicle.name,
    consumptionText: null,
    consumptionSlider: {
      value: consumption,
      min: range.min,
      max: range.max,
      step: range.step,
      display: formatWithUnit(consumption, decimalsForStep(range.step), unit),
    },
  };
};

export const shortNameOf = (vehicle: Vehicle): string => vehicle.shortName ?? vehicle.name;

export const buildSummary = (comparison: CostComparison, cars: CarPair): string => {
  if (comparison.cheaper === 'equal') return TEXT.tie;
  return TEXT.cheaperBy(shortNameOf(cars[comparison.cheaper]), formatMoney(comparison.saving));
};

export const buildResults = (comparison: CostComparison, cars: CarPair): ResultsView => ({
  gasoline: {
    title: cars.gasoline.name,
    cost: formatMoney(comparison.gasolineCost),
    highlighted: comparison.cheaper === 'gasoline',
  },
  electric: {
    title: cars.electric.name,
    cost: formatMoney(comparison.electricCost),
    highlighted: comparison.cheaper === 'electric',
  },
  summary: buildSummary(comparison, cars),
});

export const buildBreakEven = (input: TripCostInput, cars: CarPair): BreakEvenView => {
  const litersPer100Km = cars.gasoline.consumptionPer100Km;
  const electricity = calculateElectricityBreakEven(input.gasolinePrice, litersPer100Km, input.kWhPer100Km);
  const gasoline = calculateGasolineBreakEven(input.electricityPrice, input.kWhPer100Km, litersPer100Km);
  return {
    electricity:
      electricity === null
        ? null
        : TEXT.electricityBreakEven(formatWithUnit(electricity, MONEY_DECIMALS, ELECTRICITY_PRICE_UNIT)),
    gasoline:
      gasoline === null ? null : TEXT.gasolineBreakEven(formatWithUnit(gasoline, MONEY_DECIMALS, GASOLINE_PRICE_UNIT)),
  };
};

export const calculateComparison = (distance: number, input: TripCostInput, cars: CarPair): CostComparison => {
  const tripDistance = calculateTripDistance(distance, input.roundTrip);
  return compareCosts(
    calculateGasolineCost(tripDistance, cars.gasoline.consumptionPer100Km, input.gasolinePrice),
    calculateElectricCost(tripDistance, input.kWhPer100Km, input.electricityPrice),
    TIE_THRESHOLD,
  );
};

/** Turns the raw input state into everything the UI needs, formatted for display. */
export const buildTripCostView = (input: TripCostInput, cars: CarPair): TripCostView => {
  const distance = parseDistance(input.distance);
  return {
    distanceError: visibleError(distance, input.distanceTouched),
    gasolinePrice: buildPriceSlider(input.gasolinePrice, GASOLINE_PRICE_RANGE, GASOLINE_PRICE_UNIT),
    electricityPrice: buildPriceSlider(input.electricityPrice, ELECTRICITY_PRICE_RANGE, ELECTRICITY_PRICE_UNIT),
    gasolineCar: buildCarView(cars.gasoline, cars.gasoline.consumptionPer100Km),
    electricCar: buildCarView(cars.electric, input.kWhPer100Km),
    results: distance.ok ? buildResults(calculateComparison(distance.value, input, cars), cars) : null,
    breakEven: buildBreakEven(input, cars),
  };
};
