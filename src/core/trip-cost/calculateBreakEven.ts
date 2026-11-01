/**
 * Electricity price (kr/kWh) at which both cars cost the same, given the gasoline price.
 * Returns null when a consumption is 0 (no meaningful break-even).
 */
export const calculateElectricityBreakEven = (
  gasolinePrice: number,
  litersPer100Km: number,
  kWhPer100Km: number,
): number | null => {
  if (litersPer100Km === 0 || kWhPer100Km === 0) return null;
  return (gasolinePrice * litersPer100Km) / kWhPer100Km;
};

/**
 * Gasoline price (kr/l) at which both cars cost the same, given the electricity price.
 * Returns null when a consumption is 0 (no meaningful break-even).
 */
export const calculateGasolineBreakEven = (
  electricityPrice: number,
  kWhPer100Km: number,
  litersPer100Km: number,
): number | null => {
  if (litersPer100Km === 0 || kWhPer100Km === 0) return null;
  return (electricityPrice * kWhPer100Km) / litersPer100Km;
};
