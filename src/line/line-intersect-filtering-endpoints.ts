import {
  booleanIntersects,
  featureCollection,
  getCoords,
  lineIntersect,
} from '@turf/turf';
import {Feature, FeatureCollection, LineString, Point} from 'geojson';
import {coordinatesEqual} from '../coordinates';

export function lineIntersectFilteringEndpoints(
  line1: Feature<LineString>,
  line2: Feature<LineString>,
  options?: {
    removeDuplicates?: boolean;
    ignoreSelfIntersections?: boolean;
  },
): FeatureCollection<Point> | undefined {
  if (!booleanIntersects(line1, line2)) {
    return undefined;
  }

  const lineIntersectionFeatureCollection = lineIntersect(
    line1,
    line2,
    options,
  );
  const line1Coords = getCoords(line1);
  const line2Coords = getCoords(line2);

  const filtered = lineIntersectionFeatureCollection.features.filter(value => {
    const coord = getCoords(value);
    return !(
      (coordinatesEqual(coord, line1Coords[0]) ||
        coordinatesEqual(coord, line1Coords[line1Coords.length - 1])) &&
      (coordinatesEqual(coord, line2Coords[0]) ||
        coordinatesEqual(coord, line2Coords[line2Coords.length - 1]))
    );
  });

  return filtered.length ? featureCollection(filtered) : undefined;
}
