import type { CarPair, Vehicle, VehicleType } from './types';

const findFirstOfType = (vehicles: readonly Vehicle[], type: VehicleType): Vehicle => {
  const vehicle = vehicles.find((candidate) => candidate.type === type);
  if (vehicle === undefined) {
    throw new Error(`Vehicle config has no ${type} car`);
  }
  return vehicle;
};

/** Picks the first gasoline and the first electric car from the config. Throws if either is missing. */
export const selectCarPair = (vehicles: readonly Vehicle[]): CarPair => ({
  gasoline: findFirstOfType(vehicles, 'gasoline'),
  electric: findFirstOfType(vehicles, 'electric'),
});
