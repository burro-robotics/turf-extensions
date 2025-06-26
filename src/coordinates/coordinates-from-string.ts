import {Position} from 'geojson';

export function coordinatesFromString(str: string): Position {
  const [lng, lat] = str.split(',').map(Number);
  return [lng, lat];
}
