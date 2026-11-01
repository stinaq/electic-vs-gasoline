import type { Vehicle } from './trip-cost/types';

// Owner estimates (see docs/FEATURES.md). Agents must not invent figures.
export const VEHICLES: readonly Vehicle[] = [
  {
    id: 'volvo-v70-2009',
    name: 'Volvo V70 (2009)',
    shortName: 'Volvo V70',
    type: 'gasoline',
    consumptionPer100Km: 8.0,
  },
  {
    id: 'nissan-leaf-2022-40kwh',
    name: 'Nissan Leaf (2022, 40 kWh)',
    shortName: 'Nissan Leaf',
    type: 'electric',
    consumptionPer100Km: 13.0,
    consumptionRange: { min: 12, max: 30, step: 0.1 },
  },
];
