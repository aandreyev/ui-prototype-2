export function minutesToUnits(minutes: number): number {
  if (!Number.isFinite(minutes) || minutes <= 0) return 0;
  return Math.ceil(minutes / 6);
}

export function unitsToMinutes(units: number): number {
  if (!Number.isFinite(units) || units <= 0) return 0;
  return units * 6;
}
