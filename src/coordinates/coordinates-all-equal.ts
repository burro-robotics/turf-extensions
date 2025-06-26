import {Position} from 'geojson';
import {coordinatesEqual} from './coordinates-equal';

export function coordinatesEveryEqual({
  coordinates,
}: {
  coordinates: Position[];
}): boolean {
  if (coordinates.length < 2) {
    return true;
  }

  const result = coordinates.every(value => {
    return coordinatesEqual(coordinates[0], value);
  });

  return result;
}
