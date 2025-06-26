import {Position} from 'geojson';

export function coordinatesReversing(coords: Position[]): Position[] {
  return [...coords].reverse();
}
