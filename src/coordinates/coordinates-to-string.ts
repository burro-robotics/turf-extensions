import type {Position} from 'geojson';

export function coordinatesToString(coordinate: Position) {
  return `${coordinate[0]},${coordinate[1]}`;
}
