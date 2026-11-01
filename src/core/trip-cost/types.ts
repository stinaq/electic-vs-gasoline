export type VehicleType = 'gasoline' | 'electric';

export type SliderRange = {
  min: number;
  max: number;
  step: number;
  defaultValue: number;
};

export type ConsumptionRange = {
  min: number;
  max: number;
  step: number;
};

export type Vehicle = {
  id: string;
  name: string;
  /** Shorter name for running text such as the summary line. Falls back to `name`. */
  shortName?: string;
  /** Engine designation, shown as a detail under the name, e.g. `2.0 F B4204S4 (107 kW)`. */
  engine?: string;
  type: VehicleType;
  /** Liters per 100 km for gasoline cars, kWh per 100 km for electric cars. */
  consumptionPer100Km: number;
  /** Present when the user may adjust the consumption. */
  consumptionRange?: ConsumptionRange;
};

export type CarPair = {
  gasoline: Vehicle;
  electric: Vehicle;
};

export type Cheaper = VehicleType | 'equal';

export type ParseResult = { ok: true; value: number } | { ok: false; error: string };

export type CostComparison = {
  gasolineCost: number;
  electricCost: number;
  cheaper: Cheaper;
  saving: number;
};

export type TripCostInput = {
  distance: string;
  distanceTouched: boolean;
  roundTrip: boolean;
  gasolinePrice: number;
  electricityPrice: number;
  kWhPer100Km: number;
  includeChargingLosses: boolean;
};
