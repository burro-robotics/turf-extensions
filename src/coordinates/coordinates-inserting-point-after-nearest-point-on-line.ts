import {lineString, nearestPointOnLine, point} from '@turf/turf';
import type {Position} from 'geojson';

export function coordinatesInsertingPointAfterNearestPointOnLine({
  coordinates,
  newPointCoords,
}: {
  coordinates: Position[];
  newPointCoords: Position;
}): Position[] | undefined {
  const line = lineString(coordinates);
  const newPoint = point(newPointCoords);

  const nearest = nearestPointOnLine(line, newPoint);

  if (nearest.properties.index !== undefined) {
    const insertAt = +nearest.properties.index + 1;

    coordinates.splice(insertAt, 0, newPointCoords);

    return coordinates;
  }

  return undefined;
}
