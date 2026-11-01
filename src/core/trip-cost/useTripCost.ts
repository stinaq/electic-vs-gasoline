import { useMemo, useState } from 'react';
import { ELECTRICITY_PRICE_RANGE, GASOLINE_PRICE_RANGE, TEXT } from '../constants';
import { VEHICLES } from '../vehicles';
import { buildTripCostView, createInitialInput } from './buildTripCostView';
import type { TripCostView } from './buildTripCostView';
import { clampConsumption, clampToRange } from './clampToRange';
import { selectCarPair } from './selectCarPair';
import type { TripCostInput } from './types';

const CARS = selectCarPair(VEHICLES);

export type UseTripCost = TripCostView & {
  distance: string;
  roundTrip: boolean;
  includeChargingLosses: boolean;
  text: typeof TEXT;
  onDistanceChange: (value: string) => void;
  onDistanceBlur: () => void;
  onRoundTripChange: (checked: boolean) => void;
  onChargingLossesChange: (checked: boolean) => void;
  onGasolinePriceChange: (value: number) => void;
  onElectricityPriceChange: (value: number) => void;
  onElectricConsumptionChange: (value: number) => void;
};

export const useTripCost = (): UseTripCost => {
  const [input, setInput] = useState<TripCostInput>(() => createInitialInput(CARS));
  const view = useMemo(() => buildTripCostView(input, CARS), [input]);

  return {
    ...view,
    distance: input.distance,
    roundTrip: input.roundTrip,
    includeChargingLosses: input.includeChargingLosses,
    text: TEXT,
    onDistanceChange: (distance) => setInput((prev) => ({ ...prev, distance, distanceTouched: true })),
    onDistanceBlur: () => setInput((prev) => ({ ...prev, distanceTouched: true })),
    onRoundTripChange: (roundTrip) => setInput((prev) => ({ ...prev, roundTrip })),
    onChargingLossesChange: (includeChargingLosses) => setInput((prev) => ({ ...prev, includeChargingLosses })),
    onGasolinePriceChange: (value) =>
      setInput((prev) => ({
        ...prev,
        gasolinePrice: clampToRange(value, GASOLINE_PRICE_RANGE.min, GASOLINE_PRICE_RANGE.max),
      })),
    onElectricityPriceChange: (value) =>
      setInput((prev) => ({
        ...prev,
        electricityPrice: clampToRange(value, ELECTRICITY_PRICE_RANGE.min, ELECTRICITY_PRICE_RANGE.max),
      })),
    onElectricConsumptionChange: (value) =>
      setInput((prev) => ({ ...prev, kWhPer100Km: clampConsumption(value, CARS.electric) })),
  };
};
