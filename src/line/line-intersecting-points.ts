import {
  booleanCrosses,
  booleanIntersects,
  getCoords,
  lineIntersect,
} from '@turf/turf';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';
import {coordinatesEqual} from '../coordinates';

export function lineIntersectingPoints(
  line1: Feature<LineString>,
  line2: Feature<LineString>,
  options?: {includeSharedEndpoints: boolean},
): FeatureCollection<Point> | undefined {
  if (!booleanIntersects(line1, line2)) {
    return undefined;
  }

  const aLineIntersect = lineIntersect(line1, line2);

  if (!aLineIntersect.features.length) {
    return undefined;
  }

  if (booleanCrosses(line1, line2)) {
    return aLineIntersect;
  }

  const line1Coords = getCoords(line1);
  const line2Coords = getCoords(line2);

  const isLineIntersectEndpoints = aLineIntersect.features.some(value => {
    const coord = getCoords(value);
    return (
      (coordinatesEqual(coord, line1Coords[0]) ||
        coordinatesEqual(coord, line1Coords[line1Coords.length - 1])) &&
      (coordinatesEqual(coord, line2Coords[0]) ||
        coordinatesEqual(coord, line2Coords[line2Coords.length - 1]))
    );
  });

  if (isLineIntersectEndpoints) {
    return options?.includeSharedEndpoints ? aLineIntersect : undefined;
  }

  return aLineIntersect;
}
