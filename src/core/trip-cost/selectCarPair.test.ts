import { describe, expect, it } from 'vitest';
import type { Vehicle } from './types';
import { selectCarPair } from './selectCarPair';

const gasA: Vehicle = { id: 'gas-a', name: 'Gas A', type: 'gasoline', consumptionPer100Km: 7 };
const gasB: Vehicle = { id: 'gas-b', name: 'Gas B', type: 'gasoline', consumptionPer100Km: 9 };
const ev: Vehicle = { id: 'ev', name: 'EV', type: 'electric', consumptionPer100Km: 15 };

describe('selectCarPair', () => {
  it('picks one car of each type', () => {
    expect(selectCarPair([ev, gasA])).toEqual({ gasoline: gasA, electric: ev });
  });

  it('picks the first car of each type', () => {
    expect(selectCarPair([gasA, gasB, ev]).gasoline).toBe(gasA);
  });

  it('throws when a type is missing', () => {
    expect(() => selectCarPair([gasA])).toThrow(/electric/);
    expect(() => selectCarPair([ev])).toThrow(/gasoline/);
    expect(() => selectCarPair([])).toThrow();
  });
});
