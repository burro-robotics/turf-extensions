import {Units, distance} from '@turf/turf';
import type {Position} from 'geojson';

export function coordinatesCalculatedRadii({
  coordinates,
  withOptions,
}: {
  coordinates: Position[];
  withOptions?:
    | {
        units?: Units | undefined;
      }
    | undefined;
}): number[] {
  if (coordinates.length < 3) {
    throw new Error(
      'At least three coordinates are required to calculate curvature.',
    );
  }

  const radii: number[] = [Infinity];

  for (let i = 1; i < coordinates.length - 1; i++) {
    const p1 = coordinates[i - 1];
    const p2 = coordinates[i];
    const p3 = coordinates[i + 1];

    const a = distance(p1, p2, withOptions);
    const b = distance(p2, p3, withOptions);
    const c = distance(p3, p1, withOptions);

    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const radius = (a * b * c) / (4 * area);

    radii.push(radius);
  }

  radii.push(Infinity);

  return radii;
}
