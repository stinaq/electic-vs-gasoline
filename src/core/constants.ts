import type { SliderRange } from './trip-cost/types';

// Locale and display
export const LOCALE = 'sv-SE';
export const MONEY_DECIMALS = 2;
/** Non-breaking space between a value and its unit, so `17,50 kr/l` never wraps. */
export const UNIT_SEPARATOR = '\u00a0';
/** Precision for consumption values that have no editable range (and thus no step). */
export const DEFAULT_CONSUMPTION_DECIMALS = 1;

// Units
export const CURRENCY_UNIT = 'kr';
export const DISTANCE_UNIT = 'km';
export const GASOLINE_CONSUMPTION_UNIT = 'l/100 km';
export const ELECTRIC_CONSUMPTION_UNIT = 'kWh/100 km';
export const GASOLINE_PRICE_UNIT = 'kr/l';
export const ELECTRICITY_PRICE_UNIT = 'kr/kWh';

// Domain
export const KM_PER_CONSUMPTION_UNIT = 100;
export const ROUND_TRIP_MULTIPLIER = 2;
/** Cost differences below this (kr) count as a tie. */
export const TIE_THRESHOLD = 0.01;
/** Share of the electricity from the wall that ends up in the battery (owner estimate, home AC charging). */
export const CHARGING_EFFICIENCY = 0.85;
/** Charging losses are shown as a whole percentage, e.g. `15 %`. */
export const PERCENT_DECIMALS = 0;

// Sliders
export const GASOLINE_PRICE_RANGE: SliderRange = { min: 12, max: 30, step: 0.1, defaultValue: 17.5 };
export const ELECTRICITY_PRICE_RANGE: SliderRange = { min: 0, max: 15, step: 0.05, defaultValue: 2 };

// Defaults
export const DEFAULT_DISTANCE = '';
export const DEFAULT_ROUND_TRIP = false;
export const DEFAULT_INCLUDE_CHARGING_LOSSES = true;

// Texts
export const TEXT = {
  title: 'Gasoline or electric?',
  tripHeading: 'The trip',
  distanceLabel: 'Distance (one way)',
  distanceUnit: DISTANCE_UNIT,
  roundTripLabel: 'Round trip',
  pricesHeading: 'Prices',
  gasolinePriceLabel: 'Gasoline price',
  electricityPriceLabel: 'Electricity price',
  carsHeading: 'The cars',
  chargingLossesLabel: 'Include charging losses',
  chargingLossesHint: (lossPercent: string): string =>
    `About ${lossPercent} of the electricity is lost as heat while charging. The car's consumption only counts what leaves the battery, but you pay for what comes out of the wall.`,

  resultsHeading: 'Cost for this trip',
  breakEvenHeading: 'Break-even prices',
  errorDistanceRequired: 'Enter a distance',
  errorDistanceNotNumber: 'Enter a number, e.g. 12,5',
  errorDistanceNotPositive: 'The distance must be more than 0',
  cheaperBy: (name: string, saving: string): string => `${name} is cheaper by ${saving}`,
  tie: 'Both cost the same',
  electricityBreakEven: (price: string): string => `Electric is cheaper while electricity is below ${price}`,
  gasolineBreakEven: (price: string): string => `Gasoline is cheaper while gasoline is below ${price}`,
} as const;
