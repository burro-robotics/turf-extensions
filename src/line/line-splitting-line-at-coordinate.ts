import {lineString, nearestPointOnLine, point} from '@turf/turf';
import type {Position} from 'geojson';

export function linesSplittingLineAtCoordinate(params: {
  coordinates: Position[];
  coordinate: Position;
}): [Position[], Position[]] | null {
  const {coordinates, coordinate: newPointCoordinates} = params;

  const line = lineString(coordinates);
  const newPoint = point(newPointCoordinates);

  const nearest = nearestPointOnLine(line, newPoint);

  if (nearest.properties.index !== undefined) {
    const insertAt = +nearest.properties.index + 1;

    const firstSegment = coordinates.slice(0, insertAt);
    firstSegment.push(newPointCoordinates);

    const secondSegment = [newPointCoordinates, ...coordinates.slice(insertAt)];

    return [firstSegment, secondSegment];
  }

  return null;
}
