import type {Position} from 'geojson';

import {coordinatesCalculatedAngularChanges} from './coordinates-calculated-angular-changes';

export function filterCoordinatesWithMaximumAngularChange({
  coordinates,
  maximumAngle,
}: {
  coordinates: Position[];
  maximumAngle: number;
}): Position[] {
  if (!coordinates.length) {
    return [];
  }

  if (maximumAngle < 0) {
    throw new Error('Minimum radius must be non-negative.');
  }

  const angles = coordinatesCalculatedAngularChanges({coordinates});
  return coordinates.filter((_, index) => angles[index] > maximumAngle);
}
