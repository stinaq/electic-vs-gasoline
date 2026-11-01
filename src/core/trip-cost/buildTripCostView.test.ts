import { describe, expect, it } from 'vitest';
import { ELECTRICITY_PRICE_RANGE, GASOLINE_PRICE_RANGE, TEXT } from '../constants';
import {
  buildBreakEven,
  buildCarView,
  buildChargingLossesHint,
  chargedConsumptionOf,
  buildPriceSlider,
  buildResults,
  buildSummary,
  buildTripCostView,
  calculateComparison,
  createInitialInput,
  shortNameOf,
} from './buildTripCostView';
import type { CarPair, TripCostInput } from './types';

const nbsp = ' ';

const cars: CarPair = {
  gasoline: { id: 'gas', name: 'Gas Car', type: 'gasoline', consumptionPer100Km: 8 },
  electric: {
    id: 'ev',
    name: 'EV (2022, 40 kWh)',
    shortName: 'EV',
    type: 'electric',
    consumptionPer100Km: 13,
    consumptionRange: { min: 12, max: 30, step: 0.1 },
  },
};

const input = (overrides: Partial<TripCostInput> = {}): TripCostInput => ({
  ...createInitialInput(cars),
  ...overrides,
});

describe('createInitialInput', () => {
  it('starts with an empty, untouched distance and the configured defaults', () => {
    expect(createInitialInput(cars)).toEqual({
      distance: '',
      distanceTouched: false,
      roundTrip: false,
      gasolinePrice: GASOLINE_PRICE_RANGE.defaultValue,
      electricityPrice: ELECTRICITY_PRICE_RANGE.defaultValue,
      kWhPer100Km: 13,
      includeChargingLosses: true,
    });
  });
});

describe('chargedConsumptionOf', () => {
  it('uses the car consumption when charging losses are off', () => {
    expect(chargedConsumptionOf(input({ includeChargingLosses: false }))).toBe(13);
  });

  it('adds the configured charging losses when on', () => {
    expect(chargedConsumptionOf(input({ includeChargingLosses: true }))).toBeCloseTo(13 / 0.85);
  });
});

describe('buildChargingLossesHint', () => {
  it('states the loss as a percentage', () => {
    expect(buildChargingLossesHint(0.85)).toBe(TEXT.chargingLossesHint(`15${nbsp}%`));
  });
});

describe('buildPriceSlider', () => {
  it('passes through the range and formats the value as money per unit', () => {
    expect(buildPriceSlider(17.5, GASOLINE_PRICE_RANGE, 'kr/l')).toEqual({
      value: 17.5,
      min: 12,
      max: 30,
      step: 0.1,
      display: `17,50${nbsp}kr/l`,
    });
  });
});

describe('buildCarView', () => {
  it('shows read-only text for a car without an editable range', () => {
    expect(buildCarView(cars.gasoline, 8)).toEqual({
      name: 'Gas Car',
      detail: null,
      consumptionText: `8,0${nbsp}l/100 km`,
      consumptionSlider: null,
    });
  });

  it('shows the engine as a detail when configured', () => {
    expect(buildCarView({ ...cars.gasoline, engine: '2.0 F B4204S4 (107 kW)' }, 8).detail).toBe(
      '2.0 F B4204S4 (107 kW)',
    );
    expect(buildCarView({ ...cars.electric, engine: 'EM57 (110 kW)' }, 13).detail).toBe('EM57 (110 kW)');
  });

  it('shows a slider with step precision for an editable car', () => {
    expect(buildCarView(cars.electric, 14.3)).toEqual({
      name: 'EV (2022, 40 kWh)',
      detail: null,
      consumptionText: null,
      consumptionSlider: { value: 14.3, min: 12, max: 30, step: 0.1, display: `14,3${nbsp}kWh/100 km` },
    });
  });
});

describe('calculateComparison', () => {
  it('applies round trip and current prices', () => {
    // 25 km: gasoline 25/100 × 8 × 17,50 = 35 kr, electric 25/100 × 13 × 2 = 6,50 kr
    const result = calculateComparison(12.5, input({ roundTrip: true, includeChargingLosses: false }), cars);
    expect(result.gasolineCost).toBeCloseTo(35);
    expect(result.electricCost).toBeCloseTo(6.5);
    expect(result.cheaper).toBe('electric');
  });

  it('adds charging losses to the electric cost when on', () => {
    // 25 km: 6,50 kr / 0,85 ≈ 7,65 kr. Gasoline is unaffected.
    const result = calculateComparison(12.5, input({ roundTrip: true, includeChargingLosses: true }), cars);
    expect(result.gasolineCost).toBeCloseTo(35);
    expect(result.electricCost).toBeCloseTo(7.647, 3);
  });

  it('uses the adjusted electric consumption', () => {
    const result = calculateComparison(
      100,
      input({ kWhPer100Km: 30, electricityPrice: 15, includeChargingLosses: false }),
      cars,
    );
    expect(result.electricCost).toBeCloseTo(450);
    expect(result.cheaper).toBe('gasoline');
  });
});

describe('shortNameOf', () => {
  it('uses the short name when set', () => {
    expect(shortNameOf(cars.electric)).toBe('EV');
  });

  it('falls back to the full name', () => {
    expect(shortNameOf(cars.gasoline)).toBe('Gas Car');
  });
});

describe('buildSummary', () => {
  it('names the cheaper car by its short name, with the saving', () => {
    expect(buildSummary({ gasolineCost: 300, electricCost: 152.8, cheaper: 'electric', saving: 147.2 }, cars)).toBe(
      `EV is cheaper by 147,20${nbsp}kr`,
    );
    expect(buildSummary({ gasolineCost: 10, electricCost: 20, cheaper: 'gasoline', saving: 10 }, cars)).toBe(
      `Gas Car is cheaper by 10,00${nbsp}kr`,
    );
  });

  it('says so for a tie', () => {
    expect(buildSummary({ gasolineCost: 10, electricCost: 10, cheaper: 'equal', saving: 0 }, cars)).toBe(TEXT.tie);
  });
});

describe('buildResults', () => {
  it('highlights only the cheaper car', () => {
    const results = buildResults({ gasolineCost: 35, electricCost: 6.5, cheaper: 'electric', saving: 28.5 }, cars);
    expect(results.gasoline).toEqual({ title: 'Gas Car', cost: `35,00${nbsp}kr`, highlighted: false });
    expect(results.electric).toEqual({ title: 'EV (2022, 40 kWh)', cost: `6,50${nbsp}kr`, highlighted: true });
  });

  it('highlights neither car for a tie', () => {
    const results = buildResults({ gasolineCost: 10, electricCost: 10, cheaper: 'equal', saving: 0 }, cars);
    expect(results.gasoline.highlighted).toBe(false);
    expect(results.electric.highlighted).toBe(false);
  });
});

describe('buildBreakEven', () => {
  it('formats both break-even prices', () => {
    expect(buildBreakEven(input({ includeChargingLosses: false }), cars)).toEqual([
      `Electric is cheaper while electricity is below 10,77${nbsp}kr/kWh`,
      `Gasoline is cheaper while gasoline is below 3,25${nbsp}kr/l`,
    ]);
  });

  it('includes charging losses when on', () => {
    // 17,50 × 8 × 0,85 / 13 ≈ 9,15 and 2 × (13 / 0,85) / 8 ≈ 3,82
    expect(buildBreakEven(input({ includeChargingLosses: true }), cars)).toEqual([
      `Electric is cheaper while electricity is below 9,15${nbsp}kr/kWh`,
      `Gasoline is cheaper while gasoline is below 3,82${nbsp}kr/l`,
    ]);
  });

  it('shows nothing when a consumption is 0', () => {
    expect(buildBreakEven(input({ kWhPer100Km: 0 }), cars)).toBeNull();
  });
});

describe('buildTripCostView', () => {
  it('hides results and errors on first load', () => {
    const view = buildTripCostView(input(), cars);
    expect(view.results).toBeNull();
    expect(view.distanceError).toBeNull();
  });

  it('shows break-even even without a valid distance', () => {
    const view = buildTripCostView(input({ distance: 'abc', distanceTouched: true }), cars);
    expect(view.breakEven).toHaveLength(2);
  });

  it.each(['', 'abc', '0', '-3'])('shows an error and no results for %j once touched', (distance) => {
    const view = buildTripCostView(input({ distance, distanceTouched: true }), cars);
    expect(view.results).toBeNull();
    expect(view.distanceError).not.toBeNull();
  });

  it('shows results for a valid distance', () => {
    const view = buildTripCostView(
      input({ distance: '12,5', distanceTouched: true, roundTrip: true, includeChargingLosses: false }),
      cars,
    );
    expect(view.distanceError).toBeNull();
    expect(view.results?.gasoline.cost).toBe(`35,00${nbsp}kr`);
    expect(view.results?.electric.cost).toBe(`6,50${nbsp}kr`);
    expect(view.results?.summary).toBe(`EV is cheaper by 28,50${nbsp}kr`);
  });

  it('shows a tie at the break-even electricity price', () => {
    const view = buildTripCostView(
      input({ distance: '100', electricityPrice: (17.5 * 8) / 13, includeChargingLosses: false }),
      cars,
    );
    expect(view.results?.summary).toBe(TEXT.tie);
  });

  it('shows a tie at the break-even electricity price with charging losses', () => {
    const view = buildTripCostView(
      input({ distance: '100', electricityPrice: (17.5 * 8 * 0.85) / 13, includeChargingLosses: true }),
      cars,
    );
    expect(view.results?.summary).toBe(TEXT.tie);
  });

  it('shows the charging losses hint', () => {
    expect(buildTripCostView(input(), cars).chargingLossesHint).toContain(`15${nbsp}%`);
  });
});
